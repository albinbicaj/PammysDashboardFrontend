import { IconCircleCheck, IconExclamationCircle, IconX } from '@tabler/icons-react';

export const SuccessNotification = ({ message = '' }) => {
  return (
    <div className="flex max-w-[600px] gap-4 rounded-md   bg-green-400 p-4 text-white">
      <div className="min-w-4 pt-1 ">
        <IconCircleCheck />
      </div>
      <div>
        <p className={`text-lg font-bold text-white`}>Success!</p>
        <p>{message}</p>
      </div>
    </div>
  );
  return (
    <div className="flex gap-2">
      <div>{message}</div>
      <div className="flex items-center justify-center">
        <IconX />
      </div>
    </div>
  );
};

export const ErrorNotification = ({ message = '' }) => {
  return (
    <div className="flex max-w-[600px] gap-4 rounded-md   bg-red-500 p-4 text-white">
      <div className="min-w-4 pt-1 ">
        <IconExclamationCircle />
      </div>
      <div>
        <p className={`text-lg font-bold text-white`}>Error!</p>
        <p>{message} </p>
      </div>
    </div>
  );
};
