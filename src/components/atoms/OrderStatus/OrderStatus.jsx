import { StatusEnum } from '../../../enums/Status.enum';
import { capitalizeFirstLetter } from '../../../utils';
StatusEnum;
export const OrderStatus = ({ status }) => {
  if (status == StatusEnum.REQUESTED) {
    return <span className='requested-order'>{capitalizeFirstLetter(status)}</span>;
  } else if (status == StatusEnum.REJECTED) {
    return <span className='rejected-order'>{capitalizeFirstLetter(status)}</span>;
  } else if (status == StatusEnum.APPROVED) {
    return <span className='approved-order'>{capitalizeFirstLetter(status)}</span>;
  }
};
