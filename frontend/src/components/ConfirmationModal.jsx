import { X } from 'lucide-react';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmColor = 'bg-propertyflow-gold' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-propertyflow-dark/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-propertyflow-dark">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 ${confirmColor} text-white rounded-lg hover:opacity-90 transition-opacity font-medium`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
