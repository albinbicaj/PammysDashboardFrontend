import { IconAlertTriangle, IconCircleCheck } from '@tabler/icons-react';
import React from 'react';
import { PammysLoading } from '../../../components/atoms/PammysLoading/PammysLoading';

// Topics to check for
// const requiredTopics = [
//   'orders/updated',
//   'orders/fulfilled',
//   'orders/partially_fulfilled',
//   'orders/cancelled',
//   'fulfillments/update',
//   'products/update',
//   'products/delete',
//   'fulfillment_orders/hold_released',
//   'fulfillment_orders/placed_on_hold',
// ];
const requiredTopics = [
  'ORDERS_UPDATED',
  'ORDERS_FULFILLED',
  'ORDERS_PARTIALLY_FULFILLED',
  'ORDERS_CANCELLED',
  'FULFILLMENTS_UPDATE',
  'PRODUCTS_UPDATE',
  'PRODUCTS_DELETE',
  'FULFILLMENT_ORDERS_HOLD_RELEASED',
  'FULFILLMENT_ORDERS_PLACED_ON_HOLD',
];

// Function to group the webhooks by address
const groupByAddress = (data) => {
  return data.reduce((acc, curr) => {
    if (!acc[curr.endpoint.callbackUrl]) {
      acc[curr.endpoint.callbackUrl] = [];
    }
    acc[curr.endpoint.callbackUrl].push(curr);
    return acc;
  }, {});
};

// Function to check if an address has all the required topics
const hasAllRequiredTopics = (webhooks) => {
  const topics = webhooks.map((item) => item.topic);
  return requiredTopics.every((requiredTopic) => topics.includes(requiredTopic));
};

const WebhookGroupedList = ({
  webhooks = [],
  handleSaveWebhook = () => {},
  isFetching = false,
}) => {
  const groupedPayload = groupByAddress(webhooks);

  console.log(webhooks);

  return (
    <div className="flex flex-col gap-5">
      {Object.keys(groupedPayload).map((address) => {
        const topics = groupedPayload[address].map((item) => item.topic);
        const includesAllRequiredTopics = hasAllRequiredTopics(groupedPayload[address]);

        return (
          <>
            {' '}
            <div key={address} className="card relative flex flex-col gap-8 bg-white p-4">
              <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-lg border bg-gray-50 py-8">
                {includesAllRequiredTopics ? (
                  <>
                    <IconCircleCheck className="text-green-500" size={64} />
                    <p className="text-2xl font-semibold ">Webhooks operational</p>
                  </>
                ) : (
                  <>
                    <IconAlertTriangle className="text-red-500" size={64} />
                    <p className="text-2xl font-semibold ">Inactive webhook detected</p>
                  </>
                )}
                <p className="text-xl ">{address.replace('https://', '').split('/')[0]}</p>
              </div>
              {/* <div className="flex items-center gap-4 ">
              <div>
                {includesAllRequiredTopics ? (
                  <IconCircleCheck className="text-green-500" size={32} />
                ) : (
                  <IconAlertCircle className="text-orange-500" size={32} />
                )}
              </div>
              <div>
                <p>
                  Address:
                  <span>{address}</span>
                </p>
              </div>
            </div> */}
              <div className="grid grid-cols-3 gap-5">
                {requiredTopics.map((topic) => (
                  <div key={topic} className="flex items-center gap-3 p-2">
                    {topics.includes(topic) ? (
                      <IconCircleCheck className="text-green-500" size={20} />
                    ) : (
                      <IconAlertTriangle className="text-red-500" size={20} />
                    )}
                    <div>{topic}</div>
                  </div>
                ))}
              </div>
              <div
                className={`fixed left-7 top-7 transition-opacity duration-300 ${isFetching ? 'opacity-100' : 'opacity-0'}`}
              >
                <PammysLoading />
              </div>
            </div>
            <div className="mb-5 text-center">
              <button
                className="btn btn-primary"
                // disabled={includesAllRequiredTopics}
                onClick={handleSaveWebhook}
              >
                Save Webhook
              </button>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default WebhookGroupedList;
