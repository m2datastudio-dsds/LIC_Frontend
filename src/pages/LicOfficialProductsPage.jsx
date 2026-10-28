import { ArrowRight, ShieldCheck, Download, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

export default function LicOfficialProductsPage() {
  const [searchParams] = useSearchParams();
  const planType = searchParams.get('type') || 'term';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Plan type options
  const planTypes = [
    { value: 'term', label: 'Term Assurance' },
    { value: 'endowment', label: 'Endowment Plans' },
    { value: 'money-back', label: 'Money-Back Plans' },
    { value: 'whole-life', label: 'Whole-Life Plans' },
    { value: 'pension', label: 'Pension Plans' },
    { value: 'ulip', label: 'Unit-Linked (ULIP)' },
    { value: 'child', label: 'Child Plans' },
  ];

  // Fetch products from LIC official website
  useEffect(() => {
    setProducts([]);
    setSelectedProduct(null);
    setProductDetails(null);
    setLoading(true);
    setError(null);

    api
      .get('/lic-products', {
        params: { planType },
      })
      .then((response) => {
        setProducts(response.data.data || []);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load LIC products');
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [planType]);

  // Fetch detailed info for selected product
  const fetchProductDetails = async (product) => {
    setSelectedProduct(product);
    setDetailsLoading(true);
    setProductDetails(null);

    try {
      const response = await api.get('/lic-products/details', {
        params: { url: product.officialUrl },
      });
      setProductDetails(response.data.data || {});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load product details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const currentPlanLabel = planTypes.find((p) => p.value === planType)?.label || planType;

  return (
    <div className="page-shell lic-official-products-page">
      {/* Breadcrumb */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span>›</span>
        <strong>LIC Official Products</strong>
      </div>

      {/* Header */}
      <header className="catalog-heading">
        <h1>LIC Official Insurance Plans</h1>
        <p>Browse live products directly from LIC India's official website</p>
      </header>

      {/* Plan Type Filter */}
      <div className="plan-type-filter">
        <label>Select Plan Type:</label>
        <div className="filter-buttons">
          {planTypes.map((plan) => (
            <Link
              key={plan.value}
              to={`?type=${plan.value}`}
              className={`filter-btn ${planType === plan.value ? 'active' : ''}`}
            >
              {plan.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="lic-products-container">
        {/* Products List */}
        <div className="products-section">
          <h2>Available {currentPlanLabel}</h2>

          {loading && (
            <div className="loading-state">
              <Loader className="spinner" size={40} />
              <p>Loading LIC products from official website...</p>
            </div>
          )}

          {error && !loading && (
            <div className="error-state">
              <p>⚠️ {error}</p>
              <p className="error-hint">Please check your internet connection or try a different plan type.</p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="empty-state">
              <ShieldCheck size={34} />
              <h3>No products found</h3>
              <p>Try selecting a different plan type.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="products-grid">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`product-card ${selectedProduct?.id === product.id ? 'active' : ''}`}
                  onClick={() => fetchProductDetails(product)}
                >
                  <div className="product-card-header">
                    <ShieldCheck size={20} />
                    <span className="plan-badge">{product.planType}</span>
                  </div>
                  <h3>{product.name}</h3>
                  {product.planNumber && <p className="plan-number">Plan: {product.planNumber}</p>}
                  {product.uin && <p className="uin">UIN: {product.uin}</p>}
                  <div className="product-card-footer">
                    <button
                      className="btn-view-details"
                      onClick={(e) => {
                        e.preventDefault();
                        fetchProductDetails(product);
                      }}
                    >
                      View Details <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Panel */}
        <div className="details-section">
          {!selectedProduct && (
            <div className="details-placeholder">
              <ShieldCheck size={40} />
              <h3>Select a product</h3>
              <p>Click on any product to view detailed information</p>
            </div>
          )}

          {selectedProduct && (
            <div className="details-content">
              <div className="details-header">
                <h2>{selectedProduct.name}</h2>
                <p className="plan-info">Plan #{selectedProduct.planNumber} • UIN: {selectedProduct.uin}</p>
                {selectedProduct.officialUrl && (
                  <a
                    href={selectedProduct.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="official-link"
                  >
                    View on LIC Website ↗
                  </a>
                )}
              </div>

              {detailsLoading ? (
                <div className="details-loading">
                  <Loader className="spinner" size={30} />
                  <p>Loading product details...</p>
                </div>
              ) : productDetails ? (
                <div className="details-body">
                  {/* Description */}
                  {productDetails.description && (
                    <div className="detail-section">
                      <h4>Overview</h4>
                      <p>{productDetails.description}</p>
                    </div>
                  )}

                  {/* Age Range */}
                  {productDetails.ageRange && (
                    <div className="detail-section">
                      <h4>Age Eligibility</h4>
                      <p>{productDetails.ageRange}</p>
                    </div>
                  )}

                  {/* Benefits */}
                  {productDetails.benefits && productDetails.benefits.length > 0 && (
                    <div className="detail-section">
                      <h4>Key Benefits</h4>
                      <ul className="benefits-list">
                        {productDetails.benefits.map((benefit, idx) => (
                          <li key={idx}>✓ {benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Eligibility */}
                  {productDetails.eligibility && productDetails.eligibility.length > 0 && (
                    <div className="detail-section">
                      <h4>Eligibility Criteria</h4>
                      <ul className="eligibility-list">
                        {productDetails.eligibility.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Coverage */}
                  {productDetails.coverage && productDetails.coverage.length > 0 && (
                    <div className="detail-section">
                      <h4>Coverage Details</h4>
                      <ul className="coverage-list">
                        {productDetails.coverage.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Premium Info */}
                  {productDetails.premiumInfo && (
                    <div className="detail-section">
                      <h4>Premium Payment</h4>
                      <p>{productDetails.premiumInfo}</p>
                    </div>
                  )}

                  {/* Policy Term */}
                  {productDetails.policyTerm && (
                    <div className="detail-section">
                      <h4>Policy Term</h4>
                      <p>{productDetails.policyTerm}</p>
                    </div>
                  )}

                  {/* Documents Required */}
                  {productDetails.documents && productDetails.documents.length > 0 && (
                    <div className="detail-section">
                      <h4>Required Documents</h4>
                      <ul className="documents-list">
                        {productDetails.documents.map((doc, idx) => (
                          <li key={idx}>📄 {doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Brochure Download */}
                  {productDetails.brochureUrl && (
                    <div className="detail-section">
                      <a
                        href={productDetails.brochureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-download-brochure"
                      >
                        <Download size={18} />
                        Download Sales Brochure (PDF)
                      </a>
                    </div>
                  )}

                  {/* Call to Action */}
                  <div className="detail-section cta-section">
                    <button className="btn btn-primary">Get More Information</button>
                    <button className="btn btn-secondary">Compare Plans</button>
                  </div>
                </div>
              ) : (
                <div className="details-empty">
                  <p>Failed to load product details. Please try again.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
