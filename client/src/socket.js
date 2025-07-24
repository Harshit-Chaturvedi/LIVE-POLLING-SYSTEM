import { io } from "socket.io-client";

const socket = io(); // 👈 This works since both frontend & backend are same origin

export default socket;
