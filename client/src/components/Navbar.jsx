// import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import genora from '../assets/genora.png';
import bg from "../assets/gradientBackground.png";
import { useClerk, useUser } from '@clerk/clerk-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();

  // Wait for Clerk to load
  if (!isLoaded) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[95%] max-w-7xl rounded-full  shadow-sm backdrop-blur-2xl bg-cover bg-no-repeat bg-center border border-color_6/40" style={{ backgroundImage: `url(${bg})` }}>
  <div
    className="w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 md:px-10   bg-center "

  >
    {/* Logo and Title */}
    <Link to="/" className="flex items-center">
      <img
        className="h-9"
        src={genora}
        alt="Genora Logo"
        onClick={() => navigate("/")}
      />
      <span className="bg-gradient-2 text-[26px] text-transparent bg-clip-text font-bold px-2 rounded-lg inline-block">
        Genora.AI
      </span>
    </Link>

    {/* Right Section */}
    {user ? (
      <div className="flex items-center gap-3">
        <UserButton />
        <div className="hidden sm:block">
          <h1 className="text-sm font-semibold text-color_5">
            {user.fullName}
          </h1>
          <p className="text-xs text-color_4">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>
    ) : (
      <button className="btn2-grad flex items-center gap-4" onClick={openSignIn}>Get Started <ArrowRight className="w-4 h-4" /></button>
    )}
  </div>
</div>

  );
};

export default Navbar;
