import React from "react";
import { Routes, Route } from "react-router-dom";
import NoChatSelected from "../../components/NoChatSelected.jsx";
import UserSideBar from "./components/UserSideBar.jsx";
import ChatWindow from "../../components/ChatWindow.jsx";

function UserChat() {
  return (
    <div className="h-screen bg-gray-50">
      <div className="flex h-[90vh] max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Sidebar */}
        <UserSideBar />
        
        {/* Main Chat Area */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<NoChatSelected />} />
            <Route path="/:chatId" element={<ChatWindow />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default UserChat;