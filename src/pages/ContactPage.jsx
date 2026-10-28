import { useState } from 'react';
import api from '../services/api';

const emptyForm = { name: '', mobile: '', email: '', subject: '', message: '' };

function ContactPage() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSending(true); setStatus('');
    try {
      await api.post('/contact', form);
      setForm(emptyForm);
      setStatus('Your enquiry was sent successfully.');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to send your enquiry. Please try again.');
    } finally { setSending(false); }
  };

  const change = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  return (
    <div className="page-shell contact-layout">
      <div>
        <h1>Contact Agent</h1>
        <p><strong>Agent Name:</strong> Amit Sharma</p>
        <p><strong>Mobile:</strong> +91 98765 43210</p>
        <p><strong>Email:</strong> amit@licagent.example</p>
        <p><strong>WhatsApp:</strong> +91 98765 43210</p>
        <p><strong>Location:</strong> Bengaluru, India</p>
      </div>

      <form className="form-card" onSubmit={submit}>
        <h3>Send a Message</h3>
        <input placeholder="Name" value={form.name} onChange={change('name')} required />
        <input placeholder="Mobile" value={form.mobile} onChange={change('mobile')} />
        <input type="email" placeholder="Email" value={form.email} onChange={change('email')} />
        <input placeholder="Subject" value={form.subject} onChange={change('subject')} />
        <textarea placeholder="Message" rows="5" value={form.message} onChange={change('message')} required />
        {status && <p className="form-status" role="status">{status}</p>}
        <button type="submit" className="btn btn-primary" disabled={sending}>{sending ? 'Sending…' : 'Send Enquiry'}</button>
      </form>
    </div>
  );
}

export default ContactPage;
