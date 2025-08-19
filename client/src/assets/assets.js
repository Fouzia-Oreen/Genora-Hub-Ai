import { Briefcase, Eraser, FileSearch, FileText, FileUser, Hash, Image, Mail, Megaphone, MessageCircle, Scissors, SpellCheck, SquarePen, Tag, UserRound, UsersRound, Video } from 'lucide-react';
import template1Img from './tem-1.png';
import template2Img from './tem-2.png';
import template3Img from './tem-3.png';
import template4Img from './tem-4.png';
import template5Img from './tem-5.png';
import template6Img from './tem-6.png';
import template7Img from './tem-7.png';




export const companyLogos = ["slack", "framer", "netflix", "google", "linkedin", "instagram", "facebook"];

export const categories = [
  { label: 'Writing & Content', value: 'writing' },
  { label: 'Marketing & SEO', value: 'marketing' },
  { label: 'Image Editing', value: 'image' }, 
  { label: 'Career & Development', value: 'career' }, 
];

export const navItems = [
  // writing tools
  { label: 'Write Article', Icon: SquarePen, to: '/ai/write-article' , category: "writing"},
  { label: 'Blog Generator', Icon: Hash, to: '/ai/blog-generator' , category: "writing"},
  { label: 'Text Summarizer', Icon: FileSearch, to: '/ai/text-summarize', category: "writing" },
  { label: 'Grammar & Rewriter', Icon: SpellCheck, to: '/ai/grammar-rewriter', category: "writing" },
  // marketing tools
  { label: 'Product Description', Icon: Tag, to: '/ai/product-description', category: "marketing" },
  { label: 'Social Media Caption', Icon: MessageCircle, to: '/ai/social-caption-generator' , category: "marketing"},
  { label: 'Generate YouTube Script', Icon: Video, to: '/ai/youtube-script-generator' , category: "marketing"},
  { label: 'Ad Copy Generator', Icon: Megaphone, to: '/ai/ad-copy-generator', category: "marketing" },
  // image tools
  { label: 'Generate Images', Icon: Image, to: '/ai/generate-images', category: "image" },
  { label: 'Remove Background', Icon: Eraser, to: '/ai/remove-background' , category: "image"},
  { label: 'Remove Object', Icon: Scissors, to: '/ai/remove-object' , category: "image"},
  // career tools
  { label: 'Respond to AI Email', Icon: Mail, to: '/ai/email-respond' , category: "career"},
  { label: 'Review Resume', Icon: FileText, to: '/ai/review-resume' , category: "career"},
  { label: 'Generate Cover Letter', Icon: FileUser, to: '/ai/cover-letter-generator', category: "career" },
  { label: 'Built Your Resume', Icon: Briefcase, to: '/ai/resume-builder' , category: "career"},
  // community
  { label: 'Community', Icon: UsersRound, to: '/ai/community' },
  { label: 'My Profile', Icon: UserRound, to: '/ai/profile' },

];

