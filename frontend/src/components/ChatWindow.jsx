import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useChatStore } from "../store/ChatStore";
import { useAuthStore } from "../store/AuthStore";
import MessageSkeleton from "./MessageSkeleton.jsx";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";

const ChatWindow = () => {
  const { chatId } = useParams();
  const [userNotFound, setUserNotFound] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const {
    messages,
    selectedUser,
    isMessagesLoading,
    getMessages,
    sendMessage,
    subscribeToMessages,
    unsubscribeFromMessages,
    setSelectedUser,
    getUserById
  } = useChatStore();

  const { user } = useAuthStore();

  const scrollToBottom = () => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const initChat = async () => {
      if (!chatId || !user) return;

      try {
        const fetchedUser = await getUserById(chatId);
        if (!fetchedUser) {
          setUserNotFound(true);
          return;
        }
        setUserNotFound(false);
        setSelectedUser(fetchedUser);
        await getMessages(chatId);
      } catch {
        setUserNotFound(true);
      }
    };
    initChat();
  }, [chatId, user]);

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (!isMessagesLoading && messages.length > 0) scrollToBottom();
  }, [messages, isMessagesLoading]);

  const handleSendMessage = async (messageData) => {
    if (!user || !selectedUser) return;
    const result = await sendMessage(messageData);
    if (!result.success) alert(result.message || "Failed to send message");
  };

  const isOwnMessage = (message) => message.senderId._id === user?._id || message.senderId === user?._id;

  const formatTime = (timestamp) =>
    new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(timestamp));

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return new Intl.DateTimeFormat("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(date);
  };

  const shouldShowDateDivider = (currentMsg, prevMsg) =>
    !prevMsg || new Date(currentMsg.createdAt).toDateString() !== new Date(prevMsg.createdAt).toDateString();

  const getSenderName = (message) => {
    if (isOwnMessage(message)) return "You";
    if (message.senderId && typeof message.senderId === "object") return `${message.senderId.FirstName} ${message.senderId.LastName}`;
    return selectedUser ? `${selectedUser.FirstName} ${selectedUser.LastName}` : "Unknown";
  };

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium">Select a conversation</p>
          <p className="text-sm">Choose someone to start chatting with</p>
        </div>
      </div>
    );
  }

  if (userNotFound) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-gray-500">
        <p className="text-xl font-semibold">No such user exists</p>
        <p className="text-sm">Please select a valid conversation</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border rounded-lg bg-white shadow-sm">
      <ChatHeader />
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-4 space-y-1">
          {isMessagesLoading ? (
            <MessageSkeleton />
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm">Send a message to start the conversation!</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => {
                const prevMsg = messages[index - 1];
                const showDateDivider = shouldShowDateDivider(message, prevMsg);
                const isOwn = isOwnMessage(message);
                return (
                  <div key={message._id}>
                    {showDateDivider && (
                      <div className="flex justify-center my-6">
                        <span className="bg-white px-4 py-2 rounded-full text-sm text-gray-600 shadow-sm font-medium">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                    )}
                    <div className={`flex mb-2 ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${isOwn ? "bg-orange-500 text-white rounded-br-md" : "bg-white text-gray-800 rounded-bl-md border border-gray-200"}`}>
                        {!isOwn && <p className="text-xs text-gray-500 mb-1 font-medium">{getSenderName(message)}</p>}
                        {message.image && <div className="mb-2"><img src={message.image} alt="Sent" className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90" onClick={() => window.open(message.image, "_blank")} /></div>}
                        {message.text && <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>}
                        <p className={`text-xs mt-1 ${isOwn ? "text-white opacity-75" : "text-gray-500"}`}>{formatTime(message.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>
      <MessageInput onSendMessage={handleSendMessage} doctorId={chatId} disabled={isMessagesLoading || !selectedUser} placeholder="Type a message..." />
    </div>
  );
};

export default ChatWindow;
