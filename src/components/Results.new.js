import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useThree, extend } from "@react-three/fiber";

import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

import Inter from "./Inter_Bold.json";
import pibe from '../assets/pibe1.png'
import { Html } from "@react-three/drei";
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
    size: 10, 
    height: 2, 

  };

  useEffect(() => {
    console.log(props.results)
    console.log(count)
    if (props.results.items) {
      setTexture(props.results.items[count].images[0].url)
    }
  }, [])

  const deg2rad = degrees => degrees * (Math.PI / 180);

  useThree(({camera}) => {
    camera.rotation.set(0, deg2rad(45), 0);
    camera.position.set(-25, 5, 25)
  })



  function onTextureChange(link) {
    const three_texture = new THREE.TextureLoader().load(link)
    three_texture.wrapS = THREE.RepeatWrapping
    three_texture.wrapT = THREE.RepeatWrapping
    three_texture.repeat.set(0.3, 0.3);
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
    <Html>
      <button onClick={onDecrement}>back</button>
      <button onClick={onIncrement}>next</button>
    </Html>
    <mesh position={[-20, -10, -10]}>
      <textGeometry args={[`${count+1}. ${props.results.items[count].name}`, textOptions]} />
      <meshStandardMaterial attach="material" map={onTextureChange(props.results.items[count].images[0].url)} />
    </mesh>
    </>
    :
    <Html><h1>click to see results</h1></Html>
    }
    </>
  );
}


export default Results;
