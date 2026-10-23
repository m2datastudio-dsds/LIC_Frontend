import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getLifeCategory } from '../data/lifeProducts';

export default function LifePlanListPage() {
  const { categoryId } = useParams();
  const category = getLifeCategory(categoryId);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { setPlans([]); setLoading(true); axios.get('http://localhost:5000/api/lic-products', { params: { planType: categoryId } }).then(({data}) => setPlans(data.data || [])).catch(() => setPlans([])).finally(() => setLoading(false)); }, [categoryId]);
  if (!category) return <Navigate to="/life-insurance" replace />;
  return <div className="page-shell life-catalog-page insurance-brand-page life-brand-page">
    <div className="breadcrumbs"><Link to="/">Home</Link><span>›</span><Link to="/life-insurance">Life Insurance</Link><span>›</span><strong>{category.name}</strong></div>
    <header className="catalog-heading"><h1>{category.name}</h1><p>Secure your future with plans that offer both protection and savings.</p></header>
    {loading ? <div className="catalog-empty">Loading plans directly from LIC India...</div> : plans.length === 0 ? <div className="catalog-empty"><ShieldCheck size={34}/><h2>Official plans are unavailable</h2><p>Please try again shortly.</p></div> : <div className="plan-list-grid">{plans.map((item) => <article className="plan-list-card" key={item.id}>
      {item.imageUrl && <img className="plan-list-image" src={item.imageUrl} alt={item.name} />}
      <div className="plan-card-top"><ShieldCheck size={24}/><span>{category.name.replace(' Plans','')}</span></div>
      <h2>{item.name}</h2><p>{category.name.replace(' Plans','')} {item.ageRange ? `• ${item.ageRange}` : ''}</p>
      <Link to={`/official-product/lic?url=${encodeURIComponent(item.officialUrl)}&name=${encodeURIComponent(item.name)}&number=${encodeURIComponent(item.planNumber || '')}`} className="view-details-link">View Details <ArrowRight size={17}/></Link>
    </article>)}</div>}
  </div>;
}
