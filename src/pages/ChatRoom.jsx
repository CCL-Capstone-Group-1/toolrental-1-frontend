import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useChat } from "../hooks/useChat";
import { useAuth } from "../context/AuthContext";
import "./ChatRoom.css";

export default function ChatRoom() {
  const { id } = useParams();
  const { user } = useAuth();
  const { currentMessages, isLoading, fetchChatMessages, sendNewMessage } = useChat();
  const [draft, setDraft] = useState("");

  useEffect(() => {
    fetchChatMessages(id);
  }, [id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!draft.trim()) return;

    const text = draft;
    setDraft("");
    await sendNewMessage(id, { text });
  };

  return (
    <main className="chat-room">
      <h1>Chat with tool owner</h1>

      <div className="chat-room__messages">
        {isLoading && currentMessages.length === 0 ? (
          <p className="chat-room__status">Loading conversation…</p>
        ) : currentMessages.length === 0 ? (
          <p className="chat-room__status">No messages yet. Say hello!</p>
        ) : (
          currentMessages.map((message, index) => {
            const isMine = message.senderId === user?.id;
            return (
              <div
                key={message.id || index}
                className={`chat-bubble${isMine ? " chat-bubble--mine" : ""}`}
              >
                {message.text || message.content}
              </div>
            );
          })
        )}
      </div>

      <form className="chat-room__composer" onSubmit={handleSend}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message…"
          rows={2}
        />
        <button type="submit" className="chat-room__send" aria-label="Send message">
          ▲
        </button>
      </form>
    </main>
  );
}
