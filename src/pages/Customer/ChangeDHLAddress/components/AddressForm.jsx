import { t } from 'i18next';
import { IconLoader2 } from '@tabler/icons-react';

const countryNames = {
  DE: 'Germany',
  FR: 'France',
  NL: 'Netherlands',
  AT: 'Austria',
  PL: 'Poland',
  PT: 'Portugal',
  ES: 'Spain',
  CZ: 'Czech Republic',
};

// const countryCodes = ['DE', 'FR', 'NL', 'AT', 'PL', 'PT', 'ES', 'CZ'];
const countryCodes = Object.keys(countryNames);

const AddressForm = ({
  handleSubmit,
  address,
  setAddress,
  requestingDHL,
  dhlUpdateStatus,
  warning,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Check if the changed field is the country code
    if (name === 'country_code') {
      const countryName = countryNames[value] || '';
      setAddress({
        ...address,
        country_code: value,
        country: countryName,
      });
    } else {
      setAddress({
        ...address,
        [name]: value,
      });
    }
  };
  return (
    <form
      autoComplete="off"
      onSubmit={requestingDHL || dhlUpdateStatus === 200 ? null : handleSubmit}
      className=""
      id="form"
    >
      <div>
        <div className=" space-y-5 overflow-y-auto p-5 md:p-8 ">
          <div className="grid grid-cols-1 gap-4 ">
            <div className="space-y-0.5">
              <label className="block">Land/Region:</label>
              <select
                disabled={requestingDHL || dhlUpdateStatus === 200}
                name="country_code"
                value={address.country_code}
                onChange={handleChange}
                className="w-full border p-2"
                style={{
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  backgroundImage:
                    "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e\")",
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1em',
                  paddingRight: '2rem',
                  backgroundColor: 'white',
                  color: 'black',
                }}
              >
                <option value="" disabled>
                  Wählen Sie Ihr Land
                </option>
                {countryCodes.map((code) => (
                  <option
                    key={code}
                    value={code}
                    style={{ backgroundColor: 'white', color: 'black' }}
                  >
                    {t(`countries.${code}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-0.5 ">
              <label className="block">Vorname:</label>
              <input
                disabled={requestingDHL || dhlUpdateStatus === 200}
                type="text"
                name="first_name"
                value={address.first_name}
                onChange={handleChange}
                className="w-full  border p-2"
              />
            </div>
            <div className="space-y-0.5 ">
              <label className="block">Nachname:</label>
              <input
                disabled={requestingDHL || dhlUpdateStatus === 200}
                type="text"
                name="last_name"
                value={address.last_name}
                onChange={handleChange}
                className="w-full  border p-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 ">
            <div className="space-y-0.5 ">
              <label className="block">Straße und Hausnummer:</label>
              <input
                disabled={requestingDHL || dhlUpdateStatus === 200}
                type="text"
                name="address1"
                value={address.address1}
                onChange={handleChange}
                className="w-full  border p-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-0.5 ">
              <label className="block">Postleitzahl:</label>
              <input
                disabled={requestingDHL || dhlUpdateStatus === 200}
                type="text"
                name="zip"
                value={address.zip}
                onChange={handleChange}
                className="w-full  border p-2"
              />
            </div>
            <div className="space-y-0.5 ">
              <label className="block">Stadt:</label>
              <input
                disabled={requestingDHL || dhlUpdateStatus === 200}
                type="text"
                name="city"
                value={address.city}
                onChange={handleChange}
                className="w-full  border p-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 ">
            <div className="space-y-0.5 ">
              <label className="block">Telefon (optional):</label>
              <input
                disabled={requestingDHL || dhlUpdateStatus === 200}
                type="text"
                name="phone"
                value={address.phone}
                onChange={handleChange}
                className="w-full  border p-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 ">
            <div className="space-y-0.5 ">
              <label className="block">Company (optional):</label>
              <input
                disabled={requestingDHL || dhlUpdateStatus === 200}
                type="text"
                name="company"
                value={address.company}
                onChange={handleChange}
                className="w-full  border p-2"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <button
          disabled={requestingDHL || dhlUpdateStatus === 200}
          type="submit"
          form="form"
          className={`btn btn-primary flex w-full rounded-none px-10 py-3 text-center  font-semibold duration-200 ${dhlUpdateStatus === 200 ? 'bg-green-400' : ''}`}
        >
          {requestingDHL === true ? (
            <p className="mx-auto flex gap-3 pr-4">
              <IconLoader2 className="animate-spin" /> Überprüfung mit DHL
            </p>
          ) : dhlUpdateStatus === 200 ? (
            <p className="mx-auto">
              {warning === true ? 'Mit Fehler speichern' : 'Adresse erfolgreich geändert'}
            </p>
          ) : (
            <p className="mx-auto">{t(`Submit`)} </p>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
