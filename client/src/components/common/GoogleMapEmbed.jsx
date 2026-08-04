import { COMPANY } from '../../utils/constants';

const GoogleMapEmbed = ({ height = 420, className = '' }) => {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(COMPANY.mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={`rounded-2xl overflow-hidden shadow-lg border border-slate-100 ${className}`}>
      <div style={{ height }}>
        <iframe
          title="Lotus Agritech Location"
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <a
        href={COMPANY.mapLink}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 bg-white px-4 py-3 text-sm font-semibold text-primary hover:bg-secondary transition-colors border-t border-slate-100"
      >
        Open in Google Maps
      </a>
    </div>
  );
};

export default GoogleMapEmbed;
