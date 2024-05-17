import { DateTime } from 'luxon';

import { IService } from '@typings';

interface ILicenseProductProps {
  product: IService;
}

const LicenseProduct: React.FC<ILicenseProductProps> = (props) => {
  const item = props.product;
  const timeStamp = DateTime.fromSeconds(
    item?.license?.expirationTimestamp
  ).toFormat('dd/MM/yyyy');
  return (
    <>
      <div className="pt-5 pb-5 mt-2 border-t border-gray-200">
        <h3 className="text-lg font-medium 	color: rgb(0 0 0) font-weight: 600">
          Thông tin bản quyền
        </h3>
        <div>
          <div className="py-1 sm:py-2 sm:grid sm:grid-cols-2 sm:gap-2 sm:px-2">
            <h3 className="text-sm font-medium 	color: rgb(0 0 0) font-weight: 300">
              ID Tài Khoản:
            </h3>
            <h3 className="text-sm font-medium 	color: rgb(0 0 0) font-weight: 300">
              {item?.license?.user?._id}
            </h3>
          </div>

          {item?.license?.package != null ? (
            <div className="py-1 sm:py-2 sm:grid sm:grid-cols-2 sm:gap-2 sm:px-2">
              <h3 className="text-sm font-medium 	color: rgb(0 0 0) font-weight: 300">
                Gói:
              </h3>
              <h3 className="text-sm font-medium 	color: rgb(0 0 0) font-weight: 300">
                {item?.license?.package?.name}
              </h3>
            </div>
          ) : (
            <div />
          )}
          <div className="py-1 sm:py-2 sm:grid sm:grid-cols-2 sm:gap-2 sm:px-2">
            <h3 className="text-sm font-medium 	color: rgb(0 0 0) font-weight: 300">
              Thời gian hết hạn bản quyền:
            </h3>
            <h3 className="text-sm font-medium 	color: rgb(0 0 0) font-weight: 300">
              {timeStamp}
            </h3>
          </div>

          {item?.license?.numberOfMonths != null ? (
            <>
              <div className="py-1 sm:py-2 sm:grid sm:grid-cols-2 sm:gap-2 sm:px-2">
                <h3 className="text-sm font-medium 	color: rgb(0 0 0) font-weight: 300">
                  Giới hạn tạo:
                </h3>
                <h3 className="text-sm font-medium 	color: rgb(0 0 0) font-weight: 300">
                  {item?.license?.dailyLimit?.createAudienceLimit}
                </h3>
              </div>
              <div className="py-1 sm:py-2 sm:grid sm:grid-cols-2 sm:gap-2 sm:px-2">
                <h3 className="text-sm font-medium 	color: rgb(0 0 0) font-weight: 300">
                  Giới hạn đề xuất:
                </h3>
                <h3 className="text-sm font-medium 	color: rgb(0 0 0) font-weight: 300">
                  {item?.license?.dailyLimit?.suggestedAudienceLimit}
                </h3>
              </div>
              <div className="py-1 sm:py-2 sm:grid sm:grid-cols-2 sm:gap-2 sm:px-2">
                <h3 className="text-sm font-medium 	color: rgb(0 0 0) font-weight: 300">
                  Giới hạn thư viện:
                </h3>
                <h3 className="text-sm font-medium 	color: rgb(0 0 0) font-weight: 300">
                  {item?.license?.dailyLimit?.libraryLimit}
                </h3>
              </div>
            </>
          ) : (
            <div />
          )}
        </div>
      </div>
    </>
  );
};

export default LicenseProduct;
