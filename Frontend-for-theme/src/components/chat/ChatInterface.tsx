import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { aiService } from "../../services/aiService";
import {
  PaperAirplaneIcon,
  SparklesIcon,
  UserCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

interface Message {
  sender: "user" | "ai";
  text: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hey there! What project are you thinking of building today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projectCreated, setProjectCreated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      setMessages([
        {
          sender: "ai",
          text: "Please log in first to use the AI assistant. Redirecting to login page...",
        },
      ]);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  }, []);

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
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "ai",
            text: "Please log in first to use the AI assistant. Redirecting to login page...",
          },
        ]);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        setIsLoading(false);
        return;
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
          text: "Oops! Something went wrong. Mind trying that again?",
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
        background: "rgba(17, 17, 24, 0.7)",
        backdropFilter: "blur(16px)",
        display: "flex",
        flexDirection: "column",
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Messages Area */}
      <div
        style={{
          flex: "1",
          padding: "1.5rem",
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
                borderRadius: "16px",
                background:
                  msg.sender === "user"
                    ? "linear-gradient(135deg, #dc2626, #991b1b)"
                    : "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border:
                  msg.sender === "user"
                    ? "none"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow:
                  msg.sender === "user"
                    ? "0 4px 16px rgba(220, 38, 38, 0.3)"
                    : "0 2px 8px rgba(0, 0, 0, 0.2)",
                fontFamily: "inherit",
                fontSize: "0.9375rem",
                lineHeight: "1.6",
                color: msg.sender === "user" ? "white" : "#f1f5f9",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  fontSize: "0.8125rem",
                  color:
                    msg.sender === "user"
                      ? "rgba(255, 255, 255, 0.9)"
                      : "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {msg.sender === "ai" ? (
                  <>
                    <SparklesIcon style={{ width: "14px", height: "14px" }} />
                    <span style={{ color: "#f1f5f9" }}>Ideal</span>{" "}
                    <span style={{ color: "#dc2626" }}>Assistant</span>
                  </>
                ) : (
                  <>
                    <UserCircleIcon style={{ width: "14px", height: "14px" }} />
                    You
                  </>
                )}
              </div>
              {msg.sender === "ai" ? (
                <div style={{ color: "#f1f5f9" }}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
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
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                fontFamily: "inherit",
                color: "#94a3b8",
                fontSize: "0.9375rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid #94a3b8",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
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
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "1rem",
                padding: "0.875rem 2rem",
                background: "linear-gradient(135deg, #22c55e, #15803d)",
                border: "none",
                borderRadius: "12px",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(34, 197, 94, 0.4)",
              }}
            >
              <CheckCircleIcon style={{ width: "20px", height: "20px" }} />
              View Your Project!
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          padding: "1.25rem",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          gap: "0.75rem",
          background: "rgba(10, 10, 15, 0.5)",
          backdropFilter: "blur(10px)",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
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
          style={{
            flex: "1",
            padding: "0.875rem 1rem",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            color: "#f1f5f9",
            fontSize: "0.9375rem",
            outline: "none",
          }}
          disabled={isLoading || projectCreated}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || projectCreated}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.875rem 1.5rem",
            background:
              isLoading || projectCreated
                ? "rgba(220, 38, 38, 0.5)"
                : "linear-gradient(135deg, #dc2626, #991b1b)",
            border: "none",
            borderRadius: "12px",
            color: "white",
            fontSize: "0.9375rem",
            fontWeight: 600,
            cursor: isLoading || projectCreated ? "not-allowed" : "pointer",
            boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
          }}
        >
          {isLoading ? (
            <>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid white",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <PaperAirplaneIcon style={{ width: "18px", height: "18px" }} />
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

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
