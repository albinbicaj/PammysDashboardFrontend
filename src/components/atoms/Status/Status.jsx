import React from 'react';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PaidIcon from '@mui/icons-material/Paid';
import CancelIcon from '@mui/icons-material/Cancel';
import LoopIcon from '@mui/icons-material/Loop';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { StatusEnum } from '../../../enums/Status.enum';

export const Status = ({ status }) => {
  switch (status) {
    case StatusEnum.REQUESTED:
      return <AssignmentReturnedIcon />;
    case StatusEnum.IN_PROGRESS:
      return <CheckCircleOutlineIcon />;
    case StatusEnum.APPROVED:
      return <CheckCircleOutlineIcon />;
    case StatusEnum.REFUNDED:
      return <PaidIcon />;
    case StatusEnum.REJECTED:
      return <LoopIcon />;
    case StatusEnum.EXCHANGED:
      return <PublishedWithChangesIcon />;
    case StatusEnum.CANCELED:
      return <CancelIcon />;
    default:
      return null; // Return null for unsupported statuses or handle as needed
  }
};

