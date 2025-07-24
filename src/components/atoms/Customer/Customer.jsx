import { Link } from 'react-router-dom';
export const Customer = ({ customerPath, name, email, phone, address, payment }) => {
  return (
    <div className="flex w-full  flex-col">
      <div className="customer-name flex flex-col items-start">
        <span className="mb-5 font-semibold">Kunde</span>
        <span className="">
          <Link to={customerPath} target="_blank" className="underline">
            {name}
          </Link>
        </span>
      </div>

      <div className="contact-information flex flex-col items-start">
        <span className="font-semibold">Contact information</span>
        <span className="text-">{email}</span>
      </div>
      <div className="contact-information flex flex-col items-start">
        <span className="font-semibold">Zahlungsmethode</span>
        <span>{payment}</span>
      </div>
      <div className="customer-address flex flex-col items-start">
        <span className="font-semibold">Adresse des Kunden</span>
        <span className="">{address}</span>
      </div>
    </div>
  );
};
