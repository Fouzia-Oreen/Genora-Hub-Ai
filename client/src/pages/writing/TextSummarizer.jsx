import { AlignJustify, Sparkles } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios'; 
import toast from 'react-hot-toast'; 
import Markdown from 'react-markdown'; 
import { useAuth } from '@clerk/clerk-react'; 
import { jsPDF } from 'jspdf'; 
import CopyDownloadButtons from '../../components/home/Copy&DownloadButton';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const TextSummarizer = () => {
  const summaryLengths = ['short', 'medium', 'long'];
  const [inputText, setInputText] = useState('');
  const [selectedLength, setSelectedLength] = useState('medium');
  const [summary, setSummary] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const { getToken } = useAuth(); 

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) {
      toast.error('Please paste text to summarize.');
      return;
    }

    setLoading(true); 
    setSummary(''); 

    try {
      const { data } = await axios.post(
        '/api/ai/summarize-text', 
        {
          inputText,
          selectedLength,
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success === true) {
        setSummary(data.content); 
        toast.success('Text summarized successfully!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error summarizing text:', error);
      toast.error(error.response?.data?.message || error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false); 
    }
  };

  const handleCopy = () => {
    if (!summary.trim()) {
      toast.error('No summary to copy.');
      return;
    }
    navigator.clipboard.writeText(summary)
      .then(() => toast.success('Summary copied to clipboard!'))
      .catch(() => toast.error('Failed to copy.'));
  };


  const handleDownloadPDF = () => {
    if (!summary.trim()) {
      toast.error('No summary to download as PDF.');
      return;
    }

    const doc = new jsPDF(); 

    doc.setFontSize(18);
    doc.text(`Generated ${selectedLength} Summary`, 14, 22);


    doc.setFontSize(14);

    const splitText = doc.splitTextToSize(summary, 180);
    doc.text(splitText, 14, 30); 

    // Save the PDF
    doc.save(`summary_${selectedLength}.pdf`);
    toast.success('Summary downloaded as PDF!');
  };

  return (
    <div className='panel'>

      {/* Left Panel */}
      <form onSubmit={onSubmitHandler} className="leftPanel">
        <div className='flex items-center gap-3'>
          <Sparkles className="w-5 h-5 text-color_5 animate-sparkle" />
          <h1 className='text-2xl font-semibold'>AI Text Summarizer</h1>
        </div>
        <p className='text-sm text-color_4 mt-1'>
          Condense long texts into concise summaries.
        </p>

        {/* Input Text */}
        <p className='mt-6 font-medium text-color_4'>Paste Your Text</p>
        <textarea
          rows={10}
          required
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste the text you want to summarize here..."
          className="w-full p-3 mt-2 outline-none text-sm rounded-md border border-color_7/40 resize-none"
        />

        {/* Summary Length Selection */}
        <p className='mt-6 font-medium text-color_4'>Summary Length</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {summaryLengths.map((length) => (
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
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <AlignJustify className='w-5' />}
          Summarize Text
        </button>
      </form>

      {/* Right Panel */}
      <div className='rightPanel'>
        <div className='flex items-center gap-3 justify-between'>
          <div className='flex gap-2 items-center'>
            <AlignJustify className='w-5' />
            <h1 className='text-xl font-semibold'>Generated Summary</h1>
          </div>
          <CopyDownloadButtons onCopy={handleCopy} onDownload={handleDownloadPDF} /> 
        </div>
        
        {loading ? (
          <div className='flex-1 flex justify-center items-center'>
            <span className='w-8 h-8 rounded-full border-4 border-t-transparent animate-spin text-color_5'></span>
          </div>
        ) : (
          !summary ? (
            <div className='flex-1 mt-4 overflow-y-auto text-sm text-color_4 whitespace-pre-line'>
              <div className='text-sm flex flex-col items-center gap-1 justify-center h-full'>
                <AlignJustify className='w-9 text-color_4/60' />
                <p className=' text-sm font-medium text-color_4/60 text-center'>
                  Paste text and click "Summarize Text" to get started.
                </p>
              </div>
            </div>
          ) : (
            <div className='mt-3 h-full overflow-y-scroll text-sm'>
              <div className='reset-tw'>
                <Markdown>
                  {summary}
                </Markdown>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TextSummarizer;
