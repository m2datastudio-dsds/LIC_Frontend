import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Building2, Pencil, Plus, Settings2, Trash2 } from 'lucide-react';

const API = 'http://localhost:5000/api';
const emptyService = { name: '', category: 'LIFE_INSURANCE', shortDescription: '', fullDescription: '', isActive: true };

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isFormPage = location.pathname.startsWith('/admin/services/');
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyService);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('adminToken');
  const client = useMemo(() => axios.create({ baseURL: API, headers: { Authorization: `Bearer ${token}` } }), [token]);

  const loadData = useCallback(async () => {
    try {
      const response = await client.get('/services', { params: { active: 'false' } });
      const items = response.data.data || [];
      setServices(items);
      if (location.pathname.includes('/edit')) {
        const id = location.pathname.split('/')[3];
        const item = items.find((service) => service.id === id);
        if (item) {
          setEditingId(id);
          setForm({ name: item.name || '', category: item.category || 'LIFE_INSURANCE', shortDescription: item.shortDescription || '', fullDescription: item.fullDescription || '', isActive: item.isActive });
        }
      }
    } catch (error) {
      if ([401, 403].includes(error.response?.status)) { localStorage.removeItem('adminToken'); navigate('/admin/login'); }
      else setMessage('Could not load admin data. Make sure the backend and database are running.');
    }
  }, [client, location.pathname, navigate]);

  useEffect(() => { if (!token) navigate('/admin/login'); else loadData(); }, [loadData, navigate, token]);

  const save = async (event) => {
    event.preventDefault();
    try {
      if (editingId) await client.put(`/services/${editingId}`, form); else await client.post('/services', form);
      setForm(emptyService); setEditingId(null); setMessage(editingId ? 'Service updated.' : 'Service created.');
      await loadData(); navigate('/admin/dashboard');
    } catch (error) { setMessage(error.response?.data?.message || 'Unable to save service.'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this service? This cannot be undone.')) return;
    try { await client.delete(`/services/${id}`); setMessage('Service deleted.'); await loadData(); }
    catch (error) { setMessage(error.response?.data?.message || 'Unable to delete service.'); }
  };

  const logout = () => { localStorage.removeItem('adminToken'); localStorage.removeItem('adminUser'); navigate('/admin/login'); };
  return <div className={`admin-shell ${isFormPage ? 'admin-form-page' : 'admin-dashboard-list'}`}><div className="admin-workspace">
    <aside className="admin-sidebar"><p>MANAGEMENT</p><button type="button" className="active" onClick={() => navigate('/admin/dashboard')}><Settings2 size={19}/><span>Service Management<small>{services.length} services</small></span></button><button type="button" onClick={() => navigate('/admin/real-estate')}><Building2 size={19}/><span>Real Estate<small>Property listings</small></span></button></aside>
    <section className="admin-main-panel"><header className="admin-header"><div><span className="eyebrow">Content management</span><h1>{isFormPage ? (editingId ? 'Edit Service' : 'Add Service') : 'Insurance Admin'}</h1><p>LIC and Star Health products are loaded live from their official websites. Manage customer services here.</p></div><button className="btn btn-light btn-small" type="button" onClick={logout}>Log Out</button></header>
      {message && <div className="admin-message">{message}</div>}
      {!isFormPage && <div className="admin-list-toolbar"><button className="btn btn-primary btn-small" type="button" onClick={() => { setForm(emptyService); setEditingId(null); navigate('/admin/services/new'); }}><Plus size={17}/> Add Service</button></div>}
      {isFormPage && <button className="admin-back-link" type="button" onClick={() => navigate('/admin/dashboard')}><ArrowLeft size={17}/> Back to management</button>}
      {isFormPage && <form className="admin-editor" onSubmit={save}><h2>{editingId ? 'Edit Service' : 'Add Service'}</h2><div className="admin-form-grid">
        <label>Service name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
        <label>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="LIFE_INSURANCE">Life Insurance</option><option value="HEALTH_INSURANCE">Health Insurance</option></select></label>
        <label className="wide">Short description<textarea rows="2" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} /></label>
        <label className="wide">Full description<textarea rows="3" value={form.fullDescription} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })} /></label>
        <label className="admin-check"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
      </div><div className="admin-form-actions"><button className="btn btn-primary" type="submit">{editingId ? 'Save Service' : 'Add Service'}</button></div></form>}
      {!isFormPage && <div className="admin-list">{services.map((service) => <article className="admin-row" key={service.id}><div className="admin-card-actions"><button type="button" onClick={() => navigate(`/admin/services/${service.id}/edit`)} aria-label={`Edit ${service.name}`}><Pencil size={16}/></button><button className="delete" type="button" onClick={() => remove(service.id)} aria-label={`Delete ${service.name}`}><Trash2 size={16}/></button></div><div><span className="badge">{service.category === 'LIFE_INSURANCE' ? 'Life Insurance' : 'Health Insurance'}</span><h3>{service.name}</h3><p>{service.shortDescription}</p></div></article>)}</div>}
    </section>
  </div></div>;
}
