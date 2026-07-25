import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa';
import SEO from '../../components/common/SEO.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import ProductCard from '../../components/common/ProductCard.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ContactCTA from '../../components/common/ContactCTA.jsx';
import { getProducts } from '../../services/productService';
import { getCategories } from '../../services/categoryService';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const q = searchParams.get('q') || '';
  const page = Number(searchParams.get('page')) || 1;
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    getCategories({ limit: 50, isActive: true })
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (category) params.category = category;
      if (q) params.q = q;
      const res = await getProducts(params);
      setProducts(res.data || []);
      setPagination(res.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, q, page]);

  useEffect(() => {
    load();
  }, [load]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    if (!updates.page) next.set('page', '1');
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ q: searchInput });
  };

  return (
    <>
      <SEO title="Products" description="Browse our complete range of PVC & UPVC pipes for agriculture, plumbing, drainage and industrial applications." />
      <PageHero title="Our Products" subtitle="Premium PVC & UPVC pipes engineered for every application." breadcrumb={[{ label: 'Products' }]} />

      <section className="section-padding !pt-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h3 className="font-semibold text-secondary">Filters</h3>
            <button onClick={() => setFilterOpen((o) => !o)} className="btn btn-outline text-sm py-2 px-4">
              <FaFilter size={12} /> {filterOpen ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="grid lg:grid-cols-[260px_1fr] gap-8">
            <aside className={`${filterOpen ? 'block' : 'hidden'} lg:block`}>
              <div className="card p-5 sticky top-24">
                <form onSubmit={handleSearchSubmit} className="mb-6">
                  <label className="label-field">Search Products</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search pipes..."
                      className="input-field pl-9"
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm" />
                  </div>
                </form>

                <h4 className="font-semibold text-secondary mb-3 text-sm">Categories</h4>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => updateParams({ category: '' })}
                    className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !category ? 'bg-primary text-white' : 'hover:bg-slate-50 text-secondary'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => updateParams({ category: c._id })}
                      className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        category === c._id ? 'bg-primary text-white' : 'hover:bg-slate-50 text-secondary'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                {(category || q) && (
                  <button
                    onClick={() => {
                      setSearchInput('');
                      updateParams({ category: '', q: '' });
                    }}
                    className="mt-5 text-sm text-red-500 font-medium flex items-center gap-1.5"
                  >
                    <FaTimes size={11} /> Clear Filters
                  </button>
                )}
              </div>
            </aside>

            <div>
              {loading ? (
                <LoadingSpinner />
              ) : products.length ? (
                <>
                  <p className="text-sm text-muted mb-6">{pagination.total} product(s) found</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((p, i) => (
                      <ProductCard key={p._id} product={p} index={i} />
                    ))}
                  </div>
                  {pagination.pages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                      {Array.from({ length: pagination.pages }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => updateParams({ page: String(idx + 1) })}
                          className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                            page === idx + 1 ? 'bg-primary text-white' : 'border border-slate-200 hover:bg-slate-50 text-secondary'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                  <p className="text-lg font-semibold text-secondary mb-2">No products found</p>
                  <p className="text-muted">Try adjusting your filters or search terms.</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
};

export default Products;
