import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SidebarSkeleton from "../../../components/SidebarSkeleton.jsx";

const DoctorSideBar = () => {
  const [contacts, setContacts] = useState([]);
  const [onlineContacts, setOnlineContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { chatId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentContactId, setCurrentContactId] = useState(null);

  // Dummy data for each role (replace with API fetch later)
  const dummyAdmins = [
    { _id: "a1", fullName: "Admin Smith", profilePicture: "https://randomuser.me/api/portraits/men/30.jpg" },
    { _id: "a2", fullName: "Admin Jane", profilePicture: "https://randomuser.me/api/portraits/women/29.jpg" }
  ];
  const dummyDoctors = [
    { _id: "d1", fullName: "Dr. Alice", profilePicture: "https://randomuser.me/api/portraits/women/65.jpg" },
    { _id: "d2", fullName: "Dr. Bob", profilePicture: "https://randomuser.me/api/portraits/men/62.jpg" }
  ];
  const dummyUsers = [
    { _id: "u1", fullName: "John Doe", profilePicture: "https://randomuser.me/api/portraits/men/22.jpg" },
    { _id: "u2", fullName: "Sarah Wilson", profilePicture: "https://randomuser.me/api/portraits/women/54.jpg" }
  ];

  const dummyOnline = ["a1", "d2", "u2"]; // sample online IDs

  const handleClick = (id) => {
    setCurrentContactId(id);

    if (location.pathname.startsWith("/doctor/chats/admin")) {
      navigate(`/doctor/chats/admin/${id}`);
    } else if (location.pathname.startsWith("/doctor/chats/doctor")) {
      navigate(`/doctor/chats/doctor/${id}`);
    } else if (location.pathname.startsWith("/doctor/chats/patient")) {
      navigate(`/doctor/chats/patient/${id}`);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      if (location.pathname.startsWith("/doctor/chats/admin")) {
        setContacts(dummyAdmins);
      } else if (location.pathname.startsWith("/doctor/chats/doctor")) {
        setContacts(dummyDoctors);
      } else if (location.pathname.startsWith("/doctor/chats/patient")) {
        setContacts(dummyUsers);
      }
      setOnlineContacts(dummyOnline);
      setIsLoading(false);
    }, 600);
  }, [location.pathname]);

  if (isLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-screen w-20 lg:w-72 border-r border-gray-200 flex flex-col bg-white">
      {/* Sidebar header */}
      <div className="border-b border-gray-200 w-full p-5 bg-white">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">
            {location.pathname.includes("/admin") ? "Admins"
              : location.pathname.includes("/patient") ? "Users"
              : "Doctors"}
          </span>
        </div>
      </div>

      {/* Contact list */}
      <div className="overflow-y-auto w-full py-3">
        {contacts.map((contact) => {
          const isActive = chatId === contact._id || contact._id === currentContactId;
          const isOnline = onlineContacts.includes(contact._id);

          return (
            <button
              key={contact._id}
              onClick={() => handleClick(contact._id)}
              className={`w-full p-3 flex items-center gap-3 transition-colors duration-200 rounded-lg
                ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={contact.profilePicture}
                  alt={contact.fullName}
                  className="size-12 object-cover rounded-full"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-white"></span>
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{contact.fullName}</div>
                <div className="text-sm text-gray-400">
                  {isOnline ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}

        {contacts.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No conversations yet
          </div>
        )}
      </div>
    </aside>
  );
};

export default DoctorSideBar;
