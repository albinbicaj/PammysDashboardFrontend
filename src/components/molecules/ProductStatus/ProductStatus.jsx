import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Return, Exchange } from '../../atoms';

import { ReturnProgress, ExchangeProgress } from '../../atoms';

export const ProductStatus = ({ items, address }) => {
  const navigate = useNavigate();

  const noPendingRequests = items.length === 0;
  return (
    <div className="mt-2 flex flex-col items-center">
      <div
        className={`${
          noPendingRequests ? 'overflow-hidden' : ''
        } product-status-wrapper no-scrollbar flex flex-col  items-center`}
      >
        {noPendingRequests ? (
          <p>Keine Anfragen für diese Bestellung mit der Schaltfläche zurückgehen!</p>
        ) : (
          items.map((item) => {
            const [showMore, setShowMore] = useState(false);
            return (
              <div className="flex flex-col">
                <Return
                  product_title={item.title}
                  product_price={item.price}
                  requested_date={item.created_at}
                  product_image={item.product_image}
                  product_quantity={item.quantity}
                  reason={item.reason}
                  address={address}
                  showMore={showMore}
                  setShowMore={setShowMore}
                  variant_info={item.current_variant}
                />
                {showMore && <ReturnProgress activeStep={item.latest_status} />}
              </div>
            );

            // return item.type === TypeEnum.RETURN ? (
            //   <div className="flex">
            //     <ReturnProgress activeStep={1} />
            //     <Return requested_date={'12/10/2023'} reason={'Dont like it'} />
            //   </div>
            // ) : (
            //   <div className="flex">
            //     <ExchangeProgress activeStep={1} />
            //     <Exchange requested_date={'12/10/2023'} reason={'Dont like it'} />
            //   </div>
            // );
          })
        )}
      </div>
    </div>
  );
};
