import { Toaster } from "react-hot-toast"
import { Route, Routes } from "react-router-dom"
import Community from "../../client/src/pages/Community"
import Dashboard from "../../client/src/pages/Dashboard"
import Home from "../../client/src/pages/Home"
import Layout from "../../client/src/pages/Layout"
import CoverLetterGenerator from "./pages/career/CoverLetterGenerator"
import RespondToEmail from "./pages/career/RespondToEmail"
import BuiltYourResume from "./pages/career/resume/BuiltYourResume"
import EditResume from "./pages/career/resume/EditResume"
import ReviewResume from "./pages/career/ReviewResume"
import RemoveBackground from "./pages/images/BackgroundRemover"
import ImageGenerator from "./pages/images/ImageGenerator"
import ObjectRemover from "./pages/images/ObjectRemover"
import AdCopyGenerator from "./pages/marketing/AdCopyGenerator"
import ProductDescriptionGenerator from "./pages/marketing/ProductDescriptionGenerator"
import SocialMediaCaptions from "./pages/marketing/SocialMediaCaptions"
import YouTubeScriptGenerator from "./pages/marketing/YoutubeScriptsGenerator"
import ProfileImageUploader from "./pages/user/ProfileImageUploader"
import UserProfile from "./pages/user/UserProfile"
import BlogGenerator from "./pages/writing/BlogGenerator"
import GrammarRewriter from "./pages/writing/GrammarRewriter"
import TextSummarizer from "./pages/writing/TextSummarizer"
import WriteArticle from "./pages/writing/WriteArticle"


const App = () => {

  return (
  <>
  <div>
      <Routes>
          {/* all */}
          <Route path="/" element={<Home />} />
          <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="community" element={<Community />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="profile/upload-image" element={<ProfileImageUploader />} />

          {/* writing */}
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="blog-generator" element={<BlogGenerator />} />
           <Route path="text-summarize" element={<TextSummarizer />} />
           <Route path="grammar-rewriter" element={<GrammarRewriter />} />
          {/* marketing */}
          <Route path="social-caption-generator" element={<SocialMediaCaptions />} />
          <Route path="youtube-script-generator" element={<YouTubeScriptGenerator />} />
          <Route path="product-description" element={<ProductDescriptionGenerator />} />
          <Route path="ad-copy-generator" element={<AdCopyGenerator />} />
          {/* images */}
          <Route path="generate-images" element={<ImageGenerator />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="remove-object" element={<ObjectRemover />} />
          {/* career */}
          <Route path="email-respond" element={<RespondToEmail />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="cover-letter-generator" element={<CoverLetterGenerator />} />
          {/* resume */}
          <Route path="resume-builder" element={<BuiltYourResume />} />
          <Route path="resume/:resumeId" element={<EditResume />} />

        </Route>
      </Routes>
      <Toaster
        position="top-center" 
        containerStyle={{
          zIndex: 9999, 
        }}
        toastOptions={{
          className: 'bg-[#a0c9fa] text-color_2',
          style: {
            fontSize: '16px',
            fontWeight: '500',
          },
        }}
      />
    </div>
    </>
  )
}

export default App

