import api, { ENDPOINTS } from "./api";
import {jwtDecode}  from "jwt-decode";
import { setTokens, clearTokens, getAccessToken } from "./tokenStorage";

export async function register({ username, email, password, role }) {
  const { data } = await api.post(ENDPOINTS.REGISTER, { username, email, password, role });

  return data;
}

export async function login({ username, password }) {
  const { data: tokens } = await api.post(ENDPOINTS.LOGIN, { username, password });
  setTokens({ access: tokens.access, refresh: tokens.refresh });
  const user = await loadCurrentUser();
  return { user, access: tokens.access, refresh: tokens.refresh };
}

export async function loadCurrentUser() {
  const token = getAccessToken();
  if (!token) return null;

  const payload = jwtDecode(token); 
  const userId = payload.user_id || payload.user || payload.sub;
  if (!userId) return null;

  const { data } = await api.get(ENDPOINTS.USER_DETAIL(userId));
  return data; 
}

export async function logout() {
  clearTokens();
  return true;
}
