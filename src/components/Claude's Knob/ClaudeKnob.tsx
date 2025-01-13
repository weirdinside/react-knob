import React, { useEffect, useRef, useState } from "react";

interface ClaudeKnobProps {
  // Range values
  startValue: number;
  endValue: number;
  value: number;
  setValue: (value: number) => void;
  defaultValue?: number;

  // Angle constraints
  startAngle?: number; // Default 0
  endAngle?: number; // Default 360

  // Snapping behavior
  snap?: boolean;
  snapInterval?: number;

  // Styling
  size?: number; // Diameter in pixels
  color?: string;
  backgroundColor?: string;
  showValue?: boolean;
  disabled?: boolean;
  label?: string;

  // Optional callback
  onChange?: (value: number) => void;
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 500,
};

const valueStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 500,
};

const ClaudeKnob: React.FC<ClaudeKnobProps> = ({
  startValue,
  endValue,
  value,
  setValue,
  defaultValue = startValue,
  startAngle = 0,
  endAngle = 360,
  snap = false,
  snapInterval = 1,
  size = 100,
  color = "#2563eb",
  backgroundColor = "#e5e7eb",
  showValue = true,
  disabled = false,
  label,
  onChange,
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Convert value to angle
  const valueToAngle = (val: number): number => {
    const valueRange = endValue - startValue;
    const angleRange = endAngle - startAngle;
    return ((val - startValue) / valueRange) * angleRange + startAngle;
  };

  // Convert angle to value
  const angleToValue = (angle: number): number => {
    const normalizedAngle = angle - startAngle;
    const angleRange = endAngle - startAngle;
    const valueRange = endValue - startValue;
    let value = (normalizedAngle / angleRange) * valueRange + startValue;

    // Clamp value to range
    value = Math.max(startValue, Math.min(endValue, value));

    // Apply snapping if enabled
    if (snap && snapInterval) {
      value = Math.round(value / snapInterval) * snapInterval;
    }

    return value;
  };

  // Calculate rotation from mouse/touch position
  const getRotationFromPoint = (clientX: number, clientY: number): number => {
    if (!knobRef.current) return 0;

    const knobRect = knobRef.current.getBoundingClientRect();
    const knobCenterX = knobRect.left + knobRect.width / 2;
    const knobCenterY = knobRect.top + knobRect.height / 2;

    const angle = Math.atan2(clientY - knobCenterY, clientX - knobCenterX);
    let degrees = angle * (180 / Math.PI) + 90; // Convert to degrees and offset

    // Normalize to 0-360 range
    degrees = degrees < 0 ? degrees + 360 : degrees;

    // Clamp to angle constraints
    degrees = Math.max(startAngle, Math.min(endAngle, degrees));

    return degrees;
  };

  // Handle mouse/touch movement
  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || disabled) return;

    const newRotation = getRotationFromPoint(clientX, clientY);
    setRotation(newRotation);

    const newValue = angleToValue(newRotation);
    setValue(newValue);
    onChange?.(newValue);
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  // Set up event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  // Update rotation when value changes externally
  useEffect(() => {
    setRotation(valueToAngle(value));
  }, [value]);

  // Initialize with default value
  useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(defaultValue);
    }
  }, []);

  const knobStyle: React.CSSProperties = {
    width: size,
    height: size,
    backgroundColor,
    borderRadius: "50%",
    position: "relative",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    touchAction: "none",
  };

  const indicatorStyle: React.CSSProperties = {
    position: "absolute",
    width: "8px",
    height: "40%",
    backgroundColor: color,
    borderRadius: "4px",
    top: "8px",
    left: "50%",
    transform: `translateX(-50%) rotate(${rotation}deg)`,
    transformOrigin: "bottom",
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <div
        ref={knobRef}
        style={knobStyle}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div style={indicatorStyle} />
      </div>
      {showValue && <div style={valueStyle}>{value.toFixed(snap ? 0 : 1)}</div>}
    </div>
  );
};

export default ClaudeKnob;
