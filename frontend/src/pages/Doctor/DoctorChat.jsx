import { Routes, Route } from "react-router-dom";
import DoctorSideBar from "./components/DoctorSideBar";
import DocChatWindow from "../../components/ChatWindow.jsx";
import NoChatSelected from "../../components/NoChatSelected.jsx";

function DoctorChat() {
  return (
    <div className="flex h-screen w-full">
      <DoctorSideBar />
      <div className="flex-1 p-2 bg-base-100 overflow-hidden">
        <Routes>
          <Route path="/*" element={<NoChatSelected />} />
          <Route path="/admin/:chatId" element={<DocChatWindow />} />
          <Route path="/doctor/:chatId" element={<DocChatWindow />} />
          <Route path="/patient/:chatId" element={<DocChatWindow />} />
        </Routes>
      </div>
    </div>
  );
}

export default DoctorChat;
