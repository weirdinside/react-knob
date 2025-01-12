// EXPERIMENT: GET CHATGPT 4o TO REPLICATE THE KNOB

// PROMPT 1: Please create a React function component with TypeScript that serves as a range input in the form of a rotatable knob. Name it GPTKnob.
//           The knob rotation should follow the user's mouse/touch cursor when clicking/touching and dragging.
//           I would like it to alter a state that is set outside the component in the form of a useState.
//           The developer can pass in the following props: startValue (minimum number value on the range), endValue (maximum number value on the range),
//           startAngle (polar coordinates at which the knob zeroes out), endAngle(if less than 360 degrees,
//           the value at which the knob hits its maximum value and stops rotating),
//           defaultValue (the value at which the knob starts when rendered), the value (set by state),
//           the state setter (paired with the value from the useState outside the knob component),
//           a boolean for allowing snapping to values, and interval to split the values into for snapping.
//           Please add any props as you see fit to improve usability and reusability.
// FAILED: Attempts to access functions prior to declaration, references a function that does not exist.

// PROMPT 2: on line 31: Block-scoped variable 'getAngleFromValue' used before its declaration.ts(2448)
//           on lines 81 and 89 referencing 'handleMouseMove':  No overload matches this call.
//           Overload 1 of 2, '(type: "touchmove", listener: (this: Document, ev: TouchEvent) => any, options?: boolean | AddEventListenerOptions | undefined): void', gave the following error.
//           Argument of type '(e: MouseEvent) => void' is not assignable to parameter of type '(this: Document, ev: TouchEvent) => any'.
//           Types of parameters 'e' and 'ev' are incompatible.
//           Type 'TouchEvent' is missing the following properties from type 'MouseEvent': button, buttons, clientX, clientY, and 15 more.
//           Overload 2 of 2, '(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined): void', gave the following error.
//           Argument of type '(e: MouseEvent) => void' is not assignable to parameter of type 'EventListenerOrEventListenerObject'.
//           Type '(e: MouseEvent) => void' is not assignable to type 'EventListener'.
//           Types of parameters 'e' and 'evt' are incompatible.
//           Type 'Event' is missing the following properties from type 'MouseEvent': altKey, button, buttons, clientX, and 23 more.ts(2769)

// Working component. however, the out of bounds issue is still present

// PROMPT 3: The values past the endAngle are still accessible. Make it so that the values past the endAngle are not accessible, and the range is constrained to the angles between startAngle and endAngle.
// FAILED: Unable to move past the issue of going into "negative" values and prevent value snapping when out of bounds.

// PROMPT 4: Values below the startAngle (techically, any value above the endAngle) snap to the endAngle by default. Please make it so that when the angle is out of bounds, depending on the direction the user was turning, the value does not snap to the end or beginning - it stays at the last value.
// FAILED: Unable to move past the issue of going into "negative" values and prevent value snapping when out of bounds.

// PROMPT 5: This code makes the values snap to 50 when the angle goes out of bounds - please make it so that when going past the endAngle, the endAngle is preserved, and when going past the startAngle, the startAngle is preserved
// FAILED: Unable to move past the issue of going into "negative" values and prevent value snapping when out of bounds.

// PROMPT 6: Values below the startAngle (even though they are technically larger) still snap to the endAngle. Please stop this from happening, and preserve the startAngle until a valid angle between startAngle and endAngle have been touched.
// FAILED: Unable to move past the issue of going into "negative" values and prevent value snapping when out of bounds.

// PROMPT 7: This approach still doesn't work. Please preserve startAngle when the angle is out of bounds, even if the angle is larger. If the user turns past startAngle, it should keep startAngle. If the user turns past endAngle, it should keep endAngle.
// FAILED: Unable to move past the issue of going into "negative" values and prevent value snapping when out of bounds.

// PROMPT 8: The problem with this logic is that if the startAngle is 0 or lower, the angles between the startAngle and endAngle will always be closer to endAngle. Please alter the logic to account for this. Preserve startAngle when turning back past startAngle, and preserve endAngle when turning past endAngle
// FAILED: Unable to move past the issue of going into "negative" values and prevent value snapping when out of bounds.

// PROMPT 9: This still doesn't work as you say it does - your logic is correct in your explanation, but the code does not work as intended. When I go below startAngle, the value still automatically snaps to the endAngle.
// FAILED: Unable to move past the issue of going into "negative" values and prevent value snapping when out of bounds.

// PROMPT 10: When the startAngle is 0 and endAngle is 180, going below 0 results in the value snapping to the one that is held at the endAngle (180). This issue still is not fixed.
// FAILED: Unable to move past the issue of going into "negative" values and prevent value snapping when out of bounds.

