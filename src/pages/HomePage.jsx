import { ArrowRight, Shield, HeartPulse, Building2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const featureCards = [
  {
    icon: Shield,
    title: 'Life Insurance',
    tag: 'Life',
    benefits: ['Family Protection', 'Future Planning', 'Financial Security'],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
    link: '/life-insurance',
  },
  {
    icon: HeartPulse,
    title: 'Health Insurance',
    tag: 'Health',
    benefits: ['Health Protection', 'Family Coverage', 'Medical Expense Support'],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
    link: '/health-insurance',
  },
  {
    icon: Building2,
    title: 'Real Estate',
    tag: 'Property',
    benefits: ['Residential Properties', 'Commercial Properties', 'Investment Opportunities'],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
    link: '/products?category=real-estate',
  },
];

function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <h1>Protect Your Future.<br />Secure Your Family.<br />Build Your Wealth.</h1>
          <p>Get professional assistance for health insurance, life insurance, and real estate solutions tailored to your long-term goals.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/products">Get a Quote</Link>
            <Link className="btn btn-light" to="/services">Explore Services</Link>
          </div>
          <div className="trust-row">
            <div className="trust-stat">
              <strong>15+</strong>
              <span>Years Experience</span>
            </div>
            <div className="trust-stat">
              <strong>2k+</strong>
              <span>Families Secured</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="agent-card">
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80" alt="Family planning" />
          </div>
        </div>
      </section>

      <section className="products-showcase">
        <div className="section-heading center">
          <h2>Our Products &amp; Services</h2>
          <p>Choose the right solution for your health, family, and future with our comprehensive portfolio.</p>
        </div>

        <div className="feature-grid">
          {featureCards.map(({ title, tag, benefits, image, link }) => (
            <Link key={title} to={link} className="feature-card product-spotlight" style={{ textDecoration: 'none' }}>
              <div className="product-card-image-wrap">
                <img src={image} alt={title} />
                <span className="product-tag">{tag}</span>
              </div>

              <div className="product-card-body">
                <h3>{title}</h3>
                <ul className="check-list">
                  {benefits.map((benefit) => (
                    <li key={benefit}><CheckCircle size={14} /> {benefit}</li>
                  ))}
                </ul>

                <div className="card-foot">
                  <span>View Product</span>
                  <ArrowRight size={18} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h3>Ready to secure your future?</h3>
          <p>Schedule a free consultation with our expert advisors today to discuss your specific needs.</p>
        </div>
        <Link className="btn btn-primary btn-large" to="/contact">Book Appointment</Link>
      </section>
    </>
  );
}

export default HomePage;
