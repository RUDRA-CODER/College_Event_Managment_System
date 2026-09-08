import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'light' | 'outline-light';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700",
    secondary: "bg-navy-800 text-white hover:bg-navy-900",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50",
    ghost: "bg-transparent text-gray-600 hover:text-navy-900 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
    light: "bg-white text-primary-700 hover:bg-gray-50",
    "outline-light": "border-2 border-white/30 text-white bg-white/5 hover:bg-white/10",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const variantStyle = variants[variant];
  const sizeStyle = sizes[size];

  return (
    <button 
      className={`${baseStyles} ${variantStyle} ${sizeStyle} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
