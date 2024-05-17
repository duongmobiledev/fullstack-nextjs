import { IIconSVGProps } from '@typings';

interface ICheckIcon {}

export const CheckIcon: React.FC<IIconSVGProps> = (props) => {
  return (
    <svg
      className="text-cyan-500"
      {...props}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.71 7.21a1 1 0 0 0-1.42 0l-7.45 7.46-3.13-3.14A1 1 0 1 0 5.29 13l3.84 3.84a1 1 0 0 0 1.42 0l8.16-8.16a1 1 0 0 0 0-1.47Z"
        fill="currentColor"
        className="fill-6563ff"></path>
    </svg>
  );
};
