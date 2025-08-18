import axios from 'axios';
import { Copy, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const CreationItems = ({item, handleDeleteCreation, handleCopyContent }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className='p-4  text-sm bg-color_9 border border-color_6/30 rounded-lg cursor-pointer' onClick={() => setExpanded(!expanded)}>
      <div className='flex items-start justify-between gap-4'>

        <div>
            <h2 className='text-color_4 font-medium max-h-20 overflow-y-auto hide-scrollbar '><strong className='text-base'>Prompt :</strong> {item.prompt}</h2>
        <div className='flex flex-col items-start lg:flex-row lg:items-center mt-2 lg:gap-4 gap-1'>
          <p className='text-xs text-color_4/70  font-semibold'>
            Type : <span className='text-color_5 uppercase'>{item.type.replace(/-/g, ' ').toUpperCase()}</span>
          </p>
          <p className='text-xs text-color_4/70 '>
            Generated At : {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>
        </div>
        <div className="flex gap-2"> 
          <button
            onClick={() => handleCopyContent(item.content)}
            className='p-2 rounded-full bg-color_8/30 hover:bg-color_8/50 transition'
            title='Copy Content'
          >
            <Copy className='w-4 h-4 text-color_4' />
          </button>
          <button
            onClick={() => handleDeleteCreation(item._id)}
            className='p-2 rounded-full bg-red-500/30 hover:bg-red-500/50 transition'
            title='Delete Creation'
          >
            <Trash2 className='w-4 h-4 text-red-500' />
          </button>
        </div>
      </div>
      <p className='text-color_4/70 border-t border-color_6/30  font-medium capitalize mt-2 pt-2'> Generated Content</p>
      {
        expanded && (
            <div>
            {item.type.startsWith('image') ? (
              <div className="flex justify-center items-center  p-2 rounded-md">
                <img src={item.content} alt="Generated" className="max-w-full h-auto max-h-60 object-contain rounded-md" />
              </div>
            ) : (
              <div className='text-sm text-color_4/90 bg-color_8/10 py-3 rounded-md h-40 overflow-y-auto hide-scrollbar break-words cursor-pointer mt-2'>
                <Markdown>{item.content}</Markdown>
              </div>
            )}
            </div>
        )
      }
    </div>
  )
}

export default CreationItems
