import { Link } from 'react-router-dom'
import genora from '../assets/genora.png'

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 mt-52 w-full text-color_4/70">
        <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-color_4/40 pb-6">
            <div className="md:max-w-96">
                <Link to="/" className='flex items-center'>
                <img className="h-9" src={genora} alt="dummyLogoDark" />
                <span className="bg-gradient-2 text-3xl text-transparent bg-clip-text font-bold px-2 rounded-lg inline-block">Genora AI</span>
                </Link>

                <p className="mt-6 text-sm">
                Genora Hub is your all-in-one AI toolkit for creating content, images, and resumes—fast, smart, and effortlessly.
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
                        <div className="flex items-center gap-2 pt-4">
                            <input className="border border-color_4/40 pl-2 placeholder-color_2/40 text-color_3 outline-none w-full max-w-64 h-9 rounded-full px-2" type="email" placeholder="Enter your email" />
                            <button className="btn2-grad">Subscribe</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <p className="pt-4 text-center text-xs md:text-sm pb-5">
            Copyright 2024 © <a href="https://prebuiltui.com" className='font-bold'>fouziaoreen</a>. All Right Reserved.
        </p>
    </footer>
  )
}

export default Footer
