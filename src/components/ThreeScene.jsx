import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

const ParticleSwarm = (props) => {
  const ref = useRef();
  
  // Generate random points in a sphere
  const sphere = useMemo(() => {
    return random.inSphere(new Float32Array(3000), { radius: 1.5 });
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#e24e34"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={2} // Additive blending for a glowing effect
        />
      </Points>
    </group>
  );
};

const ThreeScene = () => {
  return (
    <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 3] }}>
        <Float
          speed={2} 
          rotationIntensity={1} 
          floatIntensity={2} 
        >
          <ParticleSwarm />
        </Float>
      </Canvas>
    </div>
  );
};

export default ThreeScene;
