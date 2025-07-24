import { Collapse } from '@mui/material';
import { IconCaretDownFilled, IconHeadset, IconPlus, IconTruckReturn } from '@tabler/icons-react';
import { useState } from 'react';

export const Dropdown = ({ title, children, tabId, tab, handleTabClick }) => {
  return (
    <div className=" pb-8 ">
      <button
        className="flex w-full justify-between border-b border-gray-700 pb-2 text-left font-semibold focus:outline-none"
        onClick={() => handleTabClick(tabId)} // Pass tabId to handleTabClick
      >
        <p className="">{title}</p>
        {/* <IconCaretDownFilled
          className={`duration-500 ${tab === tabId ? 'rotate-[90deg]' : ''} `}
          // className={`duration-1000 ${tab === tabId ? 'rotate-[450deg]' : ''} `}
        /> */}
        <IconCaretDownFilled
          className={`min-w-8 duration-300 ${tab === tabId ? 'rotate-[45deg]' : ''} `}
        />
        {/* TAB: {tab}, TABID: {tabId} */}
      </button>
      <Collapse in={tab === tabId}>
        <div className=" border-gray-300 bg-gray-50 px-4 py-4">
          <div className=" min-h-[80px] text-sm ">
            <div className="">{children}</div>
          </div>
        </div>
      </Collapse>
      {/* {tab === tabId && <div className="mt-2 min-h-[70px] text-sm">{children}</div>} */}
    </div>
  );
};

export const OrderStatusPageFooterV2 = () => {
  const [tab, setTab] = useState(-1);

  const handleTabClick = (tabId) => {
    if (tabId === tab) {
      setTab(-1); // Close the dropdown if the same tab is clicked
    } else {
      setTab(tabId); // Open the dropdown for the clicked tab
    }
  };

  return (
    <div className="mt-5">
      <div className="dgb-red flex flex-col gap-12 bg-accent p-6 md:p-8 ">
        <div>
          <Dropdown
            title="Du möchtest Artikel zurücksenden oder umtauschen?"
            tabId={1}
            tab={tab}
            handleTabClick={handleTabClick}
          >
            <p>
              Melde vorab deine Rücksendung in unserem Retourenportal an und befolge alle weiteren
              Hinweise aus der Bestätigung, die du erhältst, nachdem du deine Rücksendung angemeldet
              hast.
            </p>
          </Dropdown>

          <Dropdown
            title="Reklamation und Falschlieferung"
            tabId={2}
            tab={tab}
            handleTabClick={handleTabClick}
          >
            <p>
              Falls du beschädigte Produkte erhalten hast, oder gar Produkte aus deiner Bestellung
              fehlen, obwohl laut Versandbestätigung alle Produkte versendet wurden, kannst du dies
              ebenfalls über das Retourenportal anmelden.
            </p>
          </Dropdown>
          <Dropdown
            title="Where can I find user reviews?"
            tabId={3}
            tab={tab}
            handleTabClick={handleTabClick}
          >
            <p>
              If you have any further questions, please visit our{' '}
              <a className="" href="https://pammys.com/pages/faq" target="_blank">
                FAQ page
              </a>
            </p>
          </Dropdown>
        </div>

        {/* <Dropdown title="ZUM RETOURENPORTAL ->">
          <p>{`ZUM RETOURENPORTAL ->`}</p>
        </Dropdown> */}

        {/* <Dropdown title="Dropdown 3" tabId={3} tab={tab} handleTabClick={handleTabClick}>
          <p>
            Bei weiteren Fragen schau gerne auf unserer FAQ-Seite vorbei oder wende dich über den
          </p>
          <p className="font-bold">
            Live-Chat oder unser Kontaktformular an unseren hilfsbereiten Kundenservice.
          </p>
        </Dropdown> */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row  sm:gap-8">
          <div>
            <button className="click flex w-full justify-center gap-3 border-b border-gray-700 px-4  py-2 font-semibold">
              ZUM RETOURENPORTAL <IconTruckReturn stroke={1.5} />
            </button>
          </div>
          <div>
            <button className="click flex w-full justify-center gap-3 border-b border-gray-700  px-4 py-2 font-semibold">
              {'zum Kundenservice'.toUpperCase()} <IconHeadset stroke={1.5} />
            </button>
          </div>
        </div>
      </div>
      {/* <div className="py-8">
        <button className="click relative overflow-hidden border-2 border-black bg-accent px-4 py-2">
          <span className=" bg-accent">{`ZUM RETOURENPORTAL ->`}</span>
          <span className="bg-accent-overlay absolute inset-0 z-10  border-2 border-red-500"></span>
        </button>
      </div>
      <div>
        <button className="click  hover:from-dark hover:via-dark  bg-gradient-to-b from-accent from-10% via-accent via-10% to-emerald-500 to-0% px-4 py-2 transition  duration-150  hover:from-0% hover:via-20% hover:to-black">{`ZUM RETOURENPORTAL ->`}</button>
      </div>
      <button className="relative overflow-hidden bg-accent px-4 py-2 text-white">
        <span className="relative z-10">{`ZUM RETOURENPORTAL ->`}</span>
        <span className="bg-dark absolute inset-0 translate-y-full transform transition-transform"></span>
      </button> */}
    </div>
  );
};
