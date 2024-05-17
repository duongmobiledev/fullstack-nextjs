import { IIconSVGProps } from '@typings';

export const SuccessIcons: React.FC<IIconSVGProps> = (props) => {
  const { ...res } = props;
  return (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" {...res}>
      <path
        d="M256 6.998c-137.533 0-249 111.467-249 249 0 137.534 111.467 249 249 249s249-111.467 249-249c0-137.534-111.467-249-249-249zm0 478.08c-126.309 0-229.08-102.771-229.08-229.081 0-126.31 102.771-229.08 229.08-229.08 126.31 0 229.08 102.771 229.08 229.08 0 126.31-102.77 229.081-229.08 229.081z"
        fill="#5cd102"
        className="fill-425661"></path>
      <path
        fill="#5cd102"
        d="M384.235 158.192 216.919 325.518l-89.057-89.037-14.142 14.143 103.199 103.179L398.28 172.334z"
        className="fill-425661"></path>
    </svg>
  );
};
