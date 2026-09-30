import React from 'react';

interface ReflectiveEnergyLineProps {
  dark?: boolean;
  className?: string;
}

/**
 * High-precision animated energy line component.
 * Emits a continuous reflective photonic beam moving along the section divider line.
 */
export const ReflectiveEnergyLine: React.FC<ReflectiveEnergyLineProps> = ({ 
  dark = false, 
  className = '' 
}) => {
  return (
    <div 
      className={`${dark ? 'energy-line-divider-dark' : 'energy-line-divider'} ${className}`}
      aria-hidden="true"
    >
      <div className="energy-line-beam" />
    </div>
  );
};

export default ReflectiveEnergyLine;
