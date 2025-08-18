/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { ArrowLeft, LucideCirclePlus, Sparkles } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sampleResumeData } from '../../../assets/assets';
import CreateResumeForm from '../../../components/resumeBuilt/resumeSections/CreateResumeForm';
import ModalSmall from '../../../components/resumeBuilt/resumeSections/ModalSmall';
import ResumeCard from '../../../components/resumeBuilt/resumeSections/ResumeCards';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BuiltYourResume = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [allResumes, setAllResumes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const { getToken } = useAuth();
  const navigate = useNavigate();

  const fetchAllResumes = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/resume', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setAllResumes(data.resumes);
    } catch (err) {
      console.error("Error fetching resumes:", err);
      setError("Failed to fetch resumes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async(resumeId) => {
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

  useEffect(() => {
    fetchAllResumes();
  }, []);


  const handleBack = () => {
    setSelectedTemplate(null);
  };

  if (selectedTemplate) {
    const TemplateComponent = selectedTemplate.component;
    return (
      <div className="bg-gray-100 p-8 min-h-screen">
        <button
          onClick={handleBack}
          className="mb-6 px-4 flex gap-2 py-2 items-center btn-add"
        >
          <ArrowLeft size={16} /> Back to Templates
        </button>
        <TemplateComponent data={sampleResumeData} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4 p-6 mt-20 lg:mx-12 md:mt-12 overflow-y-scroll hide-scrollbar">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div className='flex items-center gap-3'>
          <Sparkles className="w-5 h-5 text-color_5 animate-sparkle" />
          <h1 className='text-2xl font-semibold'>Built Your Resume</h1>
        </div>
        <button
          onClick={() => setOpenCreateModal(true)}
          className="btn2-grad flex gap-2 text-sm items-center w-fit"
        >
          <LucideCirclePlus size={15}/>
          Create Your Resumes
        </button>
      </div>

      {error && (
        <div className=" text-red-700 px-4 py-3 rounded-xl relative mb-6" role="alert">
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      <div className="p-8 ">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
          {allResumes?.length > 0 ? (
            allResumes.map((resume) => (
              <ResumeCard
                key={resume._id}
                imgUrl={resume.thumbnailLink || null}
                title={resume.title}
                profileInfo={resume.profileInfo?.fullName || "Unnamed"}
                lastUpdated={resume.updatedAt ? moment(resume.updatedAt).format("Do MMMM YYYY") : ""}
                onSelect={() => navigate(`/ai/resume/${resume._id}`)} 
                onDelete={() => handleDeleteResume(resume._id)}
              />
            ))
          ) : (
            <p className="text-center flex items-center justify-center">No resumes found. Create your first one!</p>
          )}
        </div>
      </div>

      <ModalSmall
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
      >
        <div className='md:w-[450px]'>
          <CreateResumeForm setOpenCreateModal={setOpenCreateModal} />
        </div>
      </ModalSmall>
    </div>
  );
};

export default BuiltYourResume
