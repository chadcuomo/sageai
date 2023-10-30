import { type SetStateAction } from "react";

type TextInputProps = {
  label: string;
  onchange: (value: SetStateAction<string>) => void
  value: string;
  placeholder: string;
  textValue: string;
};

export default function TextInput({ label, onchange, value, placeholder, textValue }: TextInputProps) {
  return (
    <div className="w-80 p-3">
      <label
        htmlFor={value}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          name={value}
          id={value}
          onChange={(e) => onchange(e.target.value)}
          value={textValue}
          className="block w-full border p-2 border-black py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
