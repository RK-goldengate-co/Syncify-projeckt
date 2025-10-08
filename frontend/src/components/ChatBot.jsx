import React, { useEffect, useRef, useState } from 'react';

const API_BASE = 'http://localhost:8000';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState([{ role: 'bot', text: 'Xin chào! Tôi là Syncify Bot. Hỏi tôi về các câu hỏi FAQ nhé.' }]);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [msgs, open]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setMsgs(m => [...m, { role: 'user', text }]);
    setInput('');
    try {
      const res = await fetch(`${API_BASE}/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text }) });
      const data = await res.json();
      setMsgs(m => [...m, { role: 'bot', text: data.reply || '...' }]);
    } catch (e) {
      setMsgs(m => [...m, { role: 'bot', text: 'Không thể kết nối bot. Hãy chạy backend Python ở cổng 8000.' }]);
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {!open && (
        <button onClick={() => setOpen(true)} className="bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center">
          💬
        </button>
      )}
      {open && (
        <div className="w-80 sm:w-96 bg-white rounded-xl shadow-xl border overflow-hidden">
          <div className="bg-blue-600 text-white px-4 py-2 flex items-center justify-between">
            <div className="font-semibold">Syncify Bot</div>
            <button onClick={() => setOpen(false)} className="text-white/90 hover:text-white">✖</button>
          </div>
          <div ref={listRef} className="h-72 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {msgs.map((m, i) => (
              <div key={i} className={`max-w-[85%] px-3 py-2 rounded-lg ${m.role==='bot' ? 'bg-white border self-start' : 'bg-blue-600 text-white ml-auto'}`}>{m.text}</div>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
              className="flex-1 border rounded px-3 py-2" placeholder="Nhập câu hỏi..." />
            <button onClick={send} className="bg-blue-600 text-white px-3 py-2 rounded">Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
}
