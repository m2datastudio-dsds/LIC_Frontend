import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

function ProductsPage() {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = selectedCategory ? { category: selectedCategory } : {};

    api.get('/products', { params })
      .then((response) => setProducts(response.data.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  if (loading) return <div className="page-shell">Loading products...</div>;

  const formattedCategory = selectedCategory
    ? selectedCategory.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
    : 'Insurance';

  return (
    <div className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Our Products</span>
        <h1>{selectedCategory ? `${formattedCategory} plans for peace of mind` : 'Insurance and services designed for peace of mind'}</h1>
      </div>

      <div className="product-grid">
        {products.length === 0 ? (
          <p>No products found for this category.</p>
        ) : (
          products.map((product) => (
            <article className="product-card" key={product.id}>
              <img src={product.imageUrl || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80'} alt={product.name} />
              <div className="product-card-body">
                <span className="badge">{product.category?.name || 'General'}</span>
                <h3>{product.name}</h3>
                <p>{product.shortDescription}</p>
                <div className="card-foot">
                  <span>{product.provider || 'Provider'}</span>
                  <Link to={`/products/${product.id}`} className="btn btn-primary btn-small">View Details</Link>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductsPage;
