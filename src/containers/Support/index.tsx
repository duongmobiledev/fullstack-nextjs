const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
interface ISupportProps {}

const Support: React.FC<ISupportProps> = (props) => {
  return <div className="px-4 sm:px-6 lg:px-8"></div>;
};

export default Support;
