import express from 'express';
import { upload } from '../config/multer.js';
import {
    generateAdCopy,
    generateArticle,
    generateBlogTitleAndDescription,
    generateCoverLetter,
    generateEmailResponse,
    generateImages,
    generateProductDescription,
    generateSocialMediaCaption,
    generateYouTubeScript,
    processGrammarAndRewrite,
    removeBackground,
    removeObject,
    resumeReview,
    summarizeText
} from '../controllers/aiController.js';
import { auth } from '../middlewares/auth.js';

const aiRouter = express.Router();

/* --- Writing Features --- */
aiRouter.post('/generate-article', auth, generateArticle);
aiRouter.post('/generate-blog', auth, generateBlogTitleAndDescription);
aiRouter.post('/generate-social-caption', auth, generateSocialMediaCaption);
aiRouter.post('/summarize-text', auth, summarizeText);
aiRouter.post('/process-grammar-rewrite', auth, processGrammarAndRewrite);

/* --- Marketing Features --- */
aiRouter.post('/generate-youtube-script', auth, generateYouTubeScript);
aiRouter.post('/generate-product-description', auth, generateProductDescription);
aiRouter.post('/generate-ad', auth, generateAdCopy); 

/* --- Image Features --- */
aiRouter.post('/generate-image', auth, generateImages);
aiRouter.post('/remove-background', upload.single('image'), auth, removeBackground);
aiRouter.post('/remove-object', upload.single('image'), auth, removeObject);

/* --- Career Features --- */
aiRouter.post('/generate-email-response', auth, generateEmailResponse);
aiRouter.post('/generate-cover-letter', auth, generateCoverLetter);
aiRouter.post('/review-resume', upload.single('resume'), auth, resumeReview);


export default aiRouter;