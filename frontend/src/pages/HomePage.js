import React, { useState } from "react";
import backgroundImage from "../assets/background_home.jpg";
import HomeNavigateComponent from "../components/Home/HomeNavigateComponent";
import ContentComponent from "../components/Home/ContentComponent";
import ScreeningComponent from "../components/Home/ScreeningComponent";

const HomePage = () => {
    const [activeTab, setActiveTab] = useState("home");

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed relative"
            style={{
                backgroundImage: `url(${backgroundImage})`,
            }}
        >
            {/* Overlay để làm mờ background */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-blue-800/20 to-blue-900/40"></div>

            {/* Nội dung chính */}
            <div className="relative z-10">
                {/* Header Navigation */}
                <HomeNavigateComponent
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                {/* Dynamic Content based on activeTab */}
                {activeTab === "home" && (
                    <ContentComponent setActiveTab={setActiveTab} />
                )}
                {activeTab === "screening" && (
                    <ScreeningComponent setActiveTab={setActiveTab} />
                )}
            </div>
        </div>
    );
};

export default HomePage;
