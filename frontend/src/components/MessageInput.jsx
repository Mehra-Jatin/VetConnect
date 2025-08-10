import { useRef, useState, useCallback } from "react";
import { Image, Send, X, Loader2 } from "lucide-react";

const MessageInput = ({ onSendMessage, disabled = false, placeholder = "Type a message..." }) => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // File size limit (5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const validateImage = (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return false;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      alert("Image size must be less than 5MB");
      return false;
    }
    
    return true;
  };

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file || !validateImage(file)) return;

    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.onerror = () => {
      alert("Failed to read image file");
    };
    reader.readAsDataURL(file);
  }, []);

  const removeImage = useCallback(() => {
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const clearForm = useCallback(() => {
    setText("");
    removeImage();
  }, [removeImage]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    const trimmedText = text.trim();
    if (!trimmedText && !imagePreview) return;
    if (isLoading || disabled) return;

    setIsLoading(true);
    
    try {
      const messageData = {
        text: trimmedText,
        image: selectedFile,
        timestamp: new Date().toISOString()
      };
      
      // Call parent's send message function
      if (onSendMessage) {
        await onSendMessage(messageData);
      }
      
      clearForm();
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const isFormValid = (text.trim() || imagePreview) && !isLoading && !disabled;

  return (
    <div className="p-4 w-full bg-orange-50 border-t border-orange-200">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2" role="img" aria-label="Image preview">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Upload preview"
              className="w-20 h-20 object-cover rounded-lg border border-orange-300 shadow-sm"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white
              flex items-center justify-center shadow-md hover:bg-orange-50 transition-colors
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
              type="button"
              aria-label="Remove uploaded image"
              disabled={isLoading}
            >
              <X size={12} className="text-gray-700" />
            </button>
          </div>
        </div>
      )}

      {/* Message Form */}
      <div className="flex items-center gap-2">
        {/* Text Input */}
        <div className="flex-1">
          <textarea
            className="w-full resize-none overflow-hidden rounded-lg border border-gray-300 
            px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-500
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none
            disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled || isLoading}
            rows={1}
            style={{
              minHeight: '40px',
              maxHeight: '120px',
              height: 'auto'
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
          disabled={disabled || isLoading}
        />

        {/* Image Upload Button */}
        <button
          type="button"
          className={`flex items-center justify-center w-10 h-10 rounded-lg border
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
          ${imagePreview 
            ? "bg-blue-50 border-blue-300 text-blue-600 hover:bg-blue-100" 
            : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800"
          }
          ${(disabled || isLoading) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={() => fileInputRef.current?.click()}
          aria-label="Upload image"
          disabled={disabled || isLoading}
        >
          <Image size={18} />
        </button>

        {/* Send Button */}
        <button
          type="submit"
          onClick={handleSendMessage}
          className={`flex items-center justify-center w-10 h-10 rounded-lg border-none
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1
          ${isFormValid 
            ? "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer" 
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!isFormValid}
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;