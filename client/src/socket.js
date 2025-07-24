import { io } from 'socket.io-client';

const socket = io('https://live-polling-system-xvcf.onrender.com'); // 🔗 Render backend URL

export default socket;
