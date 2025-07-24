import { convertToDE } from '../../../utils';

export const LineItem = ({ image, price, product, variant, quantity }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <img src={image} />
      </div>
      <div className="flex flex-col">
        <span>{product}</span>
        <span>{variant}</span>
      </div>
      <div>{convertToDE(price) + ' x ' + quantity}</div>
      <div>{convertToDE(price * quantity)}</div>
    </div>
  );
};
