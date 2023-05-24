import axios from "axios";
import { parseCookies } from "nookies";

const { "jumbo-token": token } = parseCookies();

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Request-Width, Content-Type, Accept"
  }
});

if (token) {
  api.defaults.headers["Authorization"] = `Bearer ${token}`;
}
