import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
import Input from './Input'

const CreateResumeForm = ({ setOpenCreateModal }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const handleCreateResume = async (e) => {
    e.preventDefault();

    if (!title) {
      setError("Please enter a resume title");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post('/api/resume', { title }, { headers: { Authorization: `Bearer ${await getToken()}`}});

      if (data.success === true) {
        toast.success("Resume created successfully!");
        if (data.resume && data.resume._id) {
          setOpenCreateModal(false);
          navigate(`/ai/resume/${data.resume._id}`);
        } else {
          toast.error("Resume ID not found in response.");
          setError("Resume ID not found in response.");
        }
      } else {
        toast.error(data.message);
        setError(data.message);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong");
      }
      toast.error("Failed to create resume.");
    } finally {
      setLoading(false);
    };
  }

  return (
    <div className='md:w-[90vw] md:[70vh] p-4 flex-col justify-center '>
      <h3 className='text-lg font-semibold text-color_4'>Create New Resume</h3>
      <p className='text-xs text-color_1/70 mt[5px] my-1'>Give your resume a title to get started. You can edit all details later </p>
      <form onSubmit={handleCreateResume}>
        <Input 
          value={title}
          onChange={(text) => setTitle(text)}
          label="Resume Title"
          placeholder="Eg: Mike's Resume"
          type='text' />
        {error && <p className='text-red-600 text-xs pb-2.5'>{error}</p>}
        <button type='submit' className='bg-gradient-3 px-4 py-1.5 rounded-full text-color_9 mt-2 text-sm'>Create Resume</button>
      </form>
    </div>
  )
}


export default CreateResumeForm

