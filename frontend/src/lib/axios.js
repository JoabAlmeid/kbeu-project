import axios from "axios";

const axiosInstance = axios.create({
  //this makes it dynamic. If it's in prod, use localhost, if not, use deploy URL+/api
  baseURL:
    import.meta.mode === "development" ? "http://localhost:5000/api" : "/api",
  withCredentials: true, //by default, every request send cookies to server. authmiddle
});

export default axiosInstance;
