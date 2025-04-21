// components/ChatWidget.tsx
import { useState, useEffect } from 'react';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Inject minimal widget styles directly
    const style = document.createElement('style');
    style.innerHTML = `
      .mvp-chat-button {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background-color: #2563eb;
        color: white;
        border-radius: 9999px;
        padding: 12px 18px;
        border: none;
        font-weight: 600;
        font-size: 16px;
        cursor: pointer;
        z-index: 1000;
      }

      .mvp-chat-iframe {
        position: fixed;
        bottom: 80px;
        right: 24px;
        width: 380px;
        height: 500px;
        border: none;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        z-index: 1000;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <>
      <button className="mvp-chat-button" onClick={() => setOpen(!open)}>
        {open ? 'Close Assistant' : 'Ask MVP'}
      </button>

      {open && (
        <iframe
          src="/assistant"
          className="mvp-chat-iframe"
          title="MVP Assistant"
        />
      )}
    </>
  );
}
