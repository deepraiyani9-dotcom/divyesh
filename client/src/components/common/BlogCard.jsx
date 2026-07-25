import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaRegCalendar, FaRegUser } from 'react-icons/fa';
import { formatDate, truncate, resolveAssetUrl } from '../../utils/format';

const FALLBACK_IMG =
  'data:image/svg+xml;charset=UTF-8,%3Csvg width="400" height="260" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="400" height="260" fill="%23e2e8f0"/%3E%3Ctext x="50%25" y="50%25" font-size="16" fill="%2394a3b8" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif"%3ELotus Agritech%3C/text%3E%3C/svg%3E';

const BlogCard = ({ blog, index = 0 }) => {
  const image = blog.coverImage ? resolveAssetUrl(blog.coverImage) : FALLBACK_IMG;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.08 }}
      className="card overflow-hidden flex flex-col h-full group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
    >
      <Link to={`/blog/${blog.slug}`} className="block aspect-[16/10] overflow-hidden bg-surface">
        <img
          src={image}
          alt={blog.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-4 text-xs text-muted font-medium mb-3">
          <span className="flex items-center gap-1.5">
            <FaRegCalendar size={12} /> {formatDate(blog.publishedAt || blog.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <FaRegUser size={12} /> {blog.author || 'Lotus Agritech'}
          </span>
        </div>
        <h3 className="font-semibold text-lg text-secondary line-clamp-2 mb-2">
          <Link to={`/blog/${blog.slug}`} className="hover:text-primary transition-colors">
            {blog.title}
          </Link>
        </h3>
        <p className="text-sm text-muted line-clamp-3 flex-1">{truncate(blog.excerpt || blog.content, 130)}</p>
        <Link
          to={`/blog/${blog.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary mt-4 hover:gap-2.5 transition-all"
        >
          Read Article <FaArrowRight size={12} />
        </Link>
      </div>
    </motion.article>
  );
};

export default BlogCard;
