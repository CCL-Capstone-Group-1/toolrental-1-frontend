import { useEffect, useState } from "react";
import { useChat } from "../hooks/useChat";
import { useAuth } from "../context/AuthContext";
import { getMockMessages, addMockMessage } from "../data/mockLoanStore";
import "./ChatBox.css";

export default function ChatBox({ loanId }) {
  const { user } = useAuth();
  const { currentMessages, isLoading, fetchChatMessages, sendNewMessage } = useChat();
  const [draft, setDraft] = useState("");
  // No live backend yet — fall back to locally-stored dev messages (seeded
  // by the "Skip Payment (Dev)" button on the Rental page) so the chat isn't
  // empty. Remove once chatService has a real API to hit.
  const [mockMessages, setMockMessages] = useState([]);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    fetchChatMessages(loanId).catch(() => {
      setMockMessages(getMockMessages(loanId));
      setUsingMock(true);
    });
  }, [loanId]);

  const messages = usingMock ? mockMessages : currentMessages;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!draft.trim()) return;

    const text = draft;
    setDraft("");

    if (usingMock) {
      const message = addMockMessage(loanId, { id: Date.now(), senderId: user?.id, text });
      setMockMessages((prev) => [...prev, message]);
      return;
    }

    try {
      await sendNewMessage(loanId, { text });
    } catch {
      addMockMessage(loanId, { id: Date.now(), senderId: user?.id, text });
      setMockMessages(getMockMessages(loanId));
      setUsingMock(true);
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-box__messages">
        {isLoading && !usingMock && messages.length === 0 ? (
          <p className="chat-box__status">Loading conversation…</p>
        ) : messages.length === 0 ? (
          <p className="chat-box__status">No messages yet. Say hello!</p>
        ) : (
          messages.map((message, index) => {
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

      <form className="chat-box__composer" onSubmit={handleSend}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message…"
          rows={2}
        />
        <button type="submit" className="chat-box__send" aria-label="Send message">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 4 L21 20 L3 20 Z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
