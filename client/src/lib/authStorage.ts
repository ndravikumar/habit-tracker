const TOKEN_STORAGE_KEY = "habit-tracker-token";
const USER_STORAGE_KEY = "habit-tracker-user";

export function setStoredAuth(token: string, user: string) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USER_STORAGE_KEY, user);
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getStoredUser() {
  return localStorage.getItem(USER_STORAGE_KEY);
}
