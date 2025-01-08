import { useState, useEffect, useRef } from "react";
import "./Knob.css";

export default function Knob({
  rotation = 0,
  setRotation,
  limit = 360,
}: {
  rotation: number;
  setRotation: (arg0: number) => void;
  limit?: number;
}) {
  const [knobRotation, setKnobRotation] = useState<number>(0);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [windowDimensions, setWindowDimensions] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const knobRef = useRef<HTMLDivElement>(null);

  function clampRotation(value: number) {
    return Math.min(Math.max(value, -limit), limit);
  }

  function calculateDegree(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (knobRef.current) {
      const x1 = knobRef.current.offsetLeft + knobRef.current.offsetWidth / 2;
      const y1 = knobRef.current.offsetTop + knobRef.current.offsetHeight / 2;

      const x2 = e.clientX;
      const y2 = e.clientY;

      const deltaY = y1 - y2;
      const deltaX = x1 - x2;

      const rad = Math.atan2(deltaY, deltaX);
      let deg = rad * (180 / Math.PI);

      return deg;
    }
    return 0;
  }

  function handleRotate(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (isClicked && knobRef.current) {
      setKnobRotation(clampRotation(calculateDegree(e)) - 90);
    }
  }

  useEffect(() => {
    setRotation(knobRotation);
  }, [knobRotation]);

  useEffect(function readRotationOnLoad() {
    setKnobRotation(rotation);
  }, []);

  useEffect(
    function setDimensionsOnResize() {
      setWindowDimensions({ x: window.innerWidth, y: window.innerHeight });
    },
    [window.innerHeight, window.innerWidth]
  );

  return (
    <div
      ref={knobRef}
      onMouseDown={() => {
        setIsClicked(true);
      }}
      onMouseMove={(e) => {
        handleRotate(e);
      }}
      className="knob"
    >
      <div className="knob__outline"></div>
      <div style={{ rotate: `${knobRotation}deg` }} className="knob__indicator">
        .
      </div>
      <div
        onMouseUp={() => {
          setIsClicked(false);
        }}
        style={{
          zIndex: `${isClicked ? "20" : "-1"}`,
          position: "fixed",
          width: `${windowDimensions.x}px`,
          height: `${windowDimensions.y}px`,
          top: 0,
          left: 0,
        }}
        className="mouseaction_preventer"
      ></div>
    </div>
  );
}
