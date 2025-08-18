import { LucidePlus, LucideTrash2 } from 'lucide-react';
import Input from '../resumeSections/Input';

const WorkExperienceInfoForm = ({workExperience, updateArrayItem, addArrayItem, removeArrayItem}) => {
  return (
    <div className='py-5 '>
        <h2 className='text-lg font-semibold text-color_4'>Work Experience</h2>

         <div className=' p-3'>
          {
            workExperience.map((experience, index) => {
              return (
                <div className="relative mb-2 border-b border-dashed border-color_3/30 py-6 flex flex-col" key={index}>
                    <Input
                      value={experience?.company || ""}
                      onChange={(value) => updateArrayItem(index, "company", value)}
                      label="Company"
                      placeholder="ABC Corp."
                      type='text'
                    />
                    <Input
                      value={experience?.role || ""}
                      onChange={(value) => updateArrayItem(index, "role", value)}
                      label="Role"
                      placeholder="Frontend Developer"
                      type='text'
                    />
                    <Input
                      value={experience?.startDate || ""}
                      onChange={(value) => updateArrayItem(index, "startDate", value)}
                      label="Start Date"
                      type='month'
                    />
                    <Input
                      value={experience?.endDate || ""}
                      onChange={(value) => updateArrayItem(index, "endDate", value)}
                      label="End Date"
                      type='month'
                    />
                    <div className="md:col-span-2 flex flex-col md:mt-3">
                        <label className="text-sm font-medium text-color_4 mb-1">Description</label>
                        <textarea 
                        className="bg-color_9 w-full  border border-color_4/30 rounded-md px-2 py-2 focus:outline-none text-color_4 placeholder:text-sm"
                        rows={4}
                        value={experience?.description || ""}
                        onChange={({target}) => updateArrayItem(index,"description", target.value)}
                        placeholder="what did you do in this role?"
                        />
                    </div>
                    {/* delete button */}
                    {workExperience.length > 1 && (
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
                company: "", role:"", startDate: "", endDate: "", description: ""
            })}>
            <LucidePlus className='size-4'/> Add New 
        </button>
    </div>
  )
}

export default WorkExperienceInfoForm
