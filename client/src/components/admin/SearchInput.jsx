import { FaSearch } from 'react-icons/fa';

const SearchInput = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="relative w-full sm:w-72">
      <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-10"
      />
    </div>
  );
};

export default SearchInput;
