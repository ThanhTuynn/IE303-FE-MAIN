import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import ChatBotWidget from "../components/ChatBotWidget";

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
            <ChatBotWidget />
        </div>
    );
};

export default Layout;
