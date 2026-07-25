import ImageUploader from './ImageUploader.jsx';

/**
 * Generic form field renderer for admin CRUD forms.
 * field: { name, label, type, options, placeholder, required, rows, help, colSpan }
 */
const FormField = ({ field, value, onChange, error }) => {
  const { name, label, type = 'text', options = [], placeholder, required, rows = 4, help } = field;

  const commonProps = {
    id: name,
    name,
    required,
    placeholder,
  };

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={rows}
            className="input-field resize-none"
            value={value ?? ''}
            onChange={(e) => onChange(name, e.target.value)}
          />
        );
      case 'number':
        return (
          <input
            {...commonProps}
            type="number"
            step="any"
            className="input-field"
            value={value ?? ''}
            onChange={(e) => onChange(name, e.target.value)}
          />
        );
      case 'checkbox':
        return (
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(name, e.target.checked)}
              className="w-4.5 h-4.5 accent-[#0B5ED7] w-5 h-5"
            />
            <span className="text-sm text-secondary">{label}</span>
          </label>
        );
      case 'select':
        return (
          <select
            {...commonProps}
            className="input-field"
            value={value ?? ''}
            onChange={(e) => onChange(name, e.target.value)}
          >
            <option value="">Select {label}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      case 'date':
        return (
          <input
            {...commonProps}
            type="date"
            className="input-field"
            value={value ? String(value).slice(0, 10) : ''}
            onChange={(e) => onChange(name, e.target.value)}
          />
        );
      case 'image':
        return <ImageUploader value={value} onChange={(url) => onChange(name, url)} />;
      case 'imageArray':
        return <ImageUploader multiple value={value} onChange={(urls) => onChange(name, urls)} />;
      case 'tags':
        return (
          <input
            {...commonProps}
            type="text"
            className="input-field"
            value={Array.isArray(value) ? value.join(', ') : value ?? ''}
            onChange={(e) => onChange(name, e.target.value)}
          />
        );
      default:
        return (
          <input
            {...commonProps}
            type="text"
            className="input-field"
            value={value ?? ''}
            onChange={(e) => onChange(name, e.target.value)}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <div className="flex flex-col justify-center h-full">
        {renderInput()}
        {help && <p className="text-xs text-muted mt-1">{help}</p>}
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={name} className="label-field">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {renderInput()}
      {type === 'tags' && <p className="text-xs text-muted mt-1">Separate multiple values with commas.</p>}
      {help && <p className="text-xs text-muted mt-1">{help}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default FormField;
