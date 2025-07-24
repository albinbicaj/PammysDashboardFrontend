import dayjs from 'dayjs';
import { BACKEND_URL } from '../../../config/env';
import { UploadedTimelineImage } from '../UploadedTimelineImage/UploadedTimelineImage';

export const Event = ({ createdBy, message, createdAt, image }) => {
  return (
    <div className="flex w-full  items-center ">
      <div className="ml-4 flex flex-col gap-1 ">
        {/* <div>{dayjs(createdAt, 'DD.MM.YYYY HH:mm:ss').format('DD.MM.YYYY HH:mm:ss')}</div> */}
        <div>{createdAt}</div>
        <div>{message}</div>
        <div className="font-semibold text-gray-400">{createdBy || ''}</div>
        <div className="mt-3 flex flex-wrap gap-5">
          {image &&
            image.map((image, index) => {
              return <UploadedTimelineImage key={index} uploaded_image={image} />;
            })}
        </div>
      </div>
    </div>
  );
};
