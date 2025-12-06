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
        background: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        borderRadius: "var(--radius-xl)",
      }}
    >
      {/* Messages Area */}
      <div
        style={{
          flex: "1",
          padding: "20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
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
                padding: "14px 18px",
                borderRadius: "12px",
                background:
                  msg.sender === "user"
                    ? "linear-gradient(145deg, #f0f0f0, #cacaca)"
                    : "#e8e8e8",
                boxShadow:
                  msg.sender === "user"
                    ? "6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff"
                    : "6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff",
                fontFamily: "inherit",
                fontSize: "15px",
                lineHeight: "1.6",
                color: "#090909",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "6px",
                  fontSize: "13px",
                  color: "#666",
                }}
              >
                {msg.sender === "ai" ? "🤖 Atlas AI" : "👤 You"}
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
                padding: "14px 18px",
                borderRadius: "12px",
                background: "#e8e8e8",
                boxShadow: "6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff",
                fontFamily: "inherit",
                color: "#666",
                fontSize: "15px",
              }}
            >
              <span style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
                🤔 Thinking...
              </span>
            </div>
          </div>
        )}

        {projectCreated && (
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              animation: "bounceIn 0.5s ease-out",
            }}
          >
            <button
              onClick={() => (window.location.href = "/task-board")}
              className="btn-primary"
              style={{
                fontSize: "1rem",
              }}
            >
              🎉 View Your Project!
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          padding: "20px",
          borderTop: "1px solid rgba(0, 0, 0, 0.1)",
          display: "flex",
          gap: "12px",
          background: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(10px)",
          borderBottomLeftRadius: "var(--radius-xl)",
          borderBottomRightRadius: "var(--radius-xl)",
        }}
      >
        <input
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
          onClick={handleSendMessage}
          className="btn-primary"
          disabled={isLoading || projectCreated}
        >
          {isLoading ? "⏳ Sending..." : "📤 Send"}
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

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
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
