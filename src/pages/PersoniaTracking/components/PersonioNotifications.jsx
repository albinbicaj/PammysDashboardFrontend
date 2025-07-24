import { IconLoader2 } from '@tabler/icons-react';
import dayjs from 'dayjs';

const PersonioNotifications = ({ response = [], type = 'default', taskToast = () => {} }) => {
  const createdAt =
    type === 'startWork' || type === 'startPause'
      ? response.log.start_time || response.log.updated_time
      : response.log.end_time || response.log.updated_time;
  // const createdAt = response.log.updated_at || response.log.created_at;

  // Format the created_at date using Day.js
  const formattedDate = dayjs(createdAt).format('dddd D MMMM');
  const formattedTime = dayjs(createdAt).format('HH:mm');

  const getMessage = (type = '', name = 'NAME', time = 'TIME') => {
    const formattedTime = dayjs(time).format('HH:mm');
    switch (type) {
      case 'startWork':
        return `Good morning, ${name}! You started work at ${formattedTime}. Have a great day!`;
      case 'startPause':
        return `Take a break, ${name}. You started your pause at ${formattedTime}. Enjoy your rest!`;
      case 'stopPause':
        return `Break's over, ${name}. You resumed work at ${formattedTime}. Let's get back to it!`;
      case 'stopWork':
        return `Well done, ${name}! You finished work at ${formattedTime}. Relax and recharge!`;
      default:
        return `Hello, ${name}. The current timeime is ${formattedTime}.`;
    }
  };
  const getHeader = (type = '') => {
    switch (type) {
      case 'startWork':
        return `Work Started`;
      case 'startPause':
        return `Break Started`;
      case 'stopPause':
        return `Break Over`;
      case 'stopWork':
        return `Work Completed`;
      default:
        return `Sync Completed`;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'startWork':
        return '#007AFF';
      case 'startPause':
        return '#FFA500';
      case 'stopPause':
        return '#34C759';
      case 'stopWork':
        return '#0056A6';
      default:
        return '#0056A6';
    }
  };
  return (
    <div
      onClick={() =>
        taskToast.update({
          message: '',
          position: 'center',
          duration: 1,
        })
      }
    >
      <div
        className="flex h-screen w-screen cursor-pointer flex-col items-center justify-center text-white"
        style={{ backgroundColor: getBgColor(type) }}
      >
        <div className=" flex h-full flex-col items-center px-6 py-24 md:py-32">
          <p className=" mb-4 text-4xl md:text-6xl">{getHeader(type)}</p>
          <p className="text-lg">{getMessage(type, response.user, response.log.created_at)}</p>
          <p className="mt-auto text-lg">TOUCH ANYWHERE TO CONTINUE</p>
          {/* <p>Wednesday 19 February at 21:03</p> */}
          <p>
            {formattedDate} at {formattedTime}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonioNotifications;
