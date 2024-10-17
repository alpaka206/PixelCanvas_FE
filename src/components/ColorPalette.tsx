import React from "react";

const colors = [
  "#000000",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFFFFF",
];

interface ColorPaletteProps {
  onColorSelect: (color: string) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ onColorSelect }) => {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}
    >
      {colors.map((color) => (
        <div
          key={color}
          style={{
            width: "30px",
            height: "30px",
            backgroundColor: color,
            margin: "0 5px",
            cursor: "pointer",
            border: "1px solid #000",
          }}
          onClick={() => onColorSelect(color)}
        />
      ))}
    </div>
  );
};

export default ColorPalette;
