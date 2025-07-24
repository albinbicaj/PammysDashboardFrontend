import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { blue } from '@mui/material/colors';
export const CustomChart = () => {
  const data = [
    { name: 'Jan', uv: 1, pv: 35, amt: 3 },
    { name: 'Feb', uv: 4, pv: 2, amt: 6 },
    { name: 'Mar', uv: 7, pv: 35, amt: 9 },
    { name: 'Apr', uv: 21, pv: 12, amt: 23 },
    { name: 'May', uv: 31, pv: 52, amt: 3 },
    { name: 'Jun', uv: 41, pv: 42, amt: 43 },
    { name: 'Jul', uv: 51, pv: 72, amt: 53 },
  ];

  return (
    <LineChart width={1300} height={400} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="pv" stroke={blue[500]} />
      <Line type="monotone" dataKey="uv" stroke={'red'} />
      <Line type="monotone" dataKey="amt" stroke={'green'} />
    </LineChart>
  );
};
