/* 
This helper file has the setup required to handle backend private requests. It includes:
  - An interceptor function that acts as middleware to attach user tokens to every request sent.
  - An interceptor function that acts as protection for requests that have expired Access Tokens,
    but a valid Refresh token. This interceptor catches 404 requests and refreshes the user's Access
    Tokens in the background if the Refresh token is valid, otherwise it clears the browser's token
    storage.
  - A verify method for private pages to use in their loaders to allow access to a logged in user,
    or redirect them if trying to access private pages as a public user.
*/

import axios from "axios";

// Create a placeholder object to hold the loader controls
let loaderControls = {
  show: () => {},
  hide: () => {},
};

// Export a function that RootHeader will use to "inject" the context functions
export const injectLoader = (show, hide) => {
  loaderControls.show = show;
  loaderControls.hide = hide;
};

// Set the base of every backend request
const api = axios.create({
  baseURL: "http://localhost:8080/api", // The backend URL
});

// Automatically add the Access Token to every request
api.interceptors.request.use((config) => {
  loaderControls.show(); // Turn loader ON

  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (Check if expired Access Tokens)
api.interceptors.response.use(
  (response) => {
    loaderControls.hide(); // Turn loader OFF on success
    return response; // If the request succeeds, just return it
  },

  async (error) => {
    const originalRequest = error.config;

    // If the request itself was to the login or refresh endpoint, don't intercept 401s
    if (
      originalRequest.url.includes("/login") ||
      originalRequest.url.includes("/refresh")
    ) {
      loaderControls.hide(); // Turn loader OFF if login/refresh fails
      return Promise.reject(error);
    }

    // If error is 403 (Forbidden) and we haven't tried to refresh yet
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Grab refresh token
        const refreshToken = localStorage.getItem("refreshToken");

        // Call backend refresh endpoint
        const res = await axios.post("http://localhost:8080/api/user/refresh", {
          token: refreshToken,
        });
        if (res.status === 200) {
          // Store the new token
          localStorage.setItem("accessToken", res.data.accessToken);

          // Update the header for the original failed request
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          // Retry the original request
          return api(originalRequest);
        } else {
          throw new Error();
        }
      } catch (refreshError) {
        // If the refresh token is also expired/invalid, clear browser storage (Log them out)
        localStorage.clear();
        loaderControls.hide(); // Turn loader OFF if refresh fails
        return Promise.reject(refreshError);
      }
    }

    loaderControls.hide(); // Turn loader OFF for all other errors
    return Promise.reject(error);
  },
);

// For landing on a private page, verify if token is real
api.verifyToken = async () => {
  try {
    const response = await api.get("/user/verify");
    return response.data; // Return user data
  } catch (error) {
    // If refresh fails, the interceptor already cleared localStorage
    return error;
  }
};

export default api;
