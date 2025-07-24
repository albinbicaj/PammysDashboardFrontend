import { readFromStorage, writeToStorage } from '../storage/webStorage';
import { AUTH_TOKEN_KEY } from '../../config/env';

export const readAuthToken = () => readFromStorage(AUTH_TOKEN_KEY, 'localStorage');
export const removeAuthToken = () => writeToStorage(AUTH_TOKEN_KEY, 'localStorage');
export const writeAuthToken = (token) => writeToStorage(AUTH_TOKEN_KEY, token, 'localStorage');
