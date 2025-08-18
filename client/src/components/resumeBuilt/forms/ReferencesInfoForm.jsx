import { LucidePlus, LucideTrash2 } from 'lucide-react';
import Input from '../resumeSections/Input';


const ReferencesInfoForm = ({referencesInfo, updateArrayItem, addArrayItem, removeArrayItem}) => {
  return (
    <div className='py-5 md:p-5'>
        <h2 className='text-lg font-semibold text-color_4'>References</h2>

         <div className=''>
          {
            referencesInfo.map((reference, index) => {
              return (
                <div className="relative mb-2 border-b border-dashed border-color_3/30 py-6 flex flex-col" key={index}>
                    <Input
                      value={reference?.name || ""}
                      onChange={(value) => updateArrayItem(index, "name", value)}
                      label="Name"
                      placeholder="John Doe"
                      type='text'
                    />
                    <Input
                      value={reference?.company || ""}
                      onChange={(value) => updateArrayItem(index, "company", value)}
                      label="Company"
                      placeholder="ABC Corp."
                      type='text'
                    />
                    <Input
                      value={reference?.designation || ""}
                      onChange={(value) => updateArrayItem(index, "designation", value)}
                      label="Designation"
                      placeholder="Marketing Manager"
                      type='text'
                    />
                    <Input
                      value={reference?.phone || ""}
                      onChange={(value) => updateArrayItem(index, "phone", value)}
                      label="Phone"
                      placeholder="99342742024"
                      type='text'
                    />
                    <Input
                      value={reference?.email || ""}
                      onChange={(value) => updateArrayItem(index, "email", value)}
                      label="Email"
                      placeholder="example@gmail.com"
                      type='email'
                    />
                    {/* delete button */}
                    {referencesInfo.length > 1 && (
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
                name: "", company:"", designation: "",phone: "", email: "",
            })}>
            <LucidePlus className='size-4'/> Add New 
        </button>
    </div>
  )
}

export default ReferencesInfoForm
