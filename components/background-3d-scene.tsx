"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as THREE from "three"

// Animated particle system for background
function AnimatedStars() {
  const ref = useRef<THREE.Points>(null)

  // Generate random positions for particles
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(300 * 3) // Reduced from 2000
    const colors = new Float32Array(300 * 3)

    for (let i = 0; i < 300; i++) {
      // Reduced from 2000
      // Spread particles in a large sphere
      positions[i * 3] = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100

      // Purple/pink color palette
      const colorVariant = Math.random()
      if (colorVariant < 0.33) {
        colors[i * 3] = 0.6 + Math.random() * 0.4 // R
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.3 // G
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2 // B
      } else if (colorVariant < 0.66) {
        colors[i * 3] = 0.8 + Math.random() * 0.2 // R
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.3 // G
        colors[i * 3 + 2] = 0.6 + Math.random() * 0.4 // B
      } else {
        colors[i * 3] = 0.5 + Math.random() * 0.3 // R
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.3 // G
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1 // B
      }
    }

    return [positions, colors]
  }, [])

  // Animate the particle system
  useFrame((state) => {
    if (ref.current) {
      // Slow rotation for subtle movement
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.05
    }
  })

  return (
    <Points ref={ref} positions={positions} colors={colors}>
      <PointMaterial
        transparent
        vertexColors
        size={1} // Reduced from 2
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.4} // Added opacity
      />
    </Points>
  )
}

// Floating geometric shapes
function FloatingGeometry() {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Independent rotation animation
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05

      // Subtle floating movement
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 2
    }
  })

  return (
    <group ref={meshRef}>
      {/* Only keep one wireframe torus, remove the others */}
      <mesh position={[0, 0, -40]}>
        <torusGeometry args={[2, 0.5, 6, 12]} />
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

// Animated gradient planes for depth
function GradientPlanes() {
  const plane1Ref = useRef<THREE.Mesh>(null)
  const plane2Ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (plane1Ref.current && plane2Ref.current) {
      // Slow oscillating movement
      plane1Ref.current.position.z = -50 + Math.sin(state.clock.elapsedTime * 0.2) * 5
      plane2Ref.current.position.z = -60 + Math.cos(state.clock.elapsedTime * 0.15) * 3

      // Subtle rotation
      plane1Ref.current.rotation.z = state.clock.elapsedTime * 0.05
      plane2Ref.current.rotation.z = -state.clock.elapsedTime * 0.03
    }
  })

  return (
    <>
      <mesh ref={plane1Ref} position={[0, 0, -50]}>
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial color="#4c1d95" transparent opacity={0.03} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={plane2Ref} position={[0, 0, -60]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="#581c87" transparent opacity={0.02} side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}

// Export both as a named export and as default
export function Background3DScene() {
  return (
    <div
      className="fixed inset-0 z-0"
      style={{
        willChange: "transform",
        backfaceVisibility: "hidden",
        perspective: "1000px",
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 30],
          fov: 60,
          near: 0.1,
          far: 200,
        }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        performance={{ min: 0.5 }} // Adaptive performance
        style={{
          background: "transparent",
          pointerEvents: "none", // Prevent interference with page interactions
        }}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.3} />

        {/* Animated components */}
        <AnimatedStars />
        <FloatingGeometry />
        <GradientPlanes />

        {/* Fog for depth */}
        <fog attach="fog" args={["#1e1b4b", 50, 120]} />
      </Canvas>
    </div>
  )
}

// Also export as default
export default Background3DScene
