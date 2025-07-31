import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { ImagePlus, Sparkles, UploadCloud } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ProfileImageUploader = () => {
  const { getToken, isLoaded: isAuthLoaded } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser(); 
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentProfileImageUrl, setCurrentProfileImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);


  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthLoaded || !isUserLoaded || !user) {
        return;
      }
      try {
        setLoading(true);
        const token = await getToken();
        const { data } = await axios.get('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (data.success && data.user) {
          setCurrentProfileImageUrl(data.user.profileImageUrl);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load profile image.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthLoaded, isUserLoaded, user, getToken]);


  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        toast.error('Image size exceeds 5MB. Please choose a smaller image.');
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      toast.error('Please select an image to upload.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', selectedFile);

      const token = await getToken();
      const { data } = await axios.post('/api/user/profile/image', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        setCurrentProfileImageUrl(data.profileImageUrl);
        setSelectedFile(null);
        setPreviewUrl(null);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload profile image.');
    } finally {
      setLoading(false);
    }
  };

  const displayImage = previewUrl || currentProfileImageUrl;

  return (
    <div className='p-6 rounded-lg border border-color_7/30 w-full max-w-md mx-auto my-8'>
      <div className='flex items-center gap-3 mb-6'>
        <Sparkles className="w-5 h-5 text-color_5 animate-sparkle" />
        <h1 className='text-2xl font-semibold'>Upload Profile Image</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          onClick={() => fileInputRef.current.click()}
          className="w-full h-48 border-2 border-dashed border-color_7/40 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-color_9 transition-all duration-200"
        >
          {loading ? (
            <span className='w-8 h-8 rounded-full border-4 border-t-transparent animate-spin text-color_5'></span>
          ) : displayImage ? (
            <img
              src={displayImage}
              alt="Profile Preview"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <>
              <ImagePlus className="w-12 h-12 text-color_5 mb-3" />
              <p className="text-sm text-color_4/70">Click to select an image</p>
              <p className="text-xs text-color_4/50">(Max 5MB)</p>
            </>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {selectedFile && (
          <p className="mt-3 text-sm text-color_4/80 text-center">
            Selected: {selectedFile.name}
          </p>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 btn2-grad"
          disabled={loading || !selectedFile}
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
          ) : (
            <UploadCloud className='w-5' />
          )}
          Upload Image
        </button>
      </form>

      {!selectedFile && !loading && currentProfileImageUrl && (
        <div className="mt-6 text-center">
          <p className="text-sm text-color_4/70 mb-2">Your current profile image:</p>
          <img
            src={currentProfileImageUrl}
            alt="Current Profile"
            className="w-24 h-24 rounded-full object-cover mx-auto border border-color_7/30"
          />
        </div>
      )}
    </div>
  );
};

export default ProfileImageUploader;
