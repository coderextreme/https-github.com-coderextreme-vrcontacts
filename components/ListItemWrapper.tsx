import React, { ReactNode } from 'react';
// Changed from @react-spring/three to @react-spring/web to make this a DOM component
import { useSpring, a } from '@react-spring/web';

interface ListItemWrapperProps {
  children: ReactNode;
  onClick: () => void;
}

const ListItemWrapper: React.FC<ListItemWrapperProps> = ({ children, onClick }) => {
  const [spring, api] = useSpring(() => ({
    scale: 1,
    // Replicating the 3D glow effect with a CSS box-shadow for a similar visual cue
    boxShadow: '0px 0px 0px 0px rgba(167, 139, 250, 0)',
    config: { mass: 1, tension: 300, friction: 25 },
  }));

  const handleMouseOver = (e: React.MouseEvent) => {
    e.stopPropagation();
    api.start({
      scale: 1.03,
      boxShadow: '0px 0px 25px 3px rgba(167, 139, 250, 0.4)',
    });
  };
  
  const handleMouseOut = () => {
    api.start({
      scale: 1,
      boxShadow: '0px 0px 0px 0px rgba(167, 139, 250, 0)',
    });
  };

  // Using a.div which is an animatable DOM element, instead of a.group for 3D
  return (
    <a.div
      style={spring}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={onClick}
    >
      {children}
    </a.div>
  );
};

export default ListItemWrapper;