import React, { useState, useEffect, useRef } from "react";

// Define prop types
interface GPTKnobProps {
  startValue: number;
  endValue: number;
  startAngle: number;
  endAngle: number;
  defaultValue: number;
  value: number;
  onChange: (newValue: number) => void;
  snapToValues?: boolean;
  snapInterval?: number;
  width?: number;
  height?: number;
}

const GPTKnob: React.FC<GPTKnobProps> = ({
  startValue,
  endValue,
  startAngle,
  endAngle,
  defaultValue,
  value,
  onChange,
  snapToValues = false,
  snapInterval = 1,
  width = 100,
  height = 100,
}) => {
  // Utility functions to convert between value and angle
  const getAngleFromValue = (val: number) => {
    const ratio = (val - startValue) / (endValue - startValue);
    return startAngle + ratio * (endAngle - startAngle);
  };

  const getValueFromAngle = (angle: number) => {
    const ratio = (angle - startAngle) / (endAngle - startAngle);
    return startValue + ratio * (endValue - startValue);
  };

  // Snapping logic
  const snapToClosestValue = (angle: number) => {
    if (!snapToValues) return angle;
    const snappedValue = Math.round(getValueFromAngle(angle) / snapInterval) * snapInterval;
    return getAngleFromValue(snappedValue);
  };

  const [angle, setAngle] = useState<number>(getAngleFromValue(defaultValue));
  const knobRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastValidAngle = useRef<number>(getAngleFromValue(defaultValue));
  const prevAngle = useRef<number>(angle);

  // Handle Mouse Movement
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !knobRef.current) return;

    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const radians = Math.atan2(dy, dx);
    let newAngle = radians * (180 / Math.PI) + 90;
    if (newAngle < 0) newAngle += 360;

    // Check if turning direction goes out of bounds
    if (newAngle < startAngle && prevAngle.current >= startAngle) {
      newAngle = startAngle; // Keep at startAngle if turning past it
    } else if (newAngle > endAngle && prevAngle.current <= endAngle) {
      newAngle = endAngle; // Keep at endAngle if turning past it
    }

    // Preserve valid angle within the range
    if (newAngle < startAngle) {
      newAngle = startAngle;
    } else if (newAngle > endAngle) {
      newAngle = endAngle;
    }

    // Apply snapping if needed
    newAngle = snapToClosestValue(newAngle);

    // Update the angle and value
    setAngle(newAngle);
    lastValidAngle.current = newAngle; // Store the last valid angle
    prevAngle.current = newAngle; // Update the previous angle

    onChange(getValueFromAngle(newAngle));
  };

  // Handle Touch Movement
  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current || !knobRef.current) return;

    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const touch = e.touches[0];
    const touchX = touch.clientX;
    const touchY = touch.clientY;

    const dx = touchX - centerX;
    const dy = touchY - centerY;
    const radians = Math.atan2(dy, dx);
    let newAngle = radians * (180 / Math.PI) + 90;
    if (newAngle < 0) newAngle += 360;

    // Check if turning direction goes out of bounds
    if (newAngle < startAngle && prevAngle.current >= startAngle) {
      newAngle = startAngle; // Keep at startAngle if turning past it
    } else if (newAngle > endAngle && prevAngle.current <= endAngle) {
      newAngle = endAngle; // Keep at endAngle if turning past it
    }

    // Preserve valid angle within the range
    if (newAngle < startAngle) {
      newAngle = startAngle;
    } else if (newAngle > endAngle) {
      newAngle = endAngle;
    }

    // Apply snapping if needed
    newAngle = snapToClosestValue(newAngle);

    // Update the angle and value
    setAngle(newAngle);
    lastValidAngle.current = newAngle; // Store the last valid angle
    prevAngle.current = newAngle; // Update the previous angle

    onChange(getValueFromAngle(newAngle));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleMouseUp);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleMouseUp);
  };

  useEffect(() => {
    setAngle(getAngleFromValue(value));
  }, [value]);

  return (
    <div
      ref={knobRef}
      className="gpt-knob"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: "relative",
        borderRadius: "50%",
        border: "2px solid #ccc",
        cursor: "pointer",
        background: `conic-gradient(#4A90E2 ${startAngle}deg ${angle}deg, #f0f0f0 ${angle}deg ${endAngle}deg)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "12px",
          height: "12px",
          backgroundColor: "#4A90E2",
          borderRadius: "50%",
          transform: `translate(-50%, -50%) rotate(${angle - 90}deg)`,
          transformOrigin: "center center",
        }}
      />
    </div>
  );
};

export default GPTKnob;
