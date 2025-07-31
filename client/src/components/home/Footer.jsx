import Logo from './Logo'
import moment from 'moment'
import { useSignIn } from '@clerk/clerk-react';
import { useState } from 'react';

const Footer = () => {
  const { signIn } = useSignIn();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); 

  const handleSubscribe = async () => {
    if (!email) return;

    try {
      const { supportedFirstFactors } = await signIn.create({ identifier: email });
      const emailFactor = supportedFirstFactors.find(f => f.strategy === 'email_code');

      if (emailFactor) {
        await signIn.prepareFirstFactor({ strategy: 'email_code', emailAddressId: emailFactor.emailAddressId });
        setStatus('Check your email for a verification code.');
      } else {
        setStatus('Email sign-in not supported for this email.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Something went wrong.');
    }
  };

  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 mt-52 w-full text-color_4/90">
        <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-color_4/40 pb-6">
            <div className="md:max-w-96">
                <Logo />

                <p className="mt-6 text-sm">
                "Genora.Ai is your all-in-one AI platform to effortlessly create compelling content, stunning visuals, and professional resumes — faster and smarter than ever."
                </p>
            </div>
            <div className="flex-1 flex items-start md:justify-end gap-20">
                <div>
                    <h2 className="font-semibold mb-5 text-color_4">Company</h2>
                    <ul className="text-sm space-y-2">
                        <li><a href="/">Home</a></li>
                        <li><a href="/">About us</a></li>
                        <li><a href="/">Contact us</a></li>
                        <li><a href="/">Privacy policy</a></li>
                    </ul>
                </div>
                <div>
                    <h2 className="font-semibold text-color_4 mb-5">Subscribe to our newsletter</h2>
                    <div className="text-sm space-y-2">
                        <p>The latest news, articles, and resources, sent to your inbox weekly.</p>
                        <div className="flex flex-col lg:flex-row items-center gap-2 pt-4">
                            <input className="border border-color_4/40 pl-2 placeholder-color_2/40 text-color_3 outline-none w-full max-w-64 h-9 rounded-full px-2" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            <button className="btn2-grad w-full lg:w-fit" onClick={handleSubscribe}>Subscribe</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <p className="pt-4 text-center text-xs md:text-sm pb-5">
       Copyright © {moment().format("MMM Do YY")} <a href="https://prebuiltui.com" className='font-bold'> fouziaoreen </a>. All Rights Reserved.
        </p>

    </footer>
  )
}

export default Footer
