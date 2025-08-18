
import Input from '../resumeSections/Input'
import ProfilePhotoSelector from '../resumeSections/ProfilePhotoSelector'

const ProfileInfoForm = ({profileData, updateSection }) => {
  return (
    <div className='py-5 '>
      <h2 className='text-lg font-semibold text-color_4'>Personal Information</h2>
      <div className='mt-4'>
        <ProfilePhotoSelector
          image={profileData?.profileImg || profileData.profilePreviewUrl}
          setImage={(value) => updateSection("profileImg", value)}
          preview={profileData?.profilePreviewUrl}
          setPreview={(value) => updateSection("profilePreviewUrl", value)}
        />
        <div className='flex flex-col gap-2'>
          <Input
            value={profileData?.fullName || ""}
            onChange={(value) => updateSection("fullName", value)}
            label="Full Name"
            placeholder="Eg: John Doe"
            type='text'
          />
          <Input
            value={profileData?.designation || ""}
            onChange={(value) => updateSection("designation", value)}
            label="Designation"
            placeholder="Eg: UI Designer"
            type='text'
          />
          <div className=" flex flex-col">
            <label className="text-sm font-medium text-color_4 mb-1">Summary</label>
            <textarea
              className="bg-color_9 w-full  border border-color_4/30 rounded-md px-2 py-2 focus:outline-none text-color_4"
              rows={4}
              value={profileData?.summary || ""}
              onChange={({target}) => updateSection("summary", target.value)}
              placeholder="Short Intro"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileInfoForm