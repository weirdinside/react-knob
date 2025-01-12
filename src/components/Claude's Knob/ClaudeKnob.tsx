import React, { useState, useRef, useEffect } from 'react';

interface KnobProps {
  min?: number;
  max?: number;
  value?: number;
  size?: number;
  onChange?: (value: number) => void;
  color?: string;
  showValue?: boolean;
  disabled?: boolean;
  startAngle?: number;
  endAngle?: number;
  numTicks?: number;
  step?: number;
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    userSelect: 'none' as const,
  },
  knobWrapper: {
    position: 'relative' as const,
    borderRadius: '50%',
  },
  knobWrapperDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  knobWrapperEnabled: {
    cursor: 'pointer',
  },
  knobBase: {
    position: 'absolute' as const,
    inset: 0,
    borderRadius: '50%',
    border: '4px solid #e5e7eb',
    backgroundColor: 'white',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  indicator: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '2px',
    height: '40%',
  },
  tick: {
    position: 'absolute' as const,
    width: '4px',
    height: '12px',
    left: '50%',
    top: 0,
    transformOrigin: 'bottom',
  },
  tickLine: {
    width: '100%',
    height: '100%',
    backgroundColor: '#d1d5db',
  },
  value: {
    marginTop: '8px',
    fontSize: '14px',
    fontWeight: 500,
  },
};

const ClaudeKnob: React.FC<KnobProps> = ({
  min = 0,
  max = 100,
  value = 50,
  size = 100,
  onChange = () => {},
  color = '#2563eb',
  showValue = true,
  disabled = false,
  startAngle = -135,
  endAngle = 135,
  numTicks = 11,
  step = 1
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(valueToAngle(value));

  // Convert angle (degrees) to value
  function angleToValue(angle: number): number {
    // Normalize angle to the allowed range
    while (angle < startAngle) angle += 360;
    while (angle > endAngle) angle -= 360;
    
    // Clamp angle to the allowed range
    angle = Math.max(startAngle, Math.min(endAngle, angle));
    
    // Convert to value
    const percent = (angle - startAngle) / (endAngle - startAngle);
    let newValue = min + percent * (max - min);
    
    // Apply stepping
    newValue = Math.round(newValue / step) * step;
    return Math.max(min, Math.min(max, newValue));
  }

  // Convert value to angle (degrees)
  function valueToAngle(value: number): number {
    const percent = (value - min) / (max - min);
    return startAngle + percent * (endAngle - startAngle);
  }

  // Calculate angle from center
  function calculateAngle(clientX: number, clientY: number): number {
    if (!knobRef.current) return 0;
    
    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    return Math.atan2(clientY - centerY, clientX - centerX) * 180 / Math.PI + 90;
  }

  useEffect(() => {
    setRotation(valueToAngle(value));
  }, [value]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    
    const newAngle = calculateAngle(e.clientX, e.clientY);
    const newValue = angleToValue(newAngle);
    
    setIsDragging(true);
    setRotation(newAngle);
    onChange(newValue);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newAngle = calculateAngle(e.clientX, e.clientY);
    const newValue = angleToValue(newAngle);
    
    setRotation(newAngle);
    onChange(newValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const getTicks = () => {
    return Array.from({ length: numTicks }).map((_, i) => {
      const tickRotation = startAngle + (i * (endAngle - startAngle) / (numTicks - 1));
      return tickRotation;
    });
  };

  return (
    <div style={styles.container}>
      <div
        ref={knobRef}
        style={{
          ...styles.knobWrapper,
          ...(disabled ? styles.knobWrapperDisabled : styles.knobWrapperEnabled),
          width: size,
          height: size,
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            ...styles.knobBase,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <div
            style={{
              ...styles.indicator,
              backgroundColor: color,
            }}
          />
        </div>
        
        {getTicks().map((tickRotation, i) => (
          <div
            key={i}
            style={{
              ...styles.tick,
              transform: `translateX(-50%) rotate(${tickRotation}deg)`,
            }}
          >
            <div style={styles.tickLine} />
          </div>
        ))}
      </div>
      
      {showValue && (
        <div style={styles.value}>
          {Math.round(value)}
        </div>
      )}
    </div>
  );
};

export default ClaudeKnob;