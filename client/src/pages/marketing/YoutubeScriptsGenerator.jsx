import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { Sparkles, Video } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import CopyDownloadButtons from '../../components/home/Copy&DownloadButton';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const vibes = ['Professional', 'Friendly', 'Confident', 'Funny', 'Simple'];

const YouTubeScriptGenerator = () => {
  const [topic, setTopic] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('Professional');
  const [script, setScript] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const { getToken } = useAuth(); 

  const generateScript = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error('Please enter a topic.');
      return;
    }

    setLoading(true); 
    setScript(''); 

    try {
      const { data } = await axios.post(
        '/api/ai/generate-youtube-script', 
        {
          topic,
          selectedVibe,
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setScript(data.content);
        toast.success('YouTube script generated successfully!');
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
    if (!script.trim()) {
      toast.error('No script to copy.');
      return;
    }
    navigator.clipboard.writeText(script)
      .then(() => toast.success('Script copied to clipboard!'))
      .catch(() => toast.error('Failed to copy.'));
  };

  const handleDownloadPDF = () => {
    if (!script.trim()) {
      toast.error('No script to download as PDF.');
      return;
    }

    const doc = new jsPDF(); 

    doc.setFontSize(18);
    doc.text(`YouTube Script - ${topic}`, 14, 22);


    doc.setFontSize(14);
    const splitText = doc.splitTextToSize(script, 180); 
    doc.text(splitText, 14, 30); 

    // Save the PDF
    doc.save(`youtube_script_${topic.replace(/\s/g, '-')}.pdf`);
    toast.success('YouTube script downloaded as PDF!');
  };

  return (
    <div className="panel">

      {/* Left Panel */}
      <form onSubmit={generateScript} className="leftPanel">
        <div className='flex items-center gap-3'>
          <Sparkles className="w-5 h-5 text-color_5 animate-sparkle" />
          <h1 className='text-2xl font-semibold'>AI YouTube Script Generator</h1>
        </div>

        {/* Input */}
        <p className='mt-6 font-medium text-color_4'>Enter the topic of your YouTube video</p>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          type="text"
          placeholder='e.g. How to build a brand in 2025'
          className='w-full p-2 mt-2 outline-none text-sm rounded-md border border-color_7/40'
          required
        />

        {/* Vibe Selection */}
        <p className='mt-6 font-medium text-color_4'>Choose a vibe</p>
        <div className='mt-3 flex gap-2 flex-wrap'>
          {vibes.map((vibe) => (
            <span
              key={vibe}
              onClick={() => {
                setSelectedVibe(vibe);
                setScript(''); 
              }}
              className={`${selectedVibe === vibe ? 'selectButton' : 'notSelectButton'}`}
            >
              {vibe}
            </span>
          ))}
        </div>

        {/* Submit */}
        <button className='w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 btn2-grad' disabled={loading}>
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Video className='w-5' />}
          Generate Script
        </button>
      </form>

      {/* Right Panel */}
      <div className='rightPanel'>
        <div className='flex items-center gap-3 justify-between'>
          <div className='flex gap-2 items-center'>
            <Video className='w-5' />
            <h1 className='text-xl font-semibold'>Generated Script</h1>
          </div>
          <CopyDownloadButtons onCopy={handleCopy} onDownload={handleDownloadPDF} /> 
        </div>

        {loading ? (
          <div className='flex-1 flex justify-center items-center'>
            <span className='w-8 h-8 rounded-full border-4 border-t-transparent animate-spin text-color_5'></span>
          </div>
        ) : (
          !script ? (
            <div className='flex-1 overflow-auto mt-6 whitespace-pre-wrap text-sm text-color_4'>
              <div className='text-sm flex flex-col items-center gap-2 text-color_4/60 h-full justify-center text-center'>
                <Video className='w-9 text-color_4/60' />
                <p className=' text-sm font-medium text-color_4/60 text-center'>
                  Enter a topic and select a vibe to <strong>"Generate YouTube Script"</strong> to get started.
                </p>
              </div>
            </div>
          ) : (
            <div className='flex-1 mt-4 overflow-y-auto text-sm text-color_4'>
              <div className='reset-tw'>
                <Markdown>
                  {script}
                </Markdown>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default YouTubeScriptGenerator;
