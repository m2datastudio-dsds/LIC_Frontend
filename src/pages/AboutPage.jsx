import { CheckCircle, Shield, Users, Award, BarChart3 } from 'lucide-react';

function AboutPage() {
  const services = [
    {
      title: 'Policy Guidance',
      description: 'Understand which insurance plan suits your financial goals.',
      icon: Award,
    },
    {
      title: 'Premium Payment Assistance',
      description: 'Easy payment options and assistance for policy premiums.',
      icon: BarChart3,
    },
    {
      title: 'Policy Renewal',
      description: 'Hassle-free policy renewal and continuation support.',
      icon: CheckCircle,
    },
    {
      title: 'Claim Assistance',
      description: 'Expert guidance through the entire claim settlement process.',
      icon: Shield,
    },
    {
      title: 'Document Assistance',
      description: 'Complete help with documentation and paperwork.',
      icon: Users,
    },
    {
      title: 'Plan Comparison',
      description: 'Compare multiple plans to find the best fit for your needs.',
      icon: BarChart3,
    },
  ];

  const benefits = [
    {
      icon: Award,
      title: 'Authorized Agent',
      description: 'Officially recognized and certified by LIC, ensuring all policies and advice are strictly compliant and authentic.',
    },
    {
      icon: Shield,
      title: '24/7 Claim Support',
      description: 'Dedicated assistance during emergencies and seamless handling of claim settlements without bureaucratic delays.',
    },
    {
      icon: BarChart3,
      title: 'Dual Expertise',
      description: 'Unique ability to synchronize life insurance planning with high-yield real estate investments for maximum growth.',
    },
    {
      icon: Users,
      title: 'Client-First Integrity',
      description: 'Unbiased recommendations focusing purely on what benefits your portfolio, maintaining absolute transparency.',
    },
  ];

  return (
    <div className="page-shell about-page">
      {/* Agent Hero Section */}
      <section className="agent-hero">
        <div className="agent-intro">
          <div className="certified-badge">◎ CERTIFIED PROFESSIONAL</div>
          <h1>About Your <br/><span className="highlight">LIC Agent</span></h1>
          <p>
            With over a decade of dedicated service in the financial sector, I specialize in providing comprehensive guidance across life insurance, health security, and real estate investments. My approach is rooted in understanding your unique family dynamics to build a resilient financial fortress for generations.
          </p>
          <button className="btn btn-primary">Schedule a Meeting</button>
        </div>

        <div className="agent-profile-card">
          <div className="profile-image">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80" alt="Rajesh Kumar" />
          </div>
          <div className="profile-info">
            <h3>Rajesh Kumar</h3>
            <p>Senior Investment Consultant</p>
          </div>
        </div>
      </section>

      {/* Mission & Approach */}
      <section className="mission-approach">
        <div className="mission-card">
          <div className="mission-icon">🎯</div>
          <h2>My Mission</h2>
          <p>
            To demystify complex financial instruments and empower families with tailored insurance and real estate strategies. I believe that true wealth is not just accumulated, but protected and systematically passed down, ensuring peace of mind for every client I serve.
          </p>
        </div>

        <div className="approach-card">
          <div className="approach-icon">⚙️</div>
          <h2>Professional Approach</h2>
          <p>
            I utilize a holistic, data-driven methodology to assess risk and identify opportunities. By combining traditional LIC security with modern real estate insights, I create diversified portfolios that withstand market volatility while meeting your specific timeline and lifestyle goals.
          </p>
        </div>
      </section>

      {/* Why Choose Me */}
      <section className="why-choose-section">
        <h2>Why Choose Me?</h2>
        <p>A commitment to excellence, transparency, and lifelong partnership.</p>

        <div className="benefits-grid">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div className="benefit-card" key={title}>
              <div className="benefit-icon">
                <Icon size={24} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Offered */}
      <section className="services-section">
        <h2>Services I Offer</h2>
        <p>Comprehensive support across all aspects of insurance, financial planning, and real estate investment.</p>

        <div className="services-grid">
          {services.map(({ icon: Icon, title, description }) => (
            <div className="service-card" key={title}>
              <div className="service-icon">
                <Icon size={20} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <a href="#" className="service-link">Learn More →</a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
