import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination as SwiperPagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaChevronLeft, FaFileInvoiceDollar, FaPhoneAlt, FaTag } from 'react-icons/fa';
import SEO from '../../components/common/SEO.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ProductCard from '../../components/common/ProductCard.jsx';
import Button from '../../components/common/Button.jsx';
import { getProductBySlug, getProducts } from '../../services/productService';
import { formatCurrency, resolveAssetUrl } from '../../utils/format';
import { COMPANY } from '../../utils/constants';

const FALLBACK_IMG =
  'data:image/svg+xml;charset=UTF-8,%3Csvg width="600" height="500" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="600" height="500" fill="%23e2e8f0"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="%2394a3b8" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif"%3ELotus Agritech PVC Pipe%3C/text%3E%3C/svg%3E';

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

  const images = product.images?.length ? product.images : [];
  const specs = product.specifications || {};

  return (
    <>
      <SEO title={product.name} description={product.shortDescription || product.description} />

      <div className="pt-28 md:pt-32 pb-6 bg-surface border-b border-slate-100">
        <div className="container-custom">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium text-muted hover:text-primary transition-colors">
            <FaChevronLeft size={12} /> Back
          </button>
        </div>
      </div>

      <section className="section-padding !pt-10">
        <div className="container-custom grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            {images.length > 0 ? (
              <Swiper
                modules={[Navigation, SwiperPagination]}
                navigation
                pagination={{ clickable: true }}
                className="rounded-2xl overflow-hidden bg-surface aspect-square"
              >
                {images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={resolveAssetUrl(img)}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMG;
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="rounded-2xl overflow-hidden bg-surface aspect-square flex items-center justify-center">
                <img src={FALLBACK_IMG} alt={product.name} className="w-full h-full object-cover" />
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
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
