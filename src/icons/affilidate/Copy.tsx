import { IIconSVGProps } from '@typings';

interface ICopyIcon extends IIconSVGProps {}

export const CopyIcon: React.FC<ICopyIcon> = (props) => {
  return (
    <svg
      {...props}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      enable-background="new 0 0 32 32">
      <path
        d="M12 3v6h6l-6-6H3v22h15V9"
        fill="none"
        stroke="#ffffff"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        className="stroke-000000"></path>
      <path
        d="M29 12v17H14v-4M23 6v6h6l-6-6h-8"
        fill="none"
        stroke="#ffffff"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        className="stroke-000000"></path>
    </svg>
  );
};
