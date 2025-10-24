import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary';
};

export default function Button({ children, variant = 'primary', ...rest }: Props) {
  const base = 'px-4 py-2 rounded';
  const cls = variant === 'primary' ? `${base} bg-blue-600 text-white` : `${base} bg-gray-200 text-black`;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
