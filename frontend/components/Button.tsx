import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;      // ✅ added fullWidth prop
  isLoading?: boolean;      // ✅ added isLoading prop
};

export default function Button({ children, variant = 'primary', fullWidth, isLoading, ...rest }: Props) {
  const base = 'px-4 py-2 rounded';
  const widthClass = fullWidth ? 'w-full' : '';
  const cls = `${base} ${widthClass} ${variant === 'primary' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`;

  return (
    <button className={cls} {...rest} disabled={isLoading || rest.disabled}>
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
