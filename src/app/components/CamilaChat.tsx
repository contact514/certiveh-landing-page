import { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUPPORT_CHAT_URL = 'https://ykolfdgnlaxahtbuurgj.supabase.co/functions/v1/support-chat';

export default function CamilaChat() {
  const [open, setOpen] = useState(false);
  const [prefilterDone, setPrefilterDone] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef(open);

  useEffect(() => { openRef.current = open; }, [open]);

  useEffect(() => {
    if (open && prefilterDone) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, prefilterDone]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (chatRef.current && !chatRef.current.contains(target) && fabRef.current && !fabRef.current.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const addAssistantMessage = useCallback((content: string) => {
    const reply: Message = { id: crypto.randomUUID(), role: 'assistant', content };
    setMessages(prev => [...prev, reply]);
    if (!openRef.current) setUnread(prev => prev + 1);
  }, []);

  const getTypingDelay = (text: string) => {
    const baseDelay = 1200;
    const perChar = 35 + Math.random() * 15;
    return Math.min(baseDelay + text.length * perChar, 8000);
  };

  const handlePrefilter = (isClient: boolean) => {
    if (isClient) {
      window.open('https://portal.certiveh.co', '_blank');
      setOpen(false);
      return;
    }
    setPrefilterDone(true);
    // Send initial greeting
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addAssistantMessage('hola! que tal, soy Camila de CertiVeh');
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addAssistantMessage('en que te puedo ayudar? si tienes alguna duda sobre los beneficios tributarios para tu carro eléctrico o híbrido, con gusto te explico');
          }, 1800);
        }, 500);
      }, 2000);
    }, 500);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');

    await new Promise(r => setTimeout(r, 2500 + Math.random() * 2000));
    setIsTyping(true);

    try {
      const res = await fetch(SUPPORT_CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          screenContext: 'Landing page de certiveh.co. Visitante no registrado. IMPORTANTE: La Resolución UPME 400 de 2026 eliminó el sistema de ciclos (Ciclo I y Ciclo II). Ahora hay una ventana continua de radicación del 1 de febrero al 15 de diciembre de cada año. La ventana está ABIERTA ahora. NO menciones ciclos, NO digas que la ventana está cerrada, NO digas que hay que esperar. Las solicitudes se radican de inmediato.',
        }),
      });

      const data = await res.json();
      const rawReply = data?.reply || 'lo siento, hubo un problema, puedes intentar de nuevo?';
      const shouldClose = data?.closeChat === true;
      const parts = rawReply.split(/\n?---\n?/).map((s: string) => s.trim()).filter(Boolean);

      const firstDelay = getTypingDelay(parts[0] || '');
      await new Promise(r => setTimeout(r, firstDelay));
      setIsTyping(false);

      for (let i = 0; i < parts.length; i++) {
        if (i > 0) {
          setIsTyping(true);
          await new Promise(r => setTimeout(r, getTypingDelay(parts[i])));
          setIsTyping(false);
        }
        addAssistantMessage(parts[i]);
      }

      if (shouldClose) {
        setTimeout(() => { setOpen(false); resetChat(); }, 3000);
      }
    } catch {
      setIsTyping(false);
      addAssistantMessage('disculpa, tuve un problema técnico, puedes intentar de nuevo en un momento?');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setPrefilterDone(false);
    setIsTyping(false);
    setInput('');
  };

  return (
    <>
      {/* Chat window */}
      {open && (
        <div
          ref={chatRef}
          className="camila-chat-window"
          style={{
            position: 'fixed', bottom: 88, right: 16, width: 400, maxWidth: 'calc(100vw - 32px)',
            height: 560, maxHeight: 'calc(100vh - 120px)', zIndex: 9999, borderRadius: 16, overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column',
            background: '#fff', border: '1px solid #e2e8f0',
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #059669, #14B8A6)', padding: '14px 16px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
                </svg>
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, lineHeight: 1.2 }}>Camila · Soporte</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                  En línea
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'white', cursor: 'pointer', padding: 4, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Pre-filter screen */}
          {!prefilterDone ? (
            <div style={{
              flex: 1, padding: '32px 24px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 16, minHeight: 300,
              background: '#f8fafc', textAlign: 'center',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%', background: '#ecfdf5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>
                  Hola! Soy Camila
                </div>
                <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.5 }}>
                  Estoy aquí para resolver tus dudas sobre los beneficios tributarios para tu vehículo eléctrico o híbrido.
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginTop: 8 }}>
                <button
                  onClick={() => handlePrefilter(false)}
                  style={{
                    background: 'linear-gradient(135deg, #059669, #14B8A6)', color: '#fff', border: 'none', borderRadius: 8,
                    padding: '12px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    boxShadow: '0 4px 24px rgba(5,150,105,0.4)', transition: 'transform 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  Quiero saber más sobre CertiVeh
                </button>
                <button
                  onClick={() => handlePrefilter(true)}
                  style={{
                    background: '#fff', color: '#334155', border: '1.5px solid #CBD5E1', borderRadius: 8,
                    padding: '12px 16px', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                    transition: 'background 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                >
                  Ya soy cliente de CertiVeh
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div style={{
                flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column',
                gap: 8, minHeight: 300, background: '#f8fafc',
              }}>
                {messages.map(m => (
                  <div key={m.id} style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    background: m.role === 'user' ? '#059669' : '#F1F5F9',
                    color: m.role === 'user' ? '#fff' : '#1e293b',
                    padding: '10px 14px', fontSize: 14, lineHeight: 1.5,
                    borderRadius: m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  }}>
                    {m.content}
                  </div>
                ))}
                {isTyping && (
                  <div style={{
                    alignSelf: 'flex-start', background: '#F1F5F9',
                    padding: '10px 14px', borderRadius: '12px 12px 12px 4px', fontSize: 14, color: '#94a3b8',
                  }}>
                    <span style={{ animation: 'pulse 1.5s infinite' }}>Escribiendo...</span>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{
                padding: '10px 12px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8,
                background: '#fff',
              }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu mensaje..."
                  style={{
                    flex: 1, border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 16px',
                    fontSize: 14, outline: 'none', background: '#f8fafc',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(5,150,105,0.15)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  style={{
                    background: '#059669', border: 'none', borderRadius: 12, width: 40, height: 40,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    opacity: !input.trim() || isTyping ? 0.5 : 1,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* FAB button */}
      <button
        ref={fabRef}
        onClick={() => { setOpen(o => !o); }}
        style={{
          position: 'fixed', bottom: 20, right: 16, width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #059669, #14B8A6)', border: 'none', cursor: 'pointer', zIndex: 9999,
          boxShadow: '0 4px 24px rgba(5,150,105,0.4)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', transition: 'transform 150ms',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
          </svg>
        )}
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -2, right: -2, width: 20, height: 20, borderRadius: '50%',
            background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {unread}
          </span>
        )}
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 640px) {
          .camila-chat-window {
            bottom: 0 !important;
            right: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: 100% !important;
            max-height: 100% !important;
            border-radius: 0 !important;
            border: none !important;
          }
        }
      `}</style>
    </>
  );
}
