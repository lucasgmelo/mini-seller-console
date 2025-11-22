interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
}: BadgeProps) => {
  const baseStyles =
    'inline-flex items-center font-medium rounded-full px-2 py-1 text-xs';

  const variants = {
    default: 'bg-surface-200 text-gray-800',
    success: 'bg-accent-100 text-accent-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-primary-100 text-primary-800',
  };

  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};
