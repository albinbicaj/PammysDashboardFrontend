import { Product } from '../Product/Product';

export const Exchange = ({ requested_date, reason, address, previous_item, new_item }) => {
  return (
    <div className="mb-4 flex flex-col">
      <div className="flex h-[50px] items-center justify-around border-2">
        <div>Requested Date</div>
        <div>{requested_date}</div>
      </div>
      <div className="flex  flex-col items-start border-2">
        <p>Return item</p>
        <Product
          quantity={1}
          product={'Test prod'}
          price={'12 euor'}
          img={'https://pummys.com/cdn/shop/files/Beige-2-1_1000x.jpg?v=1682511788'}
          quantityDisabled={true}
        />
      </div>
      <div className="flex flex-col items-start border-2">
        <p>Exchanged item</p>
        <Product
          quantity={1}
          product={'Test prod'}
          price={'12 euor'}
          img={'https://pummys.com/cdn/shop/files/Beige-2-1_1000x.jpg?v=1682511788'}
          quantityDisabled={true}
        />
      </div>
      <div className="flex h-[50px] items-center justify-around">
        <div className="font-semibold">Return reason</div>
        <div>{reason}</div>
      </div>
      <div className="flex items-center  justify-around border-2">
        <div className="font-semibold">Adresse</div>
        <div className="flex h-[200px] flex-col items-end justify-center text-gray-400">
          <div>112 West Nepessing Street ,</div>
          <div>Michigan, Lapeer, United States - 48446</div>
          <div>Tel Nr. : +19898989899</div>
        </div>
      </div>
    </div>
  );
};
