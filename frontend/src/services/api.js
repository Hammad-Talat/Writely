import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./tokenStorage";

const BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
const PREFIX = (import.meta.env.VITE_API_PREFIX || "/api/users").replace(/\/$/, "");
export const ENDPOINTS = {
  LOGIN: `${BASE}${PREFIX}/login/`,
  REGISTER: `${BASE}${PREFIX}/register/`,
  REFRESH: `${BASE}${PREFIX}/token/refresh/`,
  USER_DETAIL: (id) => `${BASE}${PREFIX}/${id}/`,
};

const api = axios.create({
  baseURL: BASE,
  withCredentials: false, 
});
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let pending = [];

function flushQueue(error, token = null) {
  pending.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pending = [];
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;

    if (status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pending.push({
            resolve: (token) => {
              original.headers.Authorization = `Bearer ${token}`;
              resolve(api(original));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const refresh = getRefreshToken();
        if (!refresh) throw new Error("No refresh token");

        const { data } = await axios.post(ENDPOINTS.REFRESH, { refresh }, { withCredentials: false });
        setTokens({ access: data.access });
        flushQueue(null, data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch (e) {
        flushQueue(e, null);
        clearTokens();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
