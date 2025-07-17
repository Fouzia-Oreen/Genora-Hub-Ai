import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import genora from '../assets/genora.png';
import bg from "../assets/gradientBackground.png";

const Navbar = () => {
  const navigate = useNavigate()
  const { user, isLoaded } = useUser();
  const {openSignIn} = useClerk()
    if (!isLoaded || !user) return null;

  return (
    <div className='fixed z-50 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32 cursor-pointer bg-cover bg-no-repeat bg-center' style={{ backgroundImage: `url(${bg})` }}>
      <Link to="/" className='flex items-center'>
      <img className="h-9" src={genora} alt="dummyLogoDark" onClick={() => navigate("/")}/>
      <span className="bg-gradient-2 text-[26px] text-transparent bg-clip-text font-bold px-2 rounded-lg inline-block">Genora AI</span>
      </Link>
     {
      user ? (
    <div className='flex items-center gap-3'>
      <UserButton />
      <div>
        <h1 className='text-sm font-semibold text-color_5'>{user.fullName}</h1>
        <p className='text-xs text-color_4'>{user.primaryEmailAddress?.emailAddress}</p>
      </div>
    </div>
      ) : (
        <button onClick={openSignIn} className='flex items-center gap-3 rounded-full text-sm cursor-pointer py-2.5 px-6   font-medium text-white bg-gradient-3 p-4 '>Get Started <ArrowRight className='w-4 h-4'/></button>
      )
     }
    </div>
  )
}

export default Navbar
