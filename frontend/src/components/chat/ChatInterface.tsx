import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { aiService } from "../../services/aiService";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import theme from "../../styles/theme";

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
        background: theme.colors.background.secondary,
        backdropFilter: theme.effects.backdropBlur.md,
        display: "flex",
        flexDirection: "column",
        borderRadius: theme.borderRadius.xl,
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
                padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
                borderRadius: theme.borderRadius.lg,
                background:
                  msg.sender === "user"
                    ? theme.colors.brand.redGradient
                    : theme.colors.background.card,
                backdropFilter: theme.effects.backdropBlur.md,
                border: `1px solid ${theme.colors.border.light}`,
                boxShadow: theme.shadows.sm,
                fontFamily: "inherit",
                fontSize: theme.typography.fontSize.base,
                lineHeight: theme.typography.lineHeight.relaxed,
                color: theme.colors.text.primary,
              }}
            >
              <div
                style={{
                  fontWeight: theme.typography.fontWeight.semibold,
                  marginBottom: theme.spacing.sm,
                  fontSize: theme.typography.fontSize.sm,
                  color:
                    msg.sender === "user"
                      ? theme.colors.text.white
                      : theme.colors.text.secondary,
                }}
              >
                {msg.sender === "ai" ? "Ideal Assistant" : "You"}
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
                padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
                borderRadius: theme.borderRadius.lg,
                background: theme.colors.background.card,
                backdropFilter: theme.effects.backdropBlur.md,
                border: `1px solid ${theme.colors.border.light}`,
                boxShadow: theme.shadows.sm,
                fontFamily: "inherit",
                color: theme.colors.text.secondary,
                fontSize: theme.typography.fontSize.base,
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.sm,
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
          padding: theme.spacing.xl,
          borderTop: `1px solid ${theme.colors.border.light}`,
          display: "flex",
          gap: theme.spacing.md,
          background: theme.colors.background.secondary,
          backdropFilter: theme.effects.backdropBlur.sm,
          borderBottomLeftRadius: theme.borderRadius.xl,
          borderBottomRightRadius: theme.borderRadius.xl,
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
            gap: theme.spacing.sm,
          }}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <PaperAirplaneIcon style={{ width: "20px", height: "20px" }} />
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
