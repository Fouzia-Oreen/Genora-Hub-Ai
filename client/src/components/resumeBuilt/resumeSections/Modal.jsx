import { X } from "lucide-react";

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  hideHeader = false,
  showActionBtn = false,
  actionBtnText,
  onActionClick,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-color_1/50 p-4 transition-all duration-300 ease-in-out"
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out scale-100 opacity-100 bg-color_9 rounded-xl shadow-xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-color_4/70 hover:text-color_4 transition-colors duration-200"
          aria-label="Close"
        >
          <X size={16} className="btn-small" />
        </button>

        {/* Optional Header */}
        {!hideHeader && (
          <div className="p-6 border-b border-color_7/20">
            <h3 className="text-xl font-semibold text-color_2">{title}</h3>
          </div>
        )}

        {/* Modal Body (scrollable) */}
        <div className="p-6 text-color_4 overflow-y-auto flex-1 hide-scrollbar">
          {children}
        </div>

        {/* Optional Footer with Action Button */}
        {showActionBtn && (
          <div className="flex justify-end px-6 py-4 border-t border-color_7/20 bg-white rounded-b-xl">
            <button
              onClick={onActionClick}
              className="btn-small flex items-center justify-center"
            >
              {actionBtnText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
