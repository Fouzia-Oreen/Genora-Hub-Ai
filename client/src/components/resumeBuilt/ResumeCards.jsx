import React from 'react'
import { useState } from 'react';

const ResumeCards = ({imgUrl, title,profileInfo, lastUpdated ,onSelect}) => {

    const [resumes, setResumes] = useState([]);
    const handleEditResume = (id) => {
    console.log(`Edit resume with ID: ${id}`);
    // Implement navigation to an edit page: e.g., navigate(`/resumes/edit/${id}`);
    };

    const handleViewResume = (id) => {
    console.log(`View resume with ID: ${id}`);
    // Implement navigation to a view page: e.g., navigate(`/resumes/${id}`);
    };

    const handleDeleteResume = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
        try {
        // Replace this with your actual DELETE API call:
        // const response = await fetch(`/api/users/resumes/${id}`, {
        //   method: 'DELETE',
        //   headers: {
        //     'Authorization': `Bearer YOUR_AUTH_TOKEN_HERE` // Include your authentication token
        //   }
        // });
        // const data = await response.json();

        // Simulate successful deletion
        const data = { success: true, message: 'Resume deleted successfully!' }; // Mock response

        if (data.success) {
            setResumes(resumes.filter(resume => resume._id !== id));
            alert(data.message);
        } else {
            alert(data.message || 'Failed to delete resume.');
        }
        } catch (err) {
        console.error('Error deleting resume:', err);
        alert('An error occurred while deleting the resume.');
        }
    }
    };
  return (
    <div className="h-[360px] flex flex-col items-center bg-color_9 rounded-lg  border border-color_2/20  p-4  shadow-sm cursor-pointer" onClick={onSelect}>    
    <div className="">
      {
        imgUrl ? <img
        src={imgUrl}
        alt={`Thumbnail for ${title}`}
        className="w-full h-[260px] rounded-md object-cover border border-color_3/20 mx-auto"
       /> : <div></div>
      }
    </div>
    <div className="w-full px-4 pt-3">
        <h5 className=' font-medium overflow-hidden whitespace-nowrap'>{title}</h5>
        <h5 className='text-sm font-semibold overflow-hidden whitespace-nowrap text-color_5'>{profileInfo}</h5>
        <p className='text-xs font-medium text-color_1/40'>Last Updated : {lastUpdated}</p>
    </div>
    </div>
  )
}

export default ResumeCards
