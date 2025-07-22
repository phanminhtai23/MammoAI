import os
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import requests
import tempfile
import numpy as np
from typing import List, Tuple, Optional, Dict, Any
from pathlib import Path
import asyncio
import aiohttp
import gc  # Garbage collection để giải phóng RAM
from database import models_collection


class ModelAI:
    def __init__(self):
        """
        Khởi tạo ModelAI class cho PyTorch models (Docker-friendly)
        """
        self.current_model = None
        self.model_info = None
        self.device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
        self.class_names = ['Class_0', 'Class_1', 'Class_2', 'Class_3', 'Class_4', 'Class_5']
        
        # Docker-friendly cache directory
        cache_base = os.getenv("MODEL_CACHE_DIR", "/app/model_cache")
        self.model_cache_dir = Path(cache_base)
        self.model_cache_dir.mkdir(parents=True, exist_ok=True)
        self.current_cache_file = None  # Track current cached file
        
        # Transform cho ảnh (ImageNet pretrained)
        self.imagenet_mean = [0.485, 0.456, 0.406]
        self.imagenet_std = [0.229, 0.224, 0.225]
        self.size = (299, 299)  
        
        self.transform = transforms.Compose([
            transforms.Resize(self.size),
            transforms.ToTensor(),
            transforms.Normalize(mean=self.imagenet_mean, std=self.imagenet_std),
        ])
        
        print(f"🐳 ModelAI initialized - Cache dir: {self.model_cache_dir}")
        print(f"🎯 Device: {self.device}")
    
    def _clear_old_model_from_memory(self):
        """
        Xóa model cũ khỏi RAM và giải phóng memory (Docker-optimized)
        """
        if self.current_model is not None:
            # Move model to CPU trước khi xóa (giải phóng VRAM nếu dùng GPU)
            if hasattr(self.current_model, 'cpu'):
                self.current_model.cpu()
            
            # Xóa reference đến model
            del self.current_model
            self.current_model = None
            
            # Clear CUDA cache nếu dùng GPU
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            
            # Force garbage collection để giải phóng RAM
            gc.collect()
            
            print("🗑️ Đã xóa model cũ khỏi RAM")
    
    def _clear_old_cache_files(self, keep_file: Optional[Path] = None):
        """
        Xóa các cache files cũ, chỉ giữ lại file hiện tại
        Docker: Chỉ xóa nếu không dùng persistent volume
        
        Args:
            keep_file: File cache cần giữ lại
        """
        try:
            # Check nếu đang dùng persistent volume (Docker)
            is_persistent = os.getenv("MODEL_CACHE_PERSISTENT", "false").lower() == "true"
            
            if is_persistent:
                print("📦 Persistent cache enabled, keeping old files")
                return
            
            for cache_file in self.model_cache_dir.glob("*.pt"):
                if keep_file is None or cache_file != keep_file:
                    cache_file.unlink()
                    print(f"🗑️ Đã xóa cache cũ: {cache_file.name}")
        except Exception as e:
            print(f"⚠️ Lỗi khi xóa cache: {e}")
    
    def get_memory_usage(self) -> Dict[str, float]:
        """
        Lấy thông tin sử dụng RAM và VRAM (Docker-aware)
        
        Returns:
            Dict: Thông tin memory usage (MB)
        """
        try:
            import psutil
            
            # RAM usage (Docker container memory)
            process = psutil.Process()
            ram_mb = process.memory_info().rss / 1024 / 1024
            
            # Docker memory limit
            try:
                with open('/sys/fs/cgroup/memory/memory.limit_in_bytes', 'r') as f:
                    docker_limit = int(f.read()) / 1024 / 1024
                    # Fix nếu limit quá lớn (no limit)
                    if docker_limit > 1000000:
                        docker_limit = None
            except:
                docker_limit = None
            
            memory_info = {
                "ram_usage_mb": round(ram_mb, 2),
                "docker_memory_limit_mb": round(docker_limit, 2) if docker_limit else None,
                "model_loaded": self.current_model is not None,
                "cache_dir": str(self.model_cache_dir),
                "is_docker": self._is_running_in_docker()
            }
            
            # VRAM usage nếu có GPU
            if torch.cuda.is_available():
                gpu_memory = torch.cuda.memory_allocated() / 1024 / 1024
                gpu_cached = torch.cuda.memory_reserved() / 1024 / 1024
                memory_info.update({
                    "gpu_memory_allocated_mb": round(gpu_memory, 2),
                    "gpu_memory_cached_mb": round(gpu_cached, 2)
                })
            
            return memory_info
        except ImportError:
            # Fallback nếu không có psutil
            return {
                "ram_usage_mb": 0,
                "model_loaded": self.current_model is not None,
                "is_docker": self._is_running_in_docker(),
                "cache_dir": str(self.model_cache_dir)
            }
    
    def _is_running_in_docker(self) -> bool:
        """
        Check nếu đang chạy trong Docker container
        """
        try:
            with open('/proc/1/cgroup', 'r') as f:
                return 'docker' in f.read()
        except:
            return os.path.exists('/.dockerenv')
    
    async def load_active_model(self) -> bool:
        """
        Tự động load model đang active từ database (Docker-friendly)
        """
        try:
            # Tìm model đang active
            active_model = await models_collection.find_one({"is_active": True})
            
            if not active_model:
                print("⚠️ Không tìm thấy model nào đang active")
                return False
            
            # Check nếu model hiện tại đã là model này rồi
            if (self.model_info and 
                self.model_info.get("id") == active_model.get("id") and
                self.current_model is not None):
                print("ℹ️ Model này đã được load rồi, không cần load lại")
                return True
            
            print(f"🔄 Loading model: {active_model['name']} v{active_model.get('version', 'unknown')}")
            print(f"📊 Memory trước khi load: {self.get_memory_usage()}")
            
            # Load model từ URL
            success = await self.load_model_from_url(active_model['url'])
            
            if success:
                self.model_info = active_model
                print(f"✅ Model loaded thành công: {active_model['name']}")
                print(f"📊 Memory sau khi load: {self.get_memory_usage()}")
                return True
            else:
                return False
                
        except Exception as e:
            print(f"❌ Lỗi load model: {e}")
            return False
    
    async def load_model_from_url(self, model_url: str) -> bool:
        """
        Load PyTorch model từ S3 URL với Docker support
        
        Args:
            model_url: URL của model checkpoint trên S3
            
        Returns:
            bool: True nếu load thành công
        """
        try:
            # Xóa model cũ khỏi RAM trước
            self._clear_old_model_from_memory()
            
            # Tạo tên file cache
            cache_filename = f"model_{hash(model_url)}.pt"
            cache_path = self.model_cache_dir / cache_filename
            
            # Check cache exists (có thể persistent trong Docker volume)
            if cache_path.exists():
                print(f"📁 Sử dụng cache: {cache_path.name}")
            else:
                # Download model từ S3
                print(f"📥 Downloading model từ S3...")
                success = await self._download_model(model_url, cache_path)
                if not success:
                    return False
            
            # Xóa các cache files cũ (nếu không persistent)
            self._clear_old_cache_files(keep_file=cache_path)
            self.current_cache_file = cache_path
            
            # Load PyTorch checkpoint
            print(f"🧠 Loading model vào RAM...")
            success = self._load_model_from_file(cache_path)
            
            if success:
                print(f"✅ Model loaded vào RAM thành công!")
                return True
            else:
                return False
            
        except Exception as e:
            print(f"❌ Lỗi load model: {e}")
            # Cleanup nếu lỗi
            self._clear_old_model_from_memory()
            return False
    
    async def _download_model(self, model_url: str, cache_path: Path) -> bool:
        """
        Download model từ S3 với retry và timeout cho Docker
        """
        max_retries = 3
        timeout = 300  # 5 minutes timeout
        
        for attempt in range(max_retries):
            try:
                connector = aiohttp.TCPConnector(limit=10, ttl_dns_cache=300)
                timeout_config = aiohttp.ClientTimeout(total=timeout)
                
                async with aiohttp.ClientSession(
                    connector=connector, 
                    timeout=timeout_config
                ) as session:
                    async with session.get(model_url) as response:
                        if response.status == 200:
                            with open(cache_path, 'wb') as f:
                                async for chunk in response.content.iter_chunked(8192):
                                    f.write(chunk)
                            print(f"✅ Downloaded: {cache_path.name}")
                            return True
                        else:
                            print(f"❌ HTTP {response.status}")
                            
            except asyncio.TimeoutError:
                print(f"⏰ Timeout attempt {attempt + 1}/{max_retries}")
            except Exception as e:
                print(f"❌ Download error attempt {attempt + 1}/{max_retries}: {e}")
            
            if attempt < max_retries - 1:
                await asyncio.sleep(2 ** attempt)  # Exponential backoff
        
        return False
    
    def _load_model_from_file(self, cache_path: Path) -> bool:
        """
        Load model từ file với error handling cho Docker
        """
        try:
            # Load PyTorch checkpoint
            checkpoint = torch.load(cache_path, map_location=self.device)
            
            # Tạo model architecture (giả sử InceptionV3)
            from torchvision.models import inception_v3
            model = inception_v3(pretrained=False, num_classes=6)
            
            # Load state dict
            state_dict = checkpoint.get('model_state_dict', checkpoint)
            
            # Handle DataParallel prefix
            if list(state_dict.keys())[0].startswith('module.'):
                from collections import OrderedDict
                new_state_dict = OrderedDict()
                for k, v in state_dict.items():
                    name = k[7:]  # Remove 'module.' prefix
                    new_state_dict[name] = v
                model.load_state_dict(new_state_dict)
            else:
                model.load_state_dict(state_dict)
            
            # Move model to device và set eval mode
            model = model.to(self.device)
            model.eval()
            
            # Clear checkpoint từ memory để tiết kiệm RAM
            del checkpoint
            del state_dict
            gc.collect()
            
            self.current_model = model
            return True
            
        except Exception as e:
            print(f"❌ Lỗi load model từ file: {e}")
            return False
    
    def predict_image(self, image_url: str) -> Tuple[Optional[int], Optional[str], Optional[float], Optional[List[float]]]:
        """
        Dự đoán ảnh từ URL (Docker-optimized)
        
        Args:
            image_url: URL của ảnh cần dự đoán
            
        Returns:
            Tuple: (predicted_label_id, predicted_class_name, predicted_probability, all_probabilities)
        """
        if self.current_model is None:
            print("⚠️ Model chưa được load")
            return None, None, None, None
        
        try:
            # Download ảnh từ URL với timeout
            timeout = 30  # 30 seconds timeout cho Docker
            response = requests.get(image_url, stream=True, timeout=timeout)
            if response.status_code != 200:
                print(f"❌ HTTP {response.status_code} khi download ảnh")
                return None, None, None, None
            
            # Mở ảnh bằng PIL
            img = Image.open(response.raw)
            image = img.convert('RGB')
            
            # Apply transform
            image = self.transform(image)
            image = image.unsqueeze(0)  # Add batch dimension
            image = image.to(self.device)
            
            # Predict
            self.current_model.eval()
            with torch.no_grad():
                outputs = self.current_model(image)
                
                # Handle InceptionV3 auxiliary output
                if isinstance(outputs, tuple):
                    outputs = outputs[0]
            
            # Get probabilities
            probabilities = torch.softmax(outputs, dim=1)
            predicted_probability, predicted_label_id = torch.max(probabilities, 1)
            
            # Get class name
            predicted_class_name = self.class_names[predicted_label_id.item()]
            
            # Convert all probabilities to list
            all_probabilities = probabilities[0].cpu().numpy().tolist()
            
            # Cleanup tensors để tiết kiệm memory
            del image, outputs, probabilities
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            
            return (
                predicted_label_id.item(),
                predicted_class_name,
                predicted_probability.item(),
                all_probabilities
            )
            
        except requests.exceptions.Timeout:
            print("⏰ Timeout khi download ảnh")
            return None, None, None, None
        except Exception as e:
            print(f"❌ Lỗi predict: {e}")
            return None, None, None, None
    
    def predict(self, image_url: str) -> List[float]:
        """
        Predict và trả về mảng xác suất cho 6 lớp
        
        Args:
            image_url: URL của ảnh
            
        Returns:
            List[float]: Mảng xác suất 6 phần tử tương ứng với lớp 0-5
        """
        _, _, _, all_probabilities = self.predict_image(image_url)
        
        if all_probabilities is None:
            # Fallback: equal probability
            return [0.16, 0.17, 0.17, 0.17, 0.16, 0.17]
        
        return all_probabilities
    
    def get_prediction_details(self, image_url: str) -> Dict:
        """
        Lấy thông tin dự đoán chi tiết
        
        Args:
            image_url: URL của ảnh
            
        Returns:
            Dict: Thông tin dự đoán chi tiết
        """
        predicted_id, predicted_class, predicted_prob, all_probs = self.predict_image(image_url)
        
        if predicted_id is None:
            return {
                "success": False,
                "error": "Không thể dự đoán ảnh",
                "memory_usage": self.get_memory_usage()
            }
        
        # Map class names to BI-RADS
        bi_rads_names = [
            "BI-RADS 0 - Cần đánh giá thêm",
            "BI-RADS 1 - Âm tính", 
            "BI-RADS 2 - Tổn thương lành tính",
            "BI-RADS 3 - Có thể lành tính",
            "BI-RADS 4 - Nghi ngờ ác tính",
            "BI-RADS 5 - Rất nghi ngờ ác tính"
        ]
        
        # Tạo probability distribution
        probability_distribution = []
        for i, prob in enumerate(all_probs):
            probability_distribution.append({
                "class_id": i,
                "class_name": bi_rads_names[i],
                "probability": prob,
                "percentage": prob * 100
            })
        
        # Xác định risk level
        if predicted_id <= 2:
            risk_level = "Low"
            recommendation = "Tiếp tục tầm soát định kỳ theo lịch"
        elif predicted_id == 3:
            risk_level = "Medium" 
            recommendation = "Theo dõi ngắn hạn trong 6 tháng"
        else:
            risk_level = "High"
            recommendation = "Cần sinh thiết và thăm khám chuyên sâu ngay"
        
        return {
            "success": True,
            "predicted_class_id": predicted_id,
            "predicted_class_name": bi_rads_names[predicted_id],
            "confidence": predicted_prob,
            "probability_distribution": probability_distribution,
            "risk_level": risk_level,
            "recommendation": recommendation,
            "model_info": self.get_model_info(),
            "memory_usage": self.get_memory_usage()
        }
    
    def get_model_info(self) -> Optional[Dict]:
        """
        Lấy thông tin model hiện tại
        """
        if self.model_info:
            return {
                "id": self.model_info.get("id"),
                "name": self.model_info.get("name"),
                "version": self.model_info.get("version"),
                "url": self.model_info.get("url"),
                "is_active": self.model_info.get("is_active"),
                "loaded": self.current_model is not None,
                "device": str(self.device),
                "cache_file": str(self.current_cache_file) if self.current_cache_file else None
            }
        return None
    
    def is_model_loaded(self) -> bool:
        """
        Kiểm tra model đã được load chưa
        """
        return self.current_model is not None
    
    async def reload_active_model(self) -> bool:
        """
        Reload model active mới nhất từ database
        """
        print("🔄 Reloading active model...")
        return await self.load_active_model()
    
    def clear_all_memory(self):
        """
        Xóa hoàn toàn model và cache để giải phóng memory
        """
        print("🧹 Clearing all memory and cache...")
        self._clear_old_model_from_memory()
        self._clear_old_cache_files()
        self.model_info = None
        self.current_cache_file = None
        print("✅ Memory cleared!")


# Singleton instance
model_ai = ModelAI()


# Hàm test
async def test_model_ai():
    """
    Test ModelAI với ảnh sample (Docker-friendly)
    """
    print("🧪 Testing ModelAI...")
    print(f"📊 Memory ban đầu: {model_ai.get_memory_usage()}")
    
    # Load active model
    success = await model_ai.load_active_model()
    
    if success:
        print("✅ Model loaded successfully")
        print(f"📊 Memory sau load: {model_ai.get_memory_usage()}")
        
        # Test với sample image URL
        sample_url = "https://example.com/sample_mammogram.jpg"
        
        # Test predict
        probabilities = model_ai.predict(sample_url)
        print(f"📊 Probabilities: {[f'{p:.3f}' for p in probabilities]}")
        
        # Test detailed prediction
        details = model_ai.get_prediction_details(sample_url)
        print(f"📋 Prediction details: {details}")
        
    else:
        print("❌ No active model found")


if __name__ == "__main__":
    asyncio.run(test_model_ai())
