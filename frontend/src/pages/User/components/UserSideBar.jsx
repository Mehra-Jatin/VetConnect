import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import SidebarSkeleton from "../../../components/SidebarSkeleton.jsx";

const UserSideBar = () => {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]); // Store online user IDs
  const { chatId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);

  // Dummy contacts (replace with API call later)
  const dummyContacts = [
    {
      _id: "u1",
      fullName: "Dr. Emily Carter",
      profilePicture: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      _id: "u2",
      fullName: "John Doe",
      profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      _id: "u3",
      fullName: "Sarah Wilson",
      profilePicture: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ];


  const handleClick = (userId) => {
    setCurrentUserId(userId);
    navigate(`/user/chats/${userId}`);
  };

  // Dummy online users
  const dummyOnline = ["u2", "u3"];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setUsers(dummyContacts);
      setOnlineUsers(dummyOnline);
      setIsLoading(false);
    }, 600);
  }, []);

  if (isLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-screen w-20 lg:w-72 border-r border-black flex flex-col">
      {/* Sidebar header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">Chats</span>
        </div>
      </div>

      {/* Contact list */}
      <div className="overflow-y-auto w-full py-3">
        {users.map((user) => {
          const isActive =
            chatId === user._id || user._id === currentUserId; // Highlight if current user

          const isOnline = onlineUsers.includes(user._id);

          return (
            <button
              key={user._id}
              onClick={() => handleClick(user._id)}
              className={`w-full p-3 flex items-center gap-3 transition-colors duration-200 rounded-lg
                ${isActive ? "bg-gray-100" : "hover:bg-base-300"}`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePicture}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-white"></span>
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {isOnline ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}

        {users.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            No conversations yet
          </div>
        )}
      </div>
    </aside>
  );
};

export default UserSideBar;
