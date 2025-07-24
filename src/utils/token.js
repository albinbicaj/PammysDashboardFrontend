import { AUTH_TOKEN_KEY } from "../config/env";
import { readFromStorage } from "./storage/webStorage";

export const jwtGetToken = () =>
  readFromStorage(AUTH_TOKEN_KEY, "localStorage");
