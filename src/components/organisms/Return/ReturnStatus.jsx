import { useNavigate } from 'react-router-dom';
import { useOrderContext } from '../../../context/Order.context';
import { ProductStatus } from '../../molecules';
export const ReturnStatus = () => {
  const navigate = useNavigate();

  const { orderContext } = useOrderContext();
  return (
    <div className="mt-12 flex flex-col items-center">
      <>
        <div className={`${noPendingRequests ? 'overflow-hidden' : ''}`}>
          {noPendingRequests ? (
            <p>No requests for this order</p>
          ) : (
            orderContext.requested_line_items.map((product, i) => {
              return (
                <div key={i} className="product-wrapper">
                  <ProductStatus activeStep={1} type={'exchange'} />
                </div>
              );
            })
          )}
        </div>
      </>
    </div>
  );
};
