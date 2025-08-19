/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { LucideArrowLeft, LucideArrowRight, LucideCircleAlert, LucideDownload, LucidePalette, LucideSave, LucideTrash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import AdditionalInfoForm from '../../../components/resumeBuilt/forms/AdditionalInfoForm';
import CertificationsInfoForm from '../../../components/resumeBuilt/forms/CertificationsInfoForm';
import ContactInfoForm from '../../../components/resumeBuilt/forms/ContactInfoForm';
import EducationInfoForm from '../../../components/resumeBuilt/forms/EducationInfoForm';
import ProfileInfoForm from '../../../components/resumeBuilt/forms/ProfileInfoForm';
import ProjectsInfoForm from '../../../components/resumeBuilt/forms/ProjectsInfoForm';
import ReferencesInfoForm from '../../../components/resumeBuilt/forms/ReferencesInfoForm';
import SkillInfoForm from '../../../components/resumeBuilt/forms/SkillInfoForm';
import ToolsInfoForm from '../../../components/resumeBuilt/forms/ToolsInfoForm';
import WorkExperienceInfoForm from '../../../components/resumeBuilt/forms/WorkExperienceInfoForm';
import Modal from '../../../components/resumeBuilt/resumeSections/Modal';
import StepProgress from '../../../components/resumeBuilt/resumeSections/StepProgress';
import { ThemeSelector } from '../../../components/resumeBuilt/resumeSections/ThemeSelector';
import TitleInput from '../../../components/resumeBuilt/resumeSections/TitleInput';
import RenderResume from '../../../components/resumeBuilt/template/RenderResume';
import { captureElementAsImage, dataURLtoFile, fixTailwindColors } from '../../../helper';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const EditResume = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const resumeRef = useRef(null)
  const resumeDownloadRef = useRef(null)

  const { getToken } = useAuth();

  const [baseWidth, setBaseWidth] = useState(800);
  const [openThemeSelector, setOpenThemeSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("profile-info");
  const [selectedToolsDesign, setSelectedToolsDesign] = useState("1");
  const [progress, setProgress] = useState(0);
  const [resumeData, setResumeData] = useState({
    title : "",
    thumbLink : "",
    profileInfo : { profileImg: null, profilePreviewUrl: "", fullName : "", designation : "", summary : "",},
    template : { theme : "", colorPalette : ""}, 
    contactInfo : {email: "", phone: "", location : "", linkedIn : "", github : "", website : ""},
    workExperience: [], 
    education: [],
    skills: [],
    tools : [{ name : "", progress : 0}],
    projects : [{ title: "", description :"", github : "", liveDemo:""}],
    certifications : [{ title: "", issuer: "", year: "",}],
    languages: [{ name: "", progress: 0,}],
    references: [{ name: "", designation: "", company: "", phone: "", email: ""}],
    interests: [""] 
  });

  const [errorMsg, setErrorMsg] = useState("")
  const [loading, setLoading] = useState(true);


  const validateAndNext = () => {
    const errors = [];
    setErrorMsg(""); 

    switch (currentPage) {
      case "profile-info": {
        const { fullName, designation, summary } = resumeData.profileInfo;
        if (!fullName.trim()) errors.push("Full Name is required");
        if (!designation.trim()) errors.push("Designation is required");
        if (!summary.trim()) errors.push("Summary is required");
        break;
      }
      case "contact-info": {
        const { email, phone } = resumeData.contactInfo;
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
          errors.push("A valid email is required.");
        }
        if (!phone.trim()) {
          errors.push("Valid 10-digit phone number is required.");
        }
        break;
      }
      case "work-experience": {
        const activeWorkExperience = resumeData.workExperience.filter(
          (entry) => entry.company?.trim() || entry.role?.trim() || entry.description?.trim()
        );
        if (activeWorkExperience.length > 0) {
          activeWorkExperience.forEach(({ company, role, startDate, endDate }, index) => {
            if (!company?.trim()) errors.push(`Company name is required for work experience ${index + 1}.`);
            if (!role?.trim()) errors.push(`Role is required for work experience ${index + 1}.`);
            if (!startDate || !endDate) errors.push(`StartDate, EndDate is required for work experience ${index + 1}.`);
          });
        }
        break;
      }
      case "education": {
        const activeEducationEntries = resumeData.education.filter(
          (entry) => entry && (entry.degree?.trim() || entry.institution?.trim() || entry.description?.trim())
        );

        if (activeEducationEntries.length === 0) {
          errors.push("At least one education entry is required.");
        } else {
          activeEducationEntries.forEach((entry, index) => {
            if (!entry.degree?.trim()) {
              errors.push(`Degree is required for education entry ${index + 1}.`);
            }
            if (!entry.institution?.trim()) {
              errors.push(`Institute is required for education entry ${index + 1}.`);
            }
            if (!entry.startDate || !entry.endDate) {
              errors.push(`Start date and end date are required for education entry ${index + 1}.`);
            }
          });
        }
        break;
      }
      case "skills": {
        // resumeData.skills.forEach(({name, progress}, index) => {
        //   if (!name.trim()) {
        //     errors.push(`Skill name is required for skill ${index + 1}.`);
        //   }
        //   // Optional: Add a check for progress value
        //   if (progress < 1 || progress > 100) {
        //     errors.push(`Progress for skill ${index + 1} must be between 0 and 100.`);
        //   }
        // });
      const activeSkills = resumeData.skills.filter((entry) => entry.name?.trim());
        if (activeSkills.length > 0) {
          activeSkills.forEach(({ name, progress }, index) => {
            if (!name?.trim()) errors.push(`Skill name is required for skill ${index + 1}.`);
            if (progress < 0 || progress > 100) errors.push(`Progress for skill ${index + 1} must be between 0 and 100.`);
          });
        }
        break;
      }
      case "tools": {
        resumeData.tools.forEach(({name, progress}, index) => {
          if (!name.trim()) {
            errors.push(`Tools name is required for skill ${index + 1}.`);
          }
          // Optional: Add a check for progress value
          if (progress < 1 || progress > 100) {
            errors.push(`Progress for skill ${index + 1} must be between 0 and 100.`);
          }
        });
        break;
      }
      case "projects": {
        const activeProjects = resumeData.projects.filter(
          (entry) => entry.title?.trim() || entry.description?.trim()
        );
        if (activeProjects.length > 0) {
          activeProjects.forEach(({ title, description }, index) => {
            if (!title?.trim()) errors.push(`Project title is required for project ${index + 1}.`);
            if (!description?.trim()) errors.push(`Project description is required for project ${index + 1}.`);
          });
        }
        break;
      }
      case "certifications": {
        const activeCertifications = resumeData.certifications.filter(
          (entry) => entry.title?.trim() || entry.issuer?.trim()
        );
        if (activeCertifications.length > 0) {
          activeCertifications.forEach(({ title, issuer }, index) => {
            if (!title?.trim()) errors.push(`Certification title is required for entry ${index + 1}.`);
            if (!issuer?.trim()) errors.push(`Certification issuer is required for entry ${index + 1}.`);
          });
        }
        break;
      }
      case "references": {
        const activeReferences = resumeData.references.filter(
          (entry) => entry.name?.trim() || entry.designation?.trim() || entry.company?.trim() || entry.phone?.trim() || entry.email?.trim()
        );
        if (activeReferences.length > 0) {
          activeReferences.forEach(({ name, designation, company, phone, email }, index) => {
            if (!name.trim()) {
              errors.push(`Name is required for reference ${index + 1}.`);
            }
            if (!designation.trim()) {
              errors.push(`Designation is required for reference #${index + 1}.`);
            }
            if (!company.trim()) {
              errors.push(`Company is required for reference ${index + 1}.`);
            }
            if (phone.trim() && !/^\+?[0-9\s-]{7,15}$/.test(phone)) {
              errors.push(`A valid phone number is required for reference ${index + 1}.`);
            }
            if (email.trim() && !/^\S+@\S+\.\S+$/.test(email)) {
              errors.push(`A valid email is required for reference ${index + 1}.`);
            }
          });
        }
        break;
      }
      case "additionalInfo": {
        if (resumeData.languages.length === 0 || !resumeData.languages[0].name?.trim()) {
          errors.push("Ai least 1 Language is required" );
        }
        if (resumeData.interests.length === 0 || !resumeData.interests[0]?.trim()) {
          errors.push("Ai least 1 Interest is required" );
        }
      }
      break;
      default:
        break;
    }

    if (errors.length > 0) {
      setErrorMsg(errors.join(", ")); 
      return
    } 
    setErrorMsg("")
    goToNextStep();
  };
  // Function to navigate to the next page
  const goToNextStep = () => {
    const pages = [ "profile-info", "contact-info", "work-experience", "education", "skills", "tools", "projects", "certifications", "references", "additionalInfo"
    ]

    if (currentPage === "additionalInfo") setOpenPreviewModal(true)
    const currentIndex = pages.indexOf(currentPage) 
    if (currentIndex != -1 && currentIndex < pages.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentPage(pages[nextIndex])

      // set progress as percentage
      const percent = Math.round((nextIndex / (pages.length - 1)) * 100)
      setProgress(percent);
      window.scrollTo({top: 0, behavior: 'smooth'})
    }
  }
  // Function to navigate to the previous page
  const goBack = () => {
    const pages = [ "profile-info", "contact-info", "work-experience", "education", "skills", "tools", "projects", "certifications", "references", "additionalInfo"
    ];
    if (currentPage === "profile-info") navigate("/ai")
    const currentIndex = pages.indexOf(currentPage) 
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentPage(pages[prevIndex])

      // set progress as percentage
      const percent = Math.round((prevIndex / (pages.length - 1)) * 100)
      setProgress(percent);
      window.scrollTo({top: 0, behavior: 'smooth'})
    }
  }

  const renderForm= () => {
    switch (currentPage) {
      case "profile-info":
        return (
          <ProfileInfoForm 
          profileData={resumeData.profileInfo} 
          updateSection={(key, value) => {updateSection("profileInfo", key, value)}}
          onNext={validateAndNext}
          />
        );
      case "contact-info":
        return (
          <ContactInfoForm 
          contactInfo={resumeData?.contactInfo} 
          updateSection={(key, value) => {updateSection("contactInfo", key, value)}}
          />
        );
      case "work-experience":
        return (
          <WorkExperienceInfoForm
              workExperience={resumeData?.workExperience}
              updateArrayItem={(index, key, value) => { updateArrayItem("workExperience", index, key, value) }}
              addArrayItem={(newItem) => addArrayItems("workExperience", newItem)}
              removeArrayItem={(index) => removeArrayItems("workExperience", index)}
          />
        );
      case "education":
        return (
          <EducationInfoForm
              educationInfo={resumeData?.education}
              updateArrayItem={(index, key, value) => { updateArrayItem("education", index, key, value) }}
              addArrayItem={(newItem) => addArrayItems("education", newItem)}
              removeArrayItem={(index) => removeArrayItems("education", index)}
          />
        );
      case "skills":
        return (
          <SkillInfoForm
              skillsInfo={resumeData?.skills}
              updateArrayItem={(index, key, value) => { updateArrayItem("skills", index, key, value) }}
              addArrayItem={(newItem) => addArrayItems("skills", newItem)}
              removeArrayItem={(index) => removeArrayItems("skills", index)}
          />
        );
      case "tools":
        return (
          // <ToolsInfoForm
          //     toolsInfo={resumeData?.tools}
          //     updateArrayItem={(index, key, value) => { updateArrayItem("tools", index, key, value) }}
          //     addArrayItem={(newItem) => addArrayItems("tools", newItem)}
          //     removeArrayItem={(index) => removeArrayItems("tools", index)}
          //     selectedToolsDesign={selectedToolsDesign}
          //     setSelectedToolsDesign={setSelectedToolsDesign}
          // />
        <ToolsInfoForm
          toolsInfo={resumeData.tools}
          updateArrayItem={(index, key, value) => updateArrayItem("tools", index, key, value)}
          addArrayItem={(newItem) => addArrayItems("tools", newItem)}
          removeArrayItem={(index) => removeArrayItems("tools", index)}
          selectedToolsDesign={selectedToolsDesign}
          setSelectedToolsDesign={setSelectedToolsDesign}
        />
        );
      case "projects":
        return (
          <ProjectsInfoForm
              projectsInfo={resumeData?.projects}
              updateArrayItem={(index, key, value) => { updateArrayItem("projects", index, key, value) }}
              addArrayItem={(newItem) => addArrayItems("projects", newItem)}
              removeArrayItem={(index) => removeArrayItems("projects", index)}
          />
        );    
      case "certifications":
        return (
          <CertificationsInfoForm
              certificationsInfo={resumeData?.certifications}
              updateArrayItem={(index, key, value) => { updateArrayItem("certifications", index, key, value) }}
              addArrayItem={(newItem) => addArrayItems("certifications", newItem)}
              removeArrayItem={(index) => removeArrayItems("certifications", index)}
          />
        );
      case "references":
        return (
          <ReferencesInfoForm
              referencesInfo={resumeData?.references}
              updateArrayItem={(index, key, value) => { updateArrayItem("references", index, key, value) }}
              addArrayItem={(newItem) => addArrayItems("references", newItem)}
              removeArrayItem={(index) => removeArrayItems("references", index)}
          />
        );
      case "additionalInfo":
        return (
          <AdditionalInfoForm
              languages={resumeData?.languages}
              interests={resumeData?.interests}
              updateArrayItem={(section ,index, key, value) => { updateArrayItem(section , index, key, value) }}
              addArrayItem={(section,newItem) => addArrayItems(section, newItem)}
              removeArrayItem={(section, index) => removeArrayItems(section,  index)}
          />
        );
      default:
        return null
    }
  }
  // Update simple nested object (like profileInfo, contactInfo, etc.)
  const updateSection = (section, key, value) => {
    setResumeData((prev) => ({
      ...prev, [section] : {
        ...prev[section],
        [key]: value
      }
    }))
  }
  // Update array item (like workExperience[0], skills[1], etc.)
  const updateArrayItem = (section, index, key, value) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section],];
      if (key === null) { 
        updatedArray[index] = value; 
      }else {
        updatedArray[index] = {
          ...updatedArray[index], [key] : value
        }
      }
      return {
        ...prev,
        [section]: updatedArray
      }
    })
  }
  // Add array item (like workExperience[0], skills[1], etc.)
  const addArrayItems = (section, newItem) => {
    setResumeData((prev) => ({
        ...prev,
        [section]: [...prev[section], newItem]
    }))
  }
  // Remove array item (like workExperience[0], skills[1], etc.)
  const removeArrayItems = (section, index) => {
    setResumeData((prev) => {
        const updatedArray = [...prev[section]];
        updatedArray.splice(index, 1);
        return {
          ...prev,
          [section] : updatedArray
        }
    })
  }
  // Fetch the details from api endpoint
  const fetchResumeDetailsById = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(`/api/resume/${resumeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Correctly access the nested 'resume' object from the response
        if (response.data && response.data.resume) {
          const resumeInfo = response.data.resume; 

          setResumeData((prevState) => ({
            ...prevState,
            title: resumeInfo?.title || "Untitled resume",
            template: resumeInfo?.template || prevState?.template,
            profileInfo: resumeInfo?.profileInfo || prevState?.profileInfo,
            contactInfo: resumeInfo?.contactInfo || prevState?.contactInfo,
            workExperience: resumeInfo?.workExperience || prevState?.workExperience,
            education: resumeInfo?.education || prevState?.education,
            skills: resumeInfo?.skills || prevState?.skills,
            tools: resumeInfo?.tools || prevState?.tools,
            projects: resumeInfo?.projects || prevState?.projects,
            certifications: resumeInfo?.certifications || prevState?.certifications,
            languages: resumeInfo?.languages || prevState?.languages,
            references: resumeInfo?.references || prevState?.references,
            interests: resumeInfo?.interests || prevState?.interests,
          }))
        }
      } catch (error) {
        console.error("Error fetching resumes:", error);
        // navigate('/dashboard/resumes')
      } finally {
        setLoading(false);
      }
  }
  // Update thumbnail and resume profile image
  const uploadResumeImages = async () => {
      try {
            if (!resumeId || !resumeRef.current) {
              toast.error("Resume not ready for upload.");
              return;
            }
          setLoading(true);
          const token = await getToken();

          fixTailwindColors(resumeRef.current);
          const imageDataUrl = await captureElementAsImage(resumeRef.current);

          // 1. Upload Thumbnail
          const thumbnailFile = dataURLtoFile(imageDataUrl, `resume-${resumeId}.png`);
          const thumbnailFormData = new FormData();
          thumbnailFormData.append("thumbnail", thumbnailFile);

          const thumbnailUploadResponse = await axios.post(
            `/api/resume/upload-thumbnail/${resumeId}`, 
            thumbnailFormData , {headers: { 'Authorization': `Bearer ${token}`}}
          );

          const { imageUrl: thumbnailLink } = thumbnailUploadResponse.data;
          let profilePreviewUrl = resumeData?.profileInfo?.profilePreviewUrl;

          // 2. Upload Profile Image (if it exists)
          const profileImageFile = resumeData?.profileInfo?.profileImg;
          if (profileImageFile) {
              const profileImageFormData = new FormData();
              profileImageFormData.append("profileImage", profileImageFile);

              const profileUploadResponse = await axios.post(`/api/resume/upload-profile-image/${resumeId}`, profileImageFormData, {
                  headers: { 'Authorization': `Bearer ${token}`,'Content-Type': 'multipart/form-data' },
              });
              profilePreviewUrl = profileUploadResponse.data.imageUrl;
          }

          // 3. Update Resume Details with new links
          await updateResumeDetails(thumbnailLink, profilePreviewUrl);
          
      } catch (error) {
          toast.error(
            error.response?.data?.message || "Error uploading images. Please try again."
          );
          navigate("/ai/resume-builder");
      } finally {
          setLoading(false);
      }
  };
  // upload the resume
  const updateResumeDetails = async (thumbnailLink, profilePreviewUrl) => {
    if (!resumeId || !resumeData) {
      console.error("Resume ID or data missing");
      return;
    }
    try {
      setLoading(true);
      const token = await getToken();
      await axios.put(`/api/resume/${resumeId}`, 
        {  ...resumeData,
          thumbnailLink : thumbnailLink || "",
        profileInfo : { ...resumeData.profileInfo,
          profilePreviewUrl : profilePreviewUrl || ""
        }},{ headers: { 'Authorization': `Bearer ${token}`}})
    } catch (error) {
      console.error("Error Capturing Images", error);
    } finally {
      setLoading(false);
    }
  }
  // delete the resume
  const handleDeleteResume = async() => {
    setLoading(true);
    try {
        const token = await getToken();
        await axios.delete(`/api/resume/${resumeId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Resume deleted successfully!');
        navigate('/ai/resume-builder');
    } catch (error) {
        console.error('Error deleting resume:', error);
        toast.error('Failed to delete resume. Please try again.');
    } finally {
        setLoading(false);
    }
  }

  // download resume
  const reactToPrintFn = useReactToPrint({contentRef : resumeDownloadRef})

  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth)
    }
  }

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener('resize', updateBaseWidth);

    if (resumeId) {
      fetchResumeDetailsById()
    }

    return () => {
      window.removeEventListener('resize', updateBaseWidth);
    }
  }, [])
  

  return (
    <div className="">
    <div className=" flex flex-col gap-4  mt-20 lg:ml-12 md:mt-12 ">
      {/* Title & Buttons */}
      <div className='flex items-center  justify-between gap-5 p-3 mt-2 mb-4'>
        <TitleInput 
        title={resumeData.title}
        setTitle={(value) => setResumeData((prevState) => ({...prevState, title: value}))}
        />
        <div className="flex items-center gap-4">
          <button className="btn-small-light" onClick={() => setOpenThemeSelector(true)}>
            <LucidePalette className=' btn-small text-lg' />
            <span className="hidden xl:block text-sm">Change Theme</span>
          </button>
          <button className="btn-small-light" onClick={handleDeleteResume}>
            <LucideTrash2 className=' btn-delete text-lg' />
            <span className="hidden xl:block text-sm">Delete</span>
          </button>
          <button className="btn-small-light" onClick={() => setOpenPreviewModal(true)}>
            <LucideDownload className='btn-small' />
            <span className="hidden xl:block text-sm">Preview & Download</span>
          </button>
        </div>
      </div>
      <div className=' grid grid-cols-1 xl:grid-cols-3 gap-8 p-4 lg:p-0'>
      {/* Render Form */}
      <div className=" p-6 h-fit rounded-lg border border-color_7/30 mx-auto flex-1 col-span-1 w-full max-w-xl  ">
        {/* step progress */}
        <StepProgress progress={progress} />
        {/* form */}
        { renderForm() }
        <div className=''>
          {errorMsg && (<div className='flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-100 px-2 py-0.5 my-1 rounded'><LucideCircleAlert className='text-md'/>{errorMsg}</div>)}
          <div className='flex gap-3 my-5 items-end justify-evenly xl:flex-wrap  mx-auto '>

            <button className='btn-small-light ' onClick={goBack} disabled={loading}>
              <LucideArrowLeft className='btn-small'/>
              <span className="hidden xl:block text-sm">Back</span>
            </button>

            <button className='btn-small-light ' onClick={uploadResumeImages} disabled={loading}>
              <LucideSave className='btn-small'/>
              <span className="hidden xl:block text-sm">{loading ? "Updating..." : "Save & Continue"}</span>
            </button>

            <button
              className={` flex items-center justify-center gap-2 rounded ${
                currentPage === "additionalInfo"
                  ? "bg-gradient-to-tl from-color_5 via-color_6 to-color_7"
                  : ""
              }`}
              onClick={validateAndNext}
              disabled={loading}
            >
              <span
                className={`flex text-sm rounded ${
                  currentPage !== "additionalInfo" ? "hidden xl:flex" : "bg-gradient-to-tl from-color_5 via-color_6 to-color_7 text-color_9 px-2 py-1 "
                }`}
              >
                {currentPage === "additionalInfo" ? "Preview & Download" : "Next"}
              </span>
              {currentPage !== "additionalInfo" && (
                <LucideArrowRight className="btn-small" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* resume Template */}
        <div
          ref={resumeRef}
          className="overflow-x-auto hide-scrollbar rounded-lg border border-color_7/30 mx-auto flex-1 xl:col-span-2 w-full max-w-[802px]"
        >
          <div className="max-w-[800px]"> 
            <RenderResume
              templateId={resumeData?.template?.theme || ""}
              resumeData={resumeData}
              colorPalette={resumeData?.template?.colorPalette || []}
              containerWidth={baseWidth}
            />
          </div>
        </div>
    </div>
    </div>
    <Modal isOpen={openThemeSelector} onClose={() => setOpenThemeSelector(false)} title="Change Theme" >
      <div className=" md:p-2">
        <ThemeSelector 
          selectedTheme={resumeData?.template}
          setSelectedTheme={(value) => {
            setResumeData((prevState) => ({
                ...prevState, template: value || prevState.template
            }))
          }}
          resumeData={null}
          onClose={() => setOpenThemeSelector(false)}
        />
      </div>
    </Modal>
    <Modal 
     isOpen={openPreviewModal}
     onClose={() => setOpenPreviewModal(false)} 
     title={resumeData.title} 
     showActionBtn 
     actionBtnText={ <LucideDownload size={18}/>} 
     onActionClick={() => reactToPrintFn()}>
    <div ref={resumeDownloadRef} style={{ minWidth: baseWidth }}>
      <RenderResume
        templateId={resumeData?.template?.theme || ""}
        resumeData={resumeData}
        colorPalette={resumeData?.template?.colorPalette || []}
        />
    </div>
    </Modal>
    </div>
  );
};

export default EditResume;
