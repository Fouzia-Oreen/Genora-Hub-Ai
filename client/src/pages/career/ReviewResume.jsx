import { FileText, Sparkles, Upload } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import { useAuth } from '@clerk/clerk-react';
import jsPDF from 'jspdf';
import CopyDownloadButtons from '../../components/home/Copy&DownloadButton';


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const CircularProgressBar = ({ score, size = 120, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const [offset, setOffset] = useState(circumference);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let startTimestamp;
    const duration = 1000;

    const animateScore = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      const currentScore = Math.floor(progress * score);
      const currentOffset = circumference - (currentScore / 100) * circumference;

      setDisplayScore(currentScore);
      setOffset(currentOffset);

      if (progress < 1) {
        requestAnimationFrame(animateScore);
      }
    };

    if (score > 0) {
      requestAnimationFrame(animateScore);
    } else {
      setDisplayScore(0);
      setOffset(circumference);
    }

    return () => {};
  }, [score, circumference]);

  const getColor = (s) => {
    if (s >= 80) return '#4CAF50';
    if (s >= 60) return '#FFEB3B';
    if (s >= 40) return '#FF9800';
    return '#F44336';
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="text-gray-300"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="transition-all duration-1000 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={getColor(displayScore)}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <span className="text-2xl font-bold text-color_4">{displayScore}<span className="text-lg">%</span></span>
      </div>
    </div>
  );
};


