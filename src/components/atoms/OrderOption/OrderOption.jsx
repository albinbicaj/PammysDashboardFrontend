export const OrderOption = ({ onClick, icon, optionType }) => {
  return (
    <div className="order-option flex items-center px-2 py-1 font-bold">
      <div>{optionType}</div>
      <span className="ml-2">
        <img src="/images/Vector.svg" />
      </span>
    </div>
  );
};
