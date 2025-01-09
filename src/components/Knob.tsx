import { useState, useEffect, useRef } from "react";
import "./Knob.css";

export default function Knob({
  rotation = 0,
  setRotation,
  minAngle = -180,
  maxAngle = 180,
}: {
  rotation: number;
  setRotation: (arg0: number) => void;
  minAngle?: number;
  maxAngle?: number;
  zeroAngleOffset?: number;
}) {
  const [knobRotation, setKnobRotation] = useState<number>(0);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [windowDimensions, setWindowDimensions] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const knobRef = useRef<HTMLDivElement>(null);

  function clampRotation(value: number) {
    return Math.min(Math.max(value, minAngle), maxAngle);
  }

  function calculateDegree(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (knobRef.current) {
      const x1 = knobRef.current.offsetLeft + knobRef.current.offsetWidth / 2; // xcoord center of knob
      const y1 = knobRef.current.offsetTop + knobRef.current.offsetHeight / 2; // ycoord center of knob

      const x2 = e.clientX; // xcoord mousePos
      const y2 = e.clientY; // ycoord mousePos

      const deltaY = y1 - y2; // diff between y(center of knob - mousePos)
      const deltaX = x1 - x2; // diff between x(center of knob - mousePos)

      const rad = Math.atan2(deltaY, deltaX);

      // convert radians to degree

      let deg = ((rad * (180 / Math.PI) + 90 + 360) % 360) - 180;

      // let deg = rad * (180 / Math.PI);

      return deg;
    }
    return 0;
  }

  function handleRotate(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (isClicked && knobRef.current) {
      setKnobRotation(clampRotation(calculateDegree(e)));
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
    [window.innerHeight, window.innerWidth],
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
