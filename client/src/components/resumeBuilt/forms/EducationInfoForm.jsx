import { LucidePlus, LucideTrash2 } from 'lucide-react';
import Input from '../resumeSections/Input';


const EducationInfoForm = ({educationInfo, updateArrayItem, addArrayItem, removeArrayItem}) => {
  return (
    <div className='py-5 '>
        <h2 className='text-lg font-semibold text-color_4'>Education</h2>
         <div className='p-3'>
          {
            educationInfo.map((education, index) => {
              return (
                <div className="relative mb-2 border-b border-dashed border-color_3/30 py-6  " key={index}>
                    <Input
                      value={education?.degree || ""}
                      onChange={(value) => updateArrayItem(index, "degree", value)}
                      label="Degree"
                      placeholder="CSC Engineering"
                      type='text'
                    />
                    <Input
                      value={education?.institution || ""}
                      onChange={(value) => updateArrayItem(index, "institution", value)}
                      label="Institute"
                      placeholder="XYZ University"
                      type='text'
                    />
                    <Input
                      value={education?.startDate || ""}
                      onChange={(value) => updateArrayItem(index, "startDate", value)}
                      label="Start Date"
                      type='month'
                    />
                    <Input
                      value={education?.endDate || ""}
                      onChange={(value) => updateArrayItem(index, "endDate", value)}
                      label="End Date"
                      type='month'
                    />
                    <div className=" flex flex-col">
                        <label className="text-sm font-medium text-color_4 mb-1">Description</label>
                        <textarea 
                        className="bg-color_9 w-full  border border-color_4/30 rounded-md px-2 py-2 focus:outline-none text-color_4 placeholder:text-sm"
                        rows={4}
                        value={education?.description || ""}
                        onChange={({target}) => updateArrayItem(index,"description", target.value)}
                        placeholder="what did you study in this subject?"
                        />
                    </div>
                    {/* delete button */}
                    {educationInfo.length > 1 && (
                        <button type='button' className='btn-delete flex items-center justify-center absolute top-0 right-3' onClick={() => removeArrayItem(index)}>
                            <LucideTrash2 />
                        </button>
                    )}
                  </div>
              );
            })
          }
         </div>
        {/* add button */}
        <button 
            type='button' 
            className='btn-add' 
            onClick={() => addArrayItem({
                degree: "", institution:"", startDate: "", endDate: "", description: ""
            })}>
            <LucidePlus className='size-4'/> Add New 
        </button>
    </div>
  )
}

export default EducationInfoForm
