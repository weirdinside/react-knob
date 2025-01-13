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
        />
      </div>
      {value1}
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
        startValue={0}
        endValue={100}
        value={value3}
        setValue={setValue3}
        snap={true}
        snapInterval={5}
        label="Volume"
        onChange={(newValue) => console.log("Value changed:", newValue)}
      />
    </div>
  );
}

export default App;
