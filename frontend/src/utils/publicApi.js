// LIBRARY IMPORTS
import axios from "axios";

// Create a placeholder object to hold the loader controls
let loaderControls = {
  show: () => {},
  hide: () => {},
};

// Set the base of every backend request
const publicApi = axios.create({
  baseURL: "http://localhost:8080/clubs",
});

// Add the loader interceptors to publicApi
publicApi.interceptors.request.use((config) => {
  loaderControls.show();
  return config;
});

// Creating the public request interceptors in order to control when the loading spinner appears and disappears
publicApi.interceptors.response.use(
  (res) => {
    loaderControls.hide();
    return res;
  },
  (err) => {
    loaderControls.hide();
    return Promise.reject(err);
  },
);

export default publicApi;
