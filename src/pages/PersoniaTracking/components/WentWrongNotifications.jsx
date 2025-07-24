import { IconAlertTriangle } from '@tabler/icons-react';

const WentWrongNotification = ({ error = 'API Error', taskToast = () => {} }) => {
  return (
    <div
      className="cursor-pointer"
      onClick={() =>
        taskToast.update({
          message: '',
          position: 'center',
          duration: 1,
        })
      }
    >
      <div
        className="justify-cente flex h-screen w-screen flex-col items-center text-white"
        style={{ backgroundColor: 'red' }}
      >
        <div className=" flex h-full flex-col items-center px-6 py-24 md:py-32">
          <p className=" mb-4 text-4xl md:text-6xl">Something Went Wrong</p>
          <p className="text-lg">{error}</p>
          <p className="my-auto text-lg">
            <div className="">
              <IconAlertTriangle size={120} />
            </div>
          </p>
          <p className="mt-auto text-lg">TOUCH ANYWHERE TO CONTINUE</p>
        </div>
      </div>
    </div>
  );
};

export default WentWrongNotification;
