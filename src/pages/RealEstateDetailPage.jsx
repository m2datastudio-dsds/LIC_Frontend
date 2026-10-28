import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Bath, BedDouble, Check, ChevronLeft, ChevronRight, MapPin, Maximize2, Phone } from 'lucide-react';

export default function RealEstateDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState(0);
  useEffect(() => { api.get(`/properties/${id}`).then((r) => setProperty(r.data.data)).catch(() => setProperty(null)).finally(() => setLoading(false)); }, [id]);
  if (loading) return <div className="page-shell">Loading property…</div>;
  if (!property) return <div className="page-shell"><h1>Property not found</h1><Link to="/real-estate">Back to listings</Link></div>;
  const media = property.media || [];
  const current = media[activeMedia];
  const move = (direction) => setActiveMedia((index) => (index + direction + media.length) % media.length);
  const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(property.price));
  return <div className="page-shell property-detail">
    <Link className="admin-back-link" to="/real-estate"><ArrowLeft size={17}/> Back to listings</Link>
    <div className="property-carousel">
      {current ? current.type === 'video' ? <video key={current.url} src={current.url} controls/> : <img key={current.url} src={current.url} alt={`${property.title} ${activeMedia + 1}`}/> : <div className="property-placeholder">No photos available</div>}
      {media.length > 1 && <><button className="carousel-arrow carousel-prev" onClick={() => move(-1)} aria-label="Previous photo"><ChevronLeft/></button><button className="carousel-arrow carousel-next" onClick={() => move(1)} aria-label="Next photo"><ChevronRight/></button><span className="carousel-count">{activeMedia + 1} / {media.length}</span></>}
    </div>
    {media.length > 1 && <div className="property-thumbnails">{media.map((item, index) => <button className={index === activeMedia ? 'active' : ''} onClick={() => setActiveMedia(index)} key={`${item.url}-${index}`}>{item.type === 'video' ? <><video src={item.url}/><span>▶</span></> : <img src={item.url} alt=""/>}</button>)}</div>}
    <div className="property-detail-layout"><main><span className="badge">{property.propertyType} · {property.listingType === 'SALE' ? 'For Sale' : 'For Rent'}</span><h1>{property.title}</h1><p className="property-location"><MapPin size={17}/>{property.address || property.location}</p><div className="property-detail-facts">{property.bedrooms != null && <span><BedDouble/> <b>{property.bedrooms}</b> Bedrooms</span>}{property.bathrooms != null && <span><Bath/> <b>{property.bathrooms}</b> Bathrooms</span>}{property.area != null && <span><Maximize2/> <b>{property.area}</b> {property.areaUnit}</span>}</div><h2>About this property</h2><p className="property-description">{property.description || 'Contact us for complete property details.'}</p>{property.amenities?.length > 0 && <><h2>Amenities</h2><div className="amenities-grid">{property.amenities.map((a) => <span key={a}><Check size={16}/>{a}</span>)}</div></>}</main><aside className="property-contact-card"><small>Property price</small><strong>{money}</strong><p>{property.status === 'AVAILABLE' ? 'Available now' : property.status}</p>{property.contactPhone && <a className="btn btn-primary" href={`tel:${property.contactPhone}`}><Phone size={17}/> Call {property.contactName || 'Agent'}</a>}<Link className="btn btn-light" to="/contact">Send Enquiry</Link></aside></div>
  </div>;
}
