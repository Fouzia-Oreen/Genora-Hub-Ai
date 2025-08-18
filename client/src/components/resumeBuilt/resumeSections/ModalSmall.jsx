import { X } from 'lucide-react';

const ModalSmall = ({ children, isOpen, onClose, title, hideHeader, showActionBtn = null, actionBtnText, onActionClick
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
        className="relative  overflow-y-auto transform transition-all duration-300 ease-in-out scale-100 opacity-100 bg-color_9  rounded-xl shadow-2xl hide-scrollbar"
      >

          <button
          onClick={onClose}
          className="absolute right-4 top-4 btn-small "
          aria-label="Close"
          >
          <X size={16} className='text-color_9 font-semibold'/>
          </button>
          {/* Optional Header */}
          {!hideHeader && (
            <div className="p-6 border-b border-color_7/20">
              <h3 className="text-xl font-semibold text-color_2 dark:text-color_4">{title}</h3>
            </div>
          )}
           
        {/* Modal Body (children content) */}
        <div className="p-6 text-color_4  ">
          {children}
        </div>

        {/* Optional Footer with Action Button */}
        {showActionBtn && (
          <div className="sticky bottom-0 z-10 flex justify-end px-6 py-4 border-t border-color_7/20 bg-white dark:bg-color_8">
            <button
              onClick={onActionClick}
              className="px-6 py-2 bg-color_5 hover:bg-color_5/90 text-white rounded-lg transition-colors duration-200"
            >
              {actionBtnText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalSmall
