export const toTitleCase = (name: string) => {
  let parts = name.split(/[\s-]/);

  parts = parts.map((part) => {
    if (part.length > 0) {
      return (
        part.charAt(0).toLocaleUpperCase() + part.slice(1).toLocaleLowerCase()
      );
    }
    return part;
  });

  return name.replace(/[\wÅÄÖåäö]+/g, () => parts.shift() ?? '');
};
