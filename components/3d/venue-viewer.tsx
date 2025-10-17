"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Grid, PerspectiveCamera, Html } from "@react-three/drei"
import type * as THREE from "three"
import type { Marker3D } from "@/lib/types"
import { DoorOpen, DoorClosed, Mic2, Store, Utensils, Info, Users } from "lucide-react"
import {
  CarModel,
  ElevatorModel,
  StageModel,
  BoothModel,
  FoodStandModel,
  BathroomModel,
  InfoKioskModel,
} from "./detailed-models"

const MARKER_ICONS: Record<string, any> = {
  entrance: DoorOpen,
  exit: DoorClosed,
  stage: Mic2,
  booth: Store,
  sponsor_booth: Store,
  info_booth: Store,
  food: Utensils,
  bathroom: Users,
  info: Info,
}

interface ViewerMarkerProps {
  marker: Marker3D
  onClick: () => void
}

function ViewerMarker({ marker, onClick }: ViewerMarkerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (groupRef.current && hovered) {
      groupRef.current.position.y = marker.position.y + Math.sin(state.clock.elapsedTime * 2) * 0.1
    } else if (groupRef.current) {
      groupRef.current.position.y = marker.position.y
    }
  })

  const renderDetailedModel = () => {
    const modelProps = { color: marker.color, position: [0, 0, 0] as [number, number, number] }

    switch (marker.type) {
      case "entrance":
      case "exit":
        return <CarModel {...modelProps} />
      case "elevator":
        return <ElevatorModel {...modelProps} />
      case "stage":
        return <StageModel {...modelProps} />
      case "booth":
      case "sponsor_booth":
      case "info_booth":
        return <BoothModel {...modelProps} />
      case "food":
        return <FoodStandModel {...modelProps} />
      case "bathroom":
        return <BathroomModel {...modelProps} />
      case "info":
        return <InfoKioskModel {...modelProps} />
      default:
        // Fallback to simple box for unknown types
        return (
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={marker.color}
              emissive={marker.color}
              emissiveIntensity={hovered ? 0.6 : 0.3}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        )
    }
  }

  const Icon = MARKER_ICONS[marker.type] || Info

  return (
    <group
      ref={groupRef}
      position={[marker.position.x, marker.position.y, marker.position.z]}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {renderDetailedModel()}

      {/* Outer glow effect */}
      {hovered && (
        <mesh scale={1.5}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color={marker.color} transparent opacity={0.15} />
        </mesh>
      )}

      {/* Floating label */}
      {hovered && (
        <Html position={[0, 3.5, 0]} center distanceFactor={10}>
          <div className="glass px-4 py-2 rounded-lg border border-border/50 min-w-[200px] animate-float">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-4 h-4" style={{ color: marker.color }} />
              <p className="font-bold text-foreground text-sm">{marker.name}</p>
            </div>
            {marker.description && <p className="text-xs text-muted">{marker.description}</p>}
            {marker.capacity && (
              <p className="text-xs text-muted mt-1">
                Capacidad: <span className="font-semibold">{marker.capacity}</span>
              </p>
            )}
          </div>
        </Html>
      )}

      {/* Particle effect */}
      {hovered && (
        <>
          {[...Array(8)].map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 8) * Math.PI * 2) * 2,
                Math.sin((i / 8) * Math.PI * 2) * 0.5 + 1.5,
                Math.sin((i / 8) * Math.PI * 2) * 2,
              ]}
            >
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial color={marker.color} transparent opacity={0.6} />
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}

interface VenueViewerProps {
  markers: Marker3D[]
  onMarkerClick?: (marker: Marker3D) => void
}

export function VenueViewer({ markers, onMarkerClick }: VenueViewerProps) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-border/50 bg-background/50 relative">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[15, 12, 15]} />

        {/* Enhanced Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 15, 5]} intensity={1.2} castShadow />
        <pointLight position={[-10, 10, -10]} intensity={0.8} color="#9333ea" />
        <pointLight position={[10, 5, 10]} intensity={0.8} color="#06b6d4" />
        <pointLight position={[0, 15, 0]} intensity={0.5} color="#ec4899" />

        {/* Animated Grid */}
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.6}
          cellColor="#9333ea"
          sectionSize={5}
          sectionThickness={1.2}
          sectionColor="#06b6d4"
          fadeDistance={40}
          fadeStrength={1}
          followCamera={false}
        />

        {/* Floor with reflection */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#0a0a0f" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Markers */}
        {markers.map((marker) => (
          <ViewerMarker key={marker.id} marker={marker} onClick={() => onMarkerClick?.(marker)} />
        ))}

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={8}
          maxDistance={40}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate
          autoRotateSpeed={0.5}
          mouseButtons={{
            LEFT: undefined,
            MIDDLE: 1,
            RIGHT: 0,
          }}
        />
      </Canvas>

      {/* Overlay UI */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
        <div className="glass px-6 py-3 rounded-full border border-border/50 pointer-events-auto">
          <p className="text-sm text-muted">
            <span className="font-semibold text-primary">Click derecho</span> para rotar •{" "}
            <span className="font-semibold text-secondary">Scroll</span> para zoom •{" "}
            <span className="font-semibold text-accent-pink">Hover</span> para info
          </p>
        </div>
      </div>
    </div>
  )
}
