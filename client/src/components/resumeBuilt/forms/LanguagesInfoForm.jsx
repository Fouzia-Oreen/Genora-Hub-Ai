import { LucidePlus, LucideTrash2 } from 'lucide-react';
import Input from '../Input';
import RatingInput from '../RatingInput';

const LanguagesInfoForm = ({languagesInfo,updateArrayItem, addArrayItem,removeArrayItem}) => {
  return (
    <div className='py-5 md:p-5'>
        <h2 className='text-lg font-semibold text-color_4'>Languages</h2>
         <div className='mt-4 flex flex-col gap-4 mb-3'>
          {
            languagesInfo.map((language, index) => {
              return (
                <div className="relative mb-2 border-b border-dashed border-color_3/30 py-6 " key={index}>
                  <div className='grid grid-cols-1 lg:grid-cols-3  lg:gap-4 '>
                    <div className='col-span-2'>
                    <Input
                      value={language?.name || ""}
                      onChange={(value) => updateArrayItem(index, "name", value)}
                      label="Language"
                      placeholder="French"
                      type='text'
                    />
                    </div>
                    <div className='flex flex-col my-3 '>
                      <label className="text-[13px] text-color_4 mb-1 font-semibold">Proficiency ({language.progress / 20 || 0}/5)</label>
                      <div className='mt-3'>
                        <RatingInput value={language.progress || 0} total={5} onChange={(value) => updateArrayItem(index, "progress", value)} />
                      </div>
                    </div>
                  </div>
                    {/* delete button */}
                    {languagesInfo.length > 1 && (
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

export default LanguagesInfoForm
