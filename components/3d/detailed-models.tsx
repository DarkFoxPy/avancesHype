"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

// Car model for parking/entrance
export function CarModel({
  color = "#ff6b6b",
  position = [0, 0, 0],
}: { color?: string; position?: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)

  return (
    <group ref={groupRef} position={position}>
      {/* Car body */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.8, 0.6, 0.9]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Car roof */}
      <mesh position={[0.2, 0.8, 0]}>
        <boxGeometry args={[0.8, 0.4, 0.85]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Windows */}
      <mesh position={[0.2, 0.8, 0.43]}>
        <boxGeometry args={[0.75, 0.35, 0.02]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.3} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.2, 0.8, -0.43]}>
        <boxGeometry args={[0.75, 0.35, 0.02]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.3} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Wheels */}
      {[
        [-0.6, 0, 0.5],
        [-0.6, 0, -0.5],
        [0.6, 0, 0.5],
        [0.6, 0, -0.5],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.15, 0.15, 0.16, 16]} />
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Headlights */}
      <mesh position={[0.9, 0.3, 0.3]}>
        <boxGeometry args={[0.05, 0.15, 0.15]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.9, 0.3, -0.3]}>
        <boxGeometry args={[0.05, 0.15, 0.15]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

// Elevator model
export function ElevatorModel({
  color = "#4a90e2",
  position = [0, 0, 0],
}: { color?: string; position?: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)
  const cabinRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (cabinRef.current) {
      cabinRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Elevator shaft */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[1.5, 3, 1.5]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.7} roughness={0.3} transparent opacity={0.3} />
      </mesh>

      {/* Elevator cabin */}
      <mesh ref={cabinRef} position={[0, 1, 0]}>
        <boxGeometry args={[1.3, 1.8, 1.3]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Cabin door */}
      <mesh position={[0, 1, 0.66]}>
        <boxGeometry args={[1.1, 1.6, 0.05]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Door split line */}
      <mesh position={[0, 1, 0.68]}>
        <boxGeometry args={[0.02, 1.6, 0.02]} />
        <meshStandardMaterial color="#666" />
      </mesh>

      {/* Control panel */}
      <mesh position={[0.5, 1.2, 0.67]}>
        <boxGeometry args={[0.2, 0.4, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Indicator lights */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0.5, 1.3 - i * 0.1, 0.69]}>
          <circleGeometry args={[0.03, 16]} />
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

// Stage with equipment
export function StageModel({
  color = "#9333ea",
  position = [0, 0, 0],
}: { color?: string; position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Stage platform */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[4, 0.5, 3]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Stage edge */}
      <mesh position={[0, 0.5, 1.5]}>
        <boxGeometry args={[4, 0.02, 0.1]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Microphone stand */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Speakers */}
      {[-1.5, 1.5].map((x, i) => (
        <group key={i} position={[x, 1, 1.2]}>
          <mesh>
            <boxGeometry args={[0.4, 0.8, 0.3]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[0, 0.2, 0.16]}>
            <cylinderGeometry args={[0.12, 0.12, 0.05, 16]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh position={[0, -0.2, 0.16]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        </group>
      ))}

      {/* Spotlights */}
      {[-1, 0, 1].map((x, i) => (
        <group key={i} position={[x, 3, 0]}>
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 0.3, 8]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
          </mesh>
          <pointLight position={[0, -0.2, 0]} intensity={0.5} color={color} distance={5} />
        </group>
      ))}
    </group>
  )
}

// Booth/Stand model
export function BoothModel({
  color = "#06b6d4",
  position = [0, 0, 0],
}: { color?: string; position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Booth base */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[2, 0.1, 2]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.2, -0.95]}>
        <boxGeometry args={[2, 2.4, 0.1]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Side walls */}
      <mesh position={[-0.95, 1.2, 0]}>
        <boxGeometry args={[0.1, 2.4, 2]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[0.95, 1.2, 0]}>
        <boxGeometry args={[0.1, 2.4, 2]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 2.45, 0]}>
        <boxGeometry args={[2.1, 0.1, 2.1]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Counter */}
      <mesh position={[0, 0.9, 0.7]}>
        <boxGeometry args={[1.6, 0.1, 0.5]} />
        <meshStandardMaterial color="#4a4a5e" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.5, 0.7]}>
        <boxGeometry args={[1.6, 0.8, 0.5]} />
        <meshStandardMaterial color="#3a3a4e" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Display screen */}
      <mesh position={[0, 1.5, -0.89]}>
        <boxGeometry args={[1.2, 0.8, 0.05]} />
        <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={0.3} />
      </mesh>

      {/* Lighting */}
      <pointLight position={[0, 2.3, 0]} intensity={0.8} color={color} distance={4} />
    </group>
  )
}

// Food stand model
export function FoodStandModel({
  color = "#f59e0b",
  position = [0, 0, 0],
}: { color?: string; position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.5, 0.1, 1.5]} />
        <meshStandardMaterial color="#2a2a3e" />
      </mesh>

      {/* Counter */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[1.4, 0.1, 1.4]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.3, 0.7, 1.3]} />
        <meshStandardMaterial color="#3a3a4e" />
      </mesh>

      {/* Canopy */}
      <mesh position={[0, 2, 0]}>
        <coneGeometry args={[1.2, 0.8, 4]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Support poles */}
      {[
        [-0.6, 0, -0.6],
        [-0.6, 0, 0.6],
        [0.6, 0, -0.6],
        [0.6, 0, 0.6],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.03, 0.03, 2.4, 8]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Menu board */}
      <mesh position={[0, 1.5, -0.65]}>
        <boxGeometry args={[0.8, 0.5, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Food items on counter */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.95, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
          <meshStandardMaterial color="#ff6b6b" metalness={0.2} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// Bathroom model
export function BathroomModel({
  color = "#8b5cf6",
  position = [0, 0, 0],
}: { color?: string; position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Building */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[2, 2.4, 2]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[2.2, 0.2, 2.2]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Door */}
      <mesh position={[0, 1.2, 1.01]}>
        <boxGeometry args={[0.8, 1.8, 0.05]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Door handle */}
      <mesh position={[0.3, 1.2, 1.04]}>
        <cylinderGeometry args={[0.03, 0.03, 0.15, 8]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Sign */}
      <mesh position={[0, 2, 1.01]}>
        <boxGeometry args={[0.6, 0.4, 0.05]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.2} />
      </mesh>

      {/* Windows */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 1.8, 1.01]}>
          <boxGeometry args={[0.3, 0.3, 0.02]} />
          <meshStandardMaterial color="#1a1a2e" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  )
}

// Info kiosk model
export function InfoKioskModel({
  color = "#10b981",
  position = [0, 0, 0],
}: { color?: string; position?: [number, number, number] }) {
  const screenRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (screenRef.current) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 1, 8]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Pole */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Screen housing */}
      <mesh position={[0, 2.5, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.8, 1.2, 0.15]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Screen */}
      <mesh ref={screenRef} position={[0, 2.5, 0.08]}>
        <boxGeometry args={[0.7, 1.1, 0.02]} />
        <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={0.3} />
      </mesh>

      {/* Info symbol */}
      <mesh position={[0, 2.5, 0.1]}>
        <torusGeometry args={[0.15, 0.03, 16, 32]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 2.3, 0.1]}>
        <boxGeometry args={[0.04, 0.2, 0.02]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 2.65, 0.1]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}
