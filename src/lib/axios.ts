import axios from "axios";
import { parseCookies } from "nookies";

const { "jumbo-token": token } = parseCookies();

export const api = axios.create({
  baseURL: 'http://15.228.222.52:3333',
});

if (token) {
  api.defaults.headers["Authorization"] = `Bearer ${token}`;
}
