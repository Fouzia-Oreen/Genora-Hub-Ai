import { Briefcase, Eraser, FileSearch, FileText, FileUser, Hash, Image, Mail, Megaphone, MessageCircle, Scissors, SpellCheck, SquarePen, Tag, UserRound, UsersRound, Video } from 'lucide-react';
import template_1 from '../assets/templates/template-2.webp'
import template_2 from '../assets/templates/template-3.webp'
import template_3 from '../assets/templates/template-5.webp'
import arrow_icon from "./arrow_icon.svg";
import gradientBackground from "./gradientBackground.png";


export const assets = {
    gradientBackground,
    arrow_icon,
};

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

export const resumeReviewData = [
  {
    title : 'Tailoring',
    actions : ['Hard Skills', 'Soft Skills', 'Achievements'],
  },
  {
    title : 'Content',
    actions : ['ATS Prase Rate', 'Quantifying Impact', 'Repetitions', 'Buzzwords', 'Spelling & Grammar', 'Length & Depth'],
  },
  {
    title : 'Section',
    actions : ['Essential Section', 'Contact Information', 'Formatting', 'Visual Appeal', 'Consistency'],
  },
  {
    title : 'File & Design',
    actions : ['File Format & Size', 'Design', 'Email Design', 'Hyperlink & Header'],
  },
]

export const mockFetchResumes = [
  {
    _id: 'resume1',
    title: 'Software Engineer Resume',
    thumbnailLink: template_1,
    profileInfo: { fullName: 'Alice Johnson' },
    updatedAt: '2023-01-15T10:00:00Z'
  },
  {
    _id: 'resume2',
    title: 'Product Manager CV',
    thumbnailLink: template_2,
    profileInfo: { fullName: 'Bob Williams' },
    updatedAt: '2023-03-20T14:30:00Z'
  },
  {
    _id: 'resume3',
    title: 'Data Scientist Portfolio',
    thumbnailLink: template_3,
    profileInfo: { fullName: 'Charlie Brown' },
    updatedAt: '2023-05-01T09:15:00Z'
  },
]
