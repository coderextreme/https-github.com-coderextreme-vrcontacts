// Fix: Add a triple-slash reference to include types for react-three-fiber JSX elements.
/// <reference types="@react-three/fiber" />
import React, { ReactNode } from 'react';
import { useSpring, a } from '@react-spring/three';
import { Html } from '@react-three/drei';

interface ListItemWrapperProps {
  children: ReactNode;
  index: number;
  onClick: () => void;
}

const ListItemWrapper: React.FC<ListItemWrapperProps> = ({ children, index, onClick }) => {
  const [spring, api] = useSpring(() => ({
    scale: 1,
    glow: 0,
    config: { mass: 1, tension: 300, friction: 25 },
  }));

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    api.start({ scale: 1.05, glow: 0.5 });
  };
  
  const handlePointerOut = () => {
    api.start({ scale: 1, glow: 0 });
  };

  return (
    <a.group
      position-y={index * -0.2}
      scale={spring.scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={onClick}
    >
      <mesh>
        <planeGeometry args={[1, 0.18]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
      
      <a.mesh position-z={-0.01}>
         <planeGeometry args={[1.02, 0.19]} />
         <a.meshBasicMaterial 
            color="#a78bfa"
            transparent 
            opacity={spring.glow}
            toneMapped={false} 
        />
      </a.mesh>
      
      <Html
        transform
        className="w-[400px] h-[72px] pointer-events-none group"
      >
        {children}
      </Html>
    </a.group>
  );
};

export default ListItemWrapper;
