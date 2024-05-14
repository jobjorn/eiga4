import { colors } from './colors';

export const PageTitle: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <h1
      style={{
        borderBottom: '1rem solid',
        paddingBottom: '1rem',
        marginBottom: '1rem',
        borderColor: colors.primary.main
      }}
    >
      {children}
    </h1>
  );
};
