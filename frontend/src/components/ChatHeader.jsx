import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useChatStore } from "../store/ChatStore";

const ChatHeader = ({ onBackClick }) => {
  const { selectedUser, onlineUsers = [] } = useChatStore();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (selectedUser?._id) {
      setIsOnline(onlineUsers.includes(selectedUser._id));
    }
  }, [selectedUser, onlineUsers]);

  if (!selectedUser) return null;

  return (
    <div className="relative bg-white border-b border-gray-200 shadow-sm">
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Back Button (mobile only) */}
          <button
            onClick={onBackClick}
            className="lg:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>

          {/* Avatar with online status */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-md">
              {selectedUser.profilePicture ? (
                <img
                  src={selectedUser.profilePicture}
                  alt={`${selectedUser.FirstName} ${selectedUser.LastName}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full bg-orange-500 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {selectedUser.FirstName?.charAt(0)}
                    {selectedUser.LastName?.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              {isOnline && (
                <div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>

          {/* Name + Status */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight">
              {selectedUser.FirstName} {selectedUser.LastName}
            </h3>
            <p
              className={`text-sm leading-tight ${
                isOnline ? "text-green-600 font-medium" : "text-gray-500"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
