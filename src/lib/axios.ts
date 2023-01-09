import axios from "axios";
import { parseCookies } from "nookies";

const { "jumbo-token": token } = parseCookies();

export const api = axios.create({
  baseURL: 'https://15.228.222.52:3333',
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
});

if (token) {
  api.defaults.headers["Authorization"] = `Bearer ${token}`;
}
