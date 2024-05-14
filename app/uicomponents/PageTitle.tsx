import { colors } from './colors';

export const PageTitle: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <h3
      style={{
        borderBottom: '1rem solid',
        padding: '1rem 0',
        marginBottom: '1rem',
        borderColor: colors.primary.main
      }}
    >
      {children}
    </h3>
  );
};
