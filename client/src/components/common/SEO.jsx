import { Helmet } from 'react-helmet-async';
import { COMPANY } from '../../utils/constants';

const SEO = ({
  title,
  description,
  image = '/favicon.svg',
  url,
  keywords = 'PVC pipes, UPVC pipes, pipe manufacturer, Dwarka, Gujarat, agriculture pipes, irrigation pipes',
}) => {
  const fullTitle = title ? `${title} | ${COMPANY.name}` : `${COMPANY.name} | PVC & UPVC Pipe Manufacturers`;
  const desc =
    description ||
    `${COMPANY.name} - ${COMPANY.slogan} Premium PVC & UPVC pipe manufacturing in Dwarka, Gujarat.`;
  const canonical = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={image} />
      {canonical && <meta property="og:url" content={canonical} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
