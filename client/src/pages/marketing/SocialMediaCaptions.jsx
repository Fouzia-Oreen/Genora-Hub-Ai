/* eslint-disable no-unused-vars */
import { Facebook, Instagram, Linkedin, MessageCircle, Sparkles, Twitter, Youtube } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios'; 
import toast from 'react-hot-toast'; 
import Markdown from 'react-markdown'; 
import { useAuth } from '@clerk/clerk-react'; 
import { jsPDF } from 'jspdf'; 
import CopyDownloadButtons from '../../components/home/Copy&DownloadButton';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const SocialMediaCaptions = () => {
  const platforms = [
    { name: 'Instagram', color: '#E1306C', icon: Instagram },
    { name: 'Twitter', color: '#1DA1F2', icon: Twitter },
    { name: 'LinkedIn', color: '#0077B5', icon: Linkedin },
    { name: 'YouTube', color: '#FF0000', icon: Youtube },
    { name: 'Facebook', color: '#1877F2', icon: Facebook },
  ];
  const platformRules = {
    Instagram: { maxLength: 2200, maxHashtags: 30 },
    Twitter: { maxLength: 280, maxHashtags: 5 },
    LinkedIn: { maxLength: 1300, maxHashtags: 5 },
    YouTube: { maxLength: 5000, maxHashtags: 15 },
    Facebook: { maxLength: 63206, maxHashtags: 30 },
  };

  const voiceTones = ['Curious', 'Professional', 'Playful', 'Witty', 'Inspirational'];

  const [input, setInput] = useState(''); 
  const [selectedPlatform, setSelectedPlatform] = useState('Instagram');
  const [selectedTone, setSelectedTone] = useState('Curious');
  const [wordCount, setWordCount] = useState(60); 
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [generatedCaption, setGeneratedCaption] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const { getToken } = useAuth(); 

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error('Please enter a prompt.');
      return;
    }

    setLoading(true);
    setGeneratedCaption(''); 

    try {
      const { data } = await axios.post(
        '/api/ai/generate-social-caption', 
        {
          prompt: input,
          selectedPlatform,
          selectedTone,
          wordCount,
          includeEmojis,
          includeHashtags,
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setGeneratedCaption(data.content);
        toast.success('Caption generated successfully!');
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
    if (!generatedCaption.trim()) {
      toast.error('No caption to copy.');
      return;
    }
    navigator.clipboard.writeText(generatedCaption)
      .then(() => toast.success('Caption copied to clipboard!'))
      .catch(() => toast.error('Failed to copy.'));
  };


  const handleDownloadPDF = () => {
    if (!generatedCaption.trim()) {
      toast.error('No caption to download as PDF.');
      return;
    }

    const doc = new jsPDF(); 

    doc.setFontSize(18);
    doc.text(`Social Media Caption - ${selectedPlatform}`, 14, 22);

    // Add content
    doc.setFontSize(14);
    const splitText = doc.splitTextToSize(generatedCaption, 180); 
    doc.text(splitText, 14, 30); 

    // Save the PDF
    doc.save(`social_caption_${selectedPlatform.toLowerCase()}.pdf`);
    toast.success('Caption downloaded as PDF!');
  };

  return (
    <div className='panel'>
      {/* Left Panel */}
      <form
        onSubmit={onSubmitHandler}
        className='leftPanel'
      >
        <div className='flex items-center gap-3'>
          <Sparkles className='w-5 h-5 text-color_5 animate-sparkle' />
          <h1 className='text-2xl font-semibold'>Social Caption Generator</h1>
        </div>
        <p className='text-sm text-color_4 mt-1'>
          Choose platform and style to generate an engaging social media caption.
        </p>

        {/* Prompt */}
        <p className='mt-6 font-medium text-color_4'>Your Prompt</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type='text'
          placeholder='Enter your prompt ...'
          className='w-full p-2 mt-2 outline-none text-sm rounded-md border border-color_7/40'
          required
        />

        {/* Platform */}
        <p className='mt-6 font-medium text-color_4'>Platform</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {platforms.map(({ name, color, icon: Icon }) => (
            <span
              key={name}
              onClick={() => {
                setSelectedPlatform(name);
                setGeneratedCaption(''); 
              }}
              style={{
                borderColor: selectedPlatform === name ? color : '#17255468',
                color: selectedPlatform === name ? color : '#666',
                backgroundColor: selectedPlatform === name ? `${color}20` : 'transparent',
                fontWeight: selectedPlatform === name ? 600 : 400,
              }}
              className='text-sm px-4 py-1 border rounded-full cursor-pointer flex items-center gap-2 transition-all'
            >
              <Icon className='w-4 h-4' />
              {name}
            </span>
          ))}
        </div>

        {/* Tone Selection */}
        <p className='mt-6 font-medium text-color_4'>Select Tone</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {voiceTones.map((tone) => (
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

        {/* Word Count Slider */}
        <p className='mt-6 font-medium text-color_4'>Word Count</p>
        <input
          type='range'
          min={20}
          max={150}
          value={wordCount}
          onChange={(e) => setWordCount(Number(e.target.value))}
          className='slider'
        />
        <p className='text-sm mt-1 text-color_4'>{wordCount} words</p>

        {/* Checkboxes */}
        <div className='mt-6 flex gap-4 items-center'>
          <label className='text-sm flex gap-2 items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={includeEmojis}
              onChange={() => setIncludeEmojis(!includeEmojis)}
              className={`size-5 rounded-sm border border-color_7/40 appearance-none cursor-pointer transition
                ${includeEmojis ? 'bg-color_8/60 ring-1 ring-color_8' : 'bg-color_9'}`}
            />
            Include Emojis
          </label>

          <label className='text-sm flex gap-2 items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={includeHashtags}
              onChange={() => setIncludeHashtags(!includeHashtags)}
              className={`size-5 rounded-sm border border-color_7/40 appearance-none cursor-pointer transition
                ${includeHashtags ? 'bg-color_8/60 ring-1 ring-color_8' : 'bg-color_9'}`}
            />
            Include Hashtags
          </label>
        </div>
        <p className='text-xs text-color_10 mt-3'>
          {selectedPlatform} limit: {platformRules[selectedPlatform].maxLength} characters, {platformRules[selectedPlatform].maxHashtags} hashtags.
        </p>
        {/* Submit */}
        <button
          type='submit'
          className='w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 btn2-grad'
          disabled={loading} 
        >
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <MessageCircle className='w-5' />}
          Generate Caption
        </button>
      </form>

      {/* Right Panel */}
      <div className='rightPanel'>
        <div className='flex items-center gap-3 justify-between'>
          <div className='flex gap-2 items-center'>
            <MessageCircle className='w-5' />
            <h1 className='text-xl font-semibold'>Generated Caption</h1>
          </div>
          <CopyDownloadButtons onCopy={handleCopy}  />
        </div>


        {loading ? (
          <div className='flex-1 flex justify-center items-center'>
            <span className='w-8 h-8 rounded-full border-4 border-t-transparent animate-spin text-color_5'></span>
          </div>
        ) : (
          !generatedCaption ? (
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-2'>
                <MessageCircle className='w-9 text-color_4/60' />
                <p className=' text-sm font-medium text-color_4/60 text-center'>
                  Enter a prompt and click <strong>"Generate Caption"</strong> to get started.
                </p>
              </div>
            </div>
          ) : (
            <div className='flex-1 mt-4 overflow-y-auto text-sm text-color_4 whitespace-pre-line'>
              <div className='reset-tw'>
                <Markdown>
                  {generatedCaption}
                </Markdown>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SocialMediaCaptions;
