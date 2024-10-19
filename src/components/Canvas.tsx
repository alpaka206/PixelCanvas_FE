import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import axios from "axios";
import ColorPalette from "./ColorPalette";

const Canvas: React.FC = () => {
  const [canvasData, setCanvasData] = useState<string[][]>(
    Array(64)
      .fill(null)
      .map(() => Array(64).fill("#ffffff"))
  ); // 초기화된 빈 캔버스
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selectedColor, setSelectedColor] = useState("#000000"); // 기본 색상
  const [error, setError] = useState<string>(""); // 에러 메시지 상태

  useEffect(() => {
    // 소켓 연결 설정
    const newSocket = io("http://localhost:3000", {
      withCredentials: true, // 쿠키 기반 인증을 위해 설정
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      newSocket.emit("authenticate"); // 쿠키를 통해 자동 인증
    });

    newSocket.on("authenticated", (isAuthenticated: boolean) => {
      if (isAuthenticated) {
        newSocket.emit("getCanvas");
      } else {
        console.log("Authentication failed");
        setError("Authentication failed. Please log in again.");
      }
    });

    newSocket.on("canvasData", (data) => {
      setCanvasData((prevCanvas) => {
        const updatedCanvas = prevCanvas.map((row) => [...row]);
        data.pixels.forEach(
          (pixel: { x: number; y: number; color: string }) => {
            updatedCanvas[pixel.y][pixel.x] = pixel.color;
          }
        );
        return updatedCanvas;
      });
    });

    newSocket.on(
      "pixelUpdated",
      (pixel: { x: number; y: number; color: string }) => {
        setCanvasData((prevCanvas) => {
          const updatedCanvas = prevCanvas.map((row) => [...row]);
          updatedCanvas[pixel.y][pixel.x] = pixel.color;
          return updatedCanvas;
        });
      }
    );

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleCanvasClick = (x: number, y: number) => {
    if (socket) {
      socket.emit("updatePixel", { x, y, color: selectedColor });
    } else {
      setError("Socket connection not established. Please try again.");
    }
  };

  return (
    <div>
      <h1>Canvas</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ColorPalette onColorSelect={setSelectedColor} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(64, 10px)` }}>
        {canvasData.map((row, y) =>
          row.map((color, x) => (
            <div
              key={`${x}-${y}`}
              onClick={() => handleCanvasClick(x, y)}
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: color,
                border: "1px solid #ddd",
                boxSizing: "border-box",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Canvas;
