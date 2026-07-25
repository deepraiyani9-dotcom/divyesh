import { COMPANY } from '../../utils/constants';

const GoogleMapEmbed = ({ height = 420, className = '' }) => {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(COMPANY.mapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={`rounded-2xl overflow-hidden shadow-lg border border-slate-100 ${className}`} style={{ height }}>
      <iframe
        title="Lotus Agritech Location"
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default GoogleMapEmbed;
