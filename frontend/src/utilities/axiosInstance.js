// Create a file named axiosInstance.js

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5555',
});

export default axiosInstance;
