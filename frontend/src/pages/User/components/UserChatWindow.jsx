import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import MessageSkeleton from "../../../components/MessageSkeleton.jsx";
import ChatHeader from "../../../components/ChatHeader.jsx";
import MessageInput from "../../../components/MessageInput.jsx";

const UserChatWindow = () => {
  const { chatId } = useParams(); // Get chatId from URL params
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Dummy data matching your Message model structure
  const dummyCurrentUser = {
    _id: "current_user_id",
    name: "You",
    userType: "User" // or "Doctor"
  };

  const dummyMessages = {
    u1: [
      {
        _id: "msg1",
        senderId: "u1",
        senderModel: "Doctor",
        receiverId: "current_user_id", 
        receiverModel: "User",
        text: "Hello! How can I help today?",
        image: null,
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 3600000)
      },
      {
        _id: "msg2", 
        senderId: "current_user_id",
        senderModel: "User",
        receiverId: "u1",
        receiverModel: "Doctor", 
        text: "My dog has been coughing lately.",
        image: null,
        createdAt: new Date(Date.now() - 3000000),
        updatedAt: new Date(Date.now() - 3000000)
      },
      {
        _id: "msg3",
        senderId: "u1", 
        senderModel: "Doctor",
        receiverId: "current_user_id",
        receiverModel: "User",
        text: "I see. How long has this been going on? Any other symptoms?",
        image: null,
        createdAt: new Date(Date.now() - 2400000),
        updatedAt: new Date(Date.now() - 2400000)
      },
      {
        _id: "msg4a",
        senderId: "current_user_id",
        senderModel: "User",
        receiverId: "u1",
        receiverModel: "Doctor", 
        text: "About 3 days now. He's also been less active and not eating much.",
        image: null,
        createdAt: new Date(Date.now() - 1800000),
        updatedAt: new Date(Date.now() - 1800000)
      },
      {
        _id: "msg5a",
        senderId: "u1", 
        senderModel: "Doctor",
        receiverId: "current_user_id",
        receiverModel: "User",
        text: "That sounds concerning. I'd recommend bringing him in for an examination. Can you send me a short video of the cough?",
        image: null,
        createdAt: new Date(Date.now() - 1200000),
        updatedAt: new Date(Date.now() - 1200000)
      }
    ],
    u2: [
      {
        _id: "msg4",
        senderId: "u2",
        senderModel: "User", 
        receiverId: "current_user_id",
        receiverModel: "User",
        text: "Hey! Long time no see! 😊",
        image: null,
        createdAt: new Date(Date.now() - 7200000),
        updatedAt: new Date(Date.now() - 7200000)
      },
      {
        _id: "msg5",
        senderId: "current_user_id",
        senderModel: "User",
        receiverId: "u2", 
        receiverModel: "User",
        text: "Yeah, it's been a while! How have you been?",
        image: null,
        createdAt: new Date(Date.now() - 6600000),
        updatedAt: new Date(Date.now() - 6600000)
      },
      {
        _id: "msg6b",
        senderId: "u2",
        senderModel: "User", 
        receiverId: "current_user_id",
        receiverModel: "User",
        text: "Great! Just got back from vacation. Check out this sunset I captured!",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        createdAt: new Date(Date.now() - 6000000),
        updatedAt: new Date(Date.now() - 6000000)
      },
      {
        _id: "msg7b",
        senderId: "current_user_id",
        senderModel: "User",
        receiverId: "u2", 
        receiverModel: "User",
        text: "Wow, that's absolutely beautiful! Where was this taken?",
        image: null,
        createdAt: new Date(Date.now() - 5400000),
        updatedAt: new Date(Date.now() - 5400000)
      }
    ],
    u3: [
      {
        _id: "msg6",
        senderId: "u3",
        senderModel: "Doctor",
        receiverId: "current_user_id",
        receiverModel: "User", 
        text: "Good morning! Did you get the test results I sent over?",
        image: null,
        createdAt: new Date(Date.now() - 1800000),
        updatedAt: new Date(Date.now() - 1800000)
      },
      {
        _id: "msg7",
        senderId: "current_user_id", 
        senderModel: "User",
        receiverId: "u3",
        receiverModel: "Doctor",
        text: "Yes, I reviewed them. The analysis looks comprehensive. Great work! 👏",
        image: null,
        createdAt: new Date(Date.now() - 900000),
        updatedAt: new Date(Date.now() - 900000)
      },
      {
        _id: "msg8c",
        senderId: "u3",
        senderModel: "Doctor",
        receiverId: "current_user_id",
        receiverModel: "User", 
        text: "Thank you! I wanted to follow up - do you have any questions about the treatment plan?",
        image: null,
        createdAt: new Date(Date.now() - 600000),
        updatedAt: new Date(Date.now() - 600000)
      },
      {
        _id: "msg9c",
        senderId: "current_user_id", 
        senderModel: "User",
        receiverId: "u3",
        receiverModel: "Doctor",
        text: "Actually, yes. How often should I give the medication?",
        image: null,
        createdAt: new Date(Date.now() - 300000),
        updatedAt: new Date(Date.now() - 300000)
      }
    ]
  };

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Simulate fetching current user and messages
  useEffect(() => {
    setCurrentUser(dummyCurrentUser);
    setIsLoading(true);
    setMessages([]);
    
    // Simulate API call delay
    setTimeout(() => {
      setMessages(dummyMessages[chatId] || []);
      setIsLoading(false);
    }, 400);
  }, [chatId]);

  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  // Handle sending new messages
  const handleSendMessage = async (messageData) => {
    if (!currentUser) return;

    // Create new message matching your schema
    const newMessage = {
      _id: `temp_${Date.now()}`, // Temporary ID
      senderId: currentUser._id,
      senderModel: currentUser.userType,
      receiverId: chatId,
      receiverModel: getReceiverModel(chatId), // You'll need to determine this
      text: messageData.text || "",
      image: messageData.image ? URL.createObjectURL(messageData.image) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Optimistically add message to UI
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate auto-response for demo purposes
    if (messageData.text && chatId !== "current_user_id") {
      setTimeout(() => {
        const responses = {
          u1: [ // Doctor responses
            "I understand your concern. Let me help you with that.",
            "Based on what you're describing, I'd recommend scheduling an appointment.",
            "That's a good question. Here's what I suggest...",
            "Thank you for providing those details. This helps with the diagnosis."
          ],
          u2: [ // Friend responses
            "That sounds awesome! 😄",
            "I totally agree with you on that!",
            "Haha, that's so true! 😂",
            "Thanks for sharing that with me!"
          ],
          u3: [ // Doctor responses
            "Let me check on that for you.",
            "That's a great question. I'll get back to you with more details.",
            "I appreciate your patience with this process.",
            "Feel free to reach out if you have any other concerns."
          ]
        };
        
        const chatResponses = responses[chatId] || responses.u2;
        const responseText = chatResponses[Math.floor(Math.random() * chatResponses.length)];
        
        const responseMessage = {
          _id: `response_${Date.now()}`,
          senderId: chatId,
          senderModel: getReceiverModel(chatId),
          receiverId: currentUser._id,
          receiverModel: currentUser.userType,
          text: responseText,
          image: null,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setMessages(prev => [...prev, responseMessage]);
      }, 1000 + Math.random() * 2000);
    }
  };

  // Helper function to determine receiver model
  const getReceiverModel = (receiverId) => {
    // You'll need logic to determine if receiver is User or Doctor
    // This could come from your contacts/users data
    const doctorIds = ['u1', 'u3']; // Example
    return doctorIds.includes(receiverId) ? 'Doctor' : 'User';
  };

  // Check if message is from current user
  const isOwnMessage = (message) => {
    return message.senderId === currentUser?._id;
  };

  const formatTime = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date(timestamp));
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    }
  };

  const shouldShowDateDivider = (currentMsg, prevMsg) => {
    if (!prevMsg) return true;
    
    const currentDate = new Date(currentMsg.createdAt).toDateString();
    const prevDate = new Date(prevMsg.createdAt).toDateString();
    
    return currentDate !== prevDate;
  };

  const getSenderName = (message) => {
    if (isOwnMessage(message)) return "You";
    
    // You'd typically get this from your contacts/users data
    const senderNames = {
      u1: "Dr. Emily Carter",
      u2: "John Doe",
      u3: "Sarah Wilson"
    };
    
    return senderNames[message.senderId] || `${message.senderModel}`;
  };

  return (
    <div className="flex flex-col h-full border rounded-lg bg-white shadow-sm">
      {/* Chat Header */}
      <ChatHeader currentUserId={chatId} />

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto bg-gray-50"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23f3f4f6' fill-opacity='0.1'%3e%3ccircle cx='30' cy='30' r='2'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")` 
        }}
      >
        <div className="p-4 space-y-1">
          {isLoading ? (
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
                    {/* Date divider */}
                    {showDateDivider && (
                      <div className="flex justify-center my-6">
                        <span className="bg-white px-4 py-2 rounded-full text-sm text-gray-600 shadow-sm font-medium">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                    )}
                    
                    {/* Message bubble */}
                    <div
                      className={`flex mb-2 ${
                        isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                          isOwn
                            ? "bg-orange-500 text-white rounded-br-md"
                            : "bg-white text-gray-800 rounded-bl-md border border-gray-200"
                        }`}
                      >
                        {/* Message image if exists */}
                        {message.image && (
                          <div className="mb-2">
                            <img 
                              src={message.image} 
                              alt="Sent image" 
                              className="rounded-lg max-w-full h-auto"
                            />
                          </div>
                        )}
                        
                        {/* Message text */}
                        {message.text && (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.text}
                          </p>
                        )}
                        
                        {/* Message time - white for user messages, gray for others */}
                        <p className={`text-xs mt-1 ${
                          isOwn ? "text-white opacity-75" : "text-gray-500"
                        }`}>
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Message Input */}
      <MessageInput 
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        placeholder="Type a message..."
      />
    </div>
  );
};

export default UserChatWindow;