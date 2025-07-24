import React from 'react';
import { OrderOption } from '../../atoms';
import { ReturnOrder } from './ReturnOrder';
import { ReturnExchangeOrder } from './ReturnExchange';
import { Feedback } from './Feedback';
import { ExchangeOrder } from '../Exchange/ExchangeOrder';
import { NavLink } from 'react-router-dom';
import useDocumentTitle from '../../useDocumentTitle';
const options = [
  {
    type: 'Rücksendung anmelden',
    step: 'return',
    component: <ReturnOrder />,
    link: '/return-order',
    hidden: false,
  },
  {
    type: 'Exchange order',
    step: 'exchange',
    component: <ExchangeOrder />,
    link: '/exchange-order',
    hidden: false,
  },
  {
    type: 'Return & Exchange Order',
    step: 'return_exchange',
    component: <ReturnExchangeOrder />,
    link: '/return-exchange-order',
    hidden: true,
  },
  {
    type: 'Feedback',
    step: 'feedback',
    component: <Feedback />,
    link: '/feedback',
    hidden: true,
  },
  {
    type: 'Bearbeitungsstatus anfragen',
    step: 'status',
    component: <Feedback />,
    link: '/return-order-status',
  },
];
export const ReturnMenu = () => {
  useDocumentTitle('Pammys Return Menu');

  return (
    <>
      <div className="mt-10 text-xl font-semibold">Wie möchtest du fortfahren?</div>
      <div className="flex h-full flex-col  items-center justify-center p-2">
        {options.map(
          (option, index) =>
            !option.hidden && (
              <div key={index} className="align-center my-3 flex cursor-pointer justify-center">
                <NavLink to={option.link} className="text-center">
                  <OrderOption icon={option.icon} optionType={option.type} />
                </NavLink>
              </div>
            ),
        )}
      </div>
    </>
  );
};
