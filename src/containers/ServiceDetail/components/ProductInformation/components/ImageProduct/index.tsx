import { StarIcon } from '@heroicons/react/outline';

import { IService } from '@typings';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
interface IImageProductProps {
  product?: IService;
}

const ImageProduct: React.FC<IImageProductProps> = (props) => {
  return (
    <>
      <div className="lg:row-end-1 lg:col-span-4">
        <div className="aspect-w-4 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden h-96">
          <img
            src={
              'https://i.picsum.photos/id/599/1000/1000.jpg?hmac=q-IEsdqW3riuDmeBSGNA-3ApCilkVOmojxttuOxiAKo'
            }
            className="object-center object-fill w-full h-96 "
          />
        </div>
      </div>
    </>
  );
};

export default ImageProduct;
