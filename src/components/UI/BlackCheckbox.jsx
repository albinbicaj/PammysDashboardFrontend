import Checkbox from '@mui/material/Checkbox';
import CheckIcon from '@mui/icons-material/Check';

export const BlackCheckbox = (props) => {
  return (
    <Checkbox
      {...props}
      icon={
        <span
          style={{
            width: 20,
            height: 20,
            backgroundColor: '#fff',
            border: '2px solid rgba(0, 0, 0, 0.6)',
            borderRadius: 2,
            display: 'inline-block',
          }}
        />
      }
      checkedIcon={
        <span
          style={{
            width: 20,
            height: 20,
            backgroundColor: '#000',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckIcon style={{ color: '#fff', fontSize: 18 }} />
        </span>
      }
    />
  );
};
