import { useEffect, useState } from 'react';
import { ArrowRight, HeartHandshake, HeartPulse, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const starHealthServices = [
  'Health Insurance Plans',
  'Policy Purchase',
  'Policy Renewal',
  'Cashless Hospitalisation',
  'Cashless Anywhere',
  'Reimbursement Claims',
  'Claim Intimation & Status',
  'Network Hospital Search',
  'Policy Documents',
  'Customer Support & Grievance',
].map((name, index) => ({ id: `star-health-${index + 1}`, name }));

export default function HealthInsurancePage() {
  const [planTypes, setPlanTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState(starHealthServices);
  const [supportIndex, setSupportIndex] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get('/star-health/products'),
      api.get('/star-health/plan-types'),
      api.get('/services', { params: { category: 'HEALTH_INSURANCE' } }),
    ]).then(([productResponse, planTypeResponse, serviceResponse]) => {
      setProducts(productResponse.data.data || []);
      setPlanTypes((planTypeResponse.data.data || []).filter((item) => item.categorySlug === 'health-insurance'));
      const managedServices = (serviceResponse.data.data || []).filter((item) => item.category === 'HEALTH_INSURANCE');
      const managedNames = new Set(managedServices.map((item) => item.name.trim().toLowerCase()));
      setServices([...managedServices, ...starHealthServices.filter((item) => !managedNames.has(item.name.toLowerCase()))]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (services.length <= 5) { setSupportIndex(0); return undefined; }
    const timer = window.setInterval(() => setSupportIndex((index) => index >= services.length - 5 ? 0 : index + 1), 4000);
    return () => window.clearInterval(timer);
  }, [services.length]);

  const counts = products.reduce((result, product) => {
    const slug = product.insurancePlanType?.categorySlug === 'health-insurance' ? product.insurancePlanType.slug : product.planType;
    if (slug) result[slug] = (result[slug] || 0) + 1;
    return result;
  }, {});
  return <div className="page-shell life-catalog-page insurance-brand-page health-brand-page">
    <div className="breadcrumbs"><Link to="/">Home</Link><span>›</span><strong>Health Insurance</strong></div>
    <header className="catalog-heading"><h1>Health Insurance Solutions</h1><p>Explore health insurance plan types, compare available products and find support for your policy and claims.</p></header>
    <div className="life-category-grid">
      {planTypes.map((planType) => <Link className="life-category-card" to={`/health-insurance/${planType.slug}`} key={planType.id}>
        <HeartPulse size={25}/><h2>{planType.name}</h2><p>{planType.description || 'Explore available health insurance products in this category.'}</p><span>Explore {counts[planType.slug] || 0} plans <ArrowRight size={15}/></span>
      </Link>)}
      {planTypes[0] && <Link className="life-category-card view-all-card" to={`/health-insurance/${planTypes[0].slug}`}><ShieldCheck size={30}/><h2>View All Plans</h2><p>Compare all Health Insurance offerings.</p></Link>}
    </div>
    <section className="support-section"><h2>Health Insurance Services</h2>{services.length ? <div className="support-carousel"><div className="support-grid" style={{ '--support-index': supportIndex }}>{services.map((service) => <Link to="/contact" key={service.id || service.name}><HeartHandshake size={22}/><span>{service.name}</span></Link>)}</div></div> : <div className="catalog-empty"><HeartHandshake size={34}/><h2>No health services added yet</h2></div>}</section>
  </div>;
}
