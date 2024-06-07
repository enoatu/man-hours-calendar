import React from "react";

export type SwitchCheckboxProps = {
  value: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const SwitchCheckbox = ({ value, onChange }: SwitchCheckboxProps) => (
  <div>
    <label className="flex items-center cursor-pointer">
      <input type="checkbox" className="hidden" checked={value} onChange={onChange} />
      <div className="relative">
        {value ? (
          <>
            <div className="w-10 h-4 bg-blue-500 rounded-full shadow-inner"></div>
            <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition" />
          </>
        ) : (
          <>
            <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
            <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition transform translate-x-full" />
          </>
        )}
      </div>
    </label>
  </div>
);
