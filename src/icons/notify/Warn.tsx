import { IIconSVGProps } from '@typings';

export const WarnIcon: React.FC<IIconSVGProps> = (props) => {
  const { ...res } = props;
  return (
    <svg
      data-name="Layer 1"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      {...res}>
      <path
        d="M30.16 11.51 6.84 51.9a2.13 2.13 0 0 0 1.84 3.19h46.64a2.13 2.13 0 0 0 1.84-3.19L33.84 11.51a2.13 2.13 0 0 0-3.68 0Z"
        fill="#efcc00"
        className="fill-efcc00"></path>
      <path
        d="M29 46a3 3 0 1 1 3 3 2.88 2.88 0 0 1-3-3Zm1.09-4.66-.76-15h5.26l-.73 15Z"
        fill="#ffffff"
        className="fill-353535"></path>
    </svg>
  );
};
