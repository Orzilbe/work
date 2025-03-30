'use client';

const InputField = ({ label, type, name, value, onChange, placeholder }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-900">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        placeholder={placeholder}
      />
    </div>
  );
  export default InputField;