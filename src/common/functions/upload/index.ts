export const getBase64 = (img: File) =>
  new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.addEventListener('load', () => resolve(reader.result as string));
  });
export const readFile = (file: File | undefined) => {
  if (!file) return;
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
};
