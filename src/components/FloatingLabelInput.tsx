import React from 'react';

const FloatingLabelInput = ({
    id,
    label,
    type,
    value,
    onChange,
    required = false,
    placeholder = '',
    name,
    className = '',
}: {
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    placeholder?: string;
    name?: string;
    className?: string;
}) => (
    <div className={`relative mb-6 ${className}`}>
        <input
            type={type}
            id={id}
            name={name || id}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder || ' '}
            className="peer block w-full appearance-none bg-gray-700 border border-gray-600 rounded-md px-4 pt-6 pb-2 text-sm text-white focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-transparent"
        />
        <label
            htmlFor={id}
            className="absolute left-4 text-gray-400 text-sm transition-all transform scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 
                       peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:scale-90 
                       peer-focus:text-blue-400 peer-focus:translate-y-0 peer-valid:top-1 peer-valid:scale-90 peer-valid:text-blue-400"
        >
            {label}
        </label>
    </div>
);

export default FloatingLabelInput;