export const AiToolsData = [
  // writing
  {
    title: 'AI Article Writer',
    description: 'Write full-length, engaging articles on any topic using advanced AI — perfect for blogs, news, or storytelling.',
    Icon: SquarePen,
    bg: { from: '#0073FF', to: '#00C3FF' },
    path: '/ai/write-article',
    category: 'writing'
  },
  {
    title: 'Blog Title Generator',
    description: 'Craft click-worthy and SEO-optimized blog titles in seconds to boost your traffic.',
    Icon: Hash,
    bg: { from: '#A83378', to: '#F857A4' },
    path: '/ai/blog-generator',
    category: 'writing'
  },
  {
    title: 'Text Summarizer',
    description: 'Condense long paragraphs into clear, structured summaries — short, medium, or detailed.',
    Icon: FileSearch,
    bg: { from: '#6366F1', to: '#8B5CF6' },
    path: 'ai/text-summarize',
    category: 'writing'
  },
  {
    title: 'Grammar ReWriter',
    description: 'Fix grammar, improve clarity, and rewrite sentences professionally using AI assistance.',
    Icon: SpellCheck,
    bg: { from: '#0EA5E9', to: '#38BDF8' },
    path: 'ai/grammar-rewriter',
    category: 'writing'
  },
  // marketing
  {
    title: 'Social Media Caption Generator',
    description: 'Generate catchy, platform-optimized captions that align with trends and tone.',
    Icon: MessageCircle,
    bg: { from: '#6EE7B7', to: '#3B82F6' },
    path: '/ai/social-caption-generator',
    category: 'marketing'
  },
  {
    title: 'YouTube Script Generator',
    description: 'Build structured video scripts with engaging intros, content hooks, and CTAs.',
    Icon: Video,
    bg: { from: '#FCA5A5', to: '#F87171' },
    path: '/ai/youtube-script-generator',
    category: 'marketing'
  },
  {
    title: 'Product Description Generator',
    description: 'Write persuasive and platform-friendly product descriptions to drive conversions.',
    Icon: Tag,
    bg: { from: '#FDBA74', to: '#FB923C' },
    path: '/ai/product-description',
    category: 'marketing'
  },
  {
    title: 'Ad Copy Generator',
    description: 'Generate compelling and high-converting ad copies for your campaigns and platforms.',
    Icon: Megaphone,
    bg: { from: '#FDE68A', to: '#F59E0B' },
    path: '/ai/ad-copy-generator',
    category: 'marketing'
  },
  // images
  {
    title: 'AI Image Generation',
    description: 'Create artistic, photorealistic, or abstract images from simple text prompts.',
    Icon: Image,
    bg: { from: '#20C363', to: '#20996E' },
    path: '/ai/generate-images',
    category: 'image'
  },
  {
    title: 'Background Removal',
    description: 'Remove image backgrounds with a single click — perfect for eCommerce, design, or profile pics.',
    Icon: Eraser,
    bg: { from: '#FF4D21', to: '#FF8F67' },
    path: '/ai/remove-background',
    category: 'image'
  },
  {
    title: 'Object Removal',
    description: 'Erase unwanted objects or distractions from any image using smart detection AI.',
    Icon: Scissors,
    bg: { from: '#673AB7', to: '#A044FF' },
    path: '/ai/remove-object',
    category: 'image'
  },
  // career
  {
    title: 'Resume Reviewer',
    description: 'Get instant, AI-driven feedback on your resume layout, content, and keyword optimization.',
    Icon: FileText,
    bg: { from: '#F2C84C', to: '#F29A4A' },
    path: '/ai/review-resume',
    category: 'career'
  },
  {
    title: 'Cover-Letter Generator',
    description: 'Generate personalized and job-specific cover letters that align with your resume.',
    Icon: FileUser,
    bg: { from: '#FFD54F', to: '#FFB74D' },
    path: '/ai/cover-letter-generator',
    category: 'career'
  },
  {
    title: 'Resume Builder',
    description: 'Design and export polished resumes with AI-suggested templates and section guides.',
    Icon: Briefcase,
    bg: { from: '#6366F1', to: '#8B5CF6' },
    path: '/ai/resume-builder',
    category: 'career'
  },
  {
    title: 'AI Email Responder',
    description: 'Write professional replies to any email tone — friendly, formal, concise, or empathetic.',
    Icon: Mail,
    bg: { from: '#C084FC', to: '#9333EA' },
    path: '/ai/email-respond',
    category: 'career'
  }
];

export const dummyTestimonialData = [
    {
        image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
        name: 'John Doe',
        title: 'Content Writer, TechCorp',
        content: 'Genora Hub AI has transformed how I write. I can generate full blog posts and article outlines in minutes, giving me more time to focus on creativity. It’s my daily writing assistant now.',
        rating: 4,
    },
    {
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
        name: 'Jane Smith',
        title: 'Marketing Manager, Creatix',
        content: 'From stunning image generation to background removal, Genora Hub has been a lifesaver for our creative team. It simplifies our design workflow and saves us hours every week.',
        rating: 5,
    },
    {
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop',
        name: 'David Lee',
        title: 'Founder, IdeaBoost',
        content: 'Genora Hub is like having an entire creative agency in one tool. I use it to generate launch content, polish product visuals, and even refine resumes for hiring. Highly recommended!',
        rating: 4,
    },
]

export const resumeTemplates = [
  {
    id: '01',
    thumbnailImg: template1Img, 
    colorPaletteCODE: 'themeOne'
  },
  {
    id: '02', 
    thumbnailImg: template2Img, 
    colorPaletteCODE: 'themeTwo'
  },
  {
    id: '03',
    thumbnailImg: template3Img, 
    colorPaletteCODE: 'themeTwo'
  },
  {
    id: '04',
    thumbnailImg: template4Img, 
    colorPaletteCODE: 'themeTwo'
  },
  {
    id: '05',
    thumbnailImg: template5Img, 
    colorPaletteCODE: 'themeTwo'
  },
  {
    id: '06',
    thumbnailImg: template6Img, 
    colorPaletteCODE: 'themeTwo'
  },
  {
    id: '07',
    thumbnailImg: template7Img, 
    colorPaletteCODE: 'themeTwo'
  },
];

