"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Grid, PerspectiveCamera } from "@react-three/drei"
import type * as THREE from "three"
import type { Marker3D } from "@/lib/types"

interface MarkerObjectProps {
  marker: Marker3D
  isSelected: boolean
  onClick: () => void
  onDrag: (position: { x: number; y: number; z: number }) => void
}

function MarkerObject({ marker, isSelected, onClick, onDrag }: MarkerObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y += 0.02
    }
  })

  const getMarkerColor = () => {
    if (isSelected) return "#22d3ee"
    if (hovered) return "#a855f7"
    return marker.color
  }

  const getMarkerGeometry = () => {
    switch (marker.type) {
      case "entrance":
      case "exit":
        return <boxGeometry args={[1, 2, 0.2]} />
      case "stage":
        return <boxGeometry args={[3, 0.5, 2]} />
      case "booth":
        return <boxGeometry args={[1.5, 1.5, 1.5]} />
      case "bathroom":
      case "food":
      case "info":
        return <cylinderGeometry args={[0.5, 0.5, 1.5, 8]} />
      default:
        return <boxGeometry args={[1, 1, 1]} />
    }
  }

  return (
    <group position={[marker.position.x, marker.position.y, marker.position.z]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {getMarkerGeometry()}
        <meshStandardMaterial
          color={getMarkerColor()}
          emissive={getMarkerColor()}
          emissiveIntensity={isSelected ? 0.5 : hovered ? 0.3 : 0.1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Glow effect */}
      {(isSelected || hovered) && (
        <mesh>
          {getMarkerGeometry()}
          <meshBasicMaterial color={getMarkerColor()} transparent opacity={0.2} />
        </mesh>
      )}

      {/* Label */}
      {(isSelected || hovered) && (
        <mesh position={[0, 2, 0]}>
          <planeGeometry args={[2, 0.5]} />
          <meshBasicMaterial color="#1e1b4b" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  )
}

interface MapCanvasProps {
  markers: Marker3D[]
  selectedMarkerId: string | null
  onMarkerSelect: (id: string | null) => void
  onMarkerUpdate: (id: string, updates: Partial<Marker3D>) => void
}

export function MapCanvas({ markers, selectedMarkerId, onMarkerSelect, onMarkerUpdate }: MapCanvasProps) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-border/50 bg-background/50">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[10, 10, 10]} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#9333ea" />
        <pointLight position={[10, 5, 10]} intensity={0.5} color="#06b6d4" />

        {/* Floor Grid */}
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#9333ea"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#06b6d4"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
        />

        {/* Floor Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#0a0a0f" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Markers */}
        {markers.map((marker) => (
          <MarkerObject
            key={marker.id}
            marker={marker}
            isSelected={marker.id === selectedMarkerId}
            onClick={() => onMarkerSelect(marker.id === selectedMarkerId ? null : marker.id)}
            onDrag={(position) => onMarkerUpdate(marker.id, { position })}
          />
        ))}

        {/* Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2}
          mouseButtons={{
            LEFT: undefined,
            MIDDLE: 1,
            RIGHT: 0,
          }}
        />
      </Canvas>
    </div>
  )
}
