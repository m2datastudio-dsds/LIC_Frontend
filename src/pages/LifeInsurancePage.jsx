import { ArrowRight, BadgeIndianRupee, ChartNoAxesCombined, GraduationCap, HeartHandshake, Infinity as InfinityIcon, ShieldCheck, Umbrella, WalletCards } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { lifeCategories } from '../data/lifeProducts';

const icons = { shield: ShieldCheck, infinity: InfinityIcon, coins: BadgeIndianRupee, umbrella: Umbrella, wallet: WalletCards, chart: ChartNoAxesCombined, graduation: GraduationCap };
const licFormsUrl = 'https://licindia.in/download-forms';
const licServices = [
  ['Death Claims', 'Forms required for processing death claims under regular policies.'],
  ['Maturity Claims', 'Application and discharge forms for policy maturity payouts.'],
  ['Survival Benefit Claims', 'Forms for periodic survival benefit payouts.'],
  ['Policy Alteration', 'Requests for changes in policy terms, mode, or details.'],
  ['Revival Forms', 'Forms to revive a lapsed policy.'],
  ['ECS / NEFT Mandate Forms', 'Set up or update bank details for premiums, claims, or annuities.'],
  ['Nomination & Assignment', 'Register or change a nominee, or assign the policy.'],
  ['Policy Loans', 'Application forms for taking a loan against an LIC policy.'],
  ['Duplicate Policy', 'Requirements and forms for obtaining a duplicate policy document.'],
  ['Annuity Claims', 'Pension and annuity-related claim forms.'],
].map(([name, description], index) => ({ id: `lic-service-${index + 1}`, name, description, url: licFormsUrl }));

export default function LifeInsurancePage() {
  const [counts, setCounts] = useState({});
  const categories = lifeCategories;
  const [services, setServices] = useState(licServices);
  const [supportIndex, setSupportIndex] = useState(0);
  useEffect(() => { Promise.all([...lifeCategories.map((item) => api.get('/lic-products', { params: { planType: item.id } })), api.get('/services', { params: { category: 'LIFE_INSURANCE' } })]).then((responses) => {
    const next = {}; lifeCategories.forEach((item, index) => { next[item.id] = (responses[index].data.data || []).length; }); setCounts(next);
    const managedServices = (responses.at(-1).data.data || []).filter((item) => item.category === 'LIFE_INSURANCE');
    const managedNames = new Set(managedServices.map((item) => item.name.trim().toLowerCase()));
    setServices([...managedServices, ...licServices.filter((item) => !managedNames.has(item.name.toLowerCase()))]);
  }).catch(() => {}); }, []);
  useEffect(() => {
    if (services.length <= 5) { setSupportIndex(0); return undefined; }
    const timer = window.setInterval(() => setSupportIndex((index) => index >= services.length - 5 ? 0 : index + 1), 4000);
    return () => window.clearInterval(timer);
  }, [services.length]);
  return <div className="page-shell life-catalog-page insurance-brand-page life-brand-page">
    <div className="breadcrumbs"><Link to="/">Home</Link><span>›</span><strong>Life Insurance</strong></div>
    <header className="catalog-heading"><h1>Life Insurance Solutions</h1><p>Explore our range of insurance plans tailored to your financial goals. Secure your family’s future with our comprehensive protection categories.</p></header>
    <div className="life-category-grid">
      {categories.map((category) => { const Icon = icons[category.icon] || ShieldCheck; const count = counts[category.id] || 0; return <Link className="life-category-card" to={`/life-insurance/${category.id}`} key={category.id}>
        <Icon size={25}/><h2>{category.name}</h2><p>{category.description}</p><span>Explore {count} plans <ArrowRight size={15}/></span>
      </Link>; })}
      <Link className="life-category-card view-all-card" to="/life-insurance/endowment"><HeartHandshake size={30}/><h2>View All Plans</h2><p>Compare all our insurance offerings.</p></Link>
    </div>
    <section className="support-section"><h2>LIC Services & Forms</h2><div className="support-carousel"><div className="support-grid" style={{ '--support-index': supportIndex }}>{services.map((service) => service.url ? <a href={service.url} target="_blank" rel="noreferrer" key={service.id || service.name} title={service.description}><HeartHandshake size={22}/><span>{service.name}</span></a> : <Link to="/contact" key={service.id || service.name}><HeartHandshake size={22}/><span>{service.name}</span></Link>)}</div></div></section>
  </div>;
}
