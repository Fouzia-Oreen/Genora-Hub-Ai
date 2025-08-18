import { LucidePlus, LucideTrash2 } from 'lucide-react';
import Input from '../resumeSections/Input';


const ProjectsInfoForm = ({projectsInfo, updateArrayItem, addArrayItem, removeArrayItem}) => {
  return (
    <div className='py-5 '>
        <h2 className='text-lg font-semibold text-color_4'>Projects</h2>

         <div className='p-3'>
          {
            projectsInfo.map((project, index) => {
              return (
                <div className="relative mb-2 border-b border-dashed border-color_3/30 py-6 flex flex-col gap-3" key={index}>
                    <div className="md:col-span-2">
                    <Input
                      value={project?.title || ""}
                      onChange={(value) => updateArrayItem(index, "title", value)}
                      label="Title"
                      placeholder="React Project"
                      type='text'
                    />
                    </div>
                    <div className="md:col-span-2 flex flex-col">
                      <label className="text-sm font-medium text-color_4 mb-1">Description</label>
                      <textarea 
                        className="bg-color_9 w-full  border border-color_4/30 rounded-md px-2 py-2 focus:outline-none text-color_4 placeholder:text-sm"
                        rows={4}
                        value={project?.description || ""}
                        onChange={({target}) => updateArrayItem(index,"description", target.value)}
                        placeholder="what is your project about?"
                     />
                    </div>
                    <Input
                      value={project?.github || ""}
                      onChange={(value) => updateArrayItem(index, "github", value)}
                      label="Github"
                      placeholder="https://github.com/username"
                      type='text'
                    />
                    <Input
                      value={project?.liveDemo || ""}
                      onChange={(value) => updateArrayItem(index, "liveDemo", value)}
                      label="Live Demo"
                      placeholder="https://abcwebsite.com"
                      type='text'
                    />
                    {/* delete button */}
                    {projectsInfo.length > 1 && (
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
                title: "", description:"", github: "", liveDemo: "", 
            })}>
            <LucidePlus className='size-4'/> Add New 
        </button>
    </div>
  )
}

export default ProjectsInfoForm
