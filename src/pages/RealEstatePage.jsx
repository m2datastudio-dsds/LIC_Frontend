import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Bath, BedDouble, Building2, MapPin, MoveUpRight } from 'lucide-react';

export default function RealEstatePage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/properties').then((r) => setProperties(r.data.data || [])).catch(() => setProperties([])).finally(() => setLoading(false)); }, []);
  const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value));
  return <div className="real-estate-page"><section className="real-estate-hero"><div><span className="eyebrow">Handpicked properties</span><h1>Find a place that feels like yours.</h1><p>Explore verified homes, plots and commercial properties with direct assistance at every step.</p></div><Building2 size={104}/></section>
    <section className="page-shell property-section"><div className="section-heading"><span className="eyebrow">Latest listings</span><h2>Properties for sale and rent</h2></div>
      {loading ? <p>Loading properties…</p> : properties.length === 0 ? <div className="property-empty"><Building2 size={42}/><h3>No properties published yet</h3><p>Please check back soon for new listings.</p></div> : <div className="public-property-grid">{properties.map((p) => { const cover = p.media?.find((m) => m.type === 'image'); return <article className="public-property-card" key={p.id}><div className="property-cover">{cover ? <img src={cover.url} alt={p.title}/> : <div className="property-placeholder"><Building2 size={50}/></div>}<span>{p.listingType === 'SALE' ? 'For Sale' : 'For Rent'}</span>{p.isFeatured && <b>Featured</b>}</div><div className="property-card-content"><small>{p.propertyType}</small><h3>{p.title}</h3><p className="property-location"><MapPin size={15}/>{p.location}</p><div className="property-facts">{p.bedrooms != null && <span><BedDouble size={16}/>{p.bedrooms} Beds</span>}{p.bathrooms != null && <span><Bath size={16}/>{p.bathrooms} Baths</span>}{p.area != null && <span>{p.area} {p.areaUnit}</span>}</div><div className="property-card-foot"><strong>{money(p.price)}</strong><Link to={`/real-estate/${p.id}`}>View <MoveUpRight size={16}/></Link></div></div></article>; })}</div>}
    </section></div>;
}
