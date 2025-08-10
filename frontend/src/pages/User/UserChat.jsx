// UserChat.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import NoChatSelected from "../../components/NoChatSelected.jsx";
import UserSideBar from "./components/UserSideBar.jsx";
import UserChatWindow from "./components/UserChatWindow.jsx";

function UserChat() {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <UserSideBar />
      
      {/* Main Chat Area */}
      <div className="flex-1 p-2 bg-base-100 overflow-hidden  ">
        <Routes>
          <Route path="/" element={<NoChatSelected />} />
          <Route path=":chatId" element={<UserChatWindow />} />
        </Routes>
      </div>
    </div>
  );
}

export default UserChat;