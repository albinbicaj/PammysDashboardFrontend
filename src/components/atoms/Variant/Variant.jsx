import React from 'react';
export const Variant = ({ image = '', product, price, onClick }) => {
  return (
    <div onClick={onClick} className={`items-around  mb-2 mr-2 flex cursor-pointer justify-start `}>
      <div className="mt-1 flex items-start justify-start">
        <div className="ml-2 mr-5">
          <img className="product-image" src={image} />
        </div>
        <div className="mr-5 flex flex-col items-start justify-start">
          <div className="font-bold">Produkt: {product}</div>
          <div className="font-medium">Price: {price} €</div>
        </div>
      </div>
    </div>
  );
};
