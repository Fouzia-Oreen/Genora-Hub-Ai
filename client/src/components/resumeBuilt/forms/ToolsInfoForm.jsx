import { LucidePlus, LucideTrash2 } from 'lucide-react';
import Input from '../resumeSections/Input';
import RatingInput from '../resumeSections/RatingInput';

const ToolsInfoForm = ({toolsInfo,updateArrayItem, addArrayItem,removeArrayItem,}) => {
  return (
    <div className='py-5 '>
        <h2 className='text-lg font-semibold text-color_4'>Tools</h2>
         <div className='mt-4 flex flex-col gap-4 mb-3 px-3'>
          {
            toolsInfo.map((tool, index) => {
              return (
                <div className="relative mb-2 border-b border-dashed border-color_3/30  pb-4" key={index}>
                   <Input
                      value={tool?.name || ""}
                      onChange={(value) => updateArrayItem(index, "name", value)}
                      label="Tool Name"
                      placeholder="V.S Code"
                      type='text'
                    />
                    <div className='flex flex-col'>
                      <label className="text-sm font-semibold text-color_4/80 mb-1">Proficiency ({tool.progress / 20 || 0}/5)</label>
                      <div className='mt-3'>
                        <RatingInput value={tool.progress || 0} total={5} onChange={(value) => updateArrayItem(index, "progress", value)} activeColor="#2563EB" inActiveColor="#c6d2f3"/>
                      </div>
                    </div>

                    {/* delete button */}
                    {toolsInfo.length > 1 && (
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
                name: "", progress:0,
            })}>
            <LucidePlus className='size-4'/> Add New 
        </button>
    </div>
  )
}

export default ToolsInfoForm;

