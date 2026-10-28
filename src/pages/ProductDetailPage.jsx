import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, ShieldCheck, Home, TrendingUp, Building2 } from 'lucide-react';
import { healthProductCatalog } from '../data/healthProducts';

const defaultHealthFeatures = [
  {
    icon: ShieldCheck,
    title: 'Hospitalization Protection',
    text: 'Covers expenses related to room rent, ICU charges, and doctor consultations.',
  },
  {
    icon: ShieldCheck,
    title: 'Family Protection',
    text: 'Single policy coverage for your entire family and dependent members.',
  },
  {
    icon: ShieldCheck,
    title: 'Financial Security',
    text: 'Prevents medical emergencies from draining your savings or long-term investments.',
  },
  {
    icon: ShieldCheck,
    title: 'Medical Expense Support',
    text: 'Includes pre- and post-hospitalization, diagnostics, and treatment cost support.',
  },
];

const defaultRealEstateFeatures = [
  {
    icon: Home,
    title: 'Asset Ownership',
    text: 'Build equity through a tangible asset that appreciates over time and provides security against inflation.',
  },
  {
    icon: TrendingUp,
    title: 'Long-Term Investment',
    text: 'Historically proven to deliver significant capital gains over a structured holding period.',
  },
  {
    icon: Building2,
    title: 'Property Opportunities & Rental Potential',
    text: 'Unlock dual income streams. Leverage property development opportunities or secure consistent passive income through structured rental agreements in high-demand zones.',
  },
];

const sampleProperties = [
  {
    name: 'The Azure Residences',
    location: 'Downtown Financial District',
    type: 'Residential',
    price: '$1.2M',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Nexus Corporate Hub',
    location: 'Tech Park Avenue',
    type: 'Commercial',
    price: '$4.5M',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Heritage Valley Estate',
    location: 'Westside Suburbs',
    type: 'Farm',
    price: '$850K',
    image: 'https://images.unsplash.com/photo-1500590046916-b5e24b27f75f?auto=format&fit=crop&w=600&q=80',
  },
];

const realEstateHighlights = [
  'Verified listings with transparent pricing',
  'Expert consultation from property specialists',
  'Flexible payment and investment options',
];

