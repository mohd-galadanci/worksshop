import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function loginAdmin(email: string, password: string) {
  try {
    const res = await axios.post(`${API}/api/admin/login`, { email, password });
    localStorage.setItem('adminToken', res.data.token);
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

export function logoutAdmin() {
  localStorage.removeItem('adminToken');
}

export function isAdminAuthenticated(): boolean {
  return !!localStorage.getItem('adminToken');
}
