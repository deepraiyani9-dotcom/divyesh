import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebookF, FaLinkedinIn, FaRegCalendar, FaRegUser, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import SEO from '../../components/common/SEO.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import BlogCard from '../../components/common/BlogCard.jsx';
import Button from '../../components/common/Button.jsx';
import { getBlogBySlug, getBlogs } from '../../services/blogService';
import { formatDate, resolveAssetUrl } from '../../utils/format';

const BlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    getBlogBySlug(slug)
      .then(async (res) => {
        if (!active) return;
        setBlog(res.data);
        try {
          const relatedRes = await getBlogs({ limit: 3, isPublished: true });
          if (active) setRelated((relatedRes.data || []).filter((b) => b._id !== res.data._id).slice(0, 3));
        } catch {
          /* ignore */
        }
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) return <LoadingSpinner fullScreen />;

  if (error || !blog) {
    return (
      <div className="container-custom section-padding text-center pt-32">
        <h2 className="text-2xl font-bold text-secondary mb-3">Article Not Found</h2>
        <p className="text-muted mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
        <Button to="/blog">Back to Blog</Button>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <SEO title={blog.title} description={blog.excerpt} image={blog.coverImage ? resolveAssetUrl(blog.coverImage) : undefined} />

      <div className="pt-28 md:pt-36 pb-10 md:pb-14 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, #0B5ED7 0%, transparent 45%)' }} />
        <div className="container-custom relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {blog.tags?.length > 0 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {blog.tags.map((tag) => (
                  <span key={tag} className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-5">{blog.title}</h1>
            <div className="flex items-center gap-5 text-slate-300 text-sm">
              <span className="flex items-center gap-1.5">
                <FaRegUser size={12} /> {blog.author || 'Lotus Agritech'}
              </span>
              <span className="flex items-center gap-1.5">
                <FaRegCalendar size={12} /> {formatDate(blog.publishedAt || blog.createdAt)}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <section className="section-padding !pt-12">
        <div className="container-custom max-w-3xl">
          {blog.coverImage && (
            <img
              src={resolveAssetUrl(blog.coverImage)}
              alt={blog.title}
              className="w-full rounded-2xl mb-10 aspect-[16/9] object-cover"
            />
          )}
          <article className="prose-content text-secondary/90 leading-relaxed whitespace-pre-line text-base md:text-lg">
            {blog.content}
          </article>

          <div className="flex items-center gap-3 mt-12 pt-8 border-t border-slate-100">
            <span className="text-sm font-semibold text-secondary">Share this article:</span>
            {[
              { icon: <FaWhatsapp />, href: `https://wa.me/?text=${encodeURIComponent(blog.title + ' ' + shareUrl)}`, color: 'bg-emerald-500' },
              { icon: <FaFacebookF />, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, color: 'bg-blue-600' },
              { icon: <FaTwitter />, href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`, color: 'bg-sky-500' },
              { icon: <FaLinkedinIn />, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, color: 'bg-blue-800' },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className={`w-9 h-9 rounded-full ${s.color} text-white flex items-center justify-center hover:scale-110 transition-transform`}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {related.length > 0 && (
          <div className="container-custom mt-16">
            <h3 className="font-bold text-2xl text-secondary mb-6">More Articles</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((b, i) => (
                <BlogCard key={b._id} blog={b} index={i} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default BlogDetails;
