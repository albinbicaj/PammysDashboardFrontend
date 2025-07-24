import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export const EventShippingLabel = ({
  createdBy = '',
  message = '',
  createdAt = '',
  pdfLabel = '',
}) => {
  // console.log(pdfLabel);
  return (
    <div className="flex items-center  ">
      <div className="ml-4 flex flex-col gap-2">
        <div>{createdAt}</div>
        <div>
          <p>{createdBy || 'Customer'},</p>
          <p>{message}</p>
        </div>

        <div>
          <a className="flex items-center text-blue-500" href={pdfLabel} target="_blank">
            Customer Shipping Label
            <InsertDriveFileIcon
              sx={{
                marginLeft: '5px',
                fontSize: '18px',
              }}
            />
          </a>
        </div>
      </div>
    </div>
  );
};
