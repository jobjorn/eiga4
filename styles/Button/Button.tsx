import './button.css';

export const Button: React.FC<{
  children: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
  variant?: 'contained' | 'outlined' | 'text';
  value?;
  name?;
}> = ({ children, disabled, type, variant, value, name }) => {
  return (
    <button
      className={`button ${variant}`}
      disabled={disabled}
      type={type}
      value={value}
      name={name}
    >
      {children}
    </button>
  );
};
