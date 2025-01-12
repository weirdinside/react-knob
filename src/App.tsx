import "./App.css";
import { useState } from "react";
import Knob from "./components/Knob";
import GPTKnob from "./components/ChatGPT's Knob/GPTKnob";
import ClaudeKnob from "./components/Claude's Knob/ClaudeKnob";

function App() {
  const [value1, setValue1] = useState<number>(0);
  const [value2, setValue2] = useState<number>(0);
  const [value3, setValue3] = useState<number>(0);

  return (
    <div className="page">
      <div className="buttons">
        <Knob
          value={value1}
          setValue={setValue1}
          startValue={0}
          endValue={12}
          startAngle={0}
          endAngle={180}
        ></Knob>
      </div>
      {Math.round(value1)}
      <GPTKnob
        startValue={0}
        endValue={100}
        startAngle={0}
        endAngle={180}
        defaultValue={50}
        value={value2}
        onChange={setValue2}
        snapToValues={true}
        snapInterval={10}
        width={150}
        height={150}
      />
      {value2}
      <ClaudeKnob
        value={value3}
        onChange={setValue3}
        min={0}
        max={100}
        step={5} // Optional: for stepped increments
        startAngle={-135}
        endAngle={135}
        size={150}
        color="#2563eb"
      />
    </div>
  );
}

export default App;
