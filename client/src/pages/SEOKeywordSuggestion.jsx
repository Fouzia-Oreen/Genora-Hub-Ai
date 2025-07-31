// import {
//   Facebook,
//   Instagram,
//   Linkedin,
//   Search,
//   Sparkles,
//   Twitter,
//   Youtube
// } from 'lucide-react'
// import { useState } from 'react'
// import CopyDownloadButtons from '../components/Copy&DownloadBotton'

// const SEOKeywordSuggestion = () => {
//   const platforms = [
//     { name: 'Instagram', color: '#E1306C', icon: Instagram },
//     { name: 'Twitter', color: '#1DA1F2', icon: Twitter },
//     { name: 'LinkedIn', color: '#0077B5', icon: Linkedin },
//     { name: 'YouTube', color: '#FF0000', icon: Youtube },
//     { name: 'Facebook', color: '#1877F2', icon: Facebook },
//   ]

//   const [keyword, setKeyword] = useState('')
//   const [wordCount, setWordCount] = useState(60)
//   const [includeEmojis, setIncludeEmojis] = useState(true)
//   const [includeHashtags, setIncludeHashtags] = useState(true)
//   const [selectedPlatform, setSelectedPlatform] = useState('Instagram')
//   const [intent, setIntent] = useState('Informational')
//   const [keywordTypes, setKeywordTypes] = useState(['Short-tail'])

//   const keywordTypeOptions = ['Short-tail', 'Long-tail', 'Questions', 'Branded']
//   const intentOptions = ['Informational', 'Transactional', 'Navigational', 'Commercial']

//   const [clusters, setClusters] = useState({
//     'AI Tools': ['best ai image tools', 'ai content generators', 'free ai tools'],
//     'Background Removers': ['remove background free', 'bg remover ai'],
//   })



//   const handleTypeChange = (type) => {
//     setKeywordTypes((prev) =>
//       prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
//     )
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()

//     // Replace this with actual keyword generation logic
//     setClusters({
//       'Generated Cluster 1': ['keyword 1', 'keyword 2', 'keyword 3'],
//       'Generated Cluster 2': ['keyword 4', 'keyword 5'],
//     })
//   }

  
//   // Function to convert clusters object to a text string for copying
//   const getClustersText = () => {
//     return Object.entries(clusters)
//       .map(
//         ([title, keywords]) =>
//           `${title}:\n${keywords.map((kw) => `- ${kw}`).join('\n')}`
//       )
//       .join('\n\n')
//   }

//   // Copy all clusters text to clipboard
//   const handleCopyAll = () => {
//     const textToCopy = getClustersText()
//     navigator.clipboard.writeText(textToCopy).then(() => {
//       alert('Keyword clusters copied to clipboard!')
//     }).catch(() => {
//       alert('Failed to copy.')
//     })
//   }

//   // Convert clusters to CSV format string
//   const getClustersCSV = () => {
//     // CSV with two columns: Cluster Title, Keyword
//     let csv = 'Cluster Title,Keyword\n'
//     Object.entries(clusters).forEach(([title, keywords]) => {
//       keywords.forEach((kw) => {
//         // Escape commas and quotes
//         const safeTitle = `"${title.replace(/"/g, '""')}"`
//         const safeKeyword = `"${kw.replace(/"/g, '""')}"`
//         csv += `${safeTitle},${safeKeyword}\n`
//       })
//     })
//     return csv
//   }

//   // Trigger download of CSV file
//   const handleDownloadCSV = () => {
//     const csvContent = getClustersCSV()
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
//     const url = URL.createObjectURL(blob)
//     const link = document.createElement('a')
//     link.href = url
//     link.setAttribute('download', 'keyword_clusters.csv')
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//     URL.revokeObjectURL(url)
//   }

//   return (
//     <div className='h-full overflow-y-scroll p-6 flex flex-wrap gap-4 justify-evenly mt-24 md:mt-12'>
//       {/* Left Panel */}
//       <form onSubmit={handleSubmit} className="w-full max-w-2xl p-6 rounded-lg border border-color_7/30">
//         <div className='flex items-center gap-3'>
//           <Sparkles className="w-5 h-5 text-color_5 animate-sparkle" />
//           <h1 className='text-2xl font-semibold'>SEO Keyword Generator</h1>
//         </div>

