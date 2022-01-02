import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useThree, extend } from "@react-three/fiber";

import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

import Inter from "./Inter_Bold.json";
import pibe from '../assets/pibe1.png'
import { Html, OrbitControls } from "@react-three/drei";
extend({ TextGeometry })

const testObj = [
  {
    name: "name1",
    info: "info1",
  },
  {
    name: "name2",
    info: "info2",
  },
];

function Results(props) {
  const [count, setCount] = useState(0);
  const [texture, setTexture] = useState('');
  const ref = useRef();


  // parse JSON file with Three
  const font = new FontLoader().parse(Inter);
  // configure font geometry
  const textOptions = {
    font,
    size: 65, 
    height: 10, 
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 2, 
    bevelSize: 1.5,
    bevelOffset: 0,
    bevelSegments: 2
  };

  useEffect(() => {
    console.log(props.results)
    console.log(count)
    if (props.results.items) {
      setTexture(props.results.items[count].images[0].url)
    }
  }, [])

  function onTextureChange(link) {
    const three_texture = new THREE.TextureLoader().load(link)
    three_texture.wrapS = THREE.RepeatWrapping
    three_texture.wrapT = THREE.RepeatWrapping
    three_texture.repeat.set(0.1, 0.1);
    return three_texture;
  }


  function onIncrement() {
    if (count === props.results.items.length - 1) {
      setCount(0);
    } else {
      setCount(count + 1);
    }
  }

  function onDecrement() {
    if (count === 0) {
      setCount(props.results.items.length - 1);
    } else {
      setCount(count - 1);
    }
  }

  return (
    <>
    {props.results.items ?
    <>
    <div>
    <button 
      className="bg-green-300 hover:bg-green-500 hover:scale-110 text-white font-asap p-3 rounded-full m-1 drop-shadow-lg" 
      onClick={onDecrement}>back</button>
    <button 
      className="bg-green-300 hover:bg-green-500 hover:scale-110 text-white font-asap p-3 rounded-full m-1 drop-shadow-lg"
      onClick={onIncrement}>next</button>
    </div>
    <Canvas camera={{ position: [150, 20, 220]}}>
    <ambientLight intensity={2} />
    <pointLight position={[40, 40, 40]} />
    <OrbitControls autoRotate enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} /> 
      <mesh position={[-250, -10, -100]}>
        <textGeometry args={[`${count+1}. ${props.results.items[count].name}`, textOptions]} />
        <meshStandardMaterial attach="material" map={onTextureChange(props.results.items[count].images[0].url)} />
      </mesh>
    </Canvas>
    </>
    :
    <h1>click to see results</h1>
    }
    </>
  );
}


export default Results;