export const themeColorPalette = {
  themeOne : [
  // ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#00B8D8", "#4A5565"],
  // ["#E9FBF8", "#84EFE7", "#93E20A", "#2AC9A0", "#3D4C5A"],
  // ["#F5F4FF", "#E0DBFF", "#C9C2F8", "#8579D1", "#4B4B5C"],
  // ["#F0FAFF", "#06F0FF", "#AFDEFF", "#3399FF", "#445361"],
  // ["#FFF5F7", "#FFE0EC", "#FAC6D4", "#F6729C", "#5A5A5A"],
  // ["#F9FAFB", "#E4E7EB", "#CBD5E0", "#7F9CF5", "#2D3748"],
  // ["#F4FFFD", "#D3DFD2", "#B0E9D4", "#34C790", "#384C48"],
  // ["#FFF7F0", "#FFE609", "#FFD2BA", "#FF9561", "#4C4743"],
  // ["#F9FCFF", "#E3F0F9", "#C8DDEE", "#6CA6CF", "#46545E"],
  // ["#FFFDF6", "#FFF4D7", "#FFE7A0", "#FFD000", "#57534E"],
  // ["#EFFCFF", "#C8F0FF", "#99E0FF", "#007BA7", "#2B3A42"],
  // ["#F7F7F7", "#E4E4E4", "#CFCFCF", "#4A4A4A", "#222222"],
  // ["#E3F2FD", "#90CAF9", "#A8D2F4", "#1E88E5", "#0D47A1"],
      [ "#c5c5c5","#918c89","#55524f","#3a3635","#0a0a0a"],
      [ "#ffccd3","#faabb5","#ff7b91","#fd4f7b","#110005"],
      [ "#c2b2fa","#bba1fd","#b28df8","#935cd1","#09001a"],
      [ "#ffedd4","#ffd6a7","#fcab50","#fd7941","#140400"],
      [ "#dcfce7","#a4f4cf","#43ac8b","#04684a","#001611"],
      [ "#bedbff","#8ec5ff","#2b7fff","#155dfc","#00061d"],
      [ "#bae6fd","#7dd3fc","#06b6d4","#0e7490","#00161f"]
  ]
}

export const DUMMY_RESUME_DATA = {
  userId: 1,
  title: "Software Engineering Resume",
  thumbnailLink: {
    type: "image",
    colorPalette: ["#2C3E50", "#2980B9", "#ECF0F1", "#E74C3C", "#27AE60"],
  },
  profileInfo: {
    profileImg: null,
    previewUrl: '',
    fullName: "Arjun Malhotra",
    designation: "Full Stack Developer",
    summary:
      "Dedicated and detail-oriented Full Stack Developer with 5+ years of experience building scalable web applications. Skilled in JavaScript, React, Node.js, and modern cloud-based solutions. Passionate about delivering clean, efficient code and collaborating across teams.",
  },
  contactInfo: {    
    location: "123 Bangalore, India",
    phone: "+91 98765 43210",
    email: "arjun.malhotra@example.com",
    website: "https://arjunmalhotra.dev",
    linkedin: "https://linkedin.com/in/arjunmalhotra",
    github: "https://github.com/arjun-malhotra",
  },
  skills: [
    { name: "JavaScript", progress: 90 },
    { name: "React.js", progress: 85 },
    { name: "Node.js", progress: 80 },
    { name: "MongoDB", progress: 75 },
    { name: "TypeScript", progress: 70 },
    { name: "AWS", progress: 65 },
  ],
  workExperience: [
    {
      company: "Ingenious Group",
      role: "Software Engineer",
      startDate: "2021-06",
      endDate: "2023-07",
      description:
        "Built and maintained multiple SaaS platforms using MERN stack. Collaborated with product and design teams to create scalable features. Improved system performance by 30% with optimized queries.",
    },
    {
      company: "TechVision Labs",
      role: "Frontend Developer",
      startDate: "2018-05",
      endDate: "2021-05",
      description:
        "Developed responsive UI components with React and Redux. Integrated REST APIs and improved accessibility across applications. Mentored junior developers.",
    },
  ],
  education: [
    {
      institution: "Indian Institute of Technology (IIT), Delhi",
      degree: "B.Tech in Computer Science",
      startDate: "2014",
      endDate: "2018",
      description:
        "Focused on software engineering, algorithms, and system design. Led the Coding Club and organized hackathons.",
    },
  ],
  projects: [
    {
      title: "E-commerce Platform",
      link: "https://shopkart.dev",
      description:
        "Developed a multi-vendor MERN stack e-commerce app with authentication, product management, and secure payments.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    },
    {
      title: "AI Resume Builder",
      link: "https://resume-gen.dev",
      description:
        "Built an AI-powered resume generator with real-time preview and multiple templates.",
      technologies: ["Next.js", "Tailwind", "OpenAI API"],
    },
  ],
  languages: [
    { name: "English", progress: 95 },
    { name: "Hindi", progress: 85 },
    { name: "Kannada", progress: 70 },
  ],
  certifications: [
    {
      title: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services",
      year: "2022",
    },
    {
      title: "Full Stack Web Development Certification",
      issuer: "freeCodeCamp",
      year: "2020",
    },
  ],
  tools: [
    { name: "VS Code", progress: 95 },
    { name: "Git", progress: 90 },
    { name: "Postman", progress: 85 },
    { name: "Docker", progress: 70 },
  ],
  references: [
    {
      name: "Samantha Lee",
      designation: "CTO",
      company: "TechWave Solutions",
      phone: "+987-654-3210",
      email: "samantha@techwave.com",
    }
  ],
  interests: ["Coding", "Gaming", "Hiking"],
};