//         {/* Keyword Input */}
//         <p className='mt-8 font-medium text-color_4'>Target Keyword</p>
//         <input
//           type='text'
//           value={keyword}
//           onChange={(e) => setKeyword(e.target.value)}
//           placeholder='e.g., AI image generation tools'
//           required
//           className='w-full p-2 mt-2 text-sm rounded-md border border-color_7/40 outline-none'
//         />

//         {/* Platform Selection */}
//         <p className='mt-8 font-medium text-color_4'>Platform</p>
//         <div className='mt-3 flex gap-3 flex-wrap'>
//           {platforms.map(({ name, color, icon: Icon }) => (
//           <span
//             key={name}
//             onClick={() => setSelectedPlatform(name)}
//             style={{
//               borderColor: color,
//               color: selectedPlatform === name ? color : '#666',
//               backgroundColor: selectedPlatform === name ? `${color}20` : 'transparent',
//               fontWeight: selectedPlatform === name ? 600 : 400
//             }}
//             className='text-sm px-4 py-1 border rounded-full cursor-pointer flex items-center gap-2 transition-all'
//           >
//             <Icon className='w-4 h-4' />
//             {name}
//           </span>
//           ))}
//         </div>

//         {/* Search Intent */}
//         <p className='mt-8 font-medium text-color_4'>Search Intent</p>
//         <div className='flex flex-wrap gap-2 mt-2'>
//           {intentOptions.map((item) => (
//             <span
//               key={item}
//               onClick={() => setIntent(item)}
//               className={`${intent === item ? 'selectButton' : 'notSelectButton'}`}
//             >
//               {item}
//             </span>
//           ))}
//         </div>

//         {/* Keyword Types */}
//         <p className='mt-8 font-medium text-color_4'>Keyword Types</p>
//         <div className='flex flex-wrap gap-2 mt-2'>
//           {keywordTypeOptions.map((type) => (
//             <label key={type} className='flex gap-2 items-center text-sm cursor-pointer'>
//               <input
//                 type='checkbox'
//                 checked={keywordTypes.includes(type)}
//                 onChange={() => handleTypeChange(type)}
//                 className={`size-5 rounded-sm border border-color_7/40 appearance-none transition
//                 ${keywordTypes.includes(type) ? 'bg-color_8/60 ring-1 ring-color_8' : 'bg-color_9'}`}
//               />
//               {type}
//             </label>
//           ))}
//         </div>

//         {/* Word Count Slider */}
//         <p className='mt-10 font-medium text-color_4'>Word Count</p>
//         <input
//           type='range'
//           min={20}
//           max={150}
//           value={wordCount}
//           onChange={(e) => setWordCount(Number(e.target.value))}
//           className='slider'
//         />
//         <p className='text-sm mt-1 text-color_4'>{wordCount} words</p>

//         {/* Emoji & Hashtag Checkboxes */}
//         <p className='mt-10 mb-1 gap-2 text-color_4 font-medium'>Emoji & Hashtag</p>
//         <div className=' flex gap-4 items-center'>
//           <label className='text-sm flex gap-2 items-center cursor-pointer'>
//             <input
//               type='checkbox'
//               checked={includeEmojis}
//               onChange={() => setIncludeEmojis(!includeEmojis)}
//               className={`size-5 rounded-sm border border-color_7/40 appearance-none transition
//               ${includeEmojis ? 'bg-color_8/60 ring-1 ring-color_8' : 'bg-color_9'}`}
//             />
//             Include Emojis
//           </label>
//           <label className='text-sm flex gap-2 items-center cursor-pointer'>
//             <input
//               type='checkbox'
//               checked={includeHashtags}
//               onChange={() => setIncludeHashtags(!includeHashtags)}
//               className={`size-5 rounded-sm border border-color_7/40 appearance-none transition
//               ${includeHashtags ? 'bg-color_8/60 ring-1 ring-color_8' : 'bg-color_9'}`}
//             />
//             Include Hashtags
//           </label>
//         </div>


