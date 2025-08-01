import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { Sparkles, SpellCheck } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import CopyDownloadButtons from '../../components/home/Copy&DownloadButton';


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GrammarRewriter = () => {
  const actions = ['check grammar', 'rephrase', 'simplify'];
  const tones = ['professional', 'friendly', 'formal', 'casual', 'empathetic'];

  const [inputText, setInputText] = useState('');
  const [selectedAction, setSelectedAction] = useState('check grammar');
  const [selectedTone, setSelectedTone] = useState('professional'); 
  const [processedText, setProcessedText] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) {
      toast.error('Please paste text to process.');
      return;
    }
    if (selectedAction !== 'check grammar' && !selectedTone) {
      toast.error('Please select a tone for rephrase or simplify.');
      return;
    }

    setLoading(true); 
    setProcessedText(''); 

    try {
      const { data } = await axios.post(
        '/api/ai/process-grammar-rewrite', 
        {
          inputText,
          selectedAction,
          selectedTone: selectedAction === 'check grammar' ? undefined : selectedTone, 
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success === true) {
        setProcessedText(data.content); 
        toast.success('Text processed successfully!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error processing text:', error);
      toast.error(error.response?.data?.message || error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false); 
    }
  };

  const handleCopy = () => {
    if (!processedText.trim()) {
      toast.error('No text to copy.');
      return;
    }
    navigator.clipboard.writeText(processedText)
      .then(() => toast.success('Text copied to clipboard!'))
      .catch(() => toast.error('Failed to copy.'));
  };


  const handleDownloadPDF = () => {
      if (!processedText.trim()) {
        toast.error('No article to download as PDF.');
        return;
      }

      const doc = new jsPDF(); 
      doc.setFontSize(18);
      doc.text(`Generated Article: ${inputText}`, 14, 22);

      doc.setFontSize(14);
      // splitTextToSize is a great way to handle long text
      const splitText = doc.splitTextToSize(processedText, 180);
      doc.text(splitText, 14, 30); 

      // Save the PDF using the article topic in the filename
      doc.save(`article_${inputText.substring(0, 30).replace(/\s/g, '_')}.pdf`);
      toast.success('Article downloaded as PDF!');
  };

  return (
    <div className='panel'>

      {/* Left Panel */}
      <form onSubmit={onSubmitHandler} className="leftPanel">
        <div className='flex items-center gap-3'>
          <Sparkles className="w-5 h-5 text-color_5 animate-sparkle" />
          <h1 className='text-2xl font-semibold'>AI Grammar & Rewriter</h1>
        </div>
        <p className='text-sm text-color_4 mt-1'>
          Improve your writing with grammar checks and rephrasing options.
        </p>

        {/* Input Text */}
        <p className='mt-6 font-medium text-color_4'>Paste Your Text</p>
        <textarea
          rows={10}
          required
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste the text you want to check or rewrite here..."
          className="w-full p-3 mt-2 outline-none text-sm rounded-md border border-color_7/40 resize-none"
        />

        {/* Action Selection */}
        <p className='mt-6 font-medium text-color_4'>Choose Action</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {actions.map((action) => (
            <span
              key={action}
              className={`cursor-pointer px-4 py-2 rounded-md text-sm border transition ${
                selectedAction === action ? 'selectButton' : 'notSelectButton'
              }`}
              onClick={() => {
                setSelectedAction(action);
                setProcessedText(''); 
              }}
            >
              {action.charAt(0).toUpperCase() + action.slice(1)}
            </span>
          ))}
        </div>

        {(selectedAction === 'rephrase' || selectedAction === 'simplify') && (
          <>
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
          </>
        )}

        {/* Submit Button */}
        <button type='submit' className='w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 btn2-grad' disabled={loading}>
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <SpellCheck className='w-5' />}
          Process Text
        </button>
      </form>

      {/* Right Panel */}
      <div className='rightPanel'>
        <div className='flex items-center gap-3 justify-between'>
          <div className='flex gap-2 items-center'>
            <SpellCheck className='w-5' />
            <h1 className='text-xl font-semibold'>Processed Text</h1>
          </div>
          <CopyDownloadButtons onCopy={handleCopy} onDownload={handleDownloadPDF} />
        </div>
        

        {loading ? (
          <div className='flex-1 flex justify-center items-center'>
            <span className='w-8 h-8 rounded-full border-4 border-t-transparent animate-spin text-color_5'></span>
          </div>
        ) : (
          !processedText ? (
            <div className='flex-1 mt-4 overflow-y-auto text-sm text-color_4 whitespace-pre-line'>
              <div className='text-sm flex flex-col items-center gap-1 justify-center h-full'>
                <SpellCheck className='w-9 text-color_4/60' />
                <p className=' text-sm font-medium text-color_4/60 text-center'>
                  Paste text and click "Process Text" to get started.
                </p>
              </div>
            </div>
          ) : (
            <div className='mt-3 h-full overflow-y-scroll text-sm'>
              <div className='reset-tw'>
                <Markdown>
                  {processedText}
                </Markdown>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GrammarRewriter;

