import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Users } from "lucide-react"; // Ye import missing tha
import { useChatStore } from "../../../store/ChatStore.js";
import SidebarSkeleton from "../../../components/SidebarSkeleton.jsx";

const UserSideBar = () => {
  const { contacts, onlineUsers, getContacts, isContactsLoading, setSelectedUser, selectedUser } = useChatStore();
  const { chatId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getContacts(); // fetch contacts from backend
  }, [getContacts]);

  const handleClick = (user) => {
    setSelectedUser(user);
    navigate(`/user/chats/${user._id}`);
  };

  if (isContactsLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-screen w-20 lg:w-72 border-r border-gray-200 flex flex-col bg-white">
      {/* Sidebar header */}
      <div className="border-b border-gray-200 w-full p-5 bg-white">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">Chats</span>
        </div>
      </div>

      {/* Contact list */}
      <div className="overflow-y-auto w-full py-3">
        {contacts.map((contact) => {
          const isActive =
            chatId === contact._id || selectedUser?._id === contact._id;
          const isOnline = onlineUsers.includes(contact._id);

          return (
            <button
              key={contact._id}
              onClick={() => handleClick(contact)}
              className={`w-full p-3 flex items-center gap-3 transition-colors duration-200 rounded-lg
                ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={
                    contact.image ||
                    `https://ui-avatars.com/api/?name=${contact.FirstName}+${contact.LastName}&background=ea580c&color=fff`
                  }
                  alt={`${contact.FirstName} ${contact.LastName}`}
                  className="size-12 object-cover rounded-full"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-white"></span>
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">
                  {contact.FirstName} {contact.LastName}
                </div>
                <div className="text-sm text-gray-400">
                  {contact.specialization ? (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {contact.specialization}
                    </span>
                  ) : contact.role === "admin" ? (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      Admin
                    </span>
                  ) : (
                    <span>{isOnline ? "Online" : "Offline"}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {contacts.length === 0 && !isContactsLoading && (
          <div className="text-center text-gray-500 py-4">
            No contacts available
          </div>
        )}
      </div>
    </aside>
  );
};

export default UserSideBar;
