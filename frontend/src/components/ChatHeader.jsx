import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

const ChatHeader = ({ 
  currentUserId, 
  onBackClick
}) => {
  const dummyContacts = [
    {
      _id: "u1",
      fullName: "Dr. Emily Carter",
      profilePicture: "https://randomuser.me/api/portraits/women/65.jpg",
      lastSeen: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    },
    {
      _id: "u2",
      fullName: "John Doe",
      profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
      lastSeen: new Date(),
    },
    {
      _id: "u3",
      fullName: "Sarah Wilson",
      profilePicture: "https://randomuser.me/api/portraits/women/44.jpg",
      lastSeen: new Date(Date.now() - 2 * 60000), // 2 minutes ago
    },
    
  ];

  const dummyOnlineUsers = ["u2", "u3"];
  const [onlineUsers, setOnlineUsers] = useState([]);

  const selectedUser = dummyContacts.find((u) => u._id === currentUserId);

  useEffect(() => {
    setTimeout(() => {
      setOnlineUsers(dummyOnlineUsers);
    }, 300);
  }, []);

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="relative bg-white border-b border-gray-200 shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Back button and User Info */}
          <div className="flex items-center gap-3">
            {/* Back Button (mobile) */}
            <button
              onClick={onBackClick}
              className="lg:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>

            {/* Avatar with online indicator */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-md">
                <img
                  src={selectedUser.profilePicture}
                  alt={selectedUser.fullName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
              {/* Online indicator */}
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${
                isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}>
                {isOnline && (
                  <div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>

            {/* User Details */}
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                {selectedUser.fullName}
              </h3>
              <p className={`text-sm leading-tight transition-colors ${
                isOnline ? 'text-green-600 font-medium' : 'text-gray-500'
              }`}>
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;