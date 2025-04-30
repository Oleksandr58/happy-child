import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/",
  timeout: 1000,
  headers: { "Access-Control-Allow-Origin": "*" },
});

// Add a response interceptor for error handling
instance.interceptors.response.use(
  (response) => {
    // Return response data if successful
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Error Response:", error.response.data.message.join(", "));
      console.error("Status Code:", error.response.status);
    }

    // Optionally re-throw the error if needed
    return Promise.reject(error);
  }
);

export default instance;
