const baseUrl = import.meta.env.VITE_API_URL || "";

import io from 'socket.io-client';
export const socket = io(baseUrl);


