import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./App";
import './styles/Global.css';
import './styles/tailwind.css';
import "antd/dist/reset.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_TD}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
