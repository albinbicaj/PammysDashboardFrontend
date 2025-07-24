import { StepConnector } from '@mui/material';

export const CustomConnector = () => (
  <StepConnector
    className="my-connector"
    style={{
      display: 'block',
      backgroundColor: 'black',
      marginLeft: '16px', // Adjust the spacing between the icon and line as needed
    }}
  />
);
