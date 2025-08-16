import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useChatStore } from "../../../store/ChatStore.js";
import { useAuthStore } from "../../../store/AuthStore.js";
import SidebarSkeleton from "../../../components/SidebarSkeleton.jsx";

const DoctorSideBar = () => {
  const [currentContactId, setCurrentContactId] = useState(null);
  const { chatId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { 
    contacts, 
    isContactsLoading, 
    onlineUsers, 
    getContacts, 
    setSelectedUser 
  } = useChatStore();
  
  const { user } = useAuthStore();

  const handleClick = (contact) => {
    setCurrentContactId(contact._id);
    setSelectedUser(contact);

    if (location.pathname.startsWith("/doctor/chats/admin")) {
      navigate(`/doctor/chats/admin/${contact._id}`);
    } else if (location.pathname.startsWith("/doctor/chats/doctor")) {
      navigate(`/doctor/chats/doctor/${contact._id}`);
    } else if (location.pathname.startsWith("/doctor/chats/patient")) {
      navigate(`/doctor/chats/patient/${contact._id}`);
    }
  };

 useEffect(() => {
  if (!user) return;

  const chatRole = location.pathname.split("/")[3]; 
  // /doctor/chats/admin => ["", "doctor", "chats", "admin"]

  if (chatRole === "admin") getContacts("admin");
  else if (chatRole === "patient") getContacts("patient");
  else if (chatRole === "doctor") getContacts("doctor");
}, [location.pathname, user, getContacts]);



  // Get display title based on route
  const getTitle = () => {
    if (location.pathname.includes("/admin")) return "Admins";
    if (location.pathname.includes("/patient")) return "Patients";
    if (location.pathname.includes("/doctor")) return "Doctors";
    return "Contacts";
  };

  if (isContactsLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-screen w-20 lg:w-72 border-r border-gray-200 flex flex-col bg-white">
      {/* Sidebar header */}
      <div className="border-b border-gray-200 w-full p-5 bg-white">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">
            {getTitle()}
          </span>
        </div>
      </div>

      {/* Contact list */}
      <div className="overflow-y-auto w-full py-3">
        {contacts.map((contact) => {
          const isActive = chatId === contact._id || contact._id === currentContactId;
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
                  src={contact.image || `https://ui-avatars.com/api/?name=${contact.FirstName}+${contact.LastName}&background=ea580c&color=fff`}
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
                  {contact.specialization && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {contact.specialization}
                    </span>
                  )}
                  {!contact.specialization && (
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

export default DoctorSideBar;