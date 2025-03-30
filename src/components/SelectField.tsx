'use client';

const SelectField = ({ label, name, value, onChange, options, error, description }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-900">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
    >
      <option value="">Select your level</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm">{error}</p>}
    {description && <p className="mt-2 text-gray-600 text-sm">{description}</p>}
  </div>
);

export default SelectField;
