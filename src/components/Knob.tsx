import { useState, useEffect, useRef } from "react";
import "./Knob.css";

// WHAT IS THIS COMPONENT?
// react-knob is a headless knob that allows devs to implement a range input with the UX of a knob.
// the goal is to keep the DX simple and create a controlled input that a developer can pass a state and state setter into

// developer should provide minValue and maxValue, startAngle and endAngle

export default function Knob({
  value,
  setValue,
  startValue = 0,
  endValue = 12,
  defaultValue = startValue,
  startAngle = -180,
  endAngle = startAngle + 360,
  snap = true,
  snapValue = false,
  step = 1,
}: {
  value: number;
  setValue: (arg0: number) => void;
  startValue: number;
  endValue: number;
  defaultValue?: number;
  startAngle: number;
  endAngle?: number;
  snap?: boolean;
  snapValue?: boolean;
  step?: number;
}) {
  const [knobRotation, setKnobRotation] = useState<number>(0);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [windowDimensions, setWindowDimensions] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const knobRef = useRef<HTMLDivElement>(null);

  function validateAngle() {
    // if the startAngle + 360 is >= than the endAngle, we're safe: 0-360 can be the endAngle without problems
    if (startAngle + 360 >= endAngle) return;
    else endAngle = startAngle + 360; // otherwise, we're maxed out. so set the endAngle to startAngle + 360
  }

  function clampRotation(value: number) {
    return Math.min(Math.max(value, startAngle), endAngle);
  }

  function normalizeAngle(angle: number) {
    return ((angle % 360) + 360) % 360;
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
      if (calculateDegree(e) > endAngle) return;
      return setKnobRotation(clampRotation(calculateDegree(e)));
    }
  }

  useEffect(function readRotationOnLoad() {
    setValue(defaultValue);
  }, []);

  useEffect(
    function setCalculatedValue() {
      validateAngle();
      const normalizedRotation = normalizeAngle(knobRotation - startAngle); // degrees rotated if startAngle is 0
      const amountRotated = normalizedRotation / (endAngle - startAngle); // degrees rotated of knob as percentage
      const currentValue = startValue + (endValue - startValue) * amountRotated;
      if (snap) {
        const snappedValue = Math.round(currentValue / step) * step;
        setValue(snappedValue);
        setKnobRotation(
          startAngle + (endAngle - startAngle) * (snappedValue / endValue),
        );
      } else {
        setValue(currentValue);
        setKnobRotation(knobRotation);
      }
    },
    [knobRotation, startAngle, endAngle],
  );

  useEffect(
    function setPreventerDimensionsOnResize() {
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
