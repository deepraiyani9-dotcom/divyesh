import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { formatCurrency, resolveAssetUrl } from '../../utils/format';

const FALLBACK_IMG =
  'data:image/svg+xml;charset=UTF-8,%3Csvg width="400" height="300" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="400" height="300" fill="%23e2e8f0"/%3E%3Ctext x="50%25" y="50%25" font-size="18" fill="%2394a3b8" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif"%3EPVC Pipe%3C/text%3E%3C/svg%3E';

const ProductCard = ({ product, index = 0 }) => {
  const image = product.images?.[0] ? resolveAssetUrl(product.images[0]) : FALLBACK_IMG;

  return (
    <motion.div
      initial={{ opacity: 1, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm group overflow-hidden flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      style={{ opacity: 1, backgroundColor: '#FFFFFF' }}
    >
      <Link to={`/products/${product.slug}`} className="relative overflow-hidden aspect-[4/3] min-h-[200px] bg-slate-100 block">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            if (e.currentTarget.dataset.fallback === '1') return;
            e.currentTarget.dataset.fallback = '1';
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />
        {product.isFeatured && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Featured
          </span>
        )}
        {product.category?.name && (
          <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur text-ink text-xs font-semibold px-3 py-1 rounded-full">
            {product.category.name}
          </span>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-lg text-ink line-clamp-2">
          <Link to={`/products/${product.slug}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-muted mt-2 line-clamp-2 flex-1">{product.shortDescription}</p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <span className="font-bold text-primary text-lg">
            {product.price ? formatCurrency(product.price) : 'On Request'}
          </span>
          <Link
            to={`/products/${product.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-primary transition-colors"
          >
            View <FaArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
