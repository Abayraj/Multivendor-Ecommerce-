import axios from 'axios';
export const axiosInstance = axios.create({
    baseURL: "http://localhost:3000", // Set the baseURL to your server variable
    // You can add other configurations here as needed
  });
  
  // export default axiosInstance
  // export default server