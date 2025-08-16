import { useEffect, useRef, useState, useCallback } from "react";
import { Image, Send, X, Loader2 } from "lucide-react";
import { useAuthStore } from "../store/AuthStore";

const MessageInput = ({ onSendMessage, doctorId, disabled = false, placeholder = "Type a message..." }) => {
  const { user, getUserAppointments } = useAuthStore();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canChat, setCanChat] = useState(false); // <-- controls whether input is enabled
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const validateImage = (file) => {
    if (!file.type.startsWith("image/")) return false;
    if (file.size > MAX_FILE_SIZE) return false;
    return true;
  };

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file || !validateImage(file)) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const removeImage = useCallback(() => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const clearForm = useCallback(() => {
    setText("");
    removeImage();
  }, [removeImage]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!canChat) return;

    const trimmedText = text.trim();
    if (!trimmedText && !imagePreview) return;
    if (isLoading || disabled) return;

    setIsLoading(true);
    try {
      const messageData = {
        text: trimmedText,
        image: imagePreview,
        timestamp: new Date().toISOString(),
      };
      if (onSendMessage) await onSendMessage(messageData);
      clearForm();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const isFormValid = (text.trim() || imagePreview) && !isLoading && !disabled && canChat;

  // Determine chat permission
  useEffect(() => {
    const checkChatPermission = async () => {
      if (!user) return setCanChat(false);

      if (user.role === "doctor" || user.role === "admin") {
        return setCanChat(true);
      }

      if (user.role === "patient") {
        const data = await getUserAppointments();
        const patientAppointments = (data.bookings || []).filter(
          appt => appt.doctorId?._id === doctorId && appt.paymentStatus === "Completed"
        );

        if (patientAppointments.length === 0) return setCanChat(false);

        // Latest appointment
        const latestAppointment = patientAppointments.reduce((prev, curr) =>
          new Date(curr.completionDate) > new Date(prev.completionDate) ? curr : prev
        );

        setCanChat(new Date(latestAppointment.completionDate) > new Date());
      }
    };

    checkChatPermission();
  }, [user, doctorId, getUserAppointments]);

  return (
    <div className="p-4 w-full bg-orange-50 border-t border-orange-200">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img src={imagePreview} alt="Upload preview" className="w-20 h-20 object-cover rounded-lg border border-orange-300 shadow-sm" />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-orange-50 transition-colors"
              type="button"
              disabled={isLoading}
            >
              <X size={12} className="text-gray-700" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <textarea
            className="w-full resize-none overflow-hidden rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled || isLoading || !canChat}
            rows={1}
            style={{ minHeight: "40px", maxHeight: "120px", height: "auto" }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
          />
        </div>

        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} disabled={disabled || isLoading || !canChat} />

        <button
          type="button"
          className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
            ${imagePreview ? "bg-blue-50 border-blue-300 text-blue-600 hover:bg-blue-100" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800"}
            ${!canChat || disabled || isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={() => fileInputRef.current?.click()}
          disabled={!canChat || disabled || isLoading}
        >
          <Image size={18} />
        </button>

        <button
          type="submit"
          onClick={handleSendMessage}
          className={`flex items-center justify-center w-10 h-10 rounded-lg border-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1
            ${isFormValid ? "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          disabled={!isFormValid}
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>

      {!canChat && user?.role === "patient" && (
        <p className="mt-2 text-sm text-gray-500">You don't have an active appointment with this doctor.</p>
      )}
    </div>
  );
};

export default MessageInput;
