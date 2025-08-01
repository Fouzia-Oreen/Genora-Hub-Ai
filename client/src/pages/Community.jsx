import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Heart, Sparkles } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user, isLoaded: isUserLoaded } = useUser();
  const { getToken, isLoaded: isAuthLoaded } = useAuth();
  const [loading, setLoading] = useState(true);



  const fetchCreations = useCallback(async () => {
    if (!isAuthLoaded || !isUserLoaded) {
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();

      const { data } = await axios.get('/api/user/creations/published', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      if (data.success) {
        const rawCreations = data.creations || [];

        const formattedCreations = rawCreations.map(creation => ({
          ...creation,
          id: creation._id || creation.id,
          likes: creation.likes || []
        }));
        setCreations(formattedCreations);

      } else {
        toast.error(data.message || 'Failed to fetch creations.');
        setCreations([]);
      }
    } catch (error) {

      toast.error(error.response?.data?.message || error.message || 'An error occurred while fetching creations.');
      setCreations([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthLoaded, isUserLoaded, getToken]);

  useEffect(() => {
    fetchCreations();
  }, [fetchCreations]);

  const toggleLike = async (creationId) => {

    if (!user || !user.id) { 
      toast.error('Please log in to like creations.');
      return;
    }

    setCreations(prevCreations =>
      prevCreations.map(creation => {
        if (creation.id === creationId) {
          const hasLiked = (creation.likes || []).includes(user.id);
          return {
            ...creation,
            likes: hasLiked
              ? (creation.likes || []).filter(id => id !== user.id)
              : [...(creation.likes || []), user.id],
          };
        }
        return creation;
      })
    );

    try {
      const { data } = await axios.post(
        '/api/user/creations/toggle-like',
        { id: creationId }, 
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (!data.success) {
        toast.error(data.message || 'Failed to update like status.');

        setCreations(prevCreations =>
          prevCreations.map(creation => {
            if (creation.id === creationId) {
              const hasLiked = !(creation.likes || []).includes(user.id);
              return {
                ...creation,
                likes: hasLiked
                  ? (creation.likes || []).filter(id => id !== user.id)
                  : [...(creation.likes || []), user.id],
              };
            }
            return creation;
          })
        );
      } else {
        toast.success(data.message);
      }
    } catch (error) {

      if (error.response && error.response.data) {
        console.error('Backend error response:', error.response.data);
      }
      toast.error(error.response?.data?.message || error.message || 'An error occurred while updating like status.');

      setCreations(prevCreations =>
        prevCreations.map(creation => {
          if (creation.id === creationId) {
            const hasLiked = !(creation.likes || []).includes(user.id);
            return {
              ...creation,
              likes: hasLiked
                ? (creation.likes || []).filter(id => id !== user.id)
                : [...(creation.likes || []), user.id],
            };
          }
          return creation;
        })
      );
    }
  };


  return (
    <div className='flex-1 h-screen flex flex-col gap-4 p-6 mt-20 lg:mx-12 md:mt-12 overflow-y-scroll hide-scrollbar'>
      <div className='flex items-center gap-3'>
        <Sparkles className='w-5 h-5 text-color_5 animate-sparkle' />
        <h1 className='text-2xl font-semibold'>Community Creations</h1>
      </div>

      {loading ? (
        <div className='flex-1 flex justify-center items-center'>
          <span className='w-8 h-8 rounded-full border-4 border-t-transparent animate-spin text-color_5'></span>
        </div>
      ) : creations.length === 0 ? (
        <div className='flex-1 flex justify-center items-center'>
          <p className='text-lg text-color_4/60'>No public creations yet. Be the first to publish one!</p>
        </div>
      ) : (
        <div className="w-full rounded-xl overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 ">
          {creations.map((creation) => (
            <div key={creation.id} className="bg-color_9 relative group rounded-lg overflow-hidden border border-color_7/30">
              <img
                src={creation.content}
                alt={creation.prompt || 'AI Generated Image'}
                className="rounded-md w-full h-64 object-cover transition-transform group-hover:scale-105"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x256/E0E0E0/ADADAD?text=Image+Error"; }}
              />

              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent p-3 flex items-end justify-end group-hover:justify-between gap-2 text-white">
                <p className="text-sm hidden group-hover:block text-gray-200">{creation.prompt}</p>
                <div className='flex gap-1 items-center'>
                  <p className="text-sm font-semibold">{(creation.likes || []).length}</p>
                  <Heart
                    className={`min-w-5 h-5 hover:scale-110 cursor-pointer transition-colors ${
                      user && creation.likes && creation.likes.includes(user.id) ? 'fill-red-500 text-red-500' : 'text-white'
                    }`}
                    onClick={() => toggleLike(creation.id)} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Community;

