import React, { useState } from 'react';
import { X } from 'lucide-react';

const chatbotIcon = "https://res.cloudinary.com/dbr85jktp/image/upload/v1747658202/chatboticx_btdz3t.webp";

const ChatBotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Xin chào! Tôi có thể giúp gì cho bạn?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    // Giả lập phản hồi bot
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { from: 'bot', text: 'Cảm ơn bạn! UniFoodie sẽ phản hồi sớm nhất có thể.' }
      ]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-kanit">
        {/* Nút mở chat */}
        {!open && (
        <button
        onClick={() => setOpen(true)}
        className="w-14 h-14 bg-orange-400 hover:bg-orange-500 rounded-full flex items-center justify-center shadow-lg"
        >
        <img src={chatbotIcon} alt="Chatbot Icon" className="w-8 h-8" />
        </button>
        )}

      {/* Khung chat */}
      {open && (
        <div className="mt-3 w-[340px] h-[480px] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden border border-gray-200 animate-slide-up">
        {/* Header */}
        <div className="bg-red-600 text-white px-4 py-2 font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
             <img
                 src={chatbotIcon}
                 className="w-8 h-8 rounded-full"
                     alt="bot"
            />
             UniFoodie Takeaway
            </div>
            <button onClick={() => setOpen(false)} className="hover:text-gray-200">
             <X size={20} />
            </button>
            </div>

          {/* Nội dung chat */}
          <div className="flex-1 p-3 space-y-2 overflow-y-auto bg-[#fffbee]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                  msg.from === 'user'
                    ? 'bg-blue-100 self-end ml-auto'
                    : 'bg-gray-200 self-start mr-auto'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Gõ tin nhắn */}
          <div className="p-2 border-t bg-white flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhắn ngay..."
              className="flex-1 border rounded-full px-4 py-1 text-sm focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-orange-400 hover:bg-orange-500 text-white p-2 rounded-full"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M22 2L11 13"></path>
                <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBotWidget;
