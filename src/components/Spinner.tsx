interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export const Spinner = ({ size = 'md', message }: SpinnerProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div
        className={`${sizeClasses[size]} border-quaternary border-t-white rounded-full animate-spin`}
        role="status"
        aria-label="Cargando"
      />
      {message && (
        <p className="text-quaternary text-sm animate-pulse">{message}</p>
      )}
    </div>
  )
}
