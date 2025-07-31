import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import jsPDF from 'jspdf'
import { Edit, Sparkles } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Markdown from 'react-markdown'
import CopyDownloadButtons from '../../components/home/Copy&DownloadButton'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const WriteArticle = () => {
  const articleLength = [
    {length: 800, text: 'Short (500-800 words)'},
    {length: 1200, text: 'Medium (800-1200 words)'},
    {length: 1600, text: 'Long (1200-1600 words)'},
  ]
  const [selectedLength, setSelectedLength] = useState(articleLength[0])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [article, setArticle] = useState(''); 

  const {getToken} = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const prompt =`Write an article about ${input} in ${selectedLength.text}`

      const {data} = await axios.post('/api/ai/generate-article', {prompt, length: selectedLength.length}, {headers : {Authorization: `Bearer ${await getToken()}`}})

      if (data.success === true) {
        setArticle(data.content)
      }else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const handleCopy = () => {
    if (!article.trim()) {
      toast.error('No summary to copy.');
      return;
    }
    navigator.clipboard.writeText(article)
      .then(() => toast.success('Summary copied to clipboard!'))
      .catch(() => toast.error('Failed to copy.'));
  };


  const handleDownloadPDF = () => {
    if (!article.trim()) {
      toast.error('No summary to download as PDF.');
      return;
    }

    const doc = new jsPDF(); 

    doc.setFontSize(18);
    doc.text(`Generated ${selectedLength} Article`, 14, 22);


    doc.setFontSize(14);

    const splitText = doc.splitTextToSize(article, 180);
    doc.text(splitText, 14, 30); 

    // Save the PDF
    doc.save(`summary_${selectedLength}.pdf`);
    toast.success('Summary downloaded as PDF!');
  };

  return (
    <div className='panel'>
      {/* left panel */}
      <form onSubmit={onSubmitHandler} className="leftPanel">
        <div className='flex items-center gap-3'>
        <Sparkles className="w-5 h-5 text-color_5 animate-sparkle" />
        <h1 className='text-2xl font-semibold'>Article Configuration</h1>
        </div>
        <p className='mt-6  font-medium text-color_4'>Article Topic</p>
        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='The future of artificial intelligence is ...' className='w-full p-2 mt-2 outline-none text-sm rounded-md border border-color_7/40 ' required/>
        <p className='mt-6 font-medium text-color_4'>Article Length</p>
        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {
            articleLength.map((item,index) => (
              <span key={index} className={` ${selectedLength.text === item.text ? 'selectButton' : 'notSelectButton'}`} onClick={()=> setSelectedLength(item)}>{item.text}</span>
            ))
          }
        </div>
        <br/>
        <button className='w-full flex items-center justify-center gap-2 px-4 py-2 mt-6  btn2-grad' disabled={loading}>
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Edit className='w-5'/> } Generate Article
        </button>
      </form>
      {/* right col */}
      <div className='rightPanel'>
          <div className='flex items-center gap-3 justify-between'>
          <div className='flex gap-2 items-center'>
            <Edit className='w-5'/>
            <h1 className='text-xl font-semibold'>Generated Article</h1>
          </div>
          <CopyDownloadButtons onCopy={handleCopy} onDownload={handleDownloadPDF} />
        </div>
          {
            !article ? (
            <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-2 '>
              <Edit className='w-9 text-color_4/60'/>
              <p className=' text-sm font-medium text-color_4/60'>Enter a topic and click "Generate article" to get started</p>
            </div>
            </div>
            ) : (
            <div className='mt-3 h-full overflow-y-scroll text-sm'>
            <div className='reset-tw'>
              <Markdown>
                {article}
              </Markdown>
            </div>
            </div>
            )
          }

      </div>
    </div>
  )
}

export default WriteArticle
