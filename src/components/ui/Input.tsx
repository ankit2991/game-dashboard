import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-[#98A5BF] pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={`w-full rounded-xl bg-[#121A2D] text-[#F5F7FF] placeholder-[#64748B] text-sm border transition-all duration-200 outline-none
            ${leftIcon ? 'pl-10' : 'pl-4'}
            ${rightIcon ? 'pr-10' : 'pr-4'}
            py-2.5
            ${error ? 'border-[#FF5D73] focus:ring-1 focus:ring-[#FF5D73]' : 'border-[#233252] focus:border-[#7C5CFC] focus:ring-2 focus:ring-[#7C5CFC]/20'}
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 text-[#98A5BF] flex items-center cursor-pointer">
            {rightIcon}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-[#FF5D73] mt-1.5 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-[#98A5BF] mt-1.5">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
