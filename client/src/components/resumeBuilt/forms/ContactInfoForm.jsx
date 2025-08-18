import Input from "../resumeSections/Input"


const ContactInfoForm = ({contactInfo, updateSection}) => {
  return (
    <div className='py-5'>
        <h2 className='text-lg font-semibold text-color_4'>Contact Information</h2>
        <div className='mt-4'>
         <div className='flex flex-col p-3'>
          <Input 
            value={contactInfo?.location || ""}
            onChange={(value) => updateSection("location", value)}
            label="Address"
            placeholder="Short Address"
            type='text' 
          />
          <Input 
            value={contactInfo?.email || ""}
            onChange={(value) => updateSection("email", value)}
            label="Email"
            placeholder="example@gmail.com"
            type='email' 
          />
           <Input 
            value={contactInfo?.phone || ""}
            onChange={(value) => updateSection("phone", value)}
            label="Phone"
            placeholder="9876543210"
            type='text' 
          />
           <Input 
            value={contactInfo?.github || ""}
            onChange={(value) => updateSection("github", value)}
            label="Github"
            placeholder="https://github.com/username"
            type='text' 
          />
           <Input 
            value={contactInfo?.linkedIn || ""}
            onChange={(value) => updateSection("linkedIn", value)}
            label="LinkedIn"
            placeholder="https://linkedIn.com/username"
            type='text' 
          />
           <Input 
            value={contactInfo?.website || ""}
            onChange={(value) => updateSection("website", value)}
            label="Website"
            placeholder="https://yourwebsite.com"
            type='text' 
          />

         </div>
        </div>

    </div>
  )
}

export default ContactInfoForm
