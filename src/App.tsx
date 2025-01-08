import './App.css'
import { useState } from 'react';
import Knob from './components/Knob'

function App() {
  const [rotation1, setRotation1] = useState<number>(0);
  const [rotation2, setRotation2] = useState<number>(0);
  const [rotation3, setRotation3] = useState<number>(0);
  return <div className="page">
    <div className="buttons">
      <Knob limit={115} rotation={rotation1} setRotation={setRotation1}></Knob>
      <Knob limit={140} rotation={rotation2} setRotation={setRotation2}></Knob>
      <Knob rotation={rotation3} setRotation={setRotation3}></Knob>
    </div>
    {Math.round(rotation1)} ////// {Math.round(rotation2)} ////// {Math.round(rotation3)}
  </div>
}

export default App
