import api from "../axios";

interface LoginDTO {
  email: string;
  password: string;
}

export async function loginRequest(data: LoginDTO) {
  const res = await api.post('/auth/login', data);
  return res.data;
}
