import Modal from './Modal.jsx';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmDialog = ({ open, onClose, onConfirm, title = 'Confirm Action', message, loading }) => {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
          <FaExclamationTriangle size={22} />
        </div>
        <p className="text-sm text-muted mb-6">{message || 'Are you sure you want to proceed? This action cannot be undone.'}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="btn btn-outline flex-1" disabled={loading}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn flex-1 bg-red-500 text-white hover:bg-red-600"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
