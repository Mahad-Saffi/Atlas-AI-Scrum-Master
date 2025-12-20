import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { aiService } from "../../services/aiService";

interface Message {
  sender: "user" | "ai";
  text: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "👋 Hey there! What project are you thinking of building today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projectCreated, setProjectCreated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage = { sender: "user" as const, text: inputValue };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("Authentication token not found.");
      }
      const aiResponse = await aiService.discover(inputValue, token);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", text: aiResponse.text },
      ]);
      if (aiResponse.text === "Project created successfully!") {
        setProjectCreated(true);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "ai",
          text: "😅 Oops! Something went wrong. Mind trying that again?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "rgba(236, 223, 204, 0.3)",
        backdropFilter: "blur(15px)",
        display: "flex",
        flexDirection: "column",
        borderRadius: "var(--radius-xl)",
      }}
    >
      {/* Messages Area */}
      <div
        style={{
          flex: "1",
          padding: "1.25rem",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              animation: "slideIn 0.3s ease-out",
            }}
          >
            <div
              style={{
                maxWidth: "75%",
                padding: "1rem 1.25rem",
                borderRadius: "var(--radius-lg)",
                background:
                  msg.sender === "user"
                    ? "linear-gradient(145deg, #ECDFCC, #D4C7B4)"
                    : "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(236, 223, 204, 0.4)",
                boxShadow: "0 2px 8px rgba(24, 28, 20, 0.08)",
                fontFamily: "inherit",
                fontSize: "0.9375rem",
                lineHeight: "1.6",
                color: "#181C14",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  fontSize: "0.8125rem",
                  color: msg.sender === "user" ? "#3C3D37" : "#697565",
                }}
              >
                {msg.sender === "ai" ? "Atlas AI" : "You"}
              </div>
              {msg.sender === "ai" ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                <div>{msg.text}</div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <div
              style={{
                padding: "1rem 1.25rem",
                borderRadius: "var(--radius-lg)",
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(236, 223, 204, 0.4)",
                boxShadow: "0 2px 8px rgba(24, 28, 20, 0.08)",
                fontFamily: "inherit",
                color: "#697565",
                fontSize: "0.9375rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span className="spinner"></span>
              <span>Thinking...</span>
            </div>
          </div>
        )}

        {projectCreated && (
          <div
            style={{
              textAlign: "center",
              marginTop: "1.25rem",
              animation: "bounceIn 0.5s ease-out",
            }}
          >
            <button
              onClick={() => (window.location.href = "/task-board")}
              className="btn-primary"
              style={{
                fontSize: "1rem",
                padding: "0.875rem 2rem",
              }}
            >
              View Your Project
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          padding: "1.25rem",
          borderTop: "1px solid rgba(236, 223, 204, 0.3)",
          display: "flex",
          gap: "0.75rem",
          background: "rgba(236, 223, 204, 0.5)",
          backdropFilter: "blur(10px)",
          borderBottomLeftRadius: "var(--radius-xl)",
          borderBottomRightRadius: "var(--radius-xl)",
        }}
      >
        <input
          id="chat-input"
          type="text"
          placeholder="Type your message here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) =>
            e.key === "Enter" && !isLoading && handleSendMessage()
          }
          className="input-modern"
          style={{
            flex: "1",
          }}
          disabled={isLoading || projectCreated}
        />
        <button
          id="btn-send-message"
          onClick={handleSendMessage}
          className="btn-primary"
          disabled={isLoading || projectCreated}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>📤</span>
              <span>Send</span>
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          50% {
            transform: scale(1.02);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
