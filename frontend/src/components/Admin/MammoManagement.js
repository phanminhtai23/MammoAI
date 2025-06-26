import React, { useState, useEffect } from "react";
import { CompactModal } from "../Modals/UserModal";
import { Edit, Trash2, Eye } from "lucide-react";
// import axiosClient from "../../services/axiosClient";
import userService from "../../services/userService";
import { message } from "antd"; // Assuming you're using Ant Design for messages
import { LoadingData } from "../loading";
import ReactPaginate from "react-paginate";

const MammoManagement = () => {
    return (
        <div>
            <h1>mammo management</h1>
        </div>
    );
};

export default MammoManagement;
