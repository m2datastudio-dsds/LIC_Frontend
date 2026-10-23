import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bell, Building2, LogOut, Mail, MessageSquare, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function AdminEnquiriesPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');
  const client = useMemo(() => axios.create({ baseURL: API, headers: { Authorization: `Bearer ${token}` } }), [token]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [openItem, setOpenItem] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setMessage('');
    try {
      const [contactResponse, enquiryResponse] = await Promise.all([client.get('/contact'), client.get('/enquiries')]);
      const contacts = (contactResponse.data.data || []).map((item) => ({ ...item, source: 'contact' }));
      const enquiries = (enquiryResponse.data.data || []).map((item) => ({ ...item, source: 'enquiry', subject: item.subject || 'Customer enquiry' }));
      setItems([...contacts, ...enquiries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      if ([401, 403].includes(error.response?.status)) navigate('/admin/login');
      else setMessage(error.response?.data?.message || 'Unable to load enquiries.');
    } finally { setLoading(false); }
  }, [client, navigate]);

  useEffect(() => { if (!token) navigate('/admin/login'); else load(); }, [load, navigate, token]);

  const openMessage = async (item) => {
    setOpenItem((current) => current === `${item.source}-${item.id}` ? null : `${item.source}-${item.id}`);
    if (item.status !== 'NEW') return;
    try {
      if (item.source === 'contact') await client.patch(`/contact/${item.id}/status`, { status: 'CLOSED' });
      else await client.patch(`/enquiries/${item.id}/status`, { status: 'CLOSED' });
      setItems((current) => current.map((entry) => entry.id === item.id && entry.source === item.source ? { ...entry, status: 'CLOSED' } : entry));
      window.dispatchEvent(new Event('admin-notifications-refresh'));
    } catch (error) { setMessage(error.response?.data?.message || 'Unable to update enquiry.'); }
  };

  const unread = items.filter((item) => item.status === 'NEW').length;
  return <div className="admin-shell admin-dashboard-list"><div className="admin-workspace">
    <aside className="admin-sidebar"><p>MANAGEMENT</p><button onClick={() => navigate('/admin/real-estate')}><Building2 size={19}/><span>Real Estate<small>Property listings</small></span></button><button className="active" onClick={() => navigate('/admin/enquiries')}><Mail size={19}/><span>Inbox<small>{unread} new messages</small></span></button><button className="admin-sidebar-logout" onClick={() => { localStorage.removeItem('adminToken'); localStorage.removeItem('adminUser'); navigate('/admin/login'); }}><LogOut size={19}/><span>Log Out<small>End admin session</small></span></button></aside>
    <section className="admin-main-panel admin-inbox-page"><header className="admin-inbox-header"><div><span className="eyebrow">Admin inbox</span><h1><Bell size={30}/> Enquiries</h1><p>{unread} new message{unread === 1 ? '' : 's'}</p></div></header><div className="admin-inbox-toolbar"><button className="admin-refresh-button" onClick={load} aria-label="Refresh enquiries" title="Refresh enquiries"><RefreshCw size={16}/></button></div>
    {message && <div className="admin-message">{message}</div>}
    {loading ? <p>Loading enquiries…</p> : items.length === 0 ? <div className="admin-inbox-empty"><Mail size={38}/><h2>No enquiries yet</h2><p>New contact and customer enquiries will appear here.</p></div> : <div className="admin-inbox-list">{items.map((item) => { const key = `${item.source}-${item.id}`; const isOpen = openItem === key; return <article className={`admin-inbox-item ${item.status === 'NEW' ? 'unread' : ''} ${isOpen ? 'open' : ''}`} key={key} onClick={() => openMessage(item)} role="button" tabIndex="0" onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') openMessage(item); }}>
      <div className="inbox-icon">{item.source === 'contact' ? <Mail size={20}/> : <MessageSquare size={20}/>}</div>
      <div className="inbox-content"><div className="inbox-meta"><strong>{item.customerName || item.name || item.user?.name || 'Customer'}</strong><span>{new Date(item.createdAt).toLocaleString()}</span></div><h3>{item.subject || 'Customer enquiry'}</h3>{isOpen && <div className="inbox-message-detail"><p>{item.message}</p><small>{item.email || item.user?.email || ''}{(item.mobile || item.user?.mobile) ? ` · ${item.mobile || item.user?.mobile}` : ''}</small></div>}</div>
      <div className="inbox-actions"><span className={`inbox-status ${item.status.toLowerCase()}`}>{item.status.replace('_', ' ')}</span></div>
    </article>; })}</div>}
    </section>
  </div></div>;
}
