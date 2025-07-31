import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth, useUser } from '@clerk/clerk-react';
import { UserCircle, Mail, DollarSign, Sparkles, Image, GalleryHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom'; // Assuming you are using React Router for navigation

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const UserProfile = () => {
  const { getToken, isLoaded: isAuthLoaded } = useAuth();
  const { user: clerkUser, isLoaded: isClerkUserLoaded } = useUser(); 
  
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className='flex-1 flex justify-center items-center h-full'>
        <span className='w-8 h-8 rounded-full border-4 border-t-transparent animate-spin text-color_5'></span>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className='flex-1 flex flex-col justify-center items-center h-full p-6'>
        <UserCircle className='w-16 h-16 text-color_4/60 mb-4' />
        <p className='text-lg text-color_4/60'>User profile not found or not loaded.</p>
        <p className='text-sm text-color_4/50 mt-2'>Please ensure you are logged in.</p>
      </div>
    );
  }

  return (
    <div className='panel'>
      <div className='rightPanel'>
        <div className='flex items-center gap-3 mb-6'>
          <Sparkles className='w-5 h-5 text-color_5 animate-sparkle' />
          <h1 className='text-2xl font-semibold'>Your Profile</h1>
        </div>

        <div className='flex flex-col items-center mb-6'>
          {userProfile.profileImageUrl ? (
            <img
              src={userProfile.profileImageUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-color_5 shadow-md"
            />
          ) : (
            <UserCircle className="w-32 h-32 text-color_4/60 border-4 border-color_7/30 rounded-full" />
          )}
          <h2 className='text-2xl font-bold mt-4 text-color_4'>{clerkUser?.fullName || clerkUser?.username || 'User'}</h2>
          <p className='text-sm text-color_4/70'>{clerkUser?.primaryEmailAddress?.emailAddress}</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-color_4'>
          <div className='flex items-center gap-3 bg-color_10/10 p-3 rounded-md'>
            <Mail className='w-5 h-5 text-color_5' />
            <p className='font-medium'>Email:</p>
            <span className='text-sm'>{userProfile.email}</span>
          </div>
          <div className='flex items-center gap-3 bg-color_10/10 p-3 rounded-md'>
            <DollarSign className='w-5 h-5 text-color_5' />
            <p className='font-medium'>Plan:</p>
            <span className='text-sm capitalize'>{userProfile.plan}</span>
          </div>
          <div className='flex items-center gap-3 bg-color_10/10 p-3 rounded-md'>
            <Sparkles className='w-5 h-5 text-color_5' />
            <p className='font-medium'>Free Usage:</p>
            <span className='text-sm'>{userProfile.freeUsage} / 10</span>
          </div>
          {/* Display specific daily counters based on your schema */}
          {userProfile.plan !== 'launch' && (
            <>
              <div className='flex items-center gap-3 bg-color_10/10 p-3 rounded-md'>
                <Mail className='w-5 h-5 text-color_5' />
                <p className='font-medium'>Email Responses:</p>
                <span className='text-sm'>{userProfile.emailResponseDailyCount} / 10</span>
              </div>
              <div className='flex items-center gap-3 bg-color_10/10 p-3 rounded-md'>
                <Image className='w-5 h-5 text-color_5' />
                <p className='font-medium'>Image Generations:</p>
                <span className='text-sm'>{userProfile.imageGenerationDailyCount} / 10</span>
              </div>
              <div className='flex items-center gap-3 bg-color_10/10 p-3 rounded-md'>
                <GalleryHorizontal className='w-5 h-5 text-color_5' />
                <p className='font-medium'>Resume Reviews:</p>
                <span className='text-sm'>{userProfile.reviewResumeDailyCount} / 3</span>
              </div>
              {userProfile.plan === 'creator' && (
                <div className='flex items-center gap-3 bg-color_10/10 p-3 rounded-md'>
                  <GalleryHorizontal className='w-5 h-5 text-color_5' />
                  <p className='font-medium'>YouTube Scripts :</p>
                  <span className='text-sm'>{userProfile.youtubeScriptDailyCount} / 10</span>
                </div>
              )}
              {userProfile.plan === 'studio' && (
                <div className='flex items-center gap-3 bg-color_10/10 p-3 rounded-md'>
                  <GalleryHorizontal className='w-5 h-5 text-color_5' />
                  <p className='font-medium'>Built Resumes :</p>
                  <span className='text-sm'>{userProfile.builtResumeDailyCount} / 10</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className='mt-8 flex flex-col sm:flex-row gap-4 justify-center'>
          <Link to="/ai/profile/upload-image" className="btn2-grad flex items-center justify-center gap-2 px-6 rounded-md">
            <Image className='w-5 h-5' />
            Update Profile Image
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