//         {/* Generate Button */}
//         <button className='w-full flex items-center justify-center gap-2 px-4 py-2 mt-8 btn2-grad'>
//           <Search className='w-5' />Generate SEO Keywords
//         </button>
//       </form>

//       {/* Right Panel */}
//       <div className='w-full max-w-lg p-4 rounded-lg flex flex-col border border-color_7/30 min-h-96 max-h-[600px]'>
//         <div className='flex items-center gap-3 justify-between'>
//           <div className='flex gap-2 items-center'>
//             <Search className='w-5' />
//             <h1 className='text-xl font-semibold'>Keyword Clusters</h1>
//           </div>
//           <CopyDownloadButtons
//             onCopy={handleCopyAll}
//             onDownload={handleDownloadCSV}
//           />
//         </div>

//         {/* Render Keyword Clusters */}
//         <div className='flex-1 flex flex-col gap-4 mt-6 overflow-auto'>
//           {Object.entries(clusters).map(([title, keywords]) => (
//             <div key={title}>
//               <p className='text-sm font-semibold text-color_5 mb-2'>{title}</p>
//               <div className='flex gap-2 flex-wrap text-sm text-color_4'>
//                 {keywords.map((kw) => (
//                   <span
//                     key={kw}
//                     className='px-2 py-1 rounded-full border border-color_7/20'
//                   >
//                     {kw}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default SEOKeywordSuggestion


import {
  Facebook,
  Instagram,
  Linkedin,
  Search,
  Sparkles,
  Twitter,
  Youtube
} from 'lucide-react'
import { useState } from 'react'
import CopyDownloadButtons from '../components/Copy&DownloadBotton'

