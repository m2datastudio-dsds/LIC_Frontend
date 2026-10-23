import { ArrowRight, HeartPulse } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HealthPlanListPage() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPlans([]);
    setLoading(true);
    setCategoryLoading(true);
    Promise.all([
      axios.get('http://localhost:5000/api/star-health/products', { params: { planType: categoryId } }),
      axios.get('http://localhost:5000/api/star-health/plan-types'),
    ]).then(([productResponse, typeResponse]) => {
      setCategory((typeResponse.data.data || []).find((item) => item.categorySlug === 'health-insurance' && item.slug === categoryId) || null);
      setPlans(productResponse.data.data || []);
    }).catch(() => {
      setPlans([]);
      setCategory(null);
    }).finally(() => {
      setLoading(false);
      setCategoryLoading(false);
    });
  }, [categoryId]);

  if (categoryLoading) return <div className="page-shell">Loading plan type...</div>;
  if (!category) return <Navigate to="/health-insurance" replace />;

  return <div className="page-shell life-catalog-page insurance-brand-page health-brand-page">
    <div className="breadcrumbs"><Link to="/">Home</Link><span>›</span><Link to="/health-insurance">Health Insurance</Link><span>›</span><strong>{category.name}</strong></div>
    <header className="catalog-heading"><h1>{category.name}</h1><p>Explore Health Insurance products available under this plan type.</p></header>
    {loading ? <div className="catalog-empty">Loading plans directly from Star Health...</div> : plans.length === 0 ? <div className="catalog-empty"><HeartPulse size={34}/><h2>Official plans are unavailable</h2><p>Please try again shortly.</p></div> : <div className="plan-list-grid">{plans.map((item) => <article className="plan-list-card" key={item.id}>
      {item.imageUrl && <img className="plan-list-image" src={item.imageUrl} alt={item.name} />}
      <div className="plan-card-top"><HeartPulse size={24}/><span>{category.name}</span></div>
      <h2>{item.name}</h2><p>{item.shortDescription || item.description}</p>
      <Link to={`/official-product/star-health?url=${encodeURIComponent(item.officialUrl)}&name=${encodeURIComponent(item.name)}&number=${encodeURIComponent(item.planNumber || '')}`} className="view-details-link">View Details <ArrowRight size={17}/></Link>
    </article>)}</div>}
  </div>;
}
