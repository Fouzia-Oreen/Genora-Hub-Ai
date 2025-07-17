import { Route, Routes } from "react-router-dom"
import Home from "../../client/src/pages/Home"
import Layout from "../../client/src/pages/Layout"
import Dashboard from "../../client/src/pages/Dashboard"
import WriteArticle from "../../client/src/pages/WriteArticle"
import BlogTitles from "../../client/src/pages/BlogTitles"
import Community from "../../client/src/pages/Community"
import GenerateImages from "../../client/src/pages/GenerateImages"
import ReviewResume from "../../client/src/pages/ReviewResume"
import RemoveBackground from "../../client/src/pages/RemoveBackground"
import RemoveObject from "../../client/src/pages/RemoveObject"

const App = () => {
  return (
  <div>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/ai" element={<Layout />}>
        <Route index element={<Dashboard />}/>
        <Route path="write-article" element={<WriteArticle />}/>
        <Route path="blog-titles" element={<BlogTitles />}/>
        <Route path="community" element={<Community />}/>
        <Route path="generate-images" element={<GenerateImages />}/>
        <Route path="review-resume" element={<ReviewResume />}/>
        <Route path="remove-background" element={<RemoveBackground />}/>
        <Route path="remove-object" element={<RemoveObject />}/>
      </Route>
    </Routes>
  </div>
  )
}

export default App

