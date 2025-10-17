"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Grid, PerspectiveCamera, Html } from "@react-three/drei"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FuturisticBackground } from "@/components/futuristic-background"
import { ArrowLeft, Calendar, MapPin, Users, Clock, Globe, Share2, Heart, Layers, Info, ImageIcon } from "lucide-react"
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
          <div className="bg-[#1e1732]/95 backdrop-blur-sm border border-[#f1c6ff]/50 rounded-lg p-4 min-w-[250px] max-w-[350px] shadow-xl">
            <h4 className="text-[#ffddff] font-bold text-base mb-2">{marker.name}</h4>

            {marker.description && <p className="text-[#e2e2e2] text-sm mb-3 leading-relaxed">{marker.description}</p>}

            <div className="space-y-2 text-sm">
              {marker.capacity && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#f1c6ff]" />
                  <span className="text-[#78767b]">Capacidad:</span>
                  <span className="text-[#f1c6ff] font-semibold">{marker.capacity}</span>
                </div>
              )}

              {(marker as any).contactInfo && (
                <div className="pt-2 border-t border-[#f1c6ff]/20">
                  <p className="text-[#78767b] text-xs mb-1">Contacto:</p>
                  {(marker as any).contactInfo.email && (
                    <p className="text-[#e2e2e2] text-xs">{(marker as any).contactInfo.email}</p>
                  )}
                  {(marker as any).contactInfo.phone && (
                    <p className="text-[#e2e2e2] text-xs">{(marker as any).contactInfo.phone}</p>
                  )}
                </div>
              )}

              {(marker as any).images && (marker as any).images.length > 0 && (
                <div className="pt-2 border-t border-[#f1c6ff]/20">
                  <div className="flex gap-2 overflow-x-auto">
                    {(marker as any).images.slice(0, 3).map((img: string, idx: number) => (
                      <img
                        key={idx}
                        src={img || "/placeholder.svg"}
                        alt={`${marker.name} ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded border border-[#f1c6ff]/30"
                      />
                    ))}
                  </div>
                </div>
              )}

              {(marker as any).socialLinks && (
                <div className="pt-2 border-t border-[#f1c6ff]/20 flex gap-3">
                  {(marker as any).socialLinks.website && (
                    <a
                      href={(marker as any).socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#f1c6ff] hover:text-[#ffddff] transition-colors"
                      title="Sitio web"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {(marker as any).socialLinks.facebook && (
                    <a
                      href={(marker as any).socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#f1c6ff] hover:text-[#ffddff] transition-colors"
                      title="Facebook"
                    >
                      📘
                    </a>
                  )}
                  {(marker as any).socialLinks.instagram && (
                    <a
                      href={(marker as any).socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#f1c6ff] hover:text-[#ffddff] transition-colors"
                      title="Instagram"
                    >
                      📷
                    </a>
                  )}
                </div>
              )}
            </div>
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

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string

  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [markers, setMarkers] = useState<Marker3D[]>([])
  const [currentFloor, setCurrentFloor] = useState(0)
  const [floorNames, setFloorNames] = useState<Record<number, string>>({ 0: "Planta Baja" })
  const [sceneConfig, setSceneConfig] = useState({
    dimensions: { width: 80, depth: 60 },
    floorHeight: 4,
  })
  const [selectedTab, setSelectedTab] = useState<"info" | "schedule" | "gallery" | "map">("info")
  const [scheduleDays, setScheduleDays] = useState<any[]>([])
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [durationDays, setDurationDays] = useState(1)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        console.log("[v0] Fetching event details:", eventId)
        const response = await fetch(`/api/events/${eventId}`)
        if (response.ok) {
          const data = await response.json()
          setEvent(data.event)
          console.log("[v0] Event loaded:", data.event)

          const start = new Date(data.event.start_date)
          const end = new Date(data.event.end_date)
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
          setDurationDays(days)

          if (days > 1) {
            const scheduleDaysResponse = await fetch(`/api/events/${eventId}/schedule-days`)
            if (scheduleDaysResponse.ok) {
              const scheduleDaysData = await scheduleDaysResponse.json()
              setScheduleDays(scheduleDaysData.scheduleDays || [])
              console.log("[v0] Schedule days loaded:", scheduleDaysData.scheduleDays)
            }
          }

          if (data.event.map_json_file) {
            await loadMapData(data.event.map_json_file)
          }
        } else {
          console.error("[v0] Failed to fetch event:", response.status)
        }
      } catch (error) {
        console.error("[v0] Error fetching event:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

  const loadMapData = async (mapUrl: string) => {
    try {
      const mapResponse = await fetch(mapUrl)
      if (mapResponse.ok) {
        const mapData = await mapResponse.json()
        if (mapData.markers) setMarkers(mapData.markers)
        if (mapData.floorNames) setFloorNames(mapData.floorNames)
        if (mapData.sceneConfig) setSceneConfig(mapData.sceneConfig)
        console.log("[v0] Map data loaded successfully")
      }
    } catch (error) {
      console.error("[v0] Error loading map data:", error)
    }
  }

  useEffect(() => {
    if (selectedDay !== null) {
      const day = scheduleDays.find((d) => d.day_number === selectedDay)
      if (day && day.map_json_file) {
        loadMapData(day.map_json_file)
      }
    } else if (event && event.map_json_file) {
      loadMapData(event.map_json_file)
    }
  }, [selectedDay, scheduleDays, event])

  if (loading) {
    return (
      <FuturisticBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f1c6ff] mx-auto mb-4"></div>
            <p className="text-[#e2e2e2]">Cargando evento...</p>
          </div>
        </div>
      </FuturisticBackground>
    )
  }

  if (!event) {
    return (
      <FuturisticBackground>
        <div className="min-h-screen flex items-center justify-center">
          <GlassCard className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-[#ffddff] mb-4">Evento no encontrado</h2>
            <p className="text-[#e2e2e2] mb-6">El evento que buscas no existe o ha sido eliminado.</p>
            <Link href="/discover">
              <GradientButton>Volver a Discover</GradientButton>
            </Link>
          </GlassCard>
        </div>
      </FuturisticBackground>
    )
  }

  const availableSpots = event.capacity - event.registrations_count
  const percentFull = (event.registrations_count / event.capacity) * 100
  const allFloors = Object.keys(floorNames)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <FuturisticBackground>
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#1e1732]/95 backdrop-blur-2xl border-b border-[#f1c6ff]/30">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <Button
              onClick={() => router.push("/discover")}
              variant="outline"
              className="border-[#f1c6ff] text-[#f1c6ff]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Discover
            </Button>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-[#f1c6ff]/50 text-[#f1c6ff] bg-transparent">
                <Heart className="w-4 h-4 mr-2" />
                Guardar
              </Button>
              <Button variant="outline" className="border-[#f1c6ff]/50 text-[#f1c6ff] bg-transparent">
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="relative h-[400px] rounded-2xl overflow-hidden mb-8">
            <img
              src={
                event.cover_image || `/placeholder.svg?height=400&width=1200&query=${encodeURIComponent(event.title)}`
              }
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e1732] via-[#1e1732]/50 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
                      {event.category}
                    </Badge>
                    {(event.map_json_file || scheduleDays.some((d) => d.map_json_file)) && (
                      <Badge className="bg-gradient-to-r from-secondary to-accent-pink text-white glow-secondary border-0">
                        Vista 3D Disponible
                      </Badge>
                    )}
                    {durationDays > 1 && (
                      <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0">
                        {durationDays} Días
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-5xl font-bold text-[#ffddff] mb-4">{event.title}</h1>
                  <p className="text-xl text-[#e2e2e2] max-w-3xl">{event.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <GlassCard>
                <div className="flex gap-2 border-b border-[#f1c6ff]/20 pb-4 mb-6">
                  <button
                    onClick={() => setSelectedTab("info")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedTab === "info"
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "text-[#78767b] hover:text-[#e2e2e2]"
                    }`}
                  >
                    <Info className="w-4 h-4 inline mr-2" />
                    Información
                  </button>
                  {event.schedule && (
                    <button
                      onClick={() => setSelectedTab("schedule")}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedTab === "schedule"
                          ? "bg-gradient-to-r from-primary to-secondary text-white"
                          : "text-[#78767b] hover:text-[#e2e2e2]"
                      }`}
                    >
                      <Clock className="w-4 h-4 inline mr-2" />
                      Cronograma
                    </button>
                  )}
                  {(event.gallery_images || event.videos) && (
                    <button
                      onClick={() => setSelectedTab("gallery")}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedTab === "gallery"
                          ? "bg-gradient-to-r from-primary to-secondary text-white"
                          : "text-[#78767b] hover:text-[#e2e2e2]"
                      }`}
                    >
                      <ImageIcon className="w-4 h-4 inline mr-2" />
                      Galería
                    </button>
                  )}
                  {(event.map_json_file || scheduleDays.some((d) => d.map_json_file)) && (
                    <button
                      onClick={() => setSelectedTab("map")}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedTab === "map"
                          ? "bg-gradient-to-r from-primary to-secondary text-white"
                          : "text-[#78767b] hover:text-[#e2e2e2]"
                      }`}
                    >
                      <Layers className="w-4 h-4 inline mr-2" />
                      Mapa 3D
                    </button>
                  )}
                </div>

                {/* Tab Content */}
                {selectedTab === "info" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-[#ffddff] mb-3">Acerca del evento</h3>
                      <p className="text-[#e2e2e2] leading-relaxed whitespace-pre-wrap">
                        {event.about_event || event.description}
                      </p>
                    </div>

                    {event.event_link && (
                      <div>
                        <h3 className="text-xl font-bold text-[#ffddff] mb-3">Enlace del evento</h3>
                        <a
                          href={event.event_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#f1c6ff] hover:text-[#ffddff] underline flex items-center gap-2"
                        >
                          <Globe className="w-4 h-4" />
                          {event.event_link}
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {selectedTab === "schedule" && event.schedule && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-[#ffddff] mb-4">Cronograma del evento</h3>
                    {JSON.parse(event.schedule).map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4 p-4 bg-[#2a1f3d]/30 rounded-lg">
                        <div className="text-[#f1c6ff] font-semibold min-w-[100px]">{item.time}</div>
                        <div className="flex-1">
                          <h4 className="text-[#ffddff] font-semibold mb-1">{item.title}</h4>
                          {item.description && <p className="text-[#e2e2e2] text-sm">{item.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedTab === "gallery" && (
                  <div className="space-y-6">
                    {event.gallery_images && JSON.parse(event.gallery_images).length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-[#ffddff] mb-4">Imágenes</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {JSON.parse(event.gallery_images).map((img: string, idx: number) => (
                            <img
                              key={idx}
                              src={img || "/placeholder.svg"}
                              alt={`Galería ${idx + 1}`}
                              className="w-full h-48 object-cover rounded-lg border border-[#f1c6ff]/30"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {event.videos && JSON.parse(event.videos).length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-[#ffddff] mb-4">Videos</h3>
                        <div className="space-y-4">
                          {JSON.parse(event.videos).map((video: string, idx: number) => (
                            <video key={idx} controls className="w-full rounded-lg border border-[#f1c6ff]/30">
                              <source src={video} />
                            </video>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedTab === "map" && (event.map_json_file || scheduleDays.some((d) => d.map_json_file)) && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-[#ffddff]">Mapa 3D Interactivo</h3>
                      <p className="text-sm text-[#78767b]">Haz hover sobre los elementos para ver detalles</p>
                    </div>

                    {durationDays > 1 && scheduleDays.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => setSelectedDay(null)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            selectedDay === null
                              ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732]"
                              : "bg-[#1e1732]/50 text-[#e2e2e2] hover:bg-[#1e1732]"
                          }`}
                        >
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Mapa General
                        </button>
                        {scheduleDays.map((day) => (
                          <button
                            key={day.id}
                            onClick={() => setSelectedDay(day.day_number)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              selectedDay === day.day_number
                                ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732]"
                                : "bg-[#1e1732]/50 text-[#e2e2e2] hover:bg-[#1e1732]"
                            }`}
                          >
                            <Calendar className="w-4 h-4 inline mr-2" />
                            {day.title}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                      {/* Floor selector */}
                      <div className="lg:col-span-1">
                        <div className="bg-[#2a1f3d]/50 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-[#ffddff] mb-3 flex items-center gap-2">
                            <Layers className="w-4 h-4" />
                            Pisos
                          </h4>
                          <div className="space-y-2">
                            {allFloors.map((floor) => (
                              <button
                                key={floor}
                                onClick={() => setCurrentFloor(floor)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                  currentFloor === floor
                                    ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] font-semibold"
                                    : "bg-[#1e1732]/50 text-[#e2e2e2] hover:bg-[#1e1732]"
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
                        <div className="bg-[#1e1732]/50 rounded-lg overflow-hidden h-[600px] border border-[#f1c6ff]/30">
                          <Canvas shadows>
                            <PerspectiveCamera makeDefault position={[40, 30, 40]} />

                            <ambientLight intensity={0.5} />
                            <directionalLight position={[20, 30, 10]} intensity={1.2} castShadow />
                            <pointLight position={[-20, 20, -20]} intensity={0.7} color="#f1c6ff" />
                            <pointLight position={[20, 10, 20]} intensity={0.7} color="#ffddff" />
                            <pointLight position={[0, 25, 0]} intensity={0.5} color="#9333ea" />

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

                            {markers
                              .filter((m) => m.floor === currentFloor)
                              .map((marker) => (
                                <ViewerMarker
                                  key={marker.id}
                                  marker={marker}
                                  onClick={() => console.log("[v0] Clicked marker:", marker)}
                                />
                              ))}

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
                        <p className="text-xs text-[#78767b] text-center mt-2">
                          <span className="text-[#f1c6ff] font-semibold">Arrastra:</span> Rotar •{" "}
                          <span className="text-[#f1c6ff] font-semibold">Click derecho:</span> Mover •{" "}
                          <span className="text-[#f1c6ff] font-semibold">Scroll:</span> Zoom
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <GlassCard glow="primary">
                <h3 className="text-2xl font-bold text-[#ffddff] mb-4">Registro</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-[#e2e2e2]">
                    <Calendar className="w-5 h-5 text-[#f1c6ff]" />
                    <div>
                      <p className="text-sm text-[#78767b]">Fecha de inicio</p>
                      <p className="font-semibold">
                        {new Date(event.start_date).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[#e2e2e2]">
                    <Calendar className="w-5 h-5 text-[#f1c6ff]" />
                    <div>
                      <p className="text-sm text-[#78767b]">Fecha de fin</p>
                      <p className="font-semibold">
                        {new Date(event.end_date).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-3 text-[#e2e2e2]">
                      <MapPin className="w-5 h-5 text-[#f1c6ff]" />
                      <div>
                        <p className="text-sm text-[#78767b]">Ubicación</p>
                        <p className="font-semibold">{event.location}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-[#f1c6ff]/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#f1c6ff]" />
                        <span className="text-[#e2e2e2] font-semibold">{availableSpots}</span>
                        <span className="text-[#78767b]">lugares disponibles</span>
                      </div>
                    </div>

                    <div className="h-2 bg-[#2a1f3d] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          percentFull > 80
                            ? "bg-gradient-to-r from-error to-warning"
                            : percentFull > 50
                              ? "bg-gradient-to-r from-warning to-success"
                              : "bg-gradient-to-r from-primary to-secondary"
                        }`}
                        style={{ width: `${percentFull}%` }}
                      />
                    </div>
                  </div>
                </div>

                <GradientButton className="w-full" size="lg">
                  Registrarse al Evento
                </GradientButton>

                {event.requires_approval && (
                  <p className="text-xs text-[#78767b] text-center mt-3">
                    Este evento requiere aprobación del organizador
                  </p>
                )}
              </GlassCard>

              {/* Event Type Badge */}
              <GlassCard>
                <h4 className="text-sm font-semibold text-[#ffddff] mb-3">Tipo de evento</h4>
                <Badge className="bg-gradient-to-r from-primary to-secondary text-white">
                  {event.event_type === "presencial"
                    ? "Presencial"
                    : event.event_type === "virtual"
                      ? "Virtual"
                      : "No Definido"}
                </Badge>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </FuturisticBackground>
  )
}
