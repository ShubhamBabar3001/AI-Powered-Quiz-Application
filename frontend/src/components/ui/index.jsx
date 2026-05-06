import React from 'react';

// Helper function to handle conditional classes
export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  children, 
  ...props 
}, ref) => {
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30',
    secondary: 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/30',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
    ghost: 'text-indigo-600 hover:bg-indigo-50',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <button
      ref={ref}
      disabled={isLoading}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
});

export const Card = ({ className, children, onClick }) => (
  <div 
    onClick={onClick}
    className={cn(
      'rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-2xl', 
      onClick ? 'cursor-pointer hover:bg-white/10 transition-all' : '',
      className
    )}
  >
    {children}
  </div>
);

export const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all',
      className
    )}
    {...props}
  />
));

export const Skeleton = ({ className }) => (
  <div className={cn('animate-pulse rounded-xl bg-white/10', className)} />
);