const SEOKeywordSuggestion = () => {
  const platforms = [
    { name: 'Instagram', color: '#E1306C', icon: Instagram },
    { name: 'Twitter', color: '#1DA1F2', icon: Twitter },
    { name: 'LinkedIn', color: '#0077B5', icon: Linkedin },
    { name: 'YouTube', color: '#FF0000', icon: Youtube },
    { name: 'Facebook', color: '#1877F2', icon: Facebook },
  ]

  const [keyword, setKeyword] = useState('')
  const [wordCount, setWordCount] = useState(60)
  const [includeEmojis, setIncludeEmojis] = useState(true)
  const [includeHashtags, setIncludeHashtags] = useState(true)
  const [selectedPlatform, setSelectedPlatform] = useState('Instagram')
  const [intent, setIntent] = useState('Informational')
  const [keywordTypes, setKeywordTypes] = useState(['Short-tail'])

  // NEW STATE FOR META DESCRIPTION GENERATION
  const [blogTopic, setBlogTopic] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const [metaDescriptions, setMetaDescriptions] = useState([]); // To store generated meta descriptions

  const keywordTypeOptions = ['Short-tail', 'Long-tail', 'Questions', 'Branded']
  const intentOptions = ['Informational', 'Transactional', 'Navigational', 'Commercial']

  const [clusters, setClusters] = useState({
    'AI Tools': ['best ai image tools', 'ai content generators', 'free ai tools'],
    'Background Removers': ['remove background free', 'bg remover ai'],
  })

  const handleTypeChange = (type) => {
    setKeywordTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const handleSubmit = async (e) => { // Made async
    e.preventDefault();

    // Prepare data to send to backend
    const requestBody = {
      keyword,
      selectedPlatform,
      intent,
      keywordTypes,
      wordCount,
      includeEmojis,
      includeHashtags,
      blogTopic,     // NEW
      blogCategory,  // NEW
    };

    try {
      const response = await fetch('/api/seo-keywords', { // Assuming your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        setClusters(data.clusters);
        setMetaDescriptions(data.metaDescriptions || []); // Update meta descriptions state
        alert('SEO Keywords and Meta Descriptions generated successfully!');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error generating SEO content:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  // Function to convert clusters object to a text string for copying
  const getClustersText = () => {
    return Object.entries(clusters)
      .map(
        ([title, keywords]) =>
          `${title}:\n${keywords.map((kw) => `- ${kw}`).join('\n')}`
      )
      .join('\n\n')
  }

  // Copy all clusters text to clipboard
  const handleCopyAll = () => {
    const textToCopy = getClustersText()
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Keyword clusters copied to clipboard!')
    }).catch(() => {
      alert('Failed to copy.')
    })
  }

  // Convert clusters to CSV format string
  const getClustersCSV = () => {
    // CSV with two columns: Cluster Title, Keyword
    let csv = 'Cluster Title,Keyword\n'
    Object.entries(clusters).forEach(([title, keywords]) => {
      keywords.forEach((kw) => {
        // Escape commas and quotes
        const safeTitle = `"${title.replace(/"/g, '""')}"`
        const safeKeyword = `"${kw.replace(/"/g, '""')}"`
        csv += `${safeTitle},${safeKeyword}\n`
      })
    })
    return csv
  }

  // Trigger download of CSV file
  const handleDownloadCSV = () => {
    const csvContent = getClustersCSV()
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'keyword_clusters.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Function to get meta descriptions as a single text string
  const getMetaDescriptionsText = () => {
    return metaDescriptions.join('\n\n');
  };

  // Function to copy meta descriptions to clipboard
  const handleCopyMetaDescriptions = () => {
    const textToCopy = getMetaDescriptionsText();
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Meta descriptions copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy meta descriptions.');
    });
  };


  return (
    <div className='h-full overflow-y-scroll p-6 flex flex-wrap gap-4 justify-evenly mt-24 md:mt-12'>
      {/* Left Panel */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl p-6 rounded-lg border border-color_7/30">
        <div className='flex items-center gap-3'>
          <Sparkles className="w-5 h-5 text-color_5 animate-sparkle" />
          <h1 className='text-2xl font-semibold'>SEO Content Generator</h1> {/* Updated title */}
        </div>

        {/* Keyword Input */}
        <p className='mt-8 font-medium text-color_4'>Target Keyword</p>
        <input
          type='text'
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder='e.g., AI image generation tools'
          required
          className='w-full p-2 mt-2 text-sm rounded-md border border-color_7/40 outline-none'
        />

        {/* NEW: Blog Topic Input */}
        <p className='mt-8 font-medium text-color_4'>Blog Topic (for Meta Descriptions)</p>
        <input
          type='text'
          value={blogTopic}
          onChange={(e) => setBlogTopic(e.target.value)}
          placeholder='e.g., The Future of AI in Photography'
          className='w-full p-2 mt-2 text-sm rounded-md border border-color_7/40 outline-none'
        />

        {/* NEW: Blog Category Input */}
        <p className='mt-8 font-medium text-color_4'>Blog Category (for Meta Descriptions)</p>
        <input
          type='text'
          value={blogCategory}
          onChange={(e) => setBlogCategory(e.target.value)}
          placeholder='e.g., Artificial Intelligence'
          className='w-full p-2 mt-2 text-sm rounded-md border border-color_7/40 outline-none'
        />

        {/* Platform Selection */}
        <p className='mt-8 font-medium text-color_4'>Platform</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {platforms.map(({ name, color, icon: Icon }) => (
            <span
              key={name}
              onClick={() => setSelectedPlatform(name)}
              style={{
                borderColor: color,
                color: selectedPlatform === name ? color : '#666',
                backgroundColor: selectedPlatform === name ? `${color}20` : 'transparent',
                fontWeight: selectedPlatform === name ? 600 : 400
              }}
              className='text-sm px-4 py-1 border rounded-full cursor-pointer flex items-center gap-2 transition-all'
            >
              <Icon className='w-4 h-4' />
              {name}
            </span>
          ))}
        </div>

        {/* Search Intent */}
        <p className='mt-8 font-medium text-color_4'>Search Intent</p>
        <div className='flex flex-wrap gap-2 mt-2'>
          {intentOptions.map((item) => (
            <span
              key={item}
              onClick={() => setIntent(item)}
              className={`${intent === item ? 'selectButton' : 'notSelectButton'}`}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Keyword Types */}
        <p className='mt-8 font-medium text-color_4'>Keyword Types</p>
        <div className='flex flex-wrap gap-2 mt-2'>
          {keywordTypeOptions.map((type) => (
            <label key={type} className='flex gap-2 items-center text-sm cursor-pointer'>
              <input
                type='checkbox'
                checked={keywordTypes.includes(type)}
                onChange={() => handleTypeChange(type)}
                className={`size-5 rounded-sm border border-color_7/40 appearance-none transition
                ${keywordTypes.includes(type) ? 'bg-color_8/60 ring-1 ring-color_8' : 'bg-color_9'}`}
              />
              {type}
            </label>
          ))}
        </div>

        {/* Word Count Slider */}
        <p className='mt-10 font-medium text-color_4'>Word Count</p>
        <input
          type='range'
          min={20}
          max={150}
          value={wordCount}
          onChange={(e) => setWordCount(Number(e.target.value))}
          className='slider'
        />
        <p className='text-sm mt-1 text-color_4'>{wordCount} words</p>

        {/* Emoji & Hashtag Checkboxes */}
        <p className='mt-10 mb-1 gap-2 text-color_4 font-medium'>Emoji & Hashtag</p>
        <div className=' flex gap-4 items-center'>
          <label className='text-sm flex gap-2 items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={includeEmojis}
              onChange={() => setIncludeEmojis(!includeEmojis)}
              className={`size-5 rounded-sm border border-color_7/40 appearance-none transition
              ${includeEmojis ? 'bg-color_8/60 ring-1 ring-color_8' : 'bg-color_9'}`}
            />
            Include Emojis
          </label>
          <label className='text-sm flex gap-2 items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={includeHashtags}
              onChange={() => setIncludeHashtags(!includeHashtags)}
              className={`size-5 rounded-sm border border-color_7/40 appearance-none transition
              ${includeHashtags ? 'bg-color_8/60 ring-1 ring-color_8' : 'bg-color_9'}`}
            />
            Include Hashtags
          </label>
        </div>


        {/* Generate Button */}
        <button type="submit" className='w-full flex items-center justify-center gap-2 px-4 py-2 mt-8 btn2-grad'>
          <Sparkles className='w-5' />Generate SEO Content
        </button>
      </form>

      {/* Right Panel - Keyword Clusters */}
      <div className='w-full max-w-lg p-4 rounded-lg flex flex-col border border-color_7/30 min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3 justify-between'>
          <div className='flex gap-2 items-center'>
            <Search className='w-5' />
            <h1 className='text-xl font-semibold'>Keyword Clusters</h1>
          </div>
          <CopyDownloadButtons
            onCopy={handleCopyAll}
            onDownload={handleDownloadCSV}
          />
        </div>

        {/* Render Keyword Clusters */}
        <div className='flex-1 flex flex-col gap-4 mt-6 overflow-auto'>
          {Object.entries(clusters).map(([title, keywords]) => (
            <div key={title}>
              <p className='text-sm font-semibold text-color_5 mb-2'>{title}</p>
              <div className='flex gap-2 flex-wrap text-sm text-color_4'>
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className='px-2 py-1 rounded-full border border-color_7/20'
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(clusters).length === 0 && (
            <p className="text-center text-color_4/70 italic mt-auto mb-auto">No keyword clusters generated yet.</p>
          )}
        </div>
      </div>

      {/* NEW: Right Panel - Meta Descriptions */}
      <div className='w-full max-w-lg p-4 rounded-lg flex flex-col border border-color_7/30 min-h-60 max-h-[400px]'>
        <div className='flex items-center gap-3 justify-between'>
          <div className='flex gap-2 items-center'>
            <Sparkles className='w-5' />
            <h1 className='text-xl font-semibold'>Meta Descriptions</h1>
          </div>
          <button
            onClick={handleCopyMetaDescriptions}
            className='px-3 py-1 text-sm bg-color_8/60 text-white rounded-md hover:bg-color_8 transition'
          >
            Copy All
          </button>
        </div>

        {/* Render Meta Descriptions */}
        <div className='flex-1 flex flex-col gap-4 mt-6 overflow-auto'>
          {metaDescriptions.length > 0 ? (
            metaDescriptions.map((desc, index) => (
              <div key={index} className='p-3 border border-color_7/20 rounded-md text-sm text-color_4'>
                <p>{desc}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-color_4/70 italic mt-auto mb-auto">No meta descriptions generated yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SEOKeywordSuggestion