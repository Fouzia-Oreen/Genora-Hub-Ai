import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { ImagePlus, Sparkles, Wand2 } from 'lucide-react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import CopyDownloadButtons from '../../components/home/Copy&DownloadButton';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ObjectRemover = () => {
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [removeText, setRemoveText] = useState('');
  const fileRef = useRef(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setProcessedImageUrl(null); 
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!imageFile || !removeText.trim()) {
      toast.error('Please upload an image and describe the object to remove.');
      return;
    }

    setLoading(true);
    setProcessedImageUrl(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('object', removeText);

      const { data } = await axios.post(
        '/api/ai/remove-object',
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (data.success) {
        setProcessedImageUrl(data.content);
        toast.success('Object removed successfully!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error calling backend:', error);
      toast.error(error.response?.data?.message || error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (!processedImageUrl) {
      toast.error('No image to download.');
      return;
    }
    const link = document.createElement('a');
    link.href = processedImageUrl;
    link.setAttribute('download', `object_removed_${Date.now()}.png`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image download initiated!');
  };

  const handleCopyImageUrl = () => {
    if (!processedImageUrl) {
      toast.error('No image URL to copy.');
      return;
    }
    navigator.clipboard.writeText(processedImageUrl)
      .then(() => toast.success('Image URL copied to clipboard!'))
      .catch(() => toast.error('Failed to copy image URL.'));
  };

  return (
    <div className='panel'>

      {/* Left Panel */}
      <form onSubmit={onSubmitHandler} className="leftPanel">
        <div className='flex items-center gap-3'>
          <Sparkles className="w-5 h-5 text-color_5 animate-sparkle" />
          <h1 className='text-2xl font-semibold'>Remove Object from Image</h1>
        </div>

        <p className='mt-6 font-medium text-color_4'>Upload Image</p>
        <div
          onClick={() => fileRef.current.click()}
          className="mt-2 w-full p-6 border border-dashed border-color_7/40 rounded-md cursor-pointer flex flex-col items-center justify-center text-center hover:bg-color_9 transition min-h-[200px]"
        >
          {preview ? (
            <>
              <img src={preview} alt="Uploaded Preview" className="max-h-40 object-contain rounded-md mb-2" />
              <p className="text-xs text-color_4/60">Click to change image</p>
            </>
          ) : (
            <>
              <ImagePlus className="w-8 h-8 text-color_5 mb-2" />
              <p className="text-sm text-color_4 font-medium">Click to select an image</p>
              <p className="text-xs text-color_4/60">or drag and drop here</p>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          onChange={handleImageChange}
          type="file"
          accept="image/*"
          className="hidden"
        />

        <p className='mt-6 font-medium text-color_4'>What object should be removed?</p>
        <textarea onChange={(e) => setRemoveText(e.target.value)} value={removeText} type="text" rows={4} placeholder='Describe what you want to remove from the image...' className='w-full p-2 mt-2 outline-none text-sm rounded-md border border-color_7/40 ' required />

        <button className='w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 btn2-grad' disabled={loading}>
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Wand2 className='w-5' />}
          Remove Object
        </button>
      </form>

      {/* Right Panel (Processed Image Display) */}
      <div className='rightPanel'>
        <div className='flex items-center gap-3 justify-between'>
          <div className='flex gap-2 items-center'>
            <Wand2 className='w-5' />
            <h1 className='text-xl font-semibold'>Processed Image</h1>
          </div>
          {processedImageUrl && (
            <CopyDownloadButtons onCopy={handleCopyImageUrl} onDownload={handleDownloadImage} />
          )}
        </div>
        <div className='flex-1 flex justify-center items-center p-4'> 
          {loading ? (
            <div className='flex-1 flex justify-center items-center'>
              <span className='w-8 h-8 rounded-full border-4 border-t-transparent animate-spin text-color_5'></span>
            </div>
          ) : (
            processedImageUrl ? (
              <img src={processedImageUrl} alt="Object Removed" className="w-full h-full object-contain rounded-md" />
            ) : (
              <div className='text-sm flex flex-col items-center gap-2'>
                <Wand2 className='w-9 text-color_4/60' />
                <p className='text-sm font-medium text-color_4/60'>
                  Upload an image and click "Remove Object" to get started
                </p>
              </div>
            )
          )}
        </div>
      </div>

    </div>
  );
};

export default ObjectRemover;
