import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaChevronLeft, FaChevronRight, FaFileInvoiceDollar, FaPhoneAlt, FaTag } from 'react-icons/fa';
import SEO from '../../components/common/SEO.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ProductCard from '../../components/common/ProductCard.jsx';
import Button from '../../components/common/Button.jsx';
import { getProductBySlug, getProducts } from '../../services/productService';
import { formatCurrency, resolveAssetUrl } from '../../utils/format';
import { COMPANY } from '../../utils/constants';

const FALLBACK_IMG =
  'data:image/svg+xml;charset=UTF-8,%3Csvg width="600" height="500" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="600" height="500" fill="%23e2e8f0"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="%2394a3b8" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif"%3ELotus Agritech PVC Pipe%3C/text%3E%3C/svg%3E';

const ProductGallery = ({ images, name }) => {
  const [active, setActive] = useState(0);
  const safeImages = images.length ? images : [FALLBACK_IMG];
  const current = safeImages[Math.min(active, safeImages.length - 1)];

  useEffect(() => {
    setActive(0);
  }, [images]);

  const go = (dir) => {
    setActive((prev) => {
      const next = prev + dir;
      if (next < 0) return safeImages.length - 1;
      if (next >= safeImages.length) return 0;
      return next;
    });
  };

  return (
    <div className="w-full">
      <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="relative w-full aspect-square max-h-[70vh] bg-[#f4f5f7]">
          <img
            key={current}
            src={current}
            alt={`${name} ${active + 1}`}
            className="absolute inset-0 w-full h-full object-contain p-3"
            decoding="async"
            loading="eager"
            onError={(e) => {
              if (e.currentTarget.dataset.fallback === '1') return;
              e.currentTarget.dataset.fallback = '1';
              e.currentTarget.src = FALLBACK_IMG;
            }}
          />
        </div>

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 border border-slate-200 shadow-md text-ink flex items-center justify-center"
              aria-label="Previous image"
            >
              <FaChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 border border-slate-200 shadow-md text-ink flex items-center justify-center"
              aria-label="Next image"
            >
              <FaChevronRight size={14} />
            </button>
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type="button"
              onClick={() => setActive(idx)}
              className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 bg-white ${
                idx === active ? 'border-primary' : 'border-slate-200'
              }`}
              aria-label={`Show image ${idx + 1}`}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMG;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    getProductBySlug(slug)
      .then(async (res) => {
        if (!active) return;
        setProduct(res.data);
        try {
          const relatedRes = await getProducts({
            category: res.data.category?._id || res.data.category,
            limit: 4,
          });
          if (active) setRelated((relatedRes.data || []).filter((p) => p._id !== res.data._id).slice(0, 3));
        } catch {
          /* ignore related errors */
        }
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug]);

  const galleryImages = useMemo(() => {
    if (!product?.images?.length) return [];
    return product.images
      .map((img) => (typeof img === 'string' ? img : img?.url || ''))
      .filter(Boolean)
      .map((img) => resolveAssetUrl(img))
      .filter(Boolean);
  }, [product]);

  if (loading) return <LoadingSpinner fullScreen />;

  if (error || !product) {
    return (
      <div className="container-custom section-padding text-center">
        <h2 className="text-2xl font-bold text-ink mb-3">Product Not Found</h2>
        <p className="text-muted mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button to="/products">Browse All Products</Button>
      </div>
    );
  }

  const specs = product.specifications || {};

  return (
    <>
      <SEO title={product.name} description={product.shortDescription || product.description} />

      <div className="pt-28 md:pt-32 pb-6 bg-surface border-b border-slate-100">
        <div className="container-custom">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-muted hover:text-primary transition-colors"
          >
            <FaChevronLeft size={12} /> Back
          </button>
        </div>
      </div>

      <section className="section-padding !pt-10 bg-[#fafbfc]">
        <div className="container-custom grid lg:grid-cols-2 gap-10 lg:gap-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <ProductGallery images={galleryImages} name={product.name} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
            {product.category?.name && (
              <span className="inline-flex items-center gap-1.5 text-primary bg-primary/10 text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full mb-4">
                <FaTag size={10} /> {product.category.name}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ink mb-4">{product.name}</h1>
            <p className="text-muted leading-relaxed mb-6">{product.shortDescription}</p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-primary">
                {product.price ? formatCurrency(product.price) : 'Price on Request'}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <Button to="/request-quote" variant="accent" icon={<FaFileInvoiceDollar />}>
                Request a Quote
              </Button>
              <Button href={COMPANY.phoneHref} variant="outline" icon={<FaPhoneAlt />}>
                Call to Order
              </Button>
            </div>

            {Object.values(specs).some(Boolean) && (
              <div className="card p-5 mb-6">
                <h3 className="font-semibold text-ink mb-3">Specifications</h3>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  {specs.diameter && (
                    <div>
                      <dt className="text-muted">Diameter</dt>
                      <dd className="font-semibold text-ink">{specs.diameter}</dd>
                    </div>
                  )}
                  {specs.pressureRating && (
                    <div>
                      <dt className="text-muted">Pressure Rating</dt>
                      <dd className="font-semibold text-ink">{specs.pressureRating}</dd>
                    </div>
                  )}
                  {specs.length && (
                    <div>
                      <dt className="text-muted">Length</dt>
                      <dd className="font-semibold text-ink">{specs.length}</dd>
                    </div>
                  )}
                  {specs.material && (
                    <div>
                      <dt className="text-muted">Material</dt>
                      <dd className="font-semibold text-ink">{specs.material}</dd>
                    </div>
                  )}
                  {specs.color && (
                    <div>
                      <dt className="text-muted">Color</dt>
                      <dd className="font-semibold text-ink">{specs.color}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {product.features?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-ink mb-3">Key Features</h3>
                <ul className="grid sm:grid-cols-2 gap-2.5">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink/80">
                      <FaCheckCircle className="text-primary mt-0.5 shrink-0" size={13} /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.applications?.length > 0 && (
              <div>
                <h3 className="font-semibold text-ink mb-3">Applications</h3>
                <div className="flex flex-wrap gap-2">
                  {product.applications.map((a) => (
                    <span key={a} className="bg-surface border border-slate-200 text-ink text-xs font-medium px-3 py-1.5 rounded-full">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {product.description && (
          <div className="container-custom mt-14">
            <div className="card p-6 md:p-8">
              <h3 className="font-semibold text-xl text-ink mb-4">Product Overview</h3>
              <p className="text-ink/80 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="container-custom mt-16">
            <h3 className="font-bold text-2xl text-ink mb-6">Related Products</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ProductDetails;
