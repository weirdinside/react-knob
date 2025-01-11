import "./App.css";
import { useState } from "react";
import Knob from "./components/Knob";

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
          endValue={-12}
          startAngle={0}
          endAngle={180}
        ></Knob>
      </div>
      {Math.round(value1)}
    </div>
  );
}

export default App;
