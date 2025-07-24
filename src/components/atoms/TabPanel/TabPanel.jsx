import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
export const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <p component="div">{children}</p>
        </Box>
      )}
    </div>
  );
};
