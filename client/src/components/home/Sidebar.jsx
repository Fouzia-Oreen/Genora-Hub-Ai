import { useAuth, useClerk, useUser } from '@clerk/clerk-react';
import axios from 'axios'; 
import { LogOut, UserCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { navItems } from '../../assets/assets';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL; 

const Sidebar = ({ sidebar, setSidebar }) => { 
  const { signOut, openUserProfile } = useClerk();
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


  const plan = userProfile?.plan?.toLowerCase() || 'launch'; 

  const badgeStyle = {
    studio: 'bg-indigo-500 text-color_2',
    creator: 'bg-green-500 text-color_2', 
    launch: 'bg-color_8/60 text-color_2', 
  };

  const displayPlan = plan.charAt(0).toUpperCase() + plan.slice(1);

  const displayProfileImage = clerkUser?.imageUrl;

  return (
    <div
      className={`
        w-72 bg-color_9 border-r border-color_6/30 flex flex-col justify-between items-center fixed top-[64px] bottom-0 z-[90] transition-transform duration-300 ease-in-out overflow-y-scroll h-screen hide-scrollbar shadow-md
        ${sidebar ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex
      `}
    >
      <div className="my-7 lg:my-10 w-full px-4">
        <h1 className="mt-1 text-xl font-semibold text-color_4">Select Your Tool</h1>
        <div className="mt-6 flex flex-col gap-8">
          {Object.entries(
            navItems.reduce((acc, item) => {
              const cat = item.category || 'other';
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(item);
              return acc;
            }, {})
          ).map(([category, items]) => (
            <div key={category}>
              <p className="text-xs uppercase font-bold mb-2 text-color_1/60 bg-color_7/25 w-fit px-2 py-1 rounded tracking-tight">
                {category === 'other' ? 'Others' : category.charAt(0).toUpperCase() + category.slice(1)}
              </p>
              <div className="flex flex-col gap-2">
                {items.map(({ to, label, Icon}) => (
                  <NavLink
                    key={label}
                    to={to}
                    onClick={() => setSidebar(false)}
                    className={({ isActive }) =>
                      `px-3.5 py-2 flex items-center gap-3 rounded-full transition-all duration-200 font-medium text-sm  border ${
                        isActive
                          ? '  cursor-pointer bg-blue-200 text-blue-700  border-blue-500 font-semibold '
                          : 'text-color_4 hover:bg-blue-200/80 border-blue-200/80 '
                      }`
                    }
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    <span className="text-[16px]">{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* logout & profile-plan */}
      <div className='w-full border-t border-color_6/30 p-4 px-7 flex items-center justify-between'>
        {loadingProfile ? (
          <div className='flex items-center gap-2'>
            <span className='w-6 h-6 rounded-full border-2 border-t-transparent animate-spin text-color_5'></span>
            <p className='text-sm text-color_4/70'>Loading profile...</p>
          </div>
        ) : (
          <div className='flex gap-2 items-center cursor-pointer' onClick={openUserProfile}>
            {displayProfileImage ? (
              <img src={displayProfileImage} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <UserCircle className="w-8 h-8 text-color_4/60" />
            )}
            <div>
              <h1 className="text-sm font-semibold text-color_4">{clerkUser?.fullName || clerkUser?.username || 'User'}</h1>
              <p className={`mt-1 text-xs rounded px-2 py-[2px] text-color_9 w-fit ${badgeStyle[plan]}`}>
                {displayPlan} Plan
              </p>
            </div>
          </div>
        )}
        <LogOut onClick={signOut} className='w-5 text-color_10 hover:text-rose-500 cursor-pointer'/>
    </div>
    </div>
  );
};

export default Sidebar;