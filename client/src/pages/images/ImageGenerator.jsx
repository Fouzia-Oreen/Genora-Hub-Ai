import { Image, Sparkles } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import CopyDownloadButtons from '../../components/home/Copy&DownloadButton';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ImageGenerator = () => {
  const imageStyle = ['Realistic', 'Ghibli Style', 'Anime Style', 'Cartoon Style', 'Fantasy Style', '3D Style', 'Portrait Style'];
  const [selectedImageStyle, setSelectedImageStyle] = useState('Realistic');
  const [input, setInput] = useState('');
  const [publish, setPublish] = useState(false); 
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error('Please describe the image you want to generate.');
      return;
    }

    setLoading(true);
    setGeneratedImageUrl(null);

    try {
      const { data } = await axios.post(
        '/api/ai/generate-image',
        {
          prompt: input,
          selectedImageStyle,
          publish, 
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setGeneratedImageUrl(data.secure_url);
        toast.success('Image generated successfully!');
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

  const handleCopyImageUrl = () => {
    if (!generatedImageUrl) {
      toast.error('No image URL to copy.');
      return;
    }
    navigator.clipboard.writeText(generatedImageUrl)
      .then(() => toast.success('Image URL copied to clipboard!'))
      .catch(() => toast.error('Failed to copy image URL.'));
  };

  const handleDownloadImage = () => {
    if (!generatedImageUrl) {
      toast.error('No image to download.');
      return;
    }
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.setAttribute('download', `ai_image_${Date.now()}.png`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image download initiated!');
  };

  return (
    <div className='panel'>
      {/* left panel */}
      <form onSubmit={onSubmitHandler} className="leftPanel">
        <div className='flex items-center gap-3'>
          <Sparkles className="w-5 h-5 text-color_5 animate-sparkle" />
          <h1 className='text-xl font-semibold'>AI Image Generator</h1>
        </div>
        <p className='mt-6 text-sm font-medium text-color_4'>Describe Your Image</p>
        <textarea onChange={(e) => setInput(e.target.value)} value={input} type="text" rows={4} placeholder='Describe what you want to see in the Image...' className='w-full p-2 mt-2 outline-none text-sm rounded-md border border-color_7/40 ' required />

        <p className='mt-6 font-medium text-color_4'>Style</p>

        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {
            imageStyle.map((item, index) => (
              <span
                key={index}
                className={` ${selectedImageStyle === item ? 'selectButton' : 'notSelectButton'}`}
                onClick={() => {
                  setSelectedImageStyle(item);
                  setGeneratedImageUrl(null);
                }}
              >
                {item}
              </span>
            ))
          }
        </div>
        <div className='my-10 flex items-center gap-2'>
        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
        <input type="checkbox" className="sr-only peer"  onChange={(e) => setPublish(e.target.checked)} checked={publish} />
        <div className="w-11 h-6 bg-slate-400 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
        <span className="dot absolute left-1 top-1 w-4 h-4 bg-color_9 rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
        </label>
          <p className='text-sm text-color_4'>Make This Image Public</p>
        </div>
        <button className='w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 btn2-grad' disabled={loading}>
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Image className='w-5' />} Generate AI Images
        </button>
      </form>
      
      {/* right panel */}
      <div className='rightPanel'>
        <div className='flex items-center gap-3 justify-between'>
          <div className='flex gap-2 items-center'>
            <Image className='w-5' />
            <h1 className='text-xl font-semibold'>Generated AI Image</h1>
          </div>
          {generatedImageUrl && (
            <CopyDownloadButtons onCopy={handleCopyImageUrl} onDownload={handleDownloadImage} />
          )}
        </div>
        <div className='flex-1 flex justify-center items-center'>
          {loading ? (
            <div className='flex-1 flex justify-center items-center'>
              <span className='w-8 h-8 rounded-full border-4 border-t-transparent animate-spin text-color_5'></span>
            </div>
          ) : (
            generatedImageUrl ? (
              <img src={generatedImageUrl} alt="Generated AI Image" className="max-w-full max-h-full object-contain rounded-md" />
            ) : (
              <div className='text-sm flex flex-col items-center gap-2 '>
                <Image className='w-9 text-color_4/60' />
                <p className='text-sm font-medium text-color_4/60'>Enter a topic and click "Generate AI Images" to get started</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
