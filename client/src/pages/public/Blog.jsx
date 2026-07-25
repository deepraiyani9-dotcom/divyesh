import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import SEO from '../../components/common/SEO.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import BlogCard from '../../components/common/BlogCard.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { getBlogs } from '../../services/blogService';

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const q = searchParams.get('q') || '';
  const page = Number(searchParams.get('page')) || 1;
  const [searchInput, setSearchInput] = useState(q);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBlogs({ page, limit: 9, isPublished: true, ...(q ? { q } : {}) });
      setBlogs(res.data || []);
      setPagination(res.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, q]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput) next.set('q', searchInput);
    else next.delete('q');
    next.set('page', '1');
    setSearchParams(next);
  };

  return (
    <>
      <SEO title="Blog" description="Insights, guides and industry news on PVC & UPVC pipe manufacturing from Lotus Agritech." />
      <PageHero title="Our Blog" subtitle="Tips, guides and industry insights from the Lotus Agritech team." breadcrumb={[{ label: 'Blog' }]} />

      <section className="section-padding">
        <div className="container-custom">
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-12 relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles..."
              className="input-field pl-11"
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          </form>

          {loading ? (
            <LoadingSpinner />
          ) : blogs.length ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((b, i) => (
                  <BlogCard key={b._id} blog={b} index={i} />
                ))}
              </div>
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {Array.from({ length: pagination.pages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const next = new URLSearchParams(searchParams);
                        next.set('page', String(idx + 1));
                        setSearchParams(next);
                      }}
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
            <p className="text-center text-muted py-16">No articles found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Blog;
