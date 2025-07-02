import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const colors = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    danger: 'border-danger-500',
    warning: 'border-warning-500',
    gray: 'border-gray-500',
  };

  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`
          animate-spin rounded-full border-b-2 border-transparent
          ${sizes[size]}
          ${colors[color]}
        `}
      ></div>
    </div>
  );
};

export default LoadingSpinner;