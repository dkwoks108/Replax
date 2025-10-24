import React from 'react';

type CardProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = '' }: CardProps) {
  return <div className={`p-4 shadow-sm bg-white ${className}`}>{children}</div>;
}
