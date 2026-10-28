import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createAuthenticatedApi } from '../services/api';
import { ArrowLeft, Building2, Camera, ImagePlus, LogOut, Mail, Pencil, Plus, Trash2, Video, X } from 'lucide-react';

const blank = { title: '', propertyType: 'Apartment', listingType: 'SALE', status: 'AVAILABLE', price: '', location: '', address: '', bedrooms: '', bathrooms: '', area: '', areaUnit: 'sq ft', description: '', amenities: '', media: [], contactName: '', contactPhone: '', isFeatured: false, isActive: true };

export default function AdminRealEstatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isForm = location.pathname !== '/admin/real-estate';
  const editId = location.pathname.includes('/edit') ? location.pathname.split('/')[3] : null;
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState(blank);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [cameraMode, setCameraMode] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const cameraPreviewRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const recorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const discardRecordingRef = useRef(false);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('adminToken');
  const client = useMemo(() => createAuthenticatedApi(token), [token]);

  const load = useCallback(async () => {
    try {
      const response = await client.get('/properties', { params: { active: 'false' } });
      const rows = response.data.data || [];
      setProperties(rows);
      if (editId) {
        const item = rows.find((row) => row.id === editId);
        if (item) setForm({ ...blank, ...item, price: String(item.price), amenities: Array.isArray(item.amenities) ? item.amenities.join('\n') : '' });
      }
    } catch (error) {
      if ([401, 403].includes(error.response?.status)) navigate('/admin/login');
      else setMessage('Could not load properties. Make sure the backend and database are running.');
    }
  }, [client, editId, navigate]);

  useEffect(() => { if (!token) navigate('/admin/login'); else load(); }, [load, navigate, token]);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const addPhotos = (files) => {
    const selected = [...files].slice(0, 15 - photoFiles.length);
    setPhotoFiles((current) => [...current, ...selected]);
    setPhotoPreviews((current) => [...current, ...selected.map((file) => URL.createObjectURL(file))]);
  };
  const selectPhotos = (event) => {
    addPhotos(event.target.files || []);
    event.target.value = '';
  };
  const removeSelectedPhoto = (index) => {
    URL.revokeObjectURL(photoPreviews[index]);
    setPhotoFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setPhotoPreviews((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };
  const closeCamera = useCallback(() => {
    if (recorderRef.current?.state === 'recording') {
      discardRecordingRef.current = true;
      recorderRef.current.stop();
    }
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
    recorderRef.current = null;
    setIsRecording(false);
    setCameraMode(null);
  }, []);
  useEffect(() => () => {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);
  const openCamera = async (mode) => {
    setCameraError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access is not supported by this browser. Please use the upload option.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: mode === 'video' });
      cameraStreamRef.current = stream;
      setCameraMode(mode);
      setTimeout(() => { if (cameraPreviewRef.current) cameraPreviewRef.current.srcObject = stream; }, 0);
    } catch {
      setCameraError('Camera could not be opened. Allow camera permission and try again.');
    }
  };
  const capturePhoto = () => {
    const preview = cameraPreviewRef.current;
    if (!preview?.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = preview.videoWidth;
    canvas.height = preview.videoHeight;
    canvas.getContext('2d').drawImage(preview, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      addPhotos([new File([blob], `property-photo-${Date.now()}.jpg`, { type: 'image/jpeg' })]);
      closeCamera();
    }, 'image/jpeg', 0.92);
  };
  const startRecording = () => {
    if (!window.MediaRecorder || !cameraStreamRef.current) {
      setCameraError('Video recording is not supported by this browser. Please upload a video instead.');
      return;
    }
    const supportedType = ['video/mp4', 'video/webm;codecs=vp9', 'video/webm'].find((type) => MediaRecorder.isTypeSupported(type));
    const recorder = new MediaRecorder(cameraStreamRef.current, supportedType ? { mimeType: supportedType } : undefined);
    discardRecordingRef.current = false;
    recordedChunksRef.current = [];
    recorder.ondataavailable = (event) => { if (event.data.size) recordedChunksRef.current.push(event.data); };
    recorder.onstop = () => {
      if (discardRecordingRef.current || !recordedChunksRef.current.length) {
        recordedChunksRef.current = [];
        return;
      }
      const type = recorder.mimeType.split(';')[0] || 'video/webm';
      const extension = type === 'video/mp4' ? 'mp4' : 'webm';
      setVideoFile(new File(recordedChunksRef.current, `property-video-${Date.now()}.${extension}`, { type }));
      recordedChunksRef.current = [];
      closeCamera();
    };
    recorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
  };
  const stopRecording = () => {
    if (recorderRef.current?.state === 'recording') {
      discardRecordingRef.current = false;
      recorderRef.current.stop();
    }
    setIsRecording(false);
  };
  const save = async (event) => {
    event.preventDefault(); setSaving(true); setMessage('');
    try {
      let media = form.media || [];
      if (photoFiles.length || videoFile) {
        const data = new FormData();
        photoFiles.forEach((file) => data.append('media', file));
        if (videoFile) data.append('media', videoFile);
        const upload = await client.post('/uploads/property-media', data);
        const uploaded = upload.data.data || [];
        const uploadedVideo = uploaded.some((item) => item.type === 'video');
        media = [...(uploadedVideo ? media.filter((item) => item.type !== 'video') : media), ...uploaded];
      }
      const payload = { ...form, media, amenities: form.amenities.split('\n').map((x) => x.trim()).filter(Boolean) };
      if (editId) await client.put(`/properties/${editId}`, payload); else await client.post('/properties', payload);
      navigate('/admin/real-estate');
    } catch (error) { setMessage(error.response?.data?.message || 'Unable to save property.'); }
    finally { setSaving(false); }
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this property? This cannot be undone.')) return;
    try { await client.delete(`/properties/${id}`); await load(); } catch (error) { setMessage(error.response?.data?.message || 'Unable to delete property.'); }
  };
  const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value));

  return <div className={`admin-shell ${isForm ? 'admin-form-page' : 'admin-dashboard-list'}`}><div className="admin-workspace">
    <aside className="admin-sidebar"><p>MANAGEMENT</p>
      <button className="active" onClick={() => navigate('/admin/real-estate')}><Building2 size={19}/><span>Real Estate<small>{properties.length} properties</small></span></button>
      <button onClick={() => navigate('/admin/enquiries')}><Mail size={19}/><span>Inbox<small>Customer enquiries</small></span></button>
      <button className="admin-sidebar-logout" onClick={() => { localStorage.removeItem('adminToken'); localStorage.removeItem('adminUser'); navigate('/admin/login'); }}><LogOut size={19}/><span>Log Out<small>End admin session</small></span></button>
    </aside>
    <section className="admin-main-panel">
      <header className="admin-header"><div><span className="eyebrow">Property management</span><h1>{isForm ? (editId ? 'Edit Property' : 'Add Property') : 'Real Estate'}</h1><p>{isForm ? 'Enter property details and upload photos or a video.' : 'Manage the properties displayed on the public website.'}</p></div>{!isForm && <button className="btn btn-primary admin-add-property" onClick={() => navigate('/admin/real-estate/new')}><Plus size={18}/> Add Property</button>}</header>
      {message && <div className="admin-message">{message}</div>}
      {isForm && <><button className="admin-back-link" onClick={() => navigate('/admin/real-estate')}><ArrowLeft size={17}/> Back to properties</button>
        <form className="admin-editor property-editor" onSubmit={save}><h2>Property details</h2><div className="admin-form-grid">
          <label>Property title<input required value={form.title} onChange={(e) => set('title', e.target.value)}/></label>
          <label>Property type<select value={form.propertyType} onChange={(e) => set('propertyType', e.target.value)}><option>Apartment</option><option>Villa</option><option>House</option><option>Plot</option><option>Commercial</option><option>Office</option><option>Shop</option></select></label>
          <label>Listing type<select value={form.listingType} onChange={(e) => set('listingType', e.target.value)}><option value="SALE">For Sale</option><option value="RENT">For Rent</option></select></label>
          <label>Status<select value={form.status} onChange={(e) => set('status', e.target.value)}><option value="AVAILABLE">Available</option><option value="SOLD">Sold</option><option value="RENTED">Rented</option></select></label>
          <label>Price (₹)<input required min="0" type="number" value={form.price} onChange={(e) => set('price', e.target.value)}/></label>
          <label>Location<input required placeholder="City / locality" value={form.location} onChange={(e) => set('location', e.target.value)}/></label>
          <label className="wide">Full address<input value={form.address} onChange={(e) => set('address', e.target.value)}/></label>
          <label>Bedrooms<input min="0" type="number" value={form.bedrooms ?? ''} onChange={(e) => set('bedrooms', e.target.value)}/></label>
          <label>Bathrooms<input min="0" type="number" value={form.bathrooms ?? ''} onChange={(e) => set('bathrooms', e.target.value)}/></label>
          <label>Area<input min="0" step="0.01" type="number" value={form.area ?? ''} onChange={(e) => set('area', e.target.value)}/></label>
          <label>Area unit<select value={form.areaUnit} onChange={(e) => set('areaUnit', e.target.value)}><option>sq ft</option><option>sq m</option><option>acre</option><option>cent</option></select></label>
          <label className="wide">Description<textarea rows="5" value={form.description || ''} onChange={(e) => set('description', e.target.value)}/></label>
          <label className="wide">Amenities <small>One per line</small><textarea rows="4" value={form.amenities} onChange={(e) => set('amenities', e.target.value)}/></label>
          <label>Contact name<input value={form.contactName || ''} onChange={(e) => set('contactName', e.target.value)}/></label>
          <label>Contact phone<input value={form.contactPhone || ''} onChange={(e) => set('contactPhone', e.target.value)}/></label>
          <label className={`wide property-upload ${photoFiles.length >= 15 ? 'upload-full' : ''}`}><ImagePlus size={24}/><span>{photoFiles.length ? 'Add more property photos' : 'Choose property photos'}</span><small>Choose photos one at a time or select several together. You can return here repeatedly until 15 photos are added.</small><input disabled={photoFiles.length >= 15} type="file" multiple accept="image/jpeg,.jpg,.jpeg,.jfif,image/png,image/webp" onChange={selectPhotos}/>{photoFiles.length > 0 && <strong>{photoFiles.length} of 15 photos selected</strong>}</label>
          <button disabled={photoFiles.length >= 15} type="button" className="wide property-upload property-camera-upload" onClick={() => openCamera('photo')}><Camera size={24}/><span>Take a property photo</span><small>Open the camera, capture a photo, and add it to this property.</small></button>
          {photoPreviews.length > 0 && <div className="wide selected-photo-previews">{photoPreviews.map((url, index) => <figure key={url}><img src={url} alt={`Selected photo ${index + 1}`}/><figcaption>{index + 1}. {photoFiles[index].name}</figcaption><button type="button" onClick={() => removeSelectedPhoto(index)}>Remove</button></figure>)}</div>}
          <label className="wide property-upload property-video-upload"><span className="property-video-icon">▶</span><span>Upload property video</span><small>Optional: upload one MP4, WebM, or MOV video, maximum 50 MB. A new video replaces the existing one.</small><input type="file" accept="video/mp4,video/webm,video/quicktime,.mov" onChange={(e) => setVideoFile(e.target.files?.[0] || null)}/>{videoFile && <strong>{videoFile.name}</strong>}</label>
          <button type="button" className="wide property-upload property-camera-upload" onClick={() => openCamera('video')}><Video size={24}/><span>Record a property video</span><small>Open the camera and record a video. Maximum file size is 50 MB.</small></button>
          {cameraError && <p className="wide camera-error">{cameraError}</p>}
          {form.media?.length > 0 && <div className="wide admin-media-strip">{form.media.map((item, index) => <div key={`${item.url}-${index}`}>{item.type === 'video' ? <video src={item.url} controls/> : <img src={item.url} alt="Property"/>}<button type="button" onClick={() => set('media', form.media.filter((_, i) => i !== index))}>Remove</button></div>)}</div>}
          <label className="admin-check"><input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)}/> Featured</label>
          <label className="admin-check"><input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)}/> Publish publicly</label>
        </div><div className="admin-form-actions"><button disabled={saving} className="btn btn-primary">{saving ? 'Saving…' : editId ? 'Save Property' : 'Add Property'}</button><button type="button" className="btn btn-light" onClick={() => navigate('/admin/real-estate')}>Cancel</button></div></form></>}
      {!isForm && <div className="admin-list">{properties.map((p) => <article className="admin-row property-admin-card" key={p.id}>{p.media?.[0] && (p.media[0].type === 'video' ? <video src={p.media[0].url}/> : <img src={p.media[0].url} alt={p.title}/>)}<div className="admin-card-actions"><button onClick={() => navigate(`/admin/real-estate/${p.id}/edit`)}><Pencil size={16}/></button><button className="delete" onClick={() => remove(p.id)}><Trash2 size={16}/></button></div><div className="property-admin-body"><span className="badge">{p.propertyType} · {p.listingType === 'SALE' ? 'Sale' : 'Rent'}</span><h3>{p.title}</h3><p>{p.location}</p><strong>{money(p.price)}</strong><small className={`property-status ${p.status.toLowerCase()}`}>{p.status}</small></div></article>)}</div>}
    </section>
    {cameraMode && <div className="camera-modal" role="dialog" aria-modal="true" aria-label={cameraMode === 'photo' ? 'Take property photo' : 'Record property video'}><div className="camera-dialog"><div className="camera-dialog-header"><div><strong>{cameraMode === 'photo' ? 'Take property photo' : 'Record property video'}</strong><small>Use the rear camera and keep the property inside the frame.</small></div><button type="button" onClick={closeCamera} aria-label="Close camera"><X size={22}/></button></div><video ref={cameraPreviewRef} autoPlay playsInline muted/><div className="camera-actions">{cameraMode === 'photo' ? <button type="button" className="camera-shutter" onClick={capturePhoto}><Camera size={21}/> Capture photo</button> : isRecording ? <button type="button" className="camera-stop" onClick={stopRecording}>Stop and use video</button> : <button type="button" className="camera-shutter" onClick={startRecording}><Video size={21}/> Start recording</button>}<button type="button" className="btn btn-light" onClick={closeCamera}>Cancel</button></div></div></div>}
  </div></div>;
}
