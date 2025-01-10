import { useState, useEffect, useRef } from "react";
import "./Knob.css";

// WHAT IS THIS COMPONENT?
// react-knob is a headless knob that allows devs to implement a range input with the UX of a knob.
// the goal is to keep the DX simple and create a controlled input that a developer can pass a state and state setter into

// developer should provide minValue and maxValue, startAngle and endAngle

export default function Knob({
  startValue = 0,
  endValue = 12,
  defaultValue = 0,
  setRotation,
  startAngle = -180,
  endAngle = startAngle + 360,
  snap = false
}: {
  startValue: number;
  endValue: number;
  defaultValue: number;
  setRotation: (arg0: number) => void;
  startAngle: number;
  endAngle?: number;
  snap: boolean;
}) {
  const [knobRotation, setKnobRotation] = useState<number>(0);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [windowDimensions, setWindowDimensions] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [value, setValue] = useState<number>(defaultValue);

  const knobRef = useRef<HTMLDivElement>(null);

  function validateAngle(){
    if(startAngle + 360 < endAngle) return;
    else endAngle = startAngle + 360; 
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

      const offset = 180 - startAngle;
      const shift = startAngle;
      let deg = ((rad * (180 / Math.PI) + 90 + offset) % 360) + shift;

      return deg;
    }
    return 0;
  }

  function handleRotate(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (isClicked && knobRef.current) {
      setKnobRotation(calculateDegree(e));
    }
  }

  useEffect(function setCalculatedValue(){
    validateAngle()
        // convert current angle to a fraction (knobRotation / maxAngle - minAngle)
    // assign the fraction to a const, then do ((maxValue - minValue) * fraction) + minValue
    const amountRotated = knobRotation / (endAngle - startAngle)
    const currentValue = startValue + ((endValue - startValue) * amountRotated)

    setRotation(knobRotation);
  }, [knobRotation, startAngle, endAngle]);

  useEffect(function readRotationOnLoad() {

    setKnobRotation(knobRotation);
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
      <input style={{opacity: '0', position: 'absolute', visibility: 'hidden'}} min={startValue} max={endValue} type="range"/>
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
