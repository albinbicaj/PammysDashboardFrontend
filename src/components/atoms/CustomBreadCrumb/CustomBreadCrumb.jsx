import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export const CustomBreadCrumb = ({ current, className }) => {
  return (
    <Breadcrumbs
      className={className}
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      <Link color="textPrimary">{current} </Link>
    </Breadcrumbs>
  );
};
