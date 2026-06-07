import React from "react";

interface DropdownProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    // The `w-full` class has been removed from this container.
    // The width can now be controlled by the parent or via the `className` prop.
    <div className={`relative ${className}`}>
      <details className="group">
        <summary className="w-full list-none cursor-pointer">
          {/* This is the visible button part of the dropdown */}
          <div className="flex items-center justify-between w-full px-4 py-2 text-left bg-[#f8efe2] border border-gray-300 rounded-lg shadow-sm transition-colors hover:border-gray-400 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <span className="block truncate text-[#502F00]">{title}</span>
            <span className="w-5 h-5 transition-transform duration-200 group-open:rotate-180 text-[#502F00]">
              ⌄
            </span>
          </div>
        </summary>

        {/* This is the floating panel that appears on open */}
        <div
          className="absolute z-50 w-full p-2 mt-2 origin-top bg-[#f8efe2] border border-gray-300 rounded-lg shadow-lg 
                     text-[#502F00] transition-all duration-200 ease-in-out 
                     transform scale-95 opacity-0 invisible 
                     group-open:scale-100 group-open:opacity-100 group-open:visible"
        >
          {children}
        </div>
      </details>
    </div>
  );
};

export default Dropdown;