function ServicesPage() {
  return (
    <div className="page-shell">
      <h1>Services</h1>
      <div className="product-grid">
        {['Policy Guidance','Premium Payment Assistance','Policy Renewal','Claim Assistance','Document Assistance','Plan Comparison'].map((service) => (
          <article key={service} className="product-card service-card">
            <div className="product-card-body">
              <h3>{service}</h3>
              <p>Helpful service support for policy selection, renewals, claims, and documentation.</p>
              <button className="btn btn-primary btn-small">View Service</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ServicesPage;
