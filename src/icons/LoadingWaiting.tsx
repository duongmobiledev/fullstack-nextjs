interface ILoadingWaiting {}

export const LoadingWaiting: React.FC<ILoadingWaiting> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="block mr-auto bg-transparent"
      width="217px"
      height="217px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid">
      <path
        d="M10 50A40 40 0 0 0 90 50A40 42.8 0 0 1 10 50"
        fill="#4f46e5"
        stroke="none">
        <animateTransform
          attributeName="transform"
          type="rotate"
          dur="1s"
          repeatCount="indefinite"
          keyTimes="0;1"
          values="0 50 51.4;360 50 51.4"></animateTransform>
      </path>
    </svg>
  );
};
