import { LucideTrash2, LucideUpload, LucideUser } from 'lucide-react';
import { useRef, useState } from 'react';

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            const preview = URL.createObjectURL(file);
            if (setPreview) {
                setPreview(preview);
            }
            setPreviewUrl(preview);
        }
    };
    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
        if (setPreview) {
            setPreview(null);
        }
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    return (
        <div className='flex justify-center mb-6'>
            <input type="file" accept='image/*' ref={inputRef} onChange={handleImageChange} className='hidden' />
            {
                !image ? (
                    <div className='w-20 h-20 flex items-center justify-center bg-[#c6d2f3] rounded-full relative cursor-pointer border border-color_6/30'>
                        <LucideUser className='text-color_4 size-5' />
                        <button type="button" className='absolute -bottom-1 -right-1 cursor-pointer btn-small flex items-center justify-center' onClick={onChooseFile}>
                            <LucideUpload />
                        </button>
                    </div>
                ) : (
                    <div className='w-20 h-20 relative rounded-full'> 
                        <img 
                            src={preview || previewUrl} 
                            alt="profile Photo" 
                            className='w-full h-full object-cover rounded-full' 
                        />
                        <button 
                            type="button" 
                            className='absolute -bottom-1 -right-1 cursor-pointer' 
                            onClick={handleRemoveImage}
                        >
                            <LucideTrash2 className='btn-delete' /> 
                        </button>
                    </div>
                )
            }
        </div>
    );
};

export default ProfilePhotoSelector;