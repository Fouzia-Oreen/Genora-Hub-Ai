import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { Sparkles, Tag } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import CopyDownloadButtons from '../../components/home/Copy&DownloadButton';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ProductDescriptionGenerator = () => {
  const tones = ['professional', 'friendly', 'luxurious', 'playful', 'concise', 'persuasive'];
  const lengths = ['short', 'medium', 'long'];

  const [productName, setProductName] = useState('');
  const [keyFeatures, setKeyFeatures] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [selectedLength, setSelectedLength] = useState('medium');
  const [generatedDescription, setGeneratedDescription] = useState(''); 
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth(); 

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!productName.trim() || !keyFeatures.trim()) {
      toast.error('Product name and key features are required.');
      return;
    }

    setLoading(true); 
    setGeneratedDescription(''); 

    try {
      const { data } = await axios.post(
        '/api/ai/generate-product-description', 
        {
          productName,
          keyFeatures,
          targetAudience,
          selectedTone,
          selectedLength,
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success === true) {
        setGeneratedDescription(data.content); 
        toast.success('Product description generated successfully!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error generating product description:', error);
      toast.error(error.response?.data?.message || error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false); 
    }
  };

  const handleCopy = () => {
    if (!generatedDescription.trim()) {
      toast.error('No description to copy.');
      return;
    }
    navigator.clipboard.writeText(generatedDescription)
      .then(() => toast.success('Description copied to clipboard!'))
      .catch(() => toast.error('Failed to copy.'));
  };


  const handleDownloadPDF = () => {
    if (!generatedDescription.trim()) {
      toast.error('No description to download as PDF.');
      return;
    }

    const doc = new jsPDF(); 

    doc.setFontSize(18);
    doc.text(`Product Description - ${productName}`, 14, 22);

    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(generatedDescription, 180); 
    doc.text(splitText, 14, 30); 

    // Save the PDF
    doc.save(`product_description_${productName.replace(/\s/g, '-')}.pdf`);
    toast.success('Product description downloaded as PDF!');
  };

  return (
    <div className='panel'>

      {/* Left Panel */}
      <form onSubmit={onSubmitHandler} className="leftPanel">
        <div className='flex items-center gap-3'>
          <Sparkles className="w-5 h-5 text-color_5 animate-sparkle" />
          <h1 className='text-2xl font-semibold'>AI Product Description Generator</h1>
        </div>
        <p className='text-sm text-color_4 mt-1'>
          Craft compelling product descriptions that sell.
        </p>

        {/* Product Name Input */}
        <p className='mt-6 font-medium text-color_4'>Product Name</p>
        <input
          type="text"
          required
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="e.g., 'Smart Coffee Maker X100'"
          className="w-full p-2 mt-2 outline-none text-sm rounded-md border border-color_7/40"
        />

        {/* Key Features/Benefits Input */}
        <p className='mt-6 font-medium text-color_4'>Key Features & Benefits</p>
        <textarea
          rows={5}
          required
          value={keyFeatures}
          onChange={(e) => setKeyFeatures(e.target.value)}
          placeholder="List key features and benefits, e.g., 'One-touch brewing, Self-cleaning, Brews 12 cups, Energy efficient'"
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

        {/* Length Selection */}
        <p className='mt-6 font-medium text-color_4'>Description Length</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {lengths.map((length) => (
            <span
              key={length}
              className={`cursor-pointer px-4 py-2 rounded-md text-sm border transition ${
                selectedLength === length ? 'selectButton' : 'notSelectButton'
              }`}
              onClick={() => setSelectedLength(length)}
            >
              {length.charAt(0).toUpperCase() + length.slice(1)}
            </span>
          ))}
        </div>

        {/* Submit Button */}
        <button type='submit' className='w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 btn2-grad' disabled={loading}>
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Tag className='w-5' />}
          Generate Description
        </button>
      </form>

      {/* Right Panel */}
      <div className='rightPanel'>
        <div className='flex items-center gap-3 justify-between'>
          <div className='flex gap-2 items-center'>
            <Tag className='w-5' />
            <h1 className='text-xl font-semibold'>Generated Description</h1>
          </div>
          <CopyDownloadButtons onCopy={handleCopy} onDownload={handleDownloadPDF} /> 
        </div>
        
        {loading ? (
          <div className='flex-1 flex justify-center items-center'>
            <span className='w-8 h-8 rounded-full border-4 border-t-transparent animate-spin text-color_5'></span>
          </div>
        ) : (
          !generatedDescription ? (
            <div className='flex-1 mt-4 overflow-y-auto text-sm text-color_4 whitespace-pre-line'>
              <div className='text-sm flex flex-col items-center gap-1 justify-center h-full'>
                <Tag className='w-9 text-color_4/60' />
                <p className=' text-sm font-medium text-color_4/60 text-center'>
                  Enter product details and click "Generate Description" to get started.
                </p>
              </div>
            </div>
          ) : (
            <div className='mt-3 h-full overflow-y-scroll text-sm'>
              <div className='reset-tw'>
                <Markdown>
                  {generatedDescription}
                </Markdown>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProductDescriptionGenerator;
