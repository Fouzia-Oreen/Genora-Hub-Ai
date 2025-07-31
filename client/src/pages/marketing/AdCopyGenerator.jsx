import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { Megaphone, Sparkles } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import CopyDownloadButtons from '../../components/home/Copy&DownloadButton';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AdCopyGenerator = () => {
  const platforms = ['Google Ads', 'Facebook Ads', 'Instagram Ads', 'LinkedIn Ads', 'Twitter Ads'];
  const tones = ['persuasive', 'urgent', 'informative', 'witty', 'friendly', 'professional'];
  const adTypes = ['Headline', 'Description', 'Call to Action', 'Full Ad Copy'];

  const [productService, setProductService] = useState('');
  const [keySellingPoints, setKeySellingPoints] = useState('');
  const [targetAudience, setTargetAudience] = useState('');

  const [selectedPlatform, setSelectedPlatform] = useState('Google Ads');
  const [selectedTone, setSelectedTone] = useState('persuasive');
  const [selectedAdType, setSelectedAdType] = useState('Headline');
  const [generatedAdCopy, setGeneratedAdCopy] = useState('');
  const [loading, setLoading] = useState(false); 

  const { getToken } = useAuth(); 

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!productService.trim() || !keySellingPoints.trim()) {
      toast.error('Product/service name and key selling points are required.');
      return;
    }

    setLoading(true); 
    setGeneratedAdCopy(''); 

    try {
      const { data } = await axios.post(
        '/api/ai/generate-ad', 
        {
          productService,
          keySellingPoints,
          selectedPlatform,
          selectedTone,
          selectedAdType,
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setGeneratedAdCopy(data.content);
        toast.success('Ad copy generated successfully!');
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

  const handleCopy = () => {
    if (!generatedAdCopy.trim()) {
      toast.error('No ad copy to copy.');
      return;
    }
    navigator.clipboard.writeText(generatedAdCopy)
      .then(() => toast.success('Ad copy copied to clipboard!'))
      .catch(() => toast.error('Failed to copy.'));
  };

  const handleDownloadPDF = () => {
    if (!generatedAdCopy.trim()) {
      toast.error('No ad copy to download as PDF.');
      return;
    }

    const doc = new jsPDF(); 

    doc.setFontSize(18);
    doc.text(`Ad Copy - ${productService} (${selectedPlatform})`, 14, 22);

    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(generatedAdCopy, 180); 
    doc.text(splitText, 14, 30); 


    doc.save(`ad_copy_${productService.replace(/\s/g, '-')}_${selectedPlatform.toLowerCase()}.pdf`);
    toast.success('Ad copy downloaded as PDF!');
  };

  return (
    <div className='panel'>

      {/* Left Panel */}
      <form onSubmit={onSubmitHandler} className="leftPanel max-h-[900px]">
        <div className='flex items-center gap-3'>
          <Sparkles className="w-5 h-5 text-color_5 animate-sparkle" />
          <h1 className='text-2xl font-semibold'>AI Ad Copy Generator</h1>
        </div>
        <p className='text-sm text-color_4 mt-1'>
          Create compelling ad copy for various platforms.
        </p>

        {/* Product/Service Name Input */}
        <p className='mt-6 font-medium text-color_4'>Product/Service Name</p>
        <input
          type="text"
          required
          value={productService}
          onChange={(e) => setProductService(e.target.value)}
          placeholder="e.g., 'Premium Online Course', 'Eco-Friendly Cleaning Service'"
          className="w-full p-2 mt-2 outline-none text-sm rounded-md border border-color_7/40"
        />

        {/* Key Selling Points Input */}
        <p className='mt-6 font-medium text-color_4'>Key Selling Points</p>
        <textarea
          rows={5}
          required
          value={keySellingPoints}
          onChange={(e) => setKeySellingPoints(e.target.value)}
          placeholder="List what makes your product/service unique, e.g., 'Save 50% now, Expert instructors, 24/7 support'"
          className="w-full p-3 mt-2 outline-none text-sm rounded-md border border-color_7/40 resize-none"
        />

        {/* Target Audience Input (Optional) */}
        <p className='mt-6 font-medium text-color_4'>Target Audience (Optional)</p>
        <input
          type="text"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          placeholder="e.g., 'Busy professionals', 'Eco-conscious consumers'"
          className="w-full p-2 mt-2 outline-none text-sm rounded-md border border-color_7/40"
        />

        {/* Platform Selection */}
        <p className='mt-6 font-medium text-color_4'>Target Platform</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {platforms.map((platform) => (
            <span
              key={platform}
              className={`cursor-pointer px-4 py-2 rounded-md text-sm border transition ${
                selectedPlatform === platform ? 'selectButton' : 'notSelectButton'
              }`}
              onClick={() => {
                setSelectedPlatform(platform);
                setGeneratedAdCopy(''); 
              }}
            >
              {platform}
            </span>
          ))}
        </div>

        {/* Tone Selection */}
        <p className='mt-6 font-medium text-color_4'>Select Tone</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {tones.map((tone) => (
            <span
              key={tone}
              className={`cursor-pointer px-4 py-2 rounded-md text-sm border transition ${
                selectedTone === tone ? 'selectButton' : 'notSelectButton'
              }`}
              onClick={() => setSelectedTone(tone)}
            >
              {tone.charAt(0).toUpperCase() + tone.slice(1)}
            </span>
          ))}
        </div>

        {/* Ad Type Selection */}
        <p className='mt-6 font-medium text-color_4'>Ad Type</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {adTypes.map((type) => (
            <span
              key={type}
              className={`cursor-pointer px-4 py-2 rounded-md text-sm border transition ${
                selectedAdType === type ? 'selectButton' : 'notSelectButton'
              }`}
              onClick={() => {
                setSelectedAdType(type);
                setGeneratedAdCopy(''); 
              }}
            >
              {type}
            </span>
          ))}
        </div>

        {/* Submit Button */}
        <button type='submit' className='w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 btn2-grad' disabled={loading}>
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Megaphone className='w-5' />}
          Generate Ad Copy
        </button>
      </form>

      {/* Right Panel: Generated Ad Copy */}
      <div className='rightPanel'>
        <div className='flex items-center gap-3 justify-between'>
          <div className='flex gap-2 items-center'>
            <Megaphone className='w-5' />
            <h1 className='text-xl font-semibold'>Generated Ad Copy</h1>
          </div>
          <CopyDownloadButtons onCopy={handleCopy} onDownload={handleDownloadPDF} /> 
        </div>
        
        {loading ? (
          <div className='flex-1 flex justify-center items-center'>
            <span className='w-8 h-8 rounded-full border-4 border-t-transparent animate-spin text-color_5'></span>
          </div>
        ) : (
          !generatedAdCopy ? (
            <div className='flex-1 mt-4 overflow-y-auto text-sm text-color_4 whitespace-pre-line'>
              <div className='text-sm flex flex-col items-center gap-1 justify-center h-full'>
                <Megaphone className='w-9 text-color_4/60' />
                <p className=' text-sm font-medium text-color_4/60 text-center'>
                  Enter product/service details and click "Generate Ad Copy" to get started.
                </p>
              </div>
            </div>
          ) : (
            <div className='mt-3 h-full overflow-y-scroll text-sm'>
              <div className='reset-tw'>
                <Markdown>
                  {generatedAdCopy}
                </Markdown>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AdCopyGenerator;