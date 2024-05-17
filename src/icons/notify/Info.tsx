import { IIconSVGProps } from '@typings';

export const InfoIcon: React.FC<IIconSVGProps> = (props) => {
  const { ...res } = props;
  return (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      enable-background="new 0 0 16 16"
      {...res}>
      <path
        d="M8 2C4.69 2 2 4.69 2 8s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 11c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
        fill="#0aa5ff"
        className="fill-000000"></path>
      <path
        d="M8 6.85c-.28 0-.5.22-.5.5v3.4c0 .28.22.5.5.5s.5-.22.5-.5v-3.4c0-.27-.22-.5-.5-.5zM8.01 4.8c-.26-.02-.5.25-.51.52v.08c0 .27.21.47.49.48H8c.27 0 .49-.24.5-.5v-.11c0-.29-.21-.47-.49-.47z"
        fill="#0aa5ff"
        className="fill-000000"></path>
    </svg>
  );
};
