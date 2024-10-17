import React, { useRef, useEffect, useState, useCallback } from "react";
import { useSockJS } from "../hooks/useSockJS";

interface CanvasProps {
  width: number;
  height: number;
}

const Canvas: React.FC<CanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [scale, setScale] = useState(0.5); // 초기 스케일을 0.5로 설정
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const { sendMessage } = useSockJS();

  const drawPixel = useCallback((x: number, y: number, color: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 초기 캔버스 설정
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    // 여기에 서버에서 초기 캔버스 상태를 가져오는 로직을 추가할 수 있습니다.
  }, [width, height]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / scale) - offset.x;
    const y = Math.floor((event.clientY - rect.top) / scale) - offset.y;

    if (x >= 0 && x < width && y >= 0 && y < height) {
      drawPixel(x, y, selectedColor);
      sendMessage({ x, y, color: selectedColor });
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const newScale = scale * (event.deltaY > 0 ? 0.9 : 1.1);
    setScale(Math.max(0.1, Math.min(newScale, 5))); // 스케일 제한
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const dx = event.clientX - lastPosition.x;
    const dy = event.clientY - lastPosition.y;

    setOffset((prev) => ({ x: prev.x + dx / scale, y: prev.y + dy / scale }));
    setLastPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleCanvasClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          border: "1px solid #000",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      />
    </div>
  );
};

export default Canvas;
