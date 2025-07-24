import axiosInstance from '../utils/axios';

export const startWork = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosInstance.post(`/work/start`, { token });
      console.log(response.data); // Resolve with response.data
      resolve(response.data); // Resolve with response.data
    } catch (error) {
      console.log(error?.response?.data?.error || 'Something went wrong.');
      console.log(error?.response?.data || 'Something went wrong on startWork');
      reject(error?.response?.data?.error || 'Work has already started."manual"');
    }
  });
};

export const endWork = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosInstance.post(`/work/end`, { token });
      // resolve('Work End Success!');
      resolve(response.data); // Resolve with response.data
    } catch (error) {
      console.log(error?.response?.data?.error || 'Something went wrong.');
      console.log(error?.response?.data || 'Something went wrong on endWork');
      reject(error?.response?.data?.error || 'Something went wrong.');
    }
  });
};

export const startBreak = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosInstance.post(`/pause/start`, { token });
      resolve(response.data);
      // resolve('Pause Start Success!');
    } catch (error) {
      console.log(error?.response?.data?.error || 'Something went wrong.');
      console.log(error?.response?.data || 'Something went wrong on startBreak');

      reject(error?.response?.data?.error || 'Something went wrong.');
    }
  });
};

export const endBreak = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosInstance.post(`/pause/end`, { token });
      resolve(response.data);
      // resolve('Pause End Success!');
    } catch (error) {
      console.log(error?.response?.data?.error || 'Something went wrong.');
      console.log(error?.response?.data || 'Something went wrong on endBreak');

      reject(error?.response?.data?.error || 'Something went wrong.');
    }
  });
};

//
// import axiosInstance from '../utils/axios';

// export const startWork = async (t) => {
//   const response = await axiosInstance.post(`/work/start?token=${t}`);
//   return response.data;
// };
// export const endWork = async (t) => {
//   const response = await axiosInstance.post(`/work/end?token=${t}`);
//   return response.data;
// };
// export const startBreak = async (t) => {
//   const response = await axiosInstance.post(`/pause/start?token=${t}`);
//   return response.data;
// };
// export const endBreak = async (t) => {
//   const response = await axiosInstance.post(`/pause/end?token=${t}`);
//   return response.data;
// };

export const personioApiController = (type, token) => {
  switch (type) {
    case 'startWork':
      return startWork(token);
    case 'stopWork':
      return endWork(token);
    case 'startPause':
      return startBreak(token);
    case 'stopPause':
      return endBreak(token);
    default:
      throw new Error('Unknown action type');
  }
};
