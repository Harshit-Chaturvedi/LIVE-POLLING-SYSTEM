import { io } from "socket.io-client";

const socket = io("https://live-polling-system-1-jsss.onrender.com"); // or use process.env.REACT_APP_SOCKET_URL

export default socket;
