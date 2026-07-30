import { FaBoxOpen } from 'react-icons/fa';

const StatCard = ({ label, value, icon, color = 'primary' }) => {
  const colorMap = {
    primary: 'bg-[#0D7377] text-white',
    accent: 'bg-[#E07A3D] text-white',
    emerald: 'bg-emerald-600 text-white',
    slate: 'bg-[#5B6B8C] text-white',
  };

  return (
    <div
      className="flex items-center gap-4 p-5 rounded-2xl border border-gray-200 shadow-md"
      style={{ backgroundColor: '#ffffff', opacity: 1 }}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${colorMap[color] || colorMap.primary}`}
      >
        {icon || <FaBoxOpen />}
      </div>
      <div>
        <p className="text-2xl font-bold text-[#2C3340] leading-none" style={{ opacity: 1 }}>
          {value}
        </p>
        <p className="text-xs font-semibold text-[#5B6B8C] mt-1.5" style={{ opacity: 1 }}>
          {label}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
