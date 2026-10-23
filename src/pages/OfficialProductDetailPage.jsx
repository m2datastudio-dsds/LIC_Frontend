import { useEffect, useState } from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function OfficialProductDetailPage() {
  const { provider } = useParams();
  const [params] = useSearchParams();
  const officialUrl = params.get('url');
  const name = params.get('name') || 'Insurance Product';
  const number = params.get('number') || '';
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isStar = provider === 'star-health';

  useEffect(() => {
    if (!officialUrl) return;
    setLoading(true); setError('');
    axios.get(`http://localhost:5000/api/${isStar ? 'star-health/products/details' : 'lic-products/details'}`, { params: { url: officialUrl } })
      .then((response) => setDetails(response.data.data || {}))
      .catch((err) => setError(err.response?.data?.message || 'Official product details are temporarily unavailable.'))
      .finally(() => setLoading(false));
  }, [isStar, officialUrl]);

  if (!officialUrl || !['lic', 'star-health'].includes(provider)) return <Navigate to="/" replace />;
  const lists = [['Key Benefits', details?.benefits], ['Eligibility', details?.eligibility], ['Coverage', details?.coverage], ['Required Documents', details?.documents]];
  return <div className={`page-shell life-catalog-page insurance-brand-page ${isStar ? 'health-brand-page' : 'life-brand-page'}`}>
    <div className="breadcrumbs"><Link to="/">Home</Link><span>›</span><Link to={isStar ? '/health-insurance' : '/life-insurance'}>{isStar ? 'Health Insurance' : 'Life Insurance'}</Link><span>›</span><strong>{name}</strong></div>
    <header className="catalog-heading"><ShieldCheck size={34}/><h1>{name}</h1><p>{isStar ? 'Star Health' : 'LIC'} official product {number && `• ${number}`}</p></header>
    {loading && <div className="catalog-empty">Loading current details from the official insurer website...</div>}
    {error && <div className="catalog-empty"><h2>Details unavailable</h2><p>{error}</p><a className="btn btn-primary" href={officialUrl} target="_blank" rel="noreferrer">Open official website <ExternalLink size={16}/></a></div>}
    {!loading && details && <div className="details-content"><div className="details-body">
      {(details.description || details.shortDescription) && <section className="detail-section"><h2>Overview</h2><p>{details.description || details.shortDescription}</p></section>}
      {details.ageRange && <section className="detail-section"><h2>Age Eligibility</h2><p>{details.ageRange}</p></section>}
      {lists.map(([title, values]) => Array.isArray(values) && values.length > 0 && <section className="detail-section" key={title}><h2>{title}</h2><ul>{values.map((value, index) => <li key={`${title}-${index}`}>{value}</li>)}</ul></section>)}
      {details.premiumInfo && <section className="detail-section"><h2>Premium Information</h2><p>{details.premiumInfo}</p></section>}
      {details.policyTerm && <section className="detail-section"><h2>Policy Term</h2><p>{details.policyTerm}</p></section>}
      <a className="btn btn-primary" href={officialUrl} target="_blank" rel="noreferrer">View on official website <ExternalLink size={16}/></a>
    </div></div>}
  </div>;
}
