import axios from "axios";

export const API_ORIGIN = "http://localhost:8080"; // for  image URLs

export const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//111111111111111111111111111111111111111111111111

// import axios from "axios";

// export const api = axios.create({
//   baseURL: "http://localhost:8080/api",
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
