import { IService } from '@typings';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
interface IDescriptionProductProps {
  item: IService;
}

const DescriptionProduct: React.FC<IDescriptionProductProps> = (props) => {
  const product = props.item;
  return (
    <>
      <div className="flex flex-col-reverse">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          {product?.name}
        </h1>
      </div>
      <p className="text-gray-500 mt-2 ">{product?.description}</p>
    </>
  );
};

export default DescriptionProduct;
