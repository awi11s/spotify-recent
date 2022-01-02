import React, { useState } from "react";
import { Canvas, extend } from "@react-three/fiber";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { OrbitControls } from "@react-three/drei";

import Inter from "../assets/Inter_Bold.json";
extend({ TextGeometry })


function Results(props) {
  const [count, setCount] = useState(0);


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
    <div className="flex p-3">
    <FaArrowLeft 
      className="text-green-300 text-3xl m-1 hover:cursor-pointer hover:scale-110"
      onClick={onDecrement} />
    <FaArrowRight 
      className="text-green-300 text-3xl m-1 hover:cursor-pointer hover:scale-110"
      onClick={onIncrement} />
    </div>
    <Canvas camera={{ position: [150, 20, 220]}}>
    <ambientLight intensity={2} />
    <pointLight position={[40, 40, 40]} />
    <OrbitControls autoRotate enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} /> 
    {props.type === 'ARTISTS' ?
      <mesh position={[-250, -10, -150]}>
        <textGeometry args={[`${count+1}. ${props.results.items[count].name}`, textOptions]} />
        <meshStandardMaterial attach="material" map={onTextureChange(props.results.items[count].images[0].url)} />
      </mesh>
      :
      <mesh position={[-250, -10, -150]}>
        <textGeometry args={[`${count+1}. ${props.results.items[count].name}`, textOptions]} />
        <meshStandardMaterial attach="material" map={onTextureChange(props.results.items[count].album.images[0].url)} />
      </mesh>
    }
    </Canvas>
    </>
    :
    <h1>click to see results</h1>
    }
    </>
  );
}


export default Results;
