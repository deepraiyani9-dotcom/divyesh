const LoadingSpinner = ({ fullScreen = false, size = 'md', label = 'Loading...' }) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} rounded-full border-primary/20 border-t-primary animate-spin`}
        role="status"
        aria-label={label}
      />
      {fullScreen && <p className="text-sm text-muted font-medium">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-16">{spinner}</div>;
};

export default LoadingSpinner;
