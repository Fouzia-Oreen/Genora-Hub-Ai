import { clerkClient } from "@clerk/express";
import User from "../models/userSchema.js";


export const auth = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth();

    if (!userId || !has) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }


    const clerkUser = await clerkClient.users.getUser(userId);
    let privateMetadata = clerkUser.privateMetadata || {};

    let userPlan;
    if (await has({ plan: "studio" })) {
      userPlan = "studio";
    } else if (await has({ plan: "creator" })) {
      userPlan = "creator";
    } else {
      userPlan = "launch"; 
    }
    req.plan = userPlan; 

    let mongoUser = await User.findOne({ clerkUserId: userId });

    const today = new Date().toISOString().slice(0, 10);
    let shouldUpdateClerkMetadata = false;
    let shouldUpdateMongoUser = false;
    const updateFields = {}; 

    if (!mongoUser) {
      mongoUser = await User.create({
        clerkUserId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        username: clerkUser.username || clerkUser.firstName,
        profileImageUrl: clerkUser.imageUrl,
        plan: userPlan, 
        imageGenerationDailyCount: privateMetadata.image_generation_daily_count ?? 0,
        reviewResumeDailyCount: privateMetadata.review_resume_daily_count ?? 0,
        builtResumeDailyCount: privateMetadata.built_resume_daily_count ?? 0,
        emailResponseLastDate: privateMetadata.email_response_last_date ?? '1970-01-01',
        imageGenerationLastDate: privateMetadata.image_generation_last_date ?? '1970-01-01',
        youtubeScriptLastDate: privateMetadata.youtube_script_last_date ?? '1970-01-01',
        reviewResumeLastDate: privateMetadata.review_resume_last_date ?? '1970-01-01',
        builtResumeLastDate: privateMetadata.built_resume_last_date ?? '1970-01-01',
        freeUsage: privateMetadata.free_usage ?? 0,
      });
      shouldUpdateMongoUser = false; 
      console.log('New user created in MongoDB:', mongoUser.clerkUserId);
    } else {
      if (mongoUser.plan !== userPlan) {
        updateFields.plan = userPlan;
        shouldUpdateMongoUser = true;
      }

      // Email Response Daily Count (10 per day for Creator/Studio)
      if (userPlan === 'creator' || userPlan === 'studio') {
          if (mongoUser.emailResponseLastDate !== today) {
              updateFields.emailResponseDailyCount = 0;
              updateFields.emailResponseLastDate = today;
              privateMetadata.email_response_daily_count = 0; 
              privateMetadata.email_response_last_date = today; 
              shouldUpdateClerkMetadata = true;
              shouldUpdateMongoUser = true;
          }
      }

      // Image Generation Daily Count (10 per day for Creator)
      if (userPlan === 'creator') {
          if (mongoUser.imageGenerationLastDate !== today) {
              updateFields.imageGenerationDailyCount = 0;
              updateFields.imageGenerationLastDate = today;
              privateMetadata.image_generation_daily_count = 0; 
              privateMetadata.image_generation_last_date = today; 
              shouldUpdateClerkMetadata = true;
              shouldUpdateMongoUser = true;
          }
      }

      // YouTube Script Daily Count (10 per day for Creator)
      if (userPlan === 'creator') {
          if (mongoUser.youtubeScriptLastDate !== today) {
              updateFields.youtubeScriptDailyCount = 0;
              updateFields.youtubeScriptLastDate = today;
              privateMetadata.youtube_script_daily_count = 0; 
              privateMetadata.youtube_script_last_date = today; 
              shouldUpdateClerkMetadata = true;
              shouldUpdateMongoUser = true;
          }
      }

      // Review Resume Daily Count (3 per day for Creator/Studio)
      if (userPlan === 'creator' || userPlan === 'studio') {
          if (mongoUser.reviewResumeLastDate !== today) {
              updateFields.reviewResumeDailyCount = 0;
              updateFields.reviewResumeLastDate = today;
              privateMetadata.review_resume_daily_count = 0; 
              privateMetadata.review_resume_last_date = today; 
              shouldUpdateClerkMetadata = true;
              shouldUpdateMongoUser = true;
          }
      }

      // Built Your Resume Daily Count (10 per day for Studio)
      if (userPlan === 'studio') {
          if (mongoUser.builtResumeLastDate !== today) {
              updateFields.builtResumeDailyCount = 0;
              updateFields.builtResumeLastDate = today;
              privateMetadata.built_resume_daily_count = 0; 
              privateMetadata.built_resume_last_date = today; 
              shouldUpdateClerkMetadata = true;
              shouldUpdateMongoUser = true;
          }
      }

      // If any updates are needed for the MongoDB user
      if (shouldUpdateMongoUser && Object.keys(updateFields).length > 0) {
        await User.updateOne({ clerkUserId: userId }, { $set: updateFields });
        mongoUser = await User.findOne({ clerkUserId: userId });
      }
    }

    req.user = mongoUser; 

    if (shouldUpdateClerkMetadata) {
        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: privateMetadata 
        });
    }

    next(); 
  } catch (error) {
    console.error("Error in auth middleware:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
