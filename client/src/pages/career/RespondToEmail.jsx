import { useAuth } from '@clerk/clerk-react'; 
import axios from 'axios'; 
import { jsPDF } from 'jspdf'; 
import { Mail, Sparkles } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast'; 
import Markdown from 'react-markdown'; 
import CopyDownloadButtons from '../../components/home/Copy&DownloadButton'; 

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RespondToEmail = () => {
  const tones = ['professional', 'friendly', 'concise', 'empathetic'];
  const [emailText, setEmailText] = useState('');
  const [tone, setTone] = useState('professional');
  const [response, setResponse] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const { getToken } = useAuth(); 

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!emailText.trim()) {
      toast.error('Please paste the email text.');
      return;
    }

    setLoading(true); 
    setResponse(''); 

    try {
      const { data } = await axios.post(
        '/api/ai/generate-email-response', 
        {
          emailText,
          tone,
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setResponse(data.content);
        toast.success('Email response generated successfully!');
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
    if (!response.trim()) {
      toast.error('No response to copy.');
      return;
    }
    navigator.clipboard.writeText(response)
      .then(() => toast.success('Response copied to clipboard!'))
      .catch(() => toast.error('Failed to copy.'));
  };


  const handleDownloadPDF = () => {
    if (!response.trim()) {
      toast.error('No response to download as PDF.');
      return;
    }

    const doc = new jsPDF(); 

    doc.setFontSize(18);
    doc.text(`Email Response (${tone} tone)`, 14, 22);

    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(response, 180); 
    doc.text(splitText, 14, 30);

    // Save the PDF
    doc.save(`email_response_${tone}.pdf`);
    toast.success('Email response downloaded as PDF!');
  };

  return (
    <div className='panel'>
      {/* Left Panel */}
      <form onSubmit={onSubmitHandler} className="leftPanel">
        <div className='flex items-center gap-3'>
          <Sparkles className="w-5 h-5 text-color_5 animate-sparkle" />
          <h1 className='text-2xl font-semibold'>AI Email Response Generator</h1>
        </div>

        {/* Input Email */}
        <p className='mt-6 font-medium text-color_4'>Paste Your Email</p>
        <textarea
          rows={7}
          required
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
          placeholder="Paste the email you received here..."
          className="w-full p-3 mt-2 outline-none text-sm rounded-md border border-color_7/40 resize-none"
        />

        {/* Tone Selection using Span */}
        <p className='mt-6 font-medium text-color_4'>Select Response Tone</p>
        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {tones.map((item, index) => (
            <span
              key={index}
              className={`cursor-pointer px-4 py-2 rounded-md text-sm border transition ${
                tone === item ? 'selectButton' : 'notSelectButton'
              }`}
              onClick={() => {
                setTone(item);
                setResponse('');
              }}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </span>
          ))}
        </div>

        {/* Submit Button */}
        <button className='w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 btn2-grad' disabled={loading}>
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Mail className='w-5' />}
          Generate Response
        </button>
      </form>

      {/* Right Panel: Generated Response */}
      <div className='rightPanel'>
        <div className='flex items-center gap-3 justify-between'>
          <div className='flex gap-2 items-center'>
            <Mail className='w-5' />
            <h1 className='text-xl font-semibold'>Generated Response</h1>
          </div>
          <CopyDownloadButtons onCopy={handleCopy} onDownload={handleDownloadPDF} /> 
        </div>
        
        {loading ? (
          <div className='flex-1 flex justify-center items-center'>
            <span className='w-8 h-8 rounded-full border-4 border-t-transparent animate-spin text-color_5'></span>
          </div>
        ) : (
          !response ? (
            <div className='flex-1 mt-4 overflow-y-auto text-sm text-color_4 whitespace-pre-line'>
              <div className='text-sm flex flex-col items-center gap-1 justify-center h-full'>
                <Mail className='w-9 text-color_4/60' />
                <p className=' text-sm font-medium text-color_4/60'>
                  Paste an email and click "Generate Response"
                </p>
              </div>
            </div>
          ) : (
            <div className='mt-3 h-full overflow-y-scroll text-sm'>
              <div className='reset-tw'>
                <Markdown>
                  {response}
                </Markdown>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default RespondToEmail;
