import { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // Assuming useAuth is in this path
import { toast } from "react-toastify"; // Assuming react-toastify is installed

export default function ChatModal({
  conversationId,
  currentUserId,
  otherPartyId, // This might not be strictly needed inside ChatModal itself if API handles sender/recipient
  currentUserName,
  otherPartyName,
  onClose,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false); // Can be used for real-time typing indicators
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { token, user: authUser } = useAuth(); // Get the authentication token and user object

  // Scroll chat to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Fetch messages when the modal opens or conversationId changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId || !token || !authUser || !authUser.role) {
        console.warn("Missing conversationId, token, or user role for fetching messages.");
        return;
      }

      let apiUrl = '';
      // Determine API URL based on user role
      if (authUser.role === "CUSTOMER") {
        apiUrl = `http://localhost:8081/api/customers/conversations/${conversationId}/messages`;
      } else if (authUser.role === "PROVIDER") {
        apiUrl = `http://localhost:8081/api/provider/conversations/${conversationId}/messages`;
      } else {
        console.error("Unknown user role for fetching messages:", authUser.role);
        toast.error("Invalid user role for chat.");
        return;
      }

      try {
        const response = await fetch(apiUrl, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch messages.");
        }
        const data = await response.json();
        
        // Map messages to include 'from' field for styling
        const formattedMessages = data.map(msg => ({
          ...msg,
          from: msg.senderId === currentUserId ? "me" : "other",
          time: new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error(error.message || "Failed to load messages.");
      }
    };

    fetchMessages();
  }, [conversationId, token, currentUserId, authUser]); // Add authUser to dependencies

  const sendMessage = async () => {
    if (input.trim() === "" || !conversationId || !token || !authUser || !authUser.role) {
      return;
    }

    let apiUrl = '';
    // Determine API URL for sending messages based on user role
    if (authUser.role === "CUSTOMER") {
      apiUrl = `http://localhost:8081/api/customers/messages`; // Assuming /api/customers/messages for customer
    } else if (authUser.role === "PROVIDER") {
      apiUrl = `http://localhost:8081/api/provider/messages`; // Assuming /api/provider/messages for provider
    } else {
      console.error("Unknown user role for sending messages:", authUser.role);
      toast.error("Invalid user role for chat.");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          conversationId: conversationId,
          content: input.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message.");
      }

      const sentMessage = await response.json();
      setMessages(prevMessages => [
        ...prevMessages,
        {
          ...sentMessage,
          from: "me", // Assuming the sent message is always from the current user
          time: new Date(sentMessage.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setInput(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Failed to send message.");
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    // Implement typing indicator logic if needed
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-[80vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Chat with {otherPartyName}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Messages Display Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.length === 0 && <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-xl px-4 py-2 ${
                  msg.from === "me"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p className="font-semibold text-sm"></p>
                <p className="text-sm">{msg.content}</p>
                <div className="flex justify-end items-center mt-1 text-xs">
                  <span className={`${msg.from === "me" ? "text-gray-200" : "text-gray-500"}`}>{msg.time}</span>
                  {/* Status indicator can be more sophisticated */}
                  {/* {msg.from === "me" && renderStatus(msg.status)} */}
                </div>
              </div>
            </div>
          ))}
          {/* Typing indicator - integrate with real-time if available */}
          {isTyping && (
            <div className="max-w-[60%] bg-gray-300 rounded-lg self-start px-4 py-2 text-gray-700 italic">
              {otherPartyName} is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t px-6 py-4 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition duration-200 text-white"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}