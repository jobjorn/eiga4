import { colors } from './colors';

export const RoundedBox: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <div
      style={{
        backgroundColor: colors.secondary.light,
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'space-between'
      }}
    >
      {children}
    </div>
  );
};
