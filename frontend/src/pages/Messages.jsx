import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MessageCircle, Send, Inbox } from 'lucide-react';

function Messages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [threads, setThreads] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const token = localStorage.getItem('token');

  const loadInbox = useCallback(async () => {
    if (!token) return;
    const res = await axios.get('/api/messages/inbox', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setThreads(res.data);
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    (async () => {
      try {
        await loadInbox();
      } catch {
        toast.error('Could not load messages');
      } finally {
        setLoading(false);
      }
    })();
  }, [token, navigate, loadInbox]);

  const loadThread = async (peerId, propertyId) => {
    const params = propertyId ? { property_id: propertyId } : {};
    const res = await axios.get(`/api/messages/thread/${peerId}`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    setMessages(res.data);
  };

  useEffect(() => {
    const peer = searchParams.get('peer');
    const property = searchParams.get('property');
    if (!peer || !token || loading) return;
    setActive({ peer_id: peer, property_id: property || null });
    loadThread(peer, property || null);
  }, [searchParams, token, loading]);

  const openThread = async (t) => {
    setActive({ peer_id: t.peer_id, property_id: t.property_id });
    await loadThread(t.peer_id, t.property_id);
    const qs = new URLSearchParams();
    qs.set('peer', t.peer_id);
    if (t.property_id) qs.set('property', t.property_id);
    navigate(`/messages?${qs.toString()}`, { replace: true });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !active || !token) return;
    setSending(true);
    try {
      const body = {
        receiver_id: active.peer_id,
        body: text.trim()
      };
      if (active.property_id) body.property_id = active.property_id;
      await axios.post('/api/messages', body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setText('');
      await loadThread(active.peer_id, active.property_id);
      await loadInbox();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="container page-messages" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-2xl)', minHeight: '75vh' }}>
      <div className="page-header-modern">
        <h1>Messages</h1>
        <p>Chat with hosts about listings or reply to guests about their stays.</p>
      </div>

      <div
        className="glass-panel"
        style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 340px) 1fr', minHeight: '520px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}
      >
        <aside style={{ borderRight: '1px solid var(--neutral-100)', background: 'var(--neutral-50)' }}>
          <div style={{ padding: 'var(--spacing-md) var(--spacing-lg)', borderBottom: '1px solid var(--neutral-100)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <Inbox size={18} /> Inbox
          </div>
          <div style={{ maxHeight: '560px', overflowY: 'auto' }}>
            {threads.length === 0 ? (
              <p style={{ padding: 'var(--spacing-lg)', color: 'var(--neutral-400)', margin: 0 }}>No conversations yet. Message a host from a property page.</p>
            ) : (
              threads.map((t) => (
                <button
                  key={`${t.peer_id}-${t.property_id || 'x'}`}
                  type="button"
                  onClick={() => openThread(t)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: 'var(--spacing-md) var(--spacing-lg)',
                    border: 'none',
                    borderBottom: '1px solid var(--neutral-100)',
                    background: active?.peer_id === t.peer_id && active?.property_id === t.property_id ? 'white' : 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t.peer_name}</div>
                  {t.property_title && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginTop: '2px' }}>{t.property_title}</div>
                  )}
                  <div style={{ fontSize: '0.8rem', color: 'var(--neutral-400)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.last_message}
                  </div>
                  {t.unread > 0 && (
                    <span className="badge-unread">{t.unread} new</span>
                  )}
                </button>
              ))
            )}
          </div>
        </aside>

        <section style={{ display: 'flex', flexDirection: 'column', background: 'white' }}>
          {!active ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--neutral-400)', flexDirection: 'column', gap: '0.5rem' }}>
              <MessageCircle size={40} strokeWidth={1.25} />
              Select a conversation
            </div>
          ) : (
            <>
              <div style={{ padding: 'var(--spacing-md) var(--spacing-lg)', borderBottom: '1px solid var(--neutral-100)' }}>
                <strong>Conversation</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--neutral-400)' }}>Messages are tied to this listing when opened from a property.</div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {messages.map((m) => {
                  const me = localStorage.getItem('user');
                  let uid = '';
                  try {
                    uid = JSON.parse(me || '{}').id;
                  } catch {
                    uid = '';
                  }
                  const mine = m.sender_id === uid;
                  return (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: mine ? 'flex-end' : 'flex-start',
                        maxWidth: '78%',
                        padding: '0.65rem 1rem',
                        borderRadius: mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: mine ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' : 'var(--neutral-50)',
                        color: mine ? 'white' : 'var(--neutral-600)',
                        fontSize: '0.9rem',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      {m.body}
                      <div style={{ fontSize: '0.7rem', opacity: 0.85, marginTop: '4px' }}>
                        {new Date(m.created_at).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
              <form onSubmit={sendMessage} style={{ padding: 'var(--spacing-md) var(--spacing-lg)', borderTop: '1px solid var(--neutral-100)', display: 'flex', gap: 'var(--spacing-sm)' }}>
                <input
                  className="form-input"
                  style={{ flex: 1, marginBottom: 0 }}
                  placeholder="Type a message…"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" disabled={sending || !text.trim()}>
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Messages;