const staticLifeInsuranceCatalog = {
  'term-insurance': {
    id: 'term-insurance',
    name: 'Term Insurance',
    category: { name: 'Life Insurance' },
    shortDescription: 'Financial protection for family in case of death during the policy term.',
    description: 'Term insurance provides financial protection for the insured person’s family if death occurs during the selected policy term.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
    benefits: ['High sum assured up to 1 Crore', 'Low premium cost', 'Family income replacement', 'Protection during earning years', 'Flexible coverage period'],
    officialUrl: 'https://www.licindia.in/en/web/guest/term-assurance-plans',
  },
  'whole-life-insurance': {
    id: 'whole-life-insurance',
    name: 'Whole Life Insurance',
    category: { name: 'Life Insurance' },
    shortDescription: 'Life cover for the policyholder’s lifetime, subject to policy terms.',
    description: 'Whole life insurance provides life cover for the policyholder’s lifetime, subject to eligibility and policy terms.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    benefits: ['Lifetime protection until age 100', 'Annual bonuses', 'Survival benefit at maturity', 'Tax benefits under Section 80C', 'Guaranteed additions'],
    officialUrl: 'https://www.licindia.in/Products/Whole-Life-Insurance-Plan',
  },
  'endowment-plan': {
    id: 'endowment-plan',
    name: 'Endowment Plans',
    category: { name: 'Life Insurance' },
    shortDescription: 'Life insurance combined with savings and a maturity benefit.',
    description: 'Endowment plans combine life insurance protection with disciplined savings and a maturity benefit, subject to plan terms.',
    imageUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    benefits: ['Life cover during policy term', 'Maturity benefit on completion', 'Annual bonuses', 'Flexible term options', 'Loan against policy'],
    officialUrl: 'https://www.licindia.in/Products/Endowment-Policies',
  },
  'money-back-plan': {
    id: 'money-back-plan',
    name: 'Money Back Plans',
    category: { name: 'Life Insurance' },
    shortDescription: 'Periodic payouts during the policy term along with life cover.',
    description: 'Money back plans provide periodic payouts during the policy term while continuing life cover, subject to plan conditions.',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    benefits: ['Periodic payouts every 3-5 years', 'Life cover throughout term', 'Bonus additions', 'Maturity benefit', 'Financial flexibility for emergencies'],
    officialUrl: 'https://www.licindia.in/Products/Money-Back-Policy',
  },
  'child-plan': {
    id: 'child-plan',
    name: 'Child Plans',
    category: { name: 'Life Insurance' },
    shortDescription: 'Savings and financial protection for a child’s education and future.',
    description: 'Child plans support savings and financial protection for a child’s education, milestones, and future needs.',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
    benefits: ['Education fund creation', 'Guaranteed maturity benefit', 'Annual bonuses', 'Parental protection', 'Flexible maturity options'],
    officialUrl: 'https://www.licindia.in/Products/Child-Plans',
  },
  'pension-annuity-plan': {
    id: 'pension-annuity-plan',
    name: 'Pension / Annuity Plans',
    category: { name: 'Life Insurance' },
    shortDescription: 'Retirement income and financial security after retirement.',
    description: 'Pension and annuity plans are designed to provide retirement income and financial security after retirement.',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    benefits: ['Guaranteed regular income', 'Multiple annuity options', 'Protection for spouse', 'Attractive annuity rates', 'Return of purchase price option'],
    officialUrl: 'https://www.licindia.in/Products/Pension-Plans',
  },
  'ulip-plan': {
    id: 'ulip-plan',
    name: 'ULIP Plans',
    category: { name: 'Life Insurance' },
    shortDescription: 'Life insurance combined with market-linked investment, subject to market risks.',
    description: 'ULIP plans combine life insurance with market-linked investment. Investment returns are subject to market risks and applicable charges.',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    benefits: ['Life cover with investment growth', 'Multiple fund options', 'Flexible investment strategy', 'Low charges', 'Professional fund management'],
    officialUrl: 'https://www.licindia.in/Products/ULIP-Plans',
  },
};

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const staticProduct = staticLifeInsuranceCatalog[id] || healthProductCatalog[id];
    if (staticProduct) {
      setProduct(staticProduct);
      return;
    }

    api.get(`/products/${id}`)
      .then((response) => setProduct(response.data.data || null))
      .catch(() => setProduct(null));
  }, [id]);

  const categoryName = product?.category?.name || 'Insurance';
  const categorySlug = product?.category?.slug || '';
  const providerName = product?.provider?.toLowerCase() || '';
  const isRealEstate = categoryName?.toLowerCase().includes('real estate');
  const isHealthInsurance = categorySlug === 'health-insurance' || categoryName.toLowerCase().includes('health insurance') || providerName.includes('star health') || Object.prototype.hasOwnProperty.call(healthProductCatalog, id);
  const isLifeInsurance = !isHealthInsurance && (categorySlug === 'life-insurance' || categoryName.toLowerCase().includes('life insurance') || providerName === 'lic' || Object.prototype.hasOwnProperty.call(staticLifeInsuranceCatalog, id));

  useEffect(() => {
    document.body.classList.toggle('life-body-theme', Boolean(product && isLifeInsurance));
    document.body.classList.toggle('health-body-theme', Boolean(product && isHealthInsurance));
    return () => document.body.classList.remove('life-body-theme', 'health-body-theme');
  }, [isHealthInsurance, isLifeInsurance, product]);

  if (!product) return <div className="page-shell">Loading product details...</div>;

  const featureCards = (product.benefits || []).slice(0, 3).map((item, index) => {
    const icons = isRealEstate ? [Home, TrendingUp, Building2] : [ShieldCheck, ShieldCheck, ShieldCheck];
    return {
      icon: icons[index] || ShieldCheck,
      title: index === 0 ? (isRealEstate ? 'Asset Ownership' : (isLifeInsurance ? 'Family Protection' : 'Hospitalization Protection'))
             : index === 1 ? (isRealEstate ? 'Long-Term Investment' : (isLifeInsurance ? 'Long-Term Security' : 'Family Protection'))
             : isRealEstate ? 'Property Opportunities & Rental Potential' : (isLifeInsurance ? 'Future Planning' : 'Financial Security'),
      text: item,
    };
  });

  const relatedPlans = isRealEstate ? sampleProperties : [
    {
      tag: 'Comprehensive',
      title: 'Family Health Optima',
      text: 'A comprehensive health policy covering the entire family under one simple insured plan.',
      features: ['Restoration of sum insured', 'Coverage for newborn baby', 'Domiciliary hospitalization'],
      button: 'Enquire Now',
    },
    {
      tag: 'Premium',
      title: 'Young Star Policy',
      text: 'Designed specifically for young individuals and couples below 40 years, offering modern health benefits.',
      features: ['Premium option for premium', 'Mid-term inclusion of spouse', 'Annual health check-up'],
      button: 'Enquire Now',
    },
    {
      tag: 'Senior Citizens',
      title: 'Senior Citizens Red Carpel',
      text: 'Specialized health insurance crafted for the elderly aged 60 years and above, with no pre-insurance medical test required.',
      features: ['No pre-policy medical checkup', 'Covers pre-existing diseases', 'Outpatient medical expenses'],
      button: 'Enquire Now',
    },
  ];

  const productHighlights = isRealEstate ? realEstateHighlights : (isLifeInsurance ? [
    'Financial protection for your family in case of unforeseen events',
    'Need-based planning for children, goals, retirement, and future stability',
    'Flexible policy options with long-term planning benefits',
  ] : [
    'Cashless treatment at network hospitals',
    'Tax benefits under section 80D',
    'Lifelong renewable options',
  ]);

  const renderInsuranceProductLayout = () => (
    <>
      <section className="product-hero-split">
        <div className="product-hero-image-wrap">
          <img src={product.imageUrl || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80'} alt={product.name} />
          <span className="trusted-badge">{isHealthInsurance ? 'Star Health Product' : 'LIC Product'}</span>
        </div>

        <div className="product-hero-copy">
          <h1>{product.name}</h1>
          <p className="lead-text">{product.shortDescription}</p>
          <p>{product.description}</p>
        </div>
      </section>

      <section className="life-specifications">
        <h2>{isHealthInsurance ? 'Health Plan Specifications' : 'Plan Specifications'}</h2>
        <div className="life-spec-grid">
          {product.planNumber && <div><h3>{isHealthInsurance ? 'Product UIN' : 'Plan Number'}</h3><p>{product.planNumber}</p></div>}
          {product.ageRange && <div><h3>Eligible Age Range</h3><p>{product.ageRange}</p></div>}
          {Array.isArray(product.eligibility) && product.eligibility.length > 0 && <div><h3>Eligibility Criteria</h3><ul>{product.eligibility.map((item) => <li key={item}>{item}</li>)}</ul></div>}
          {Array.isArray(product.coverage) && product.coverage.length > 0 && <div><h3>Cover Benefits</h3><ul>{product.coverage.map((item) => <li key={item}>{item}</li>)}</ul></div>}
          {(product.policyTerm || product.premiumInfo) && <div><h3>Premium &amp; Policy Term</h3>{product.premiumInfo && <p>{product.premiumInfo}</p>}{product.policyTerm && <p>{product.policyTerm}</p>}</div>}
          {Array.isArray(product.documents) && product.documents.length > 0 && <div><h3>Required Documents</h3><ul>{product.documents.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        </div>
      </section>

      <section className="life-insurance-two-column">
        <div className="left-column benefits-column">
          <h2>Key Benefits</h2>
          <div className="feature-grid product-feature-grid">
            {(product.benefits || []).map((benefit, index) => (
              <div className="feature-card product-feature-card" key={index}>
                <div className="feature-icon">
                  <CheckCircle size={18} />
                </div>
                <h3>{benefit}</h3>
              </div>
            ))}
          </div>
        </div>

        <div className="right-column form-column">
          <div className="enquiry-form-card">
            <h3>Interested in this Plan?</h3>
            <div className="form-fields">
              <div className="field-group">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" />
              </div>
              <div className="field-group">
                <label>Mobile Number</label>
                <input type="text" placeholder="+91 97865 43210" />
              </div>
              <div className="field-group">
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" />
              </div>
              <div className="field-group">
                <label>Age</label>
                <input type="text" placeholder="30" />
              </div>
            </div>
            <button className="btn btn-primary full-width-btn">Get Quote</button>
          </div>
        </div>
      </section>
    </>
  );

  const renderHealthInsuranceLayout = () => (
    <>
      <section className="product-hero-split">
        <div className="product-hero-image-wrap">
          <img src={product.imageUrl || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80'} alt={product.name} />
          <span className="trusted-badge">Trusted Protection</span>
        </div>

        <div className="product-hero-copy">
          <h1>{product.name}</h1>
          <p className="lead-text">Protect Your Health. Protect Your Savings.</p>
          <p>{product.description || product.shortDescription}</p>
          <a className="btn btn-primary" href="#enquiry-form">Request a Callback</a>
        </div>
      </section>

      <section className="why-section">
        <h2>Why {categoryName}?</h2>
        <p>The foundation of a secure financial plan starts with robust health coverage.</p>

        <div className="feature-grid product-feature-grid">
          {(featureCards.length ? featureCards : defaultHealthFeatures).map(({ icon: Icon, title, text }) => (
            <div className="feature-card product-feature-card" key={title}>
              <div className="feature-icon">
                <Icon size={18} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="enquiry-layout" id="enquiry-form">
        <div className="explain-box">
          <h2>What Is {categoryName}?</h2>
          <p>
            {product.description || 'Health insurance is a contract that requires an insurer to pay some or all of a person\'s healthcare costs in exchange for a premium.'}
          </p>
          <ul className="inline-checks">
            {productHighlights.map((item) => (
              <li key={item}><CheckCircle size={16} /> {item}</li>
            ))}
          </ul>
        </div>

        <div className="enquiry-form-card">
          <h3>Enquire for a Policy</h3>
          <div className="two-col-form">
            <div className="field-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" />
            </div>
            <div className="field-group">
              <label>Mobile Number</label>
              <input type="text" placeholder="+91 97865 43210" />
            </div>
            <div className="field-group">
              <label>Email Address</label>
              <input type="email" placeholder="john@example.com" />
            </div>
            <div className="field-group">
              <label>Age</label>
              <input type="text" placeholder="30" />
            </div>
            <div className="field-group">
              <label>City</label>
              <input type="text" placeholder="Mumbai" />
            </div>
            <div className="field-group">
              <label>Family Members to Cover</label>
              <select defaultValue="Self">
                <option>Self</option>
                <option>Self + Spouse</option>
                <option>Family</option>
              </select>
            </div>
            <div className="field-group wide">
              <label>Expected Coverage (€)</label>
              <select defaultValue="5 Lakhs">
                <option>5 Lakhs</option>
                <option>10 Lakhs</option>
                <option>20 Lakhs</option>
              </select>
            </div>
            <div className="field-group wide">
              <label>Message (Optional)</label>
              <textarea placeholder="Any specific requirements..." rows="4" />
            </div>
          </div>

          <button className="btn btn-primary full-width-btn">Submit Enquiry</button>
        </div>
      </section>

      <section className="plan-section">
        <h2>Featured Health Products</h2>
        <div className="feature-grid product-plan-grid">
          {relatedPlans.map((plan) => (
            <div className="feature-card product-plan-card" key={plan.title}>
              <div className="plan-header-row">
                <span className="plan-tag">{plan.tag}</span>
              </div>
              <h3>{plan.title}</h3>
              <p>{plan.text}</p>
              <ul className="plan-list">
                {plan.features.map((feature) => (
                  <li key={feature}><CheckCircle size={14} /> {feature}</li>
                ))}
              </ul>
              <button className="btn btn-primary btn-small full-width-btn secondary-btn">{plan.button}</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  const renderRealEstateLayout = () => (
    <>
      <section className="product-hero-split">
        <div className="product-hero-image-wrap">
          <img src={product.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'} alt={product.name} />
        </div>

        <div className="product-hero-copy">
          <h1>{product.name}</h1>
          <p className="lead-text">Find the Right Property for Your Future</p>
          <p>{product.description || product.shortDescription}</p>
          <a className="btn btn-primary" href="#enquiry-form">Start Exploring</a>
        </div>
      </section>

      <section className="why-section re-why-section">
        <h2>Why Invest in {categoryName}?</h2>
        <p>Tangible assets provide a secure foundation for wealth generation and portfolio diversification.</p>

        <div className="feature-grid product-feature-grid">
          {(featureCards.length ? featureCards : defaultRealEstateFeatures).map(({ icon: Icon, title, text }) => (
            <div className="feature-card product-feature-card" key={title}>
              <div className="feature-icon">
                <Icon size={20} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="available-properties">
        <div className="section-header-row">
          <h2>Available Properties</h2>
          <a href="#" className="view-all-link">View All Listings →</a>
        </div>
        <p className="section-subtitle">Exclusive listings curated for optimal return and lifestyle.</p>

        <div className="properties-grid">
          {relatedPlans.map((prop) => (
            <div className="property-card" key={prop.name}>
              <div className="property-image-wrap">
                <img src={prop.image} alt={prop.name} />
                <span className="property-type-badge">{prop.type}</span>
              </div>
              <div className="property-content">
                <h3>{prop.name}</h3>
                <p className="property-location">📍 {prop.location}</p>
                <p className="property-price">{prop.price} <span>USD</span></p>
                <div className="property-actions">
                  <button className="btn btn-small view-details-btn">View Details</button>
                  <button className="btn btn-small enquire-btn">Enquire</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="register-interest" id="enquiry-form">
        <div className="register-inner">
          <h2>Register Your Interest</h2>
          <p>Provide your requirements and our real estate specialists will contact you with tailored property returns.</p>

          <div className="two-part-form">
            <div className="form-part personal-info">
              <h3>📋 Personal Information</h3>
              <div className="form-group-grid">
                <div className="field-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="John Doe" />
                </div>
                <div className="field-group">
                  <label>Mobile Number</label>
                  <input type="text" placeholder="+1 (555) 300-3000" />
                </div>
                <div className="field-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="john@example.com" />
                </div>
                <div className="field-group">
                  <label>Age</label>
                  <input type="text" placeholder="30" />
                </div>
              </div>
            </div>

            <div className="form-part property-reqs">
              <h3>🏠 Property Requirements</h3>
              <div className="form-group-grid">
                <div className="field-group">
                  <label>Property Type</label>
                  <select defaultValue="">
                    <option value="">Select Type</option>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Farm Land</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>Purpose</label>
                  <select defaultValue="">
                    <option value="">Select Purpose</option>
                    <option>Investment</option>
                    <option>Residence</option>
                    <option>Business</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>Estimated Budget</label>
                  <input type="text" placeholder="e.g. $500k - $1M" />
                </div>
                <div className="field-group">
                  <label>Preferred Location</label>
                  <input type="text" placeholder="City or Region" />
                </div>
              </div>
              <div className="field-group-full">
                <label>Specific Requirements or Message</label>
                <textarea placeholder="Please provide any specific details about your property requirements..." rows="5" />
              </div>
            </div>
          </div>

          <button className="btn btn-primary btn-submit">Submit Enquiry</button>
        </div>
      </section>
    </>
  );

  return (
    <div className={`page-shell product-detail-page${isLifeInsurance ? ' insurance-brand-page life-brand-page' : isHealthInsurance ? ' insurance-brand-page health-brand-page' : ''}`}>
      {(isLifeInsurance || isHealthInsurance) ? renderInsuranceProductLayout() : (isRealEstate ? renderRealEstateLayout() : renderHealthInsuranceLayout())}

      <div className="detail-actions footer-detail-actions">
        {(isLifeInsurance || isHealthInsurance) ? (
          <a 
            className="btn btn-primary" 
            href={product.officialUrl || (isHealthInsurance ? 'https://www.starhealth.in/' : 'https://www.licindia.in/en/web/guest/products')} 
            target="_blank" 
            rel="noreferrer"
          >
            View More {isHealthInsurance ? 'Star Health' : 'LIC'} Website
          </a>
        ) : (
          <a 
            className="btn btn-primary" 
            href={product.officialUrl || '#'} 
            target="_blank" 
            rel="noreferrer"
          >
            View More Details
          </a>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;
