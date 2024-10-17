import React, { useState } from "react";
import Canvas from "./components/Canvas";
import ColorPalette from "./components/ColorPalette";

const App: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState("#000000");

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Pixel Art Collaborator (1024x1024)</h1>
      <ColorPalette onColorSelect={setSelectedColor} />
      <div style={{ overflow: "hidden", width: "100%", height: "80vh" }}>
        <Canvas width={1024} height={1024} />
      </div>
    </div>
  );
};

export default App;
