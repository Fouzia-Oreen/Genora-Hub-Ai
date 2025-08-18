import { LucidePlus, LucideTrash2 } from 'lucide-react';
import Input from '../resumeSections/Input';
import RatingInput from '../resumeSections/RatingInput';


const AdditionalInfoForm = ({languages , interests , updateArrayItem , addArrayItem , removeArrayItem}) => {
  return (
    <div className='py-5 md:p-5'>
        <h2 className='text-lg font-semibold text-color_4'>Additional Info</h2>
        {/* language */}
        <div className='flex flex-col  mt-5'>
         <h2 className='text-lg font-semibold text-color_4'>Languages</h2>  
          <div>
            select design
          </div>
          <div className=' flex flex-col gap-4 mb-3'>
          {
            languages?.map((language, index) => {
              return (
                <div className="relative mb-2 border-b border-dashed border-color_3/30 " key={index}>
                    <Input
                      value={language?.name || ""}
                      onChange={(value) => updateArrayItem("languages", index, "name", value)}
                      label="Language"
                      placeholder="e.g. French"
                      type='text'
                    />
                    <div className='flex flex-col my-3 '>
                      <label className="text-[13px] text-color_4 mb-1 font-semibold">Proficiency ({language.progress / 20 || 0}/5)</label>
                      <div className='mt-3'>
                        <RatingInput value={language.progress || 0} total={5} onChange={(value) => updateArrayItem("languages", index, "progress", value)} activeColor="#2563EB" inActiveColor="#c6d2f3"/>
                      </div>
                    </div>
                    {/* delete button */}
                    {languages.length > 1 && (
                        <button type='button' className='btn-delete flex items-center justify-center absolute -top-3 right-3' onClick={() => removeArrayItem("languages",index)}>
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
            onClick={() => addArrayItem("languages" ,{
                name: "", progress:0,
            })}>
            <LucidePlus className='size-4'/> Add New 
        </button>
        </div>
        {/* interests */}
        <div className='flex flex-col  mt-5'>
         <h2 className='text-lg font-semibold text-color_4'>Interests</h2>  
          <div className=' flex flex-col gap-4 mb-3'>
          {
            interests.map((interest, index) => {
              return (
                <div className="relative mb-2 border-b border-dashed border-color_3/30  " key={index}>
                  <div className='grid grid-cols-1  lg:gap-4 '>
                    <div className='col-span-2'>
                    <Input
                      value={interest || ""}
                      onChange={(value) => updateArrayItem("interests", index, null, value)}
                      label="Interests"
                      placeholder="e.g. Reading"
                      type='text'
                    />
                    </div>
                  </div>
                    {/* delete button */}
                    {interests.length > 1 && (
                        <button type='button' className='btn-delete flex items-center justify-center absolute top-0 right-3' onClick={() => removeArrayItem("interests",index)}>
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
            onClick={() => addArrayItem("interests", "")}>
            <LucidePlus className='size-4'/> Add New 
        </button>
        </div>
    </div>
  )
}

export default AdditionalInfoForm;
