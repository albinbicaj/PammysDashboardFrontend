import React, { useState } from 'react';
import MuiAlert from '@mui/material/Alert';
import { Stack, Snackbar } from '@mui/material';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={24} ref={ref} variant="filled" {...props} />;
});
export const CustomSnackBar = ({ message, severity, duration }) => {
  const [open, setOpen] = useState(true);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  return (
    <Stack className="bg-button" spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        sx={{
          '& .MuiPaper-root': {
            color: '#000',
            backgroundColor: '#ffc55b', // Set the desired background color
          },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
      >
        <Alert severity={severity}>{message}</Alert>
      </Snackbar>
    </Stack>
  );
};
