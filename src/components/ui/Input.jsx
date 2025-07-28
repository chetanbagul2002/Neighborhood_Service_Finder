import React from "react";

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={`block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-base shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
