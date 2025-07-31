import { Hash, Sparkles, Text } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios'
import toast from 'react-hot-toast'
import Markdown from 'react-markdown'
import { useAuth } from '@clerk/clerk-react';
import jsPDF from 'jspdf';
import CopyDownloadButtons from '../../components/home/Copy&DownloadButton';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
const BlogGenerator = () => {
  const tabs = ['Title', 'Desc'];
  const blogCategories = ['General', 'Technology', 'Business', 'Health', 'Education', 'Lifestyle', 'Travel', 'Food'];

  const [activeTab, setActiveTab] = useState('Title');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [input, setInput] = useState('');
  const [descLength, setDescLength] = useState(140);
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const {getToken} = useAuth()
  

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error('Please enter a keyword.');
      return;
    }

    setLoading(true);
    setContent(''); 

    try {
      let finalPromptForAI = '';


      if (activeTab === 'Title') {
        finalPromptForAI = `Generate 3 catchy blog post titles about "${input}" in the "${selectedCategory}" category.`;
      } else { 
        finalPromptForAI = `Write a comprehensive blog post description of approximately ${descLength} words about "${input}" in the "${selectedCategory}" category.`;
      }

      const { data } = await axios.post(
        '/api/ai/generate-blog',
        {
          prompt: finalPromptForAI,   
          tab: activeTab,  
          category: selectedCategory, 
          descLength: activeTab === 'Desc' ? descLength : undefined,
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success === true) {
        setContent(data.content); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error generating blog content:', error);
      toast.error(error.response?.data?.message || error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };


  const handleCopyAll = () => {
    if (!content.trim()) {
      toast.error('No generated results to copy.');
      return;
    }
    navigator.clipboard.writeText(content)
      .then(() => toast.success('Generated results copied to clipboard!'))
      .catch(() => toast.error('Failed to copy.'));
  };


  const handleDownloadPDF = () => {
    if (!content.trim()) {
      toast.error('No content to download as PDF.');
      return;
    }

    const doc = new jsPDF(); 


    doc.setFontSize(18);
    doc.text(`${activeTab === 'Title' ? 'Generated Blog Titles' : 'Generated Blog Post Description'}`, 14, 22);

    // Add content
    doc.setFontSize(14);
    const splitText = doc.splitTextToSize(content, 180); 
    doc.text(splitText, 14, 30); 

    // Save the PDF
    doc.save(`${activeTab.toLowerCase()}_results.pdf`);
    toast.success('Content downloaded as PDF!');
  };


  return (
    <div className='panel'>

      {/* left panel */}
      <form onSubmit={onSubmitHandler} className="leftPanel">
        {/* Header */}
        <div className='flex items-center gap-3'>
          <Sparkles className="w-5 h-5 text-color_5 animate-sparkle" />
          <h1 className='text-2xl font-semibold '>
            {activeTab === 'Title' ? 'AI Blog Title Generator' : 'AI Blog Description Generator'}
          </h1>
        </div>
        {/* Tabs */}
        <div className='flex flex-col gap-1 my-5'>
        <p className='text-sm'>Select one</p>
        <div className='flex gap-2 '>
          {tabs.map((tab) => (
            <button
              key={tab}
              type='button'
              onClick={() => setActiveTab(tab)}
              className={` ${activeTab === tab ? 'selectButton' : 'notSelectButton'}`}
            >
              {tab === 'Title' ? 'Generate Title' : 'Generate Description'}
            </button>
          ))}
        </div>
        </div>

        {/* Input */}
        <p className='mt-6 font-medium text-color_4'>Keyword</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder='The future of artificial intelligence is ...'
          className='w-full p-2 mt-2 outline-none text-sm rounded-md border border-color_7/40'
          required
        />

        {/* Category */}
        <p className='mt-6 font-medium text-color_4'>Category</p>
        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {blogCategories.map((item, index) => (
            <span
              key={index}
              className={` ${selectedCategory === item ? 'selectButton' : 'notSelectButton'}`}
              onClick={() => setSelectedCategory(item)}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Word Count Slider for Description tab */}
        {activeTab === 'Desc' && (
          <>
            <p className='mt-6 font-medium text-color_4'>Word Count</p>
            <input
              type='range'
              min={100} 
              max={1200} 
              value={descLength} 
              onChange={(e) => setDescLength(Number(e.target.value))}
              className='slider'
            />
            <p className='text-sm mt-1 text-color_4'>{descLength} words</p>
          </>
        )}

        {/* Submit */}
        <button className='w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 btn2-grad' disabled={loading}>
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Hash className='w-5' />} {activeTab === 'Title' ? 'Generate AI Title' : 'Generate Meta Description'}
        </button>
      </form>

      {/* Right panel */}
      <div className='rightPanel'>
        <div className='flex items-center gap-3 justify-between'>
          <div className='flex gap-2 items-center'>
          {activeTab === 'Title' ? <Hash className='w-5' /> : <Text className='w-5' />}
          <h1 className='text-xl font-semibold'>
            {activeTab === 'Title' ? 'Generated AI Title' : 'Generated Meta Description'}
          </h1>
          </div>
          <CopyDownloadButtons
            onCopy={handleCopyAll}
            onDownload={handleDownloadPDF}
          />
        </div>

        {loading ? (
          <div className='flex-1 flex justify-center items-center'>
            <span className='w-8 h-8 rounded-full border-4 border-t-transparent animate-spin text-color_5'></span>
          </div>
        ) : (
          !content ? (
            <div className='flex-1 overflow-auto mt-6'>
              <div className='text-sm flex flex-col items-center gap-2 justify-center h-full text-color_4/60'>
                {activeTab === 'Title' ? <Hash className='w-5' /> : <Text className='w-5' />}
                <p className='text-center'>
                  {activeTab === 'Title'
                    ? 'Enter a keyword and click "Generate AI Title" to get started'
                    : 'Enter a keyword and click "Generate Meta Description" to get started'}
                </p>
              </div>
            </div>
          ) : (
            <div className='mt-3 h-full overflow-y-scroll text-sm'>
              <div className='reset-tw'>
                <Markdown>
                  {content}
                </Markdown>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BlogGenerator;
