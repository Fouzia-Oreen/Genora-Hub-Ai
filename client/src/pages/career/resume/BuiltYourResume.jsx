import { Circle, LucideCirclePlus, Sparkles } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import ResumeCards from '../../../components/resumeBuilt/ResumeCards';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { mockFetchResumes } from '../../../assets/assets';

const AllResumeTemplates = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  // useEffect(() => {
  //   const fetchUserResumes = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       // Replace this mock call with your actual API call:
  //       // const response = await fetch('/api/users/resumes', {
  //       //   headers: {
  //       //     'Authorization': `Bearer YOUR_AUTH_TOKEN_HERE` // Include your authentication token
  //       //   }
  //       // });
  //       // const data = await response.json();

  //       const data = await mockFetchResumes(); // Using mock for demonstration

  //       if (data.success) {
  //         setResumes(data.resumes);
  //       } else {
  //         setError(data.message || 'Failed to fetch resumes.');
  //       }
  //     } catch (err) {
  //       console.error('Error fetching resumes:', err);
  //       setError('An error occurred while fetching resumes. Please try again.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserResumes();
  // }, []); 

  // const handleAddNewResume = () => {
  //   // In a real application, this would navigate to a resume creation page
  //   alert('Navigating to Add New Resume page!');
  //   console.log('Add New Resume clicked');
  // };



  return (
    <div className="flex-1 h-screen flex flex-col gap-4 p-6 mt-20 lg:mx-12 md:mt-12 overflow-y-scroll hide-scrollbar">
      <div className="flex flex-row justify-between items-center mb-8 gap-4">
        <div className='flex items-center gap-3'>
          <Sparkles className="w-5 h-5 text-color_5 animate-sparkle" />
          <h1 className='text-2xl font-semibold'>Your Resumes</h1>
        </div>
        <button
          onClick={() => navigate("/create-resume-form")}
          className="btn2-grad flex gap-2 text-sm items-center"
        >
          <LucideCirclePlus />
          Add New Resume
        </button>
      </div>

      {/* {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="ml-4 text-lg text-gray-700">Loading resumes...</p>
        </div>
      )} */}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {!loading && resumes.length === 0 && !error && (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <p className="text-xl text-gray-600 mb-4">You haven't created any resumes yet.</p>
          <button
            // onClick={handleAddNewResume}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-xl shadow-md transition duration-300 ease-in-out hover:scale-105"
          >
            Create Your First Resume
          </button>
        </div>
      )}

    <div className="w-full rounded-xl overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {mockFetchResumes.map((resume) => (
        <>
        <ResumeCards key={resume?._id} imgUrl={resume.thumbnailLink || null} title={resume.title}  profileInfo={resume.profileInfo.fullName} lastUpdated={resume?.updatedAt ? moment(resume.updatedAt).format("D MMM YYYY") : ""} onSelect={()=> navigate(`/resume/${resume._id}`)}/>
        </>
      ))}
    </div>

    </div>
  );
}


export default AllResumeTemplates
