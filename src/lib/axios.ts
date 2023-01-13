import axios from "axios";
import { parseCookies } from "nookies";

const { "jumbo-token": token } = parseCookies();

export const api = axios.create({
  baseURL: 'https://api.jumbo.co.ao:3333',
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
});

if (token) {
  api.defaults.headers["Authorization"] = `Bearer ${token}`;
}
