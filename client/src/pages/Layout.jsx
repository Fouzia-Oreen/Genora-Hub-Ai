import { SignIn, useAuth, useClerk, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Menu, UserCircle, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import bg from "../assets/bg-1.png";
import Logo from '../components/home/Logo';
import Sidebar from '../components/home/Sidebar';

const Layout = () => {
  const {  openUserProfile } = useClerk();
  const { getToken, isLoaded: isAuthLoaded } = useAuth();
  const { user: clerkUser, isLoaded: isClerkUserLoaded } = useUser(); 

  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true); 


  const fetchUserProfile = useCallback(async () => {
    if (!isAuthLoaded || !isClerkUserLoaded || !clerkUser) {
      setLoadingProfile(false); 
      return;
    }
    setLoadingProfile(true);
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
        setUserProfile(null); 
      }
    } catch (error) {
      console.error('Error fetching user profile in Sidebar:', error);

      setUserProfile(null); 
    } finally {
      setLoadingProfile(false);
    }
  }, [isAuthLoaded, isClerkUserLoaded, clerkUser, getToken]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const displayProfileImage = userProfile?.profileImageUrl || clerkUser?.imageUrl;

  const { user, isLoaded } = useUser();
  const [sidebar, setSidebar] = useState(false);

  if (!isLoaded) return null;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SignIn />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      
    {/* Navbar */}
    <div
    className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] md:w-[80%]  w-[95%] rounded-full  shadow-sm backdrop-blur-2xl bg-cover bg-no-repeat bg-center border border-color_8/40" style={{ backgroundImage: `url(${bg})`}}>
    <div
      className=" w-full  flex justify-between items-center py-3 px-6 bg-center"
    >
        {/* Logo */}
        <Logo />

        {/* Sidebar Toggle for small & medium screens */}
        <div className="lg:hidden">
          <button
            onClick={() => setSidebar(!sidebar)}
            className="text-color_4"
            aria-label="Toggle Sidebar"
          >
            {sidebar ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* User Info for large screens */}
          <div className='hidden lg:flex items-center gap-3 cursor-pointer' onClick={openUserProfile}>
          {displayProfileImage ? (
            <img src={displayProfileImage} alt="avatar" className="w-9 h-9 rounded-full object-cover border border-color_5/60" />
          ) : (
            <UserCircle className="w-8 h-8 text-color_4/60" />
          )}
          <div>
            <h1 className="text-sm font-semibold text-color_5">{clerkUser?.fullName || clerkUser?.username || 'User'}</h1>
            <p className="text-xs text-color_4">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
        </div>
      </div>
      
      {/* Main layout: Sidebar + Content */}
      <div className="flex-1 w-full flex pt-[64px] lg:pt-[76px] justify-center">
        <div className="flex w-full max-w-[1600px]">
          <Sidebar sidebar={sidebar} setSidebar={setSidebar} user={user} />
          <main className="flex-1 bg-color_9 min-h-screen">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
