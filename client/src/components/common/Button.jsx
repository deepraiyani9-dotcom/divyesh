import { Link } from 'react-router-dom';

const VARIANT_CLASS = {
  primary: 'btn-primary',
  accent: 'btn-accent',
  outline: 'btn-outline',
  white: 'btn-white',
};

const Button = ({
  children,
  variant = 'primary',
  to,
  href,
  onClick,
  type = 'button',
  className = '',
  icon,
  iconPosition = 'right',
  disabled = false,
  ...rest
}) => {
  const classes = `btn ${VARIANT_CLASS[variant] || VARIANT_CLASS.primary} ${
    disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''
  } ${className}`;

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="inline-flex">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="inline-flex">{icon}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} target={rest.target} rel={rest.rel} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled} {...rest}>
      {content}
    </button>
  );
};

export default Button;
