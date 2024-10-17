import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";

const SOCKET_URL = "http://localhost:3000/sockjs"; // 백엔드 서버 주소로 변경 필요

export const useSockJS = () => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:3000/sockjs", null, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.onopen = () => {
      console.log("Connected to server");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);
      // 여기서 메시지 처리 로직 구현
    };

    socket.onclose = () => {
      console.log("Disconnected from server");
    };

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = (message: any) => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

  return { sendMessage };
};
