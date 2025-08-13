
let accessTokenMem = null;

export function setTokens({ access, refresh }) {
  if (typeof access === "string") {
    accessTokenMem = access;
    localStorage.setItem("writely_access", access);
  }
  if (typeof refresh === "string") {
    localStorage.setItem("writely_refresh", refresh);
  }
}

export function getAccessToken() {
  return accessTokenMem || localStorage.getItem("writely_access") || null;
}

export function getRefreshToken() {
  return localStorage.getItem("writely_refresh") || null;
}

export function clearTokens() {
  accessTokenMem = null;
  localStorage.removeItem("writely_access");
  localStorage.removeItem("writely_refresh");
}
