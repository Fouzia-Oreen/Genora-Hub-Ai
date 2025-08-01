import OpenAI from 'openai'; 
import fs from 'fs'; 
// import pdf from 'pdf-parse';
import mammoth from 'mammoth'; 
import cloudinary from 'cloudinary'; 
import axios from 'axios'; 
import FormData from 'form-data';
import User from '../models/userSchema.js';
import Creation from '../models/creationSchema.js';

// Initialize OpenAI client for Gemini API
const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// Configure Cloudinary 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* --- Writing Features --- */

export const generateArticle = async (req, res) => {
  try {
    const { prompt, length } = req.body;
    const { user } = req; 
    const { plan, freeUsage } = user;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required.' });
    }

    if (plan === 'launch' && freeUsage >= 10) {
      return res.json({ success: false, message: 'Free usage limit exceeded. Upgrade to creator for more requests.' });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;

    await Creation.create({
      userId: user.clerkUserId, 
      prompt: prompt,
      content: content,
      type: 'article',
      publish: false, 
    });

    if (plan === 'launch') {
      await User.updateOne(
        { clerkUserId: user.clerkUserId },
        { $inc: { freeUsage: 1 } }
      );
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error('Error generating article:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateBlogTitleAndDescription = async (req, res) => {
  try {
    const { prompt, tab, category, descLength } = req.body;
    const { user } = req; 
    const { plan, freeUsage } = user;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required.' });
    }

    if (plan === 'launch' && freeUsage >= 10) {
      return res.json({ success: false, message: 'Free usage limit exceeded. Upgrade to continue.' });
    }

    let finalPrompt = '';
    let maxTokensForAI = 100;

    if (tab === 'Title') {
      finalPrompt = `Generate 3 catchy blog post titles about "${prompt}" in the "${category}" category.`;
      maxTokensForAI = 100;
    } else {
      finalPrompt = `Write a comprehensive blog post description of approximately ${descLength} words about "${prompt}" in the "${category}" category.`;
      maxTokensForAI = Math.ceil(descLength / 0.75);
      maxTokensForAI = Math.max(maxTokensForAI, 100);
      maxTokensForAI = Math.min(maxTokensForAI, 1600);
    }

    const response = await AI.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [{ role: 'user', content: finalPrompt }],
      temperature: 0.7,
      max_tokens: maxTokensForAI,
    });

    const content = response.choices[0].message.content;

    await Creation.create({
      userId: user.clerkUserId,
      prompt: finalPrompt,
      content: content,
      type: `blog-${tab.toLowerCase()}`,
      publish: false, 
    });

    if (plan === 'launch') {
      await User.updateOne(
        { clerkUserId: user.clerkUserId },
        { $inc: { freeUsage: 1 } }
      );
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error('Error generating blog content:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const summarizeText = async (req, res) => {
  try {
    const { inputText, selectedLength } = req.body;
    const { user } = req; 
    const { plan, freeUsage } = user;

    if (!inputText || inputText.trim() === '') {
      return res.status(400).json({ success: false, message: 'Text to summarize is required.' });
    }

    if (plan === 'launch' && freeUsage >= 10) {
      return res.json({ success: false, message: 'Free usage limit exceeded. Upgrade to continue.' });
    }

    let finalPrompt = `Summarize the following text into a ${selectedLength} length summary. Focus on the main points and key information.`;
    finalPrompt += `\n\nText to summarize:\n"${inputText}"`;

    const response = await AI.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [{ role: 'user', content: finalPrompt }],
      temperature: 0.4,
      max_tokens: 500,
    });

    const generatedSummary = response.choices[0].message.content;

    if (plan === 'launch') {
      await User.updateOne(
        { clerkUserId: user.clerkUserId },
        { $inc: { freeUsage: 1 } }
      );
    }

    await Creation.create({
      userId: user.clerkUserId,
      prompt: finalPrompt,
      content: generatedSummary,
      type: `text-summary-${selectedLength}`,
      publish: false, 
    });

    res.json({ success: true, content: generatedSummary.trim() });
  } catch (error) {
    console.error('Error generating text summary:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const processGrammarAndRewrite = async (req, res) => {
  try {
    const { inputText, selectedAction, selectedTone } = req.body;
    const { user } = req;
    const { plan, freeUsage } = user;

    if (!inputText || inputText.trim() === '') {
      return res.status(400).json({ success: false, message: 'Text to process is required.' });
    }
    if (!selectedAction) {
      return res.status(400).json({ success: false, message: 'Action is required.' });
    }
    if ((selectedAction === 'rephrase' || selectedAction === 'simplify') && !selectedTone) {
      return res.status(400).json({ success: false, message: 'Tone is required for this action.' });
    }

    if (plan === 'launch' && freeUsage >= 10) {
      return res.json({ success: false, message: 'Free usage limit exceeded. Upgrade to continue.' });
    }

    let finalPrompt = '';
    let typeForDb = '';

    switch (selectedAction) {
      case 'check grammar':
        finalPrompt = `Review the following text for any grammatical errors, spelling mistakes, and punctuation issues. Provide corrections and highlight the changes. If no changes are needed, state that the text is grammatically correct.\n\nText:\n"${inputText}"`;
        typeForDb = 'grammar-check';
        break;
      case 'rephrase':
        finalPrompt = `Rephrase the following text to convey the same meaning but in a ${selectedTone} tone. Ensure clarity and conciseness.\n\nText:\n"${inputText}"`;
        typeForDb = `rephrase-${selectedTone}`;
        break;
      case 'simplify':
        finalPrompt = `Simplify the following text to make it easier to understand, maintaining its core meaning. Adopt a ${selectedTone} tone.\n\nText:\n"${inputText}"`;
        typeForDb = `simplify-${selectedTone}`;
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid action selected.' });
    }

    const response = await AI.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [{ role: 'user', content: finalPrompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const processedText = response.choices[0].message.content;

    if (plan === 'launch') {
      await User.updateOne(
        { clerkUserId: user.clerkUserId },
        { $inc: { freeUsage: 1 } }
      );
    }

    await Creation.create({
      userId: user.clerkUserId,
      prompt: finalPrompt,
      content: processedText,
      type: typeForDb,
      publish: false, 
    });

    res.json({ success: true, content: processedText.trim() });
  } catch (error) {
    console.error('Error processing text for grammar/rewriter:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* --- Marketing Features --- */

export const generateSocialMediaCaption = async (req, res) => {
  try {
    const { prompt, selectedPlatform, selectedTone, wordCount, includeEmojis, includeHashtags } = req.body;
    const { user } = req;
    const { plan, freeUsage } = user;

    const platformRules = {
      Instagram: { maxLength: 2200, maxHashtags: 30 },
      Twitter: { maxLength: 280, maxHashtags: 5 },
      LinkedIn: { maxLength: 1300, maxHashtags: 5 },
      YouTube: { maxLength: 5000, maxHashtags: 15 },
      Facebook: { maxLength: 63206, maxHashtags: 30 },
    };

    const { maxLength, maxHashtags } = platformRules[selectedPlatform];

    if (plan === 'launch' && freeUsage >= 10) {
      return res.json({ success: false, message: 'Free usage limit exceeded. Upgrade to continue.' });
    }

    let finalPrompt = `Generate a social media caption for the following content: "${prompt}". `;
    finalPrompt += `The caption should be for ${selectedPlatform} and have a ${selectedTone} tone. `;
    finalPrompt += `${includeEmojis ? 'Include emojis.' : 'Do not include emojis.'} `;
    finalPrompt += `${includeHashtags ? 'Include relevant hashtags.' : 'Do not include hashtags.'} `;
    finalPrompt += `Keep the caption concise, aiming for around ${wordCount} words.`;

    const response = await AI.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [{ role: 'user', content: finalPrompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    let generatedCaption = response.choices[0].message.content;

    const words = generatedCaption.split(' ');
    if (words.length > wordCount) {
      generatedCaption = words.slice(0, wordCount).join(' ') + '...';
    }
    const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;

    if (!includeEmojis) {
      generatedCaption = generatedCaption.replace(emojiRegex, '');
    }
    let hashtagMatches = generatedCaption.match(/#[\w]+/g);
    if (!includeHashtags && hashtagMatches) {
      generatedCaption = generatedCaption.replace(/#[\w]+/g, '');
    } else if (hashtagMatches?.length > maxHashtags) {
      let allowedHashtags = hashtagMatches.slice(0, maxHashtags);
      generatedCaption = generatedCaption.replace(/#[\w]+/g, '').trim() + ' ' + allowedHashtags.join(' ');
    }
    if (generatedCaption.length > maxLength) {
      generatedCaption = generatedCaption.slice(0, maxLength - 3) + '...';
    }

    if (plan === 'launch') {
      await User.updateOne(
        { clerkUserId: user.clerkUserId },
        { $inc: { freeUsage: 1 } }
      );
    }


    await Creation.create({
      userId: user.clerkUserId,
      prompt: finalPrompt,
      content: generatedCaption,
      type: `social-caption-${selectedPlatform.toLowerCase()}`,
      publish: false, 
    });

    res.json({ success: true, content: generatedCaption.trim() });
  } catch (error) {
    console.error('Error generating social media caption:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateAdCopy = async (req, res) => {
  try {
    const { productService, keySellingPoints, selectedPlatform, selectedTone, selectedAdType } = req.body;
    const { user } = req; 
    const { plan, freeUsage } = user;

    if (!productService || productService.trim() === '') {
      return res.status(400).json({ success: false, message: 'Product/service name is required.' });
    }
    if (!keySellingPoints || keySellingPoints.trim() === '') {
      return res.status(400).json({ success: false, message: 'Key selling points are required.' });
    }

    if (plan === 'launch' && freeUsage >= 10) {
      return res.json({ success: false, message: 'Free usage limit exceeded. Upgrade to continue.' });
    }

    let finalPrompt = `Generate ${selectedAdType} ad copy for "${productService}".`;
    finalPrompt += `\n\nKey Selling Points: ${keySellingPoints}.`;
    finalPrompt += `\nTarget Platform: ${selectedPlatform}.`;
    finalPrompt += `\nThe ad copy should have a ${selectedTone} tone.`;
    finalPrompt += `\n\nEnsure it is highly engaging and optimized for conversions.`;

    const response = await AI.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [{ role: 'user', content: finalPrompt }],
      temperature: 0.9,
      max_tokens: 300,
    });

    const generatedAdCopy = response.choices[0].message.content;

    if (plan === 'launch') {
      await User.updateOne(
        { clerkUserId: user.clerkUserId },
        { $inc: { freeUsage: 1 } }
      );
    }

    await Creation.create({
      userId: user.clerkUserId,
      prompt: finalPrompt,
      content: generatedAdCopy,
      type: `ad-copy-${selectedPlatform.toLowerCase().replace(/\s/g, '-')}-${selectedTone.toLowerCase()}-${selectedAdType.toLowerCase().replace(/\s/g, '-')}`,
      publish: false, 
    });

    res.json({ success: true, content: generatedAdCopy.trim() });
  } catch (error) {
    console.error('Error generating ad copy:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateProductDescription = async (req, res) => {
  try {
    const { productName, keyFeatures, targetAudience, selectedTone, selectedLength } = req.body;
    const { user } = req; 
    const { plan, freeUsage } = user;

    if (!productName || productName.trim() === '') {
      return res.status(400).json({ success: false, message: 'Product name is required.' });
    }
    if (!keyFeatures || keyFeatures.trim() === '') {
      return res.status(400).json({ success: false, message: 'Key features are required.' });
    }

    if (plan === 'launch' && freeUsage >= 10) {
      return res.json({ success: false, message: 'Free usage limit exceeded. Upgrade to continue.' });
    }

    let finalPrompt = `Generate a ${selectedLength} product description for "${productName}".`;
    finalPrompt += `\n\nKey Features and Benefits: ${keyFeatures}.`;
    if (targetAudience && targetAudience.trim() !== '') {
      finalPrompt += `\nTarget Audience: ${targetAudience}.`;
    }
    finalPrompt += `\nThe description should have a ${selectedTone} tone.`;
    finalPrompt += `\n\nEnsure it is engaging, highlights benefits, and encourages purchase.`;

    const response = await AI.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [{ role: 'user', content: finalPrompt }],
      temperature: 0.8,
      max_tokens: 500,
    });

    const generatedDescription = response.choices[0].message.content;

    if (plan === 'launch') {
      await User.updateOne(
        { clerkUserId: user.clerkUserId },
        { $inc: { freeUsage: 1 } }
      );
    }


    await Creation.create({
      userId: user.clerkUserId,
      prompt: finalPrompt,
      content: generatedDescription,
      type: `product-description-${selectedTone}-${selectedLength}`,
      publish: false, 
    });

    res.json({ success: true, content: generatedDescription.trim() });
  } catch (error) {
    console.error('Error generating product description:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateYouTubeScript = async (req, res) => {
  try {
    const { topic, selectedVibe } = req.body;
    const { user } = req;
    const { plan, youtubeScriptDailyCount } = user; 

    if (!topic || topic.trim() === '') {
      return res.status(400).json({ success: false, message: 'Topic is required.' });
    }

    if (plan === 'creator' && youtubeScriptDailyCount >= 10) {
      return res.json({ success: false, message: 'Daily usage limit exceeded for YouTube Script Generation. Upgrade or try again tomorrow.' });
    }
    if (plan === 'launch') {
      return res.status(403).json({ success: false, message: 'This feature is not available for the Launch plan. Upgrade to Creator or Studio.' });
    }

    let finalPrompt = `Generate a YouTube video script outline for a video about "${topic}". `;
    finalPrompt += `The script should have a ${selectedVibe} vibe. `;
    finalPrompt += `Include an engaging introduction, 2-3 main segments with bullet points, and a strong call to action/conclusion. `;
    finalPrompt += `Make it suitable for a YouTube audience.`;

    const response = await AI.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [{ role: 'user', content: finalPrompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const generatedScript = response.choices[0].message.content;

    if (plan === 'creator') {
      await User.updateOne(
        { clerkUserId: user.clerkUserId },
        { $inc: { youtubeScriptDailyCount: 1 } }
      );
    }

    await Creation.create({
      userId: user.clerkUserId,
      prompt: finalPrompt,
      content: generatedScript,
      type: `youtube-script-${selectedVibe.toLowerCase()}`,
      publish: false, 
    });

    res.json({ success: true, content: generatedScript.trim() });
  } catch (error) {
    console.error('Error generating YouTube script:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* --- Image Features --- */

export const generateImages = async (req, res) => {
  try {
    const { prompt, selectedImageStyle, publish } = req.body;
    const { user } = req; 
    const { plan, imageGenerationDailyCount } = user; 

    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({ success: false, message: 'Image prompt is required.' });
    }

    if (plan === 'launch') {
      if (imageGenerationDailyCount >= 3) {
        return res.status(403).json({ success: false, message: 'Daily usage limit exceeded for Image Generation (3 images per day). Upgrade to Creator or Studio.' });
      }
    } else if (plan === 'creator') {
      if (imageGenerationDailyCount >= 10) {
        return res.status(403).json({ success: false, message: 'Daily usage limit exceeded for Image Generation (10 images per day). Upgrade to Studio or try again tomorrow.' });
      }
    }

    let finalClipdropPrompt = prompt;
    if (selectedImageStyle === 'Realistic') {
      finalClipdropPrompt += ', photorealistic, ultra-detailed, 8k, high resolution, sharp focus, cinematic lighting, professional photography';
    } else {
      finalClipdropPrompt += `, ${selectedImageStyle} style`;
    }

    const formData = new FormData();
    formData.append('prompt', finalClipdropPrompt);

    const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
      headers: {
        ...formData.getHeaders(),
        'x-api-key': process.env.CLIPDROP_API_KEY,
      },
      responseType: 'arraybuffer',
    });

    const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image, {
      folder: 'Genora',
    });

    
    if (plan === 'launch' || plan === 'creator') {
      await User.updateOne(
        { clerkUserId: user.clerkUserId },
        { $inc: { imageGenerationDailyCount: 1 } }
      );
    }

    await Creation.create({
      userId: user.clerkUserId,
      prompt: finalClipdropPrompt,
      content: secure_url,
      type: `image-generation-${selectedImageStyle.toLowerCase().replace(/\s/g, '-')}`,
      publish: publish,
      likes: [],
    });

    res.json({ success: true, secure_url });
  } catch (error) {
    console.error('Error generating image:', error);
    if (error.response && error.response.data) {
      console.error('API error response data:', error.response.data);
    }
    res.status(500).json({ success: false, message: error.message || 'An error occurred during image generation.' });
  }
};

export const removeBackground = async (req, res) => {
  try {
    const { user } = req;
    const { plan } = user;
    const imagePath = req.file.path;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required.' });
    }

    if (plan === 'launch') {
      if (backgroundRemovalDailyCount >= 3) {
        return res.status(403).json({ success: false, message: 'Daily usage limit exceeded for Background Removal (3 images per day). Upgrade to Creator or Studio.' });
      }
    } else if (plan === 'creator') {
      if (backgroundRemovalDailyCount >= 10) {
        return res.status(403).json({ success: false, message: 'Daily usage limit exceeded for Background Removal (10 images per day). Upgrade to Studio or try again tomorrow.' });
      }
    }

    const formData = new FormData();
    formData.append('image_file', fs.createReadStream(imagePath));

    const { data } = await axios.post('https://clipdrop-api.co/remove-background/v1', formData, {
      headers: {
        ...formData.getHeaders(),
        'x-api-key': process.env.CLIPDROP_API_KEY,
      },
      responseType: 'arraybuffer',
    });

    const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image, {
      folder: 'Genora',
    });

    if (plan === 'launch') {
      await User.updateOne(
        { clerkUserId: user.clerkUserId },
        { $inc: { backgroundRemovalDailyCount: 1 } }
      );
    }

    await Creation.create({
      userId: user.clerkUserId,
      prompt: 'Background removed with Clipdrop',
      content: secure_url,
      type: 'background-removal',
      publish: false,
    });

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error('Error removing background:', error);
    if (error.response && error.response.data) {
      console.error('API error response data:', error.response.data);
    }
    res.status(500).json({ success: false, message: error.message || 'An error occurred during background removal.' });
  } finally {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    }
  }
};

export const removeObject = async (req, res) => {
  try {
    const { object } = req.body;
    const { user } = req; 
    const { plan } = user;
    const imagePath = req.file.path;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required.' });
    }
    if (!object || object.trim() === '') {
      return res.status(400).json({ success: false, message: 'Description of object to remove is required.' });
    }

    if (plan === 'launch') {
      return res.status(403).json({ success: false, message: 'This feature is not available for the Launch plan. Upgrade to Creator or Studio.' });
    }

    const { public_id } = await cloudinary.uploader.upload(imagePath, {
      folder: 'Genora',
    });

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:prompt_${object}` }],
      resource_type: 'image'
    });

    await Creation.create({
      userId: user.clerkUserId,
      prompt: `Removed '${object}' from image`,
      content: imageUrl,
      type: 'object-removal',
      publish: false, 
    });

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.error('Error removing object:', error);
    if (error.response && error.response.data) {
      console.error('Cloudinary error response:', error.response.data);
    }
    if (error.message.includes('generative_remove is not enabled')) {
      res.status(400).json({ success: false, message: 'Cloudinary Generative AI add-on is not enabled for your account. Please enable it to use this feature.' });
    } else {
      res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
    }
  } finally {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    }
  }
};

/* --- Career Features --- */

export const generateCoverLetter = async (req, res) => {
  try {
    const { resumeText, jobDescription, selectedTone } = req.body;
    const { user } = req;
    const { plan, freeUsage } = user;

    if (!resumeText || resumeText.trim() === '') {
      return res.status(400).json({ success: false, message: 'Resume text is required.' });
    }
    if (!jobDescription || jobDescription.trim() === '') {
      return res.status(400).json({ success: false, message: 'Job description is required.' });
    }

    if (plan === 'launch' && freeUsage >= 10) {
      return res.json({ success: false, message: 'Free usage limit exceeded. Upgrade to continue.' });
    }

    let finalPrompt = `Generate a cover letter based on the provided resume text and job description.`;
    finalPrompt += `The cover letter should adopt a ${selectedTone} tone.`;
    finalPrompt += `\n\nResume Text:\n"${resumeText}"`;
    finalPrompt += `\n\nJob Description:\n"${jobDescription}"`;
    finalPrompt += `\n\nEnsure the cover letter highlights relevant skills and experiences from the resume that match the job description, and is concise and impactful.`;

    const response = await AI.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [{ role: 'user', content: finalPrompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const generatedCoverLetter = response.choices[0].message.content;

    // Increment free usage for 'launch' plan in MongoDB
    if (plan === 'launch') {
      await User.updateOne(
        { clerkUserId: user.clerkUserId },
        { $inc: { freeUsage: 1 } }
      );
    }

    // Store creation in MongoDB
    await Creation.create({
      userId: user.clerkUserId,
      prompt: finalPrompt,
      content: generatedCoverLetter,
      type: `cover-letter-${selectedTone}`,
      publish: false, 
    });

    res.json({ success: true, content: generatedCoverLetter.trim() });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateEmailResponse = async (req, res) => {
  try {
    const { emailText, tone } = req.body;
    const { user } = req; 
    const { plan, emailResponseDailyCount } = user; 

    if (!emailText || emailText.trim() === '') {
      return res.status(400).json({ success: false, message: 'Email text is required.' });
    }

    if (plan === 'launch') {
      return res.status(403).json({ success: false, message: 'This feature is not available for the Launch plan. Upgrade to Creator or Studio.' });
    }

    if ((plan === 'creator' || plan === 'studio') && emailResponseDailyCount >= 10) { 
      return res.json({ success: false, message: 'Daily usage limit exceeded for Email Response (10 per day). Try again tomorrow.' });
    }

    let finalPrompt = `Generate a ${tone} email response to the following email:\n\n"${emailText}"\n\nEnsure the response is polite, relevant, and addresses the key points of the original email.`;

    const response = await AI.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [{ role: 'user', content: finalPrompt }],
      temperature: 0.7,
      max_tokens: 700, 
    });

    const generatedEmailResponse = response.choices[0].message.content;


    if (plan === 'creator' || plan === 'studio') {
      await User.updateOne(
        { clerkUserId: user.clerkUserId },
        { $inc: { emailResponseDailyCount: 1 } }
      );
    }

    await Creation.create({
      userId: user.clerkUserId,
      prompt: finalPrompt,
      content: generatedEmailResponse,
      type: `email-response-${tone}`,
      publish: false, 
    });

    res.json({ success: true, content: generatedEmailResponse.trim() });

  } catch (error) {
    console.error('Error generating email response:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { user } = req; 
    const { plan, reviewResumeDailyCount } = user; 

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Resume file is required.' });
    }

    const resumeFile = req.file;

    if (resumeFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: "Resume size exceeds allowed size (5MB)." });
    }

    if (plan === 'launch') {
      return res.status(403).json({ success: false, message: 'This feature is not available for the Launch plan. Upgrade to Creator or Studio.' });
    } else if (plan === 'creator' || plan === 'studio') {
      if (reviewResumeDailyCount >= 3) {
        return res.json({ success: false, message: 'Daily usage limit exceeded for Resume Review (3 reviews per day). Try again tomorrow.' });
      }
    }

    let resumeContentText = '';
    const fileBuffer = fs.readFileSync(resumeFile.path);

    if (resumeFile.mimetype === 'application/pdf') {
      const data = await pdf(fileBuffer);
      resumeContentText = data.text;
    } else if (resumeFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      resumeContentText = result.value;
    } else if (resumeFile.mimetype === 'text/plain' || resumeFile.mimetype === 'text/markdown') {
      resumeContentText = fileBuffer.toString('utf8');
    } else {
      return res.status(400).json({ success: false, message: 'Unsupported file type. Please upload a PDF, DOCX, TXT, or MD file.' });
    }

    const prompt = `Review the following resume content. Provide a comprehensive "review_text" focusing on strengths, weaknesses, and areas for improvement. Assign a "performance_score" out of 100 based on the resume's overall quality, impact, and relevance for a job application. Finally, provide specific, actionable "excel_feedback" on how to significantly improve the resume to make a great impression and increase its chances of success.

    Resume Content:
    ${resumeContentText}

    Respond in JSON format with the following structure:
    {
      "review_text": "Your detailed review here...",
      "performance_score": 85,
      "excel_feedback": "Actionable advice for improvement..."
    }`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            review_text: { type: "STRING" },
            performance_score: { type: "NUMBER" },
            excel_feedback: { type: "STRING" }
          },
          required: ["review_text", "performance_score", "excel_feedback"]
        }
      }
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!result.candidates || result.candidates.length === 0 || !result.candidates[0].content || !result.candidates[0].content.parts || result.candidates[0].content.parts.length === 0) {
      throw new Error('AI model did not return expected content structure.');
    }

    const aiResponseJsonString = result.candidates[0].content.parts[0].text;
    const parsedResult = JSON.parse(aiResponseJsonString);

    const { review_text, performance_score, excel_feedback } = parsedResult;

    if (plan === 'creator' || plan === 'studio') {
      await User.updateOne(
        { clerkUserId: user.clerkUserId },
        { $inc: { reviewResumeDailyCount: 1 } }
      );
    }

    await Creation.create({
      userId: user.clerkUserId,
      prompt: prompt, 
      content: JSON.stringify({ review_text, performance_score, excel_feedback }), 
      type: 'resume-review',
      publish: false, 
    });

    res.json({ success: true, review_text, performance_score, excel_feedback, parsed_resume_text: resumeContentText });
  } catch (error) {
    console.error('Error in resumeReview:', error);
    res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred.' });
  } finally {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    }
  }
};
