import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { green } from '@mui/material/colors';
import { Searchbar } from '../Searchbar/Searchbar';
import { Status } from '../Status/Status';
const color = green[500];
const iconStyle = {
  color: color,
  fontSize: '40px',
};
export const Order = ({ status }) => {
  return (
    <>
      {/* <Searchbar /> */}
      <div className="flex flex-col">
        <div className="flex justify-between items-center px-3 mb-3  w-full">
          <div className="flex flex-col mt-4 ">
            <div>
              <Status status={status} />
            </div>
            <div>Item sent back to filan - fisteku</div>
          </div>
          <div className="color-gray">Approved 3 months ago</div>
        </div>
        <div className="flex justify-between px-3 w-full  border-300-gray mb-3">
          <div>Shipment status</div>
          <div>
            <div>Logistics Partner</div>
            <div>Manual / Other</div>
          </div>
          <div>
            <div>Tracking ID</div>
            <div> - </div>
          </div>
        </div>
      </div>
    </>
  );
};
