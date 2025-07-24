import { IconLoader2 } from '@tabler/icons-react';

const buttons = [
  { type: 'startWork', text: 'Start Work', color: 'bg-green-' },
  { type: 'startPause', text: 'Start Pause', color: 'bg-red-' },
  { type: 'stopPause', text: 'Stop Pause', color: 'bg-red-' },
  { type: 'stopWork', text: 'Stop Work', color: 'bg-green-' },
];

const QRCodeNotifications = ({ response = [], type = 'default' }) => {
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
    <div>
      <div
        className="justify-cente flex h-screen w-screen flex-col items-center text-white"
        style={{ backgroundColor: getBgColor(type) }}
      >
        <div className=" flex h-full flex-col items-center px-6 py-24 md:py-32">
          <p className=" mb-4 text-4xl md:text-6xl">QR Code Scanned</p>
          <p className="text-lg"></p>
          <p className="my-auto text-lg">
            <div className="animate-spin">
              <IconLoader2 size={120} />
            </div>
          </p>
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeNotifications;
