export const calculateMiddleColor = ({
  color1 = '9ad29c',
  color2 = 'fff391',
  color3 = 'ea8f8f',
  ratio
}: {
  color1?: string;
  color2?: string;
  color3?: string;
  ratio: number;
}) => {
  const hex = (color: number) => {
    const colorString = color.toString(16);
    return colorString.length === 1 ? `0${colorString}` : colorString;
  };

  if (ratio <= 0.5) {
    let newRatio = ratio * 2;

    const r = Math.ceil(
      parseInt(color2.substring(0, 2), 16) * newRatio +
        parseInt(color1.substring(0, 2), 16) * (1 - newRatio)
    );
    const g = Math.ceil(
      parseInt(color2.substring(2, 4), 16) * newRatio +
        parseInt(color1.substring(2, 4), 16) * (1 - newRatio)
    );
    const b = Math.ceil(
      parseInt(color2.substring(4, 6), 16) * newRatio +
        parseInt(color1.substring(4, 6), 16) * (1 - newRatio)
    );

    return hex(r) + hex(g) + hex(b);
  } else {
    let newRatio = ratio * 2 - 1;

    const r = Math.ceil(
      parseInt(color3.substring(0, 2), 16) * newRatio +
        parseInt(color2.substring(0, 2), 16) * (1 - newRatio)
    );
    const g = Math.ceil(
      parseInt(color3.substring(2, 4), 16) * newRatio +
        parseInt(color2.substring(2, 4), 16) * (1 - newRatio)
    );
    const b = Math.ceil(
      parseInt(color3.substring(4, 6), 16) * newRatio +
        parseInt(color2.substring(4, 6), 16) * (1 - newRatio)
    );

    return hex(r) + hex(g) + hex(b);
  }
};
