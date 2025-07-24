import React from 'react';
import { StatusEnum } from '../../../enums/Status.enum';
import { RequestedIcon, ApprovedIcon, RejectedIcon } from '../../atoms';
import { capitalizeFirstLetter } from '../../../utils';
export const RequestStatus = ({ status }) => {
  if (status == StatusEnum.REQUESTED) {
    return <RequestedIcon />;
  } else if (status == StatusEnum.APPROVED) {
    return <ApprovedIcon />;
  } else if (status == StatusEnum.REJECTED) {
    return <RejectedIcon />;
  }
};
