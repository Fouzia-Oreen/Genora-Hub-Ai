const Input = ({ value, onChange, label, placeholder, type }) => {
  return (
    <div className="flex flex-col my-3">
      {label && (
        <label className="text-sm font-semibold text-color_4/80 mb-1">
          {label}
        </label>
      )}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        className='bg-color_9 w-full max-w-[350px] px-2 py-2 focus:outline-none text-color_4 placeholder:text-sm  p-2 mt-2 outline-none text-sm rounded border border-color_7/40'
      />
    </div>
  );
};

export default Input;