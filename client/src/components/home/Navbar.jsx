import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { ArrowRight } from 'lucide-react';
import bg from "../../assets/bg-1.png";
import Logo from './Logo';

const Navbar = () => {
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();

  if (!isLoaded) return null;

  return (
  <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] md:w-[80%]  w-[95%] rounded-full  shadow-sm backdrop-blur-2xl bg-cover bg-no-repeat bg-center border border-color_8/40 " style={{ backgroundImage: `url(${bg})`}}>
    <div className="w-full  flex justify-between items-center py-3 px-6 bg-center ">
      {/* Logo */}
      <Logo />
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
        <button className="btn2-grad flex items-center gap-4 text-sm" onClick={openSignIn}>Get Started <ArrowRight className="w-4 h-4" /></button>
      )}
    </div>
  </div>

  );
};

export default Navbar;
