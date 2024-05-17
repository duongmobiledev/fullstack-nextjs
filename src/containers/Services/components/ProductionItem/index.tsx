import { IService } from 'src/typings/Services';

import { currency } from '@common/functions';

import Link from '@designs/Link';

import { PATH } from '@routes';

interface IProductItemProps {
  item?: IService;
}

const ProductItem: React.FC<IProductItemProps> = (props) => {
  const product = props.item;
  return (
    <Link routeName={PATH.SERVICES_DETAIL} params={{ id: product._id }}>
      <div className="relative flex flex-col overflow-hidden bg-white border border-gray-200 rounded-lg group">
        <div className="lg:h-80 bg-gray-200 aspect-w-3 aspect-h-4 group-hover:opacity-75 sm:aspect-none sm:h-64">
          <img
            src={
              'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-01.jpg'
            }
            className="object-cover object-center w-full h-full sm:w-full sm:h-full"
          />
        </div>
        <div className="flex flex-col flex-1 p-4 space-y-2">
          <h3 className="text-md font-medium text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.description}</p>
          <div className="flex flex-col justify-end flex-1">
            <p className="text-base font-medium text-gray-900">
              {currency(product.price)} VND
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
