import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import SEO from '../../components/common/SEO.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { getGallery } from '../../services/galleryService';
import { resolveAssetUrl } from '../../utils/format';

const FALLBACK_IMG =
  'data:image/svg+xml;charset=UTF-8,%3Csvg width="400" height="400" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="400" height="400" fill="%23e2e8f0"/%3E%3Ctext x="50%25" y="50%25" font-size="18" fill="%2394a3b8" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif"%3ELotus Agritech%3C/text%3E%3C/svg%3E';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    getGallery({ limit: 100, isActive: true })
      .then((res) => setItems(res.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category || 'General'));
    return ['All', ...Array.from(set)];
  }, [items]);

  const filtered = activeCategory === 'All' ? items : items.filter((i) => (i.category || 'General') === activeCategory);

  return (
    <>
      <SEO title="Gallery" description="Explore our manufacturing facility, machinery and finished PVC & UPVC pipe products through our photo gallery." />
      <PageHero title="Our Gallery" subtitle="A glimpse into our manufacturing facility and product range." breadcrumb={[{ label: 'Gallery' }]} />

      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeCategory === cat ? 'bg-primary text-white shadow-lg' : 'bg-surface text-ink hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : filtered.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item, i) => (
                <motion.button
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
                  onClick={() => setLightbox(item)}
                  className="relative aspect-square rounded-xl overflow-hidden group"
                >
                  <img
                    src={resolveAssetUrl(item.image) || FALLBACK_IMG}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMG;
                    }}
                  />
                  <div className="absolute inset-0 bg-brand/0 group-hover:bg-brand/50 transition-colors flex items-end p-3">
                    <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.title}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted py-16">No gallery images available yet.</p>
          )}
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-white text-2xl w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={resolveAssetUrl(lightbox.image) || FALLBACK_IMG}
                alt={lightbox.title}
                className="w-full max-h-[75vh] object-contain rounded-lg"
              />
              <div className="text-center mt-4">
                <p className="text-white font-semibold">{lightbox.title}</p>
                {lightbox.description && <p className="text-slate-400 text-sm mt-1">{lightbox.description}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;
