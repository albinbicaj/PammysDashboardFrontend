import InfoIcon from '@mui/icons-material/Info';
import { getReasonLabel } from '../../../utils/getReason';
import { Product } from '../Product/Product';

export const Return = ({
  product_title,
  product_price,
  requested_date,
  product_image,
  product_quantity,
  reason,
  address,
  showMore,
  setShowMore,
  variant_info,
}) => {
  const handleShowMore = () => {
    setShowMore(!showMore);
  };
  return (
    <div className="mb-4 flex flex-col">
      <div className="flex h-[50px] items-center justify-around border-2">
        <div className="font-semibold">Requested</div>
        <div>{requested_date}</div>
      </div>
      <div className="flex flex-col items-start border-2">
        <div className="flex justify-between">
          <div className="return-item-header ml-2 font-semibold">Returned Item</div>
          <div className="cursor-pointer" onClick={handleShowMore}>
            More info
            <InfoIcon />
          </div>
        </div>
        <Product
          onClick={handleShowMore}
          quantityDisabled={true}
          quantity={product_quantity}
          product={product_title}
          price={product_price}
          img={product_image}
          variant_info={variant_info}
        />
      </div>
      {showMore && (
        <>
          <div className="flex h-[50px] items-center justify-around border-2">
            <div className="font-semibold">Return reason</div>
            <div>{getReasonLabel(reason)}</div>
          </div>
          <div className="flex items-center  justify-around border-2">
            <div className="font-semibold">Address</div>
            <div className="flex h-[200px] flex-col items-end justify-center text-gray-400">
              <div>{address.address}</div>
              <div>
                {address.city} {address.state} {address.country} {address.zip}
              </div>
              <div>{address.phone || ''}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
