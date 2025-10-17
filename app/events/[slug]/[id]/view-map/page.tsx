"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Grid, PerspectiveCamera, Html } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { FuturisticBackground } from "@/components/futuristic-background"
import { ArrowLeft, Layers } from "lucide-react"
import type { Marker3D } from "@/lib/types"

function ViewerMarker({ marker, onClick }: { marker: Marker3D; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  const getGeometry = () => {
    switch (marker.type) {
      case "entrance":
      case "exit":
      case "emergency_exit":
        return <boxGeometry args={[1.5, 2.5, 0.3]} />
      case "stage":
        return <boxGeometry args={[4, 0.5, 3]} />
      case "backstage":
        return <boxGeometry args={[3, 2, 2]} />
      case "booth":
      case "sponsor_booth":
        return <boxGeometry args={[2, 2, 2]} />
      case "info_booth":
        return <cylinderGeometry args={[0.8, 0.8, 2, 8]} />
      case "food":
        return <boxGeometry args={[2.5, 2, 2]} />
      case "bathroom":
        return <boxGeometry args={[2, 2.5, 2]} />
      case "parking":
        return <boxGeometry args={[2.5, 0.2, 4]} />
      case "security":
        return <cylinderGeometry args={[0.6, 0.6, 2, 6]} />
      case "medical":
        return <boxGeometry args={[2, 2, 2]} />
      case "vip":
        return <boxGeometry args={[3, 2.5, 3]} />
      case "press":
        return <boxGeometry args={[2, 2, 1.5]} />
      default:
        return <boxGeometry args={[1, 1, 1]} />
    }
  }

  return (
    <group
      position={[marker.position.x, marker.position.y, marker.position.z]}
      rotation={[marker.rotation.x, marker.rotation.y, marker.rotation.z]}
      scale={[marker.scale.x, marker.scale.y, marker.scale.z]}
    >
      <mesh
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        {getGeometry()}
        <meshStandardMaterial
          color={marker.color}
          emissive={marker.color}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {hovered && (
        <mesh scale={1.15}>
          {getGeometry()}
          <meshBasicMaterial color="#f1c6ff" transparent opacity={0.3} wireframe />
        </mesh>
      )}

      {hovered && (
        <Html position={[0, 3, 0]} center distanceFactor={10}>
          <div className="bg-[#1e1732]/95 backdrop-blur-sm border border-[#f1c6ff]/50 rounded-lg p-3 min-w-[200px] shadow-xl">
            <h4 className="text-[#ffddff] font-bold text-sm mb-1">{marker.name}</h4>
            {marker.description && <p className="text-[#e2e2e2] text-xs mb-2">{marker.description}</p>}
            {marker.capacity && (
              <p className="text-[#78767b] text-xs">
                Capacidad: <span className="text-[#f1c6ff] font-semibold">{marker.capacity}</span>
              </p>
            )}
            {(marker as any).socialLinks && (
              <div className="mt-2 flex gap-2 text-xs">
                {(marker as any).socialLinks.website && (
                  <a
                    href={(marker as any).socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f1c6ff] hover:text-[#ffddff]"
                  >
                    🌐
                  </a>
                )}
                {(marker as any).socialLinks.facebook && (
                  <a
                    href={(marker as any).socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f1c6ff] hover:text-[#ffddff]"
                  >
                    📘
                  </a>
                )}
                {(marker as any).socialLinks.instagram && (
                  <a
                    href={(marker as any).socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f1c6ff] hover:text-[#ffddff]"
                  >
                    📷
                  </a>
                )}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  )
}

function ViewerFloor({
  width,
  depth,
  floorNumber,
  floorHeight,
  isVisible,
}: {
  width: number
  depth: number
  floorNumber: number
  floorHeight: number
  isVisible: boolean
}) {
  const floorY = floorNumber * floorHeight
  const opacity = isVisible ? 1 : 0.15

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, floorY, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
          color={floorNumber < 0 ? "#2a1f3d" : "#1e1732"}
          metalness={0.5}
          roughness={0.5}
          transparent={!isVisible}
          opacity={opacity}
        />
      </mesh>

      {isVisible && (
        <Grid
          args={[width, depth]}
          position={[0, floorY + 0.01, 0]}
          cellSize={2}
          cellThickness={0.6}
          cellColor="#f1c6ff"
          sectionSize={10}
          sectionThickness={1}
          sectionColor="#ffddff"
          fadeDistance={100}
          fadeStrength={1}
          followCamera={false}
        />
      )}
    </group>
  )
}

export default function ViewMapPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string

  const [markers, setMarkers] = useState<Marker3D[]>([])
  const [currentFloor, setCurrentFloor] = useState(0)
  const [floorNames, setFloorNames] = useState<Record<number, string>>({ 0: "Planta Baja" })
  const [sceneConfig, setSceneConfig] = useState({
    dimensions: { width: 80, depth: 60 },
    floorHeight: 4,
  })

  useEffect(() => {
    // TODO: Load from API or localStorage
    const savedData = localStorage.getItem(`map-${eventId}`)
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        if (data.markers) setMarkers(data.markers)
        if (data.floorNames) setFloorNames(data.floorNames)
        if (data.sceneConfig) setSceneConfig(data.sceneConfig)
      } catch (error) {
        console.error("[v0] Error loading map data:", error)
      }
    }
  }, [eventId])

  const allFloors = Object.keys(floorNames)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <FuturisticBackground>
      <div className="min-h-screen p-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Button onClick={() => router.back()} variant="outline" className="mb-4 border-[#f1c6ff] text-[#f1c6ff]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <h1 className="text-4xl font-bold text-[#ffddff] mb-2">Vista del Mapa 3D</h1>
              <p className="text-[#e2e2e2]">Explora el espacio del evento</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Floor selector */}
            <div className="lg:col-span-1">
              <div className="bg-[#1e1732]/80 backdrop-blur-sm border border-[#f1c6ff]/30 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-[#ffddff] mb-3 flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Pisos
                </h3>
                <div className="space-y-2">
                  {allFloors.map((floor) => (
                    <button
                      key={floor}
                      onClick={() => setCurrentFloor(floor)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        currentFloor === floor
                          ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] font-semibold"
                          : "bg-[#2a1f3d]/50 text-[#e2e2e2] hover:bg-[#2a1f3d]"
                      }`}
                    >
                      {floorNames[floor]}
                      <span className="text-xs block opacity-70">
                        {markers.filter((m) => m.floor === floor).length} elementos
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3D Canvas */}
            <div className="lg:col-span-4">
              <div className="bg-[#1e1732]/80 backdrop-blur-sm border border-[#f1c6ff]/30 rounded-xl overflow-hidden h-[700px]">
                <Canvas shadows>
                  <PerspectiveCamera makeDefault position={[40, 30, 40]} />

                  {/* Lighting */}
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[20, 30, 10]} intensity={1.2} castShadow />
                  <pointLight position={[-20, 20, -20]} intensity={0.7} color="#f1c6ff" />
                  <pointLight position={[20, 10, 20]} intensity={0.7} color="#ffddff" />
                  <pointLight position={[0, 25, 0]} intensity={0.5} color="#9333ea" />

                  {/* Floors */}
                  {allFloors.map((floor) => (
                    <ViewerFloor
                      key={floor}
                      width={sceneConfig.dimensions.width}
                      depth={sceneConfig.dimensions.depth}
                      floorNumber={floor}
                      floorHeight={sceneConfig.floorHeight}
                      isVisible={floor === currentFloor}
                    />
                  ))}

                  {/* Markers */}
                  {markers
                    .filter((m) => m.floor === currentFloor)
                    .map((marker) => (
                      <ViewerMarker
                        key={marker.id}
                        marker={marker}
                        onClick={() => console.log("[v0] Clicked:", marker)}
                      />
                    ))}

                  {/* OrbitControls with auto-rotate */}
                  <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={15}
                    maxDistance={120}
                    maxPolarAngle={Math.PI / 2.1}
                    enablePan
                    autoRotate
                    autoRotateSpeed={0.5}
                  />
                </Canvas>
              </div>
              <div className="mt-2 text-center text-sm text-[#78767b]">
                <p>
                  <span className="text-[#f1c6ff] font-semibold">Arrastra:</span> Rotar •{" "}
                  <span className="text-[#f1c6ff] font-semibold">Click derecho:</span> Mover •{" "}
                  <span className="text-[#f1c6ff] font-semibold">Scroll:</span> Zoom •{" "}
                  <span className="text-[#f1c6ff] font-semibold">Hover:</span> Ver info
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FuturisticBackground>
  )
}
