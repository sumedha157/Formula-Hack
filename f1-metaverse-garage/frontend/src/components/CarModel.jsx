// frontend/src/components/CarModel.jsx
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";

function Wheel({ x, z }) {
  const ref = useRef();
  useFrame(() => (ref.current.rotation.x -= 0.05));
  return (
    <mesh ref={ref} position={[x, 0.25, z]}>
      <torusGeometry args={[0.35, 0.12, 16, 60]} />
      <meshStandardMaterial color="#111" roughness={0.9} metalness={0.1} />
    </mesh>
  );
}

function CarBody() {
  const ref = useRef();
  useFrame(() => (ref.current.rotation.y += 0.003));

  return (
    <group ref={ref}>
      {/* main body */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[2.4, 0.4, 1]} />
        <meshStandardMaterial color="#c00" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* hood */}
      <mesh position={[0.9, 0.5, 0]}>
        <boxGeometry args={[1.2, 0.2, 0.9]} />
        <meshStandardMaterial color="#d11" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* roof */}
      <mesh position={[0.1, 0.75, 0]}>
        <boxGeometry args={[1, 0.3, 0.9]} />
        <meshStandardMaterial color="#800" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* headlights */}
      <mesh position={[1.6, 0.5, 0.35]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial emissive="#00f" emissiveIntensity={3} color="#00f" />
      </mesh>
      <mesh position={[1.6, 0.5, -0.35]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial emissive="#00f" emissiveIntensity={3} color="#00f" />
      </mesh>

      {/* wheels */}
      {[
        [-1.1, 0.6],
        [-1.1, -0.6],
        [1.1, 0.6],
        [1.1, -0.6],
      ].map(([x, z], i) => (
        <Wheel key={i} x={x} z={z} />
      ))}
    </group>
  );
}

function GarageEnvironment() {
  // floor, walls, lights
  return (
    <>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#222" metalness={1} roughness={0.05} />
      </mesh>

      {/* back wall */}
      <mesh position={[0, 2, -5]}>
        <boxGeometry args={[20, 4, 0.2]} />
        <meshStandardMaterial color="#181818" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* side walls */}
      <mesh position={[10, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10, 4, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-10, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10, 4, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* ceiling lights */}
      <pointLight position={[0, 5, 0]} intensity={1.5} distance={10} color="#fff" />
      <rectAreaLight
        position={[0, 4.8, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        intensity={40}
        width={6}
        height={3}
        color="#ffffff"
      />
      <rectAreaLight
        position={[0, 4.8, -2]}
        rotation={[-Math.PI / 2, 0, 0]}
        intensity={20}
        width={8}
        height={4}
        color="#ff4444"
      />
    </>
  );
}

export default function CarModel() {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [4, 2, 6], fov: 45 }} shadows>
        {/* ambient / lighting */}
        <ambientLight intensity={0.3} />
        <spotLight
          position={[5, 8, 5]}
          angle={0.4}
          intensity={1.2}
          penumbra={0.3}
          castShadow
        />
        <directionalLight position={[-5, 6, -5]} intensity={0.8} />

        <GarageEnvironment />
        <CarBody />
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.7}
          width={10}
          height={10}
          blur={1.8}
          far={1}
        />
        <OrbitControls enableZoom={true} minDistance={3} maxDistance={10} />
      </Canvas>
    </div>
  );
}