const ReviewResume = () => {
  const reviewOptions = ['Grammar', 'Tone', 'Formatting', 'Overall'];
  const [resumeFile, setResumeFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [resumeTextPreview, setResumeTextPreview] = useState(''); 
  const [selectedOption, setSelectedOption] = useState('Overall');
  const [reviewOutput, setReviewOutput] = useState('');
  const [performanceScore, setPerformanceScore] = useState(0);
  const [excelFeedback, setExcelFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef();
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error('Please upload a resume file.');
      return;
    }

    setLoading(true);
    setReviewOutput('');
    setPerformanceScore(0);
    setExcelFeedback('');
    setResumeTextPreview(`Processing "${fileName}"... Please wait.`);


    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('selectedOption', selectedOption);

      const { data } = await axios.post(
        '/api/ai/review-resume',
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (data.success) {
        setReviewOutput(data.review_text);
        setPerformanceScore(data.performance_score);
        setExcelFeedback(data.excel_feedback);
        setResumeTextPreview(data.parsed_resume_text);
        toast.success('Resume reviewed successfully!');
      } else {
        toast.error(data.message);
        setResumeTextPreview(`Error processing "${fileName}". Please try again.`); 
      }
    } catch (error) {
      console.error('Error in onSubmitHandler:', error);
      toast.error(error.response?.data?.message || error.message || 'An unexpected error occurred.');
      setResumeTextPreview(`An error occurred while processing "${fileName}".`); 
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setResumeFile(file);

    if (file.type.startsWith('text/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            setResumeTextPreview(event.target.result);
        };
        reader.readAsText(file);
    } else if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setResumeTextPreview(`File selected: "${file.name}". Content will be parsed by the AI after you click "Review My Resume".`);
    } else {
        setResumeTextPreview(`File selected: "${file.name}". Preview not available for this file type. Please upload .txt, .md, .docx, or .pdf.`);
        toast.error('Unsupported file type for preview. Please upload .txt, .md, .docx, or .pdf.');
    }

    // Clear previous results
    setReviewOutput('');
    setPerformanceScore(0);
    setExcelFeedback('');
  };

  const handleCopyReview = () => {
    if (!reviewOutput && !excelFeedback) {
      toast.error('No review to copy.');
      return;
    }
    const fullReview = `Resume Review:\n\n${reviewOutput}\n\nPerformance Score: ${performanceScore}/100\n\nHow to Excel:\n${excelFeedback}`;
    navigator.clipboard.writeText(fullReview)
      .then(() => toast.success('Review copied to clipboard!'))
      .catch(() => toast.error('Failed to copy.'));
  };

  const handleDownloadReview = () => {
    if (!reviewOutput && !excelFeedback) {
      toast.error('No review to download.');
      return;
    }

    const doc = new jsPDF();
    let yPos = 20;

    doc.setFontSize(22);
    doc.text('AI Resume Review', 14, yPos);
    yPos += 10;

    doc.setFontSize(14);
    doc.text(`Performance Score: ${performanceScore}/100`, 14, yPos);
    yPos += 15;

    doc.setFontSize(12);
    doc.text('Detailed Review:', 14, yPos);
    yPos += 7;

    const reviewLines = doc.splitTextToSize(reviewOutput, 180);
    doc.text(reviewLines, 14, yPos);
    yPos += (reviewLines.length * 7) + 10;

    doc.setFontSize(12);
    doc.text('How to Excel:', 14, yPos);
    yPos += 7;

    const feedbackLines = doc.splitTextToSize(excelFeedback, 180);
    doc.text(feedbackLines, 14, yPos);

    doc.save('resume_review.pdf');
    toast.success('Resume review downloaded as PDF!');
  };

  return (
    <div className='panel'>
      {/* Left Panel */}
      <form
        onSubmit={onSubmitHandler}
        className="leftPanel"
      >
        {/* Title */}
        <div className='flex items-center gap-3'>
          <Sparkles className='w-5 h-5 text-color_5 animate-sparkle' />
          <h1 className='text-2xl font-semibold'>AI Resume Reviewer</h1>
        </div>

        {/* File Upload */}
        <div className='mb-4 mt-6'>
          <label className='block font-medium text-color_4 mb-1'>Upload Resume File</label>
          <div
            onClick={() => fileInputRef.current.click()}
            className='w-full p-4 border border-dashed border-color_7/40 rounded-md cursor-pointer flex flex-col items-center justify-center text-center hover:bg-color_9 transition min-h-[100px]'
          >
            {fileName ? (
              <>
                <Upload className='w-6 h-6 text-color_5 mb-2' />
                <p className='text-sm text-color_4'>Loaded: {fileName}</p>
                <p className='text-xs text-color_4/60'>Click to change file</p>
              </>
            ) : (
              <>
                <Upload className='w-6 h-6 text-color_5 mb-2' />
                <p className='text-sm text-color_4 font-medium'>Click to select a file</p>
                <p className='text-xs text-color_4/60'>Supports .txt, .md, .docx, .pdf</p>
              </>
            )}
          </div>
          <input
            type='file'
            accept='.txt,.md,.docx,.pdf'
            ref={fileInputRef}
            onChange={handleFileUpload}
            className='hidden' />
        </div>

        {/* Resume Text Preview */}
        {resumeTextPreview && (
        <>
        <p className='mt-6 font-medium text-color_4'>Resume Content Preview</p>
        <textarea
            rows={7}
            readOnly
            value={resumeTextPreview}
            className="w-full p-3 mt-2 outline-none text-sm rounded-md border border-color_7/40 resize-none bg-gray-50"
            placeholder="Parsed resume text will appear here..."
        />
        </>
        )}


        {/* Review Type Options */}
        <h2 className='font-semibold text-lg mt-6 mb-2 text-color_4'>🎯 Choose Review Type</h2>
        <div className='flex flex-wrap gap-3'>
          {reviewOptions.map((opt) => (
            <span
              key={opt}
              onClick={() => setSelectedOption(opt)}
              className={`cursor-pointer px-4 py-2 rounded-full border text-sm transition ${selectedOption === opt
                  ? 'selectButton'
                  : ' notSelectButton'}`}
            >
              {opt}
            </span>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          className='w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 btn2-grad'
          disabled={loading || !resumeFile}
        >
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <FileText className='w-5' />}
          Review My Resume
        </button>
      </form>

      {/* Right Panel */}
      <div className='rightPanel'>
        <div className='flex items-center gap-3 justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <FileText className='w-5 text-color_4' />
            <h2 className='text-lg font-semibold text-color_4'>Your Review</h2>
          </div>
          {(reviewOutput || excelFeedback) && (
            <CopyDownloadButtons
              onCopy={handleCopyReview}
              onDownload={handleDownloadReview} />
          )}
        </div>

        {loading ? (
          <div className='flex-1 flex justify-center items-center'>
            <span className='w-8 h-8 rounded-full border-4 border-t-transparent animate-spin text-color_5'></span>
          </div>
        ) : (
          (reviewOutput || excelFeedback) ? (
            <div className='flex-1 overflow-y-auto text-sm text-color_4'>
              {/* Performance Score */}
              <div className="flex flex-col items-center justify-center my-6">
                <p className="text-lg font-semibold text-color_4 mb-2">Performance Score</p>
                <CircularProgressBar score={performanceScore} />
              </div>

              {/* Detailed Review */}
              <h3 className="text-md font-semibold text-color_4 mt-4 mb-2">Detailed Review:</h3>
              <div className='reset-tw'>
                <Markdown>{reviewOutput}</Markdown>
              </div>

              {/* How to Excel Feedback */}
              <h3 className="text-md font-semibold text-color_4 mt-6 mb-2">How to Excel:</h3>
              <div className='reset-tw'>
                <Markdown>{excelFeedback}</Markdown>
              </div>
            </div>
          ) : (
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-2 text-color_4/60 h-full justify-center text-center'>
                <FileText className='w-9 text-color_4/60' />
                <p className=' text-sm font-medium text-color_4/60 text-center'>
                  Upload a resume file and click "Review My Resume" to get started.
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ReviewResume;
