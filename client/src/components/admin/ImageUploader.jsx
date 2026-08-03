import { useRef, useState } from 'react';
import { FaCloudUploadAlt, FaSpinner, FaTimes } from 'react-icons/fa';
import { uploadFile } from '../../services/uploadService';
import { resolveAssetUrl } from '../../utils/format';

const ImageUploader = ({ value, onChange, multiple = false }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const urls = multiple ? (Array.isArray(value) ? value : []) : value ? [value] : [];

  const handleFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    setError('');
    try {
      const uploaded = [];
      for (const file of Array.from(files)) {
        const res = await uploadFile(file);
        const url = res.data?.url || res.data?.absoluteUrl;
        if (!url) throw new Error('Upload returned no URL');
        uploaded.push(url);
      }
      if (multiple) {
        onChange([...(Array.isArray(value) ? value : []), ...uploaded]);
      } else {
        onChange(uploaded[0]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeAt = (idx) => {
    if (multiple) {
      const next = [...urls];
      next.splice(idx, 1);
      onChange(next);
    } else {
      onChange('');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {urls.map((url, idx) => (
          <div key={url + idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 group">
            <img src={resolveAssetUrl(url)} alt="upload" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaTimes size={11} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1.5 text-muted hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
        >
          {uploading ? <FaSpinner className="animate-spin" /> : <FaCloudUploadAlt size={20} />}
          <span className="text-[11px] font-medium">{uploading ? 'Uploading' : 'Upload'}</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default ImageUploader;
