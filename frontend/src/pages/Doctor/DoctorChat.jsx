import { Routes, Route } from "react-router-dom";
import DoctorSideBar from "./components/DoctorSideBar";
import ChatWindow from "../../components/ChatWindow.jsx";
import NoChatSelected from "../../components/NoChatSelected.jsx";

function DoctorChat() {
  return (
    <div className="h-screen bg-gray-50">
      <div className="flex h-[90vh] max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Sidebar */}
        <DoctorSideBar />

        {/* Main Chat Area */}
        <div className="flex-1">
          <Routes>
            
            <Route path="admin/:chatId" element={<ChatWindow />} />
            <Route path="doctor/:chatId" element={<ChatWindow />} />
            <Route path="patient/:chatId" element={<ChatWindow />} />
             <Route path="*" element={<NoChatSelected />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default DoctorChat;
