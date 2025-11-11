// Fix: Add a triple-slash reference to include types for react-three-fiber JSX elements.
/// <reference types="@react-three/fiber" />
import React from 'react';
import { Stars, Grid } from '@react-three/drei';

const Environment: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 3, 4]} intensity={50} color="#67e8f9" />
      <pointLight position={[-3, 2, 3]} intensity={30} color="#c084fc" />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <Grid
        position={[0, 0, 0]}
        args={[100, 100]}
        cellColor="#666"
        sectionColor="#444"
        fadeDistance={25}
        infiniteGrid
      />
    </>
  );
};

export default Environment;