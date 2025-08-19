/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { Gem, LucideBriefcase, Sparkles } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CreationItems from '../components/home/CreationItems'

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken, isLoaded: isAuthLoaded } = useAuth();
  const { user: clerkUser, isLoaded: isClerkUserLoaded } = useUser(); 
  const [userProfile, setUserProfile] = useState(null);
  const [allResumes, setAllResumes] = useState(null);


  const fetchUserProfile = useCallback(async () => {
    if (!isAuthLoaded || !isClerkUserLoaded || !clerkUser) {
      return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success && data.user) {
        setUserProfile(data.user);
      } else {
        toast.error(data.message || 'Failed to fetch user profile.');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error(error.response?.data?.message || 'An error occurred while fetching user profile.');
    } finally {
      setLoading(false);
    }
  }, [isAuthLoaded, isClerkUserLoaded, clerkUser, getToken]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);


  const badgeStyle = {
    studio: 'bg-indigo-500 text-color_9',
    creator: 'bg-green-500 text-color_9', 
    launch: 'bg-color_8/60 text-color_2', 
  };

  const displayPlan = userProfile?.plan.charAt(0).toUpperCase() + userProfile?.plan.slice(1);


  const handleCopyContent = (content) => {
    if (!content) {
      toast.error('No content to copy.');
      return;
    }
    navigator.clipboard.writeText(content)
      .then(() => toast.success('Content copied to clipboard!'))
      .catch(() => toast.error('Failed to copy.'));
  };

  const handleDeleteCreation = async (creationId) => {
    let confirmed = false; 

    await new Promise(resolve => {
      toast((t) => (
        <div className="flex flex-col items-center">
          <p className="text-sm font-semibold text-color_4 mb-2">Are you sure you want to delete this creation?</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                confirmed = true; 
                toast.dismiss(t.id); 
                resolve(); 
              }}
              className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600 transition"
            >
              Delete
            </button>
            <button
              onClick={() => {
                confirmed = false; 
                toast.dismiss(t.id); 
                resolve(); 
              }}
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md text-xs hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ), { duration: Infinity }); 
    });

    if (!confirmed) {
      toast.error("Deletion cancelled.");
      return;
    }

    toast.promise(
      (async () => { 
        try {
          const token = await getToken();
          const response = await axios.delete(`/api/user/creations/${creationId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.success) {
            setCreations(prevCreations => prevCreations.filter(c => c._id !== creationId));
            return 'Creation deleted successfully!'; 
          } else {
            throw new Error(response.data.message || 'Failed to delete creation.'); 
          }
        } catch (err) {
          console.error('Error deleting creation:', err);
          throw new Error(err.response?.data?.message || err.message || 'An unexpected error occurred during deletion.');
        }
      })(), 
      {
        loading: 'Deleting creation...',
        success: (message) => message,
        error: (error) => error.message,
      }
    );
  };
  
  const getDashboardData = async () => {
    try {
        const token = await getToken();
        const response = await axios.get('/api/user/creations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setCreations(response.data.creations);
        } else {
          toast.error(response.data.message || 'Failed to fetch creations.');
          setError(response.data.message || 'Failed to fetch creations.');
        }
      } catch (err) {
        console.error('Error fetching user creations:', err);
        const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred while fetching creations.';
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
  }
  const fetchAllResumes = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/resume', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setAllResumes(data.resumes);
    } catch (err) {
      console.error("Error fetching resumes:", err);
      setError("Failed to fetch resumes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getDashboardData()
    fetchAllResumes();
  }, [])


  return (
    <div className=' p-6 mt-24 md:mt-12 xl:pl-14'>
      <div className='flex justify-start gap-4 flex-wrap '>
        {/* Total Creation Cards */}
        <div className="flex justify-between items-center md:w-72 w-full p-4 px-6 bg-color_9 rounded-xl border border-color_6/30">
          <div className='text-color_4'>
            <p className='text-sm'>Total Creations</p>
            <h2 className='text-xl font-semibold'>{creations.length}</h2>
          </div>
          <div className='w-10 h-10 rounded bg-gradient-to-bl from-[#6EE7B7] to-[#337ef8] flex items-center justify-center'>
            <Sparkles className='w-5 text-color_9' />
          </div>
        </div>
        <div className="flex justify-between items-center md:w-72 w-full p-4 px-6 bg-color_9 rounded-xl border border-color_6/30">
          <div className='text-color_4'>
            <p className='text-sm'>No. Of Resumes</p>
            <h2 className='text-xl font-semibold'>{allResumes?.length}</h2>
          </div>
          <div className='w-10 h-10 rounded bg-gradient-to-bl from-green-600 to-orange-300 flex items-center justify-center'>
            <LucideBriefcase className='w-5 text-color_9' />
          </div>
        </div>
        {/* Total Active Plan Cards */}
        <div className="flex justify-between items-center md:w-72 w-full p-4 px-6 bg-color_9 rounded-xl border border-color_6/30">
          <div className='text-color_4'>
            <p className='text-sm'>Active Plan</p>
              <p className={`mt-1 text-xs rounded px-2 py-[2px] w-fit ${badgeStyle[userProfile?.plan]}`}>
                {displayPlan} Plan
              </p>
          </div>
          <div className='w-10 h-10 rounded bg-gradient-to-tr from-[#ffc165] to-[#9e53ee] flex items-center justify-center'>
            <Gem className='w-5 text-color_9' />
          </div>
        </div>
      </div>
      {loading ? (
          <div className='flex justify-center items-center h-40'>
            <p className='ml-3 text-color_4/70'>Loading your creations...</p>
          </div>
        ) : error ? (
          <div className='text-center text-red-500 p-4'>
            <p>Error: {error}</p>
            <p>Please try refreshing the page.</p>
          </div>
        ) : creations.length === 0 ? (
          <div className='text-center p-4 text-color_2/60 mt-20'>
            <p className='text-lg font-medium'>No creations found yet!</p>
            <p className='text-sm'>Start generating content using our AI tools to see your history here.</p>
          </div>
        ) : (
      <div className='space-y-3 '>
        <p className='mt-8 mb-2 text-color_4 text-lg font-semibold'>Recent Creations</p>
        <div className='grid md:grid-cols-2 gap-6 cursor-pointer h-[80vh] hide-scrollbar overflow-y-scroll rounded'>
        {
          creations.map((item) => <CreationItems item={item} handleCopyContent={handleCopyContent} handleDeleteCreation={handleDeleteCreation}/>)
        }
        </div>
      </div>
        )}
    </div>
  )
}

export default Dashboard
