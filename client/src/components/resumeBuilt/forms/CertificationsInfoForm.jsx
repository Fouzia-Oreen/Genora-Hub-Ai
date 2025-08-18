import { LucidePlus, LucideTrash2 } from 'lucide-react';
import Input from '../resumeSections/Input';


const CertificationsInfoForm = ({certificationsInfo, updateArrayItem, addArrayItem, removeArrayItem}) => {
  return (
    <div className='py-5 '>
        <h2 className='text-lg font-semibold text-color_4'>Achievements</h2>

         <div className=' my-4 '>
          {
            certificationsInfo.map((certification, index) => {
              return (
                <div className="relative mb-2 border-b border-dashed border-color_3/30 py-6 flex flex-col" key={index}>
                  <div className='md:col-span-2'>
                    <Input
                      value={certification?.title || ""}
                      onChange={(value) => updateArrayItem(index, "title", value)}
                      label="Title"
                      placeholder="React Project"
                      type='text'
                    />
                    </div>
                    <Input
                      value={certification?.issuer || ""}
                      onChange={(value) => updateArrayItem(index, "issuer", value)}
                      label="Issuer"
                      placeholder="John Doe"
                      type='text'
                    />
                    <Input
                      value={certification?.year || ""}
                      onChange={(value) => updateArrayItem(index, "year", value)}
                      label="Year"
                      placeholder="2024"
                      type='text'
                    />
                    {/* delete button */}
                    {certificationsInfo.length > 1 && (
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
                title: "", issuer:"", year: "",
            })}>
            <LucidePlus className='size-4'/> Add New 
        </button>
    </div>
  )
}

export default CertificationsInfoForm
