import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { FileText, Sparkles } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import CopyDownloadButtons from '../../components/home/Copy&DownloadButton';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const CoverLetterGenerator = () => {
  const tones = ['professional', 'friendly', 'formal', 'confident', 'enthusiastic'];

  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const { getToken } = useAuth(); 

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast.error('Please provide both resume text and job description.');
      return;
    }

    setLoading(true); 
    setGeneratedCoverLetter(''); 

    try {
      const { data } = await axios.post(
        '/api/ai/generate-cover-letter', 
        {
          resumeText,
          jobDescription,
          selectedTone,
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success === true) {
        setGeneratedCoverLetter(data.content); 
        toast.success('Cover letter generated successfully!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast.error(error.response?.data?.message || error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false); 
    }
  };

  const handleCopy = () => {
    if (!generatedCoverLetter.trim()) {
      toast.error('No cover letter to copy.');
      return;
    }
    navigator.clipboard.writeText(generatedCoverLetter)
      .then(() => toast.success('Cover letter copied to clipboard!'))
      .catch(() => toast.error('Failed to copy.'));
  };

  const handleDownloadPDF = () => {
    if (!generatedCoverLetter.trim()) {
      toast.error('No cover letter to download as PDF.');
      return;
    }

    const doc = new jsPDF(); 

    doc.setFontSize(18);
    doc.text(`Generated Cover Letter (${selectedTone} tone)`, 14, 22);

    doc.setFontSize(12);

    const splitText = doc.splitTextToSize(generatedCoverLetter, 180); 
    doc.text(splitText, 14, 30); 

    // Save the PDF
    doc.save(`cover_letter_${selectedTone}.pdf`);
    toast.success('Cover letter downloaded as PDF!');
  };

  return (
    <div className='panel'>

      {/* Left Panel */}
      <form onSubmit={onSubmitHandler} className="leftPanel">
        <div className='flex items-center gap-3'>
          <Sparkles className="w-5 h-5 text-color_5 animate-sparkle" />
          <h1 className='text-2xl font-semibold'>AI Cover Letter Generator</h1>
        </div>
        <p className='text-sm text-color_4 mt-1'>
          Generate personalized cover letters for your job applications.
        </p>

        {/* Resume Text Input */}
        <p className='mt-6 font-medium text-color_4'>Paste Your Resume Text</p>
        <textarea
          rows={7}
          required
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume content here (key skills, experience, etc.)..."
          className="w-full p-3 mt-2 outline-none text-sm rounded-md border border-color_7/40 resize-none"
        />

        {/* Job Description Input */}
        <p className='mt-6 font-medium text-color_4'>Paste Job Description</p>
        <textarea
          rows={7}
          required
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full p-3 mt-2 outline-none text-sm rounded-md border border-color_7/40 resize-none"
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

        {/* Submit Button */}
        <button type='submit' className='w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 btn2-grad' disabled={loading}>
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <FileText className='w-5' />}
          Generate Cover Letter
        </button>
      </form>

      {/* Right Panel */}
      <div className='rightPanel'>
        <div className='flex items-center gap-3 justify-between'>
          <div className='flex gap-2 items-center'>
            <FileText className='w-5' />
            <h1 className='text-xl font-semibold'>Generated Cover Letter</h1>
          </div>
          <CopyDownloadButtons onCopy={handleCopy} onDownload={handleDownloadPDF} /> 
        </div>  
        {loading ? (
          <div className='flex-1 flex justify-center items-center'>
            <span className='w-8 h-8 rounded-full border-4 border-t-transparent animate-spin text-color_5'></span>
          </div>
        ) : (
          !generatedCoverLetter ? (
            <div className='flex-1 mt-4 overflow-y-auto text-sm text-color_4 whitespace-pre-line'>
              <div className='text-sm flex flex-col items-center gap-1 justify-center h-full'>
                <FileText className='w-9 text-color_4/60' />
                <p className=' text-sm font-medium text-color_4/60 text-center'>
                  Paste your resume and job description, then click "Generate Cover Letter" to get started.
                </p>
              </div>
            </div>
          ) : (
            <div className='mt-3 h-full overflow-y-scroll text-sm'>
              <div className='reset-tw'>
                <Markdown>
                  {generatedCoverLetter}
                </Markdown>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CoverLetterGenerator;