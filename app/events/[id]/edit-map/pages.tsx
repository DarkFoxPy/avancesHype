"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import {
  DoorOpen,
  DoorClosed,
  AlertTriangle,
  Music,
  Users,
  Store,
  Award,
  Info,
  UtensilsCrossed,
  Wine,
  ChefHat,
  Home,
  Accessibility,
  Shield,
  Cross,
  Car,
  Crown,
  Camera,
  Armchair,
  CircleUser,
  Ticket,
  ArrowUp,
  MoveVertical,
  TrendingUp,
  Warehouse,
  CreditCard,
  Zap,
  ShoppingBag,
  Sparkles,
  Save,
  Trash2,
  Copy,
  Settings,
  Plus,
  Upload,
} from "lucide-react"

// ============================================================================
// TIPOS
// ============================================================================

interface Marker3D {
  id: string
  type:
    | "entrance"
    | "exit"
    | "emergency_exit"
    | "stage"
    | "backstage"
    | "booth"
    | "sponsor_booth"
    | "info_booth"
    | "food"
    | "bar"
    | "kitchen"
    | "bathroom"
    | "accessible_bathroom"
    | "info"
    | "security"
    | "medical"
    | "parking"
    | "vip_area"
    | "press_area"
    | "seating"
    | "standing_area"
    | "vip_seating"
    | "stairs"
    | "elevator"
    | "escalator"
    | "ramp"
    | "cloakroom"
    | "atm"
    | "charging_station"
    | "photo_booth"
    | "merchandise"
    | "registration"
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale?: { x: number; y: number; z: number }
  name: string
  color: string
  icon: string
  floor: number
  description?: string
  capacity?: number
}

interface SceneConfig {
  type: "indoor" | "outdoor" | "hybrid"
  floors: number
  floorHeight: number
  dimensions: { width: number; depth: number }
  lighting: "day" | "night" | "indoor"
  groundTexture: "grass" | "concrete" | "wood" | "tile" | "carpet"
}

// ============================================================================
// CONSTANTES
// ============================================================================

const MARKER_COLORS: Record<string, string> = {
  entrance: "#10b981",
  exit: "#ef4444",
  emergency_exit: "#f97316",
  stage: "#9333ea",
  backstage: "#7c3aed",
  booth: "#06b6d4",
  sponsor_booth: "#0ea5e9",
  info_booth: "#3b82f6",
  merchandise: "#8b5cf6",
  photo_booth: "#ec4899",
  food: "#f59e0b",
  bar: "#f97316",
  kitchen: "#ea580c",
  bathroom: "#8b5cf6",
  accessible_bathroom: "#a855f7",
  cloakroom: "#c026d3",
  atm: "#14b8a6",
  charging_station: "#eab308",
  security: "#dc2626",
  medical: "#ef4444",
  info: "#3b82f6",
  seating: "#6366f1",
  standing_area: "#8b5cf6",
  vip_seating: "#f59e0b",
  vip_area: "#eab308",
  press_area: "#06b6d4",
  parking: "#64748b",
  registration: "#10b981",
  stairs: "#71717a",
  elevator: "#78716c",
  escalator: "#737373",
  ramp: "#84cc16",
}

const MARKER_CATEGORIES = {
  Accesos: [
    { type: "entrance", icon: DoorOpen, label: "Entrada Principal", color: "#10b981" },
    { type: "exit", icon: DoorClosed, label: "Salida", color: "#ef4444" },
    { type: "emergency_exit", icon: AlertTriangle, label: "Salida de Emergencia", color: "#f97316" },
  ],
  Escenarios: [
    { type: "stage", icon: Music, label: "Escenario Principal", color: "#9333ea" },
    { type: "backstage", icon: Users, label: "Backstage", color: "#7c3aed" },
  ],
  "Stands y Booths": [
    { type: "booth", icon: Store, label: "Stand General", color: "#06b6d4" },
    { type: "sponsor_booth", icon: Award, label: "Stand de Sponsor", color: "#0ea5e9" },
    { type: "info_booth", icon: Info, label: "Punto de Información", color: "#3b82f6" },
    { type: "merchandise", icon: ShoppingBag, label: "Merchandising", color: "#8b5cf6" },
    { type: "photo_booth", icon: Camera, label: "Photo Booth", color: "#ec4899" },
  ],
  "Comida y Bebida": [
    { type: "food", icon: UtensilsCrossed, label: "Punto de Comida", color: "#f59e0b" },
    { type: "bar", icon: Wine, label: "Bar", color: "#f97316" },
    { type: "kitchen", icon: ChefHat, label: "Cocina", color: "#ea580c" },
  ],
  Servicios: [
    { type: "bathroom", icon: Home, label: "Baño", color: "#8b5cf6" },
    { type: "accessible_bathroom", icon: Accessibility, label: "Baño Accesible", color: "#a855f7" },
    { type: "cloakroom", icon: Warehouse, label: "Guardarropa", color: "#c026d3" },
    { type: "atm", icon: CreditCard, label: "Cajero Automático", color: "#14b8a6" },
    { type: "charging_station", icon: Zap, label: "Estación de Carga", color: "#eab308" },
  ],
  "Seguridad y Asistencia": [
    { type: "security", icon: Shield, label: "Seguridad", color: "#dc2626" },
    { type: "medical", icon: Cross, label: "Puesto Médico", color: "#ef4444" },
    { type: "info", icon: Info, label: "Información", color: "#3b82f6" },
  ],
  "Áreas y Zonas": [
    { type: "seating", icon: Armchair, label: "Área de Asientos", color: "#6366f1" },
    { type: "standing_area", icon: CircleUser, label: "Área de Pie", color: "#8b5cf6" },
    { type: "vip_seating", icon: Sparkles, label: "Asientos VIP", color: "#f59e0b" },
    { type: "vip_area", icon: Crown, label: "Área VIP", color: "#eab308" },
    { type: "press_area", icon: Camera, label: "Área de Prensa", color: "#06b6d4" },
    { type: "parking", icon: Car, label: "Estacionamiento", color: "#64748b" },
    { type: "registration", icon: Ticket, label: "Registro/Check-in", color: "#10b981" },
  ],
  Circulación: [
    { type: "stairs", icon: ArrowUp, label: "Escaleras", color: "#71717a" },
    { type: "elevator", icon: MoveVertical, label: "Ascensor", color: "#78716c" },
    { type: "escalator", icon: TrendingUp, label: "Escalera Mecánica", color: "#737373" },
    { type: "ramp", icon: Accessibility, label: "Rampa", color: "#84cc16" },
  ],
}

const CONNECTION_ELEMENTS = ["stairs", "elevator", "escalator", "ramp"]
const CAPACITY_ELEMENTS = ["seating", "vip_seating", "standing_area", "vip_area"]

// ============================================================================
// FUNCIONES PARA CREAR OBJETOS 3D REALISTAS
// ============================================================================

function createCar(color: string): THREE.Group {
  const car = new THREE.Group()

  // Carrocería principal
  const bodyGeometry = new THREE.BoxGeometry(1.8, 0.6, 4)
  const bodyMaterial = new THREE.MeshStandardMaterial({ color, metalness: 0.8, roughness: 0.2 })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  body.position.y = 0.4
  car.add(body)

  // Cabina
  const cabinGeometry = new THREE.BoxGeometry(1.6, 0.5, 2)
  const cabinMaterial = new THREE.MeshStandardMaterial({ color, metalness: 0.8, roughness: 0.2 })
  const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial)
  cabin.position.y = 0.95
  cabin.position.z = -0.3
  car.add(cabin)

  // Ventanas
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.6,
  })
  const windowGeometry = new THREE.BoxGeometry(1.5, 0.4, 1.8)
  const windows = new THREE.Mesh(windowGeometry, windowMaterial)
  windows.position.y = 0.95
  windows.position.z = -0.3
  car.add(windows)

  // Ruedas
  const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16)
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 })

  const wheelPositions = [
    { x: -0.9, z: 1.2 },
    { x: 0.9, z: 1.2 },
    { x: -0.9, z: -1.2 },
    { x: 0.9, z: -1.2 },
  ]

  wheelPositions.forEach((pos) => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
    wheel.rotation.z = Math.PI / 2
    wheel.position.set(pos.x, 0.3, pos.z)
    car.add(wheel)
  })

  return car
}

function createDoor(color: string, isOpen = false): THREE.Group {
  const doorGroup = new THREE.Group()

  // Marco de la puerta
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.7 })

  // Postes verticales
  const postGeometry = new THREE.BoxGeometry(0.15, 2.2, 0.15)
  const leftPost = new THREE.Mesh(postGeometry, frameMaterial)
  leftPost.position.set(-0.6, 1.1, 0)
  doorGroup.add(leftPost)

  const rightPost = new THREE.Mesh(postGeometry, frameMaterial)
  rightPost.position.set(0.6, 1.1, 0)
  doorGroup.add(rightPost)

  // Dintel superior
  const lintelGeometry = new THREE.BoxGeometry(1.35, 0.15, 0.15)
  const lintel = new THREE.Mesh(lintelGeometry, frameMaterial)
  lintel.position.set(0, 2.2, 0)
  doorGroup.add(lintel)

  // Puerta
  const doorGeometry = new THREE.BoxGeometry(1.2, 2, 0.1)
  const doorMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.3 })
  const door = new THREE.Mesh(doorGeometry, doorMaterial)
  door.position.set(isOpen ? -0.6 : 0, 1, 0)
  if (isOpen) {
    door.rotation.y = Math.PI / 2
  }
  doorGroup.add(door)

  // Manija
  const handleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.15, 8)
  const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1 })
  const handle = new THREE.Mesh(handleGeometry, handleMaterial)
  handle.rotation.z = Math.PI / 2
  handle.position.set(isOpen ? -0.5 : 0.5, 1, 0.1)
  doorGroup.add(handle)

  return doorGroup
}

function createStairs(color: string): THREE.Group {
  const stairsGroup = new THREE.Group()
  const steps = 8
  const stepHeight = 0.2
  const stepDepth = 0.4
  const stepWidth = 2

  const stepMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.8 })

  for (let i = 0; i < steps; i++) {
    const stepGeometry = new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth)
    const step = new THREE.Mesh(stepGeometry, stepMaterial)
    step.position.set(0, i * stepHeight, -i * stepDepth)
    stairsGroup.add(step)
  }

  // Barandas
  const railMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3 })
  const railGeometry = new THREE.CylinderGeometry(0.05, 0.05, steps * stepHeight, 8)

  const leftRail = new THREE.Mesh(railGeometry, railMaterial)
  leftRail.position.set(-stepWidth / 2, (steps * stepHeight) / 2, (-steps * stepDepth) / 2)
  stairsGroup.add(leftRail)

  const rightRail = new THREE.Mesh(railGeometry, railMaterial)
  rightRail.position.set(stepWidth / 2, (steps * stepHeight) / 2, (-steps * stepDepth) / 2)
  stairsGroup.add(rightRail)

  return stairsGroup
}

function createBoothTable(color: string): THREE.Group {
  const boothGroup = new THREE.Group()

  // Mesa larga
  const tableTopGeometry = new THREE.BoxGeometry(3, 0.1, 1)
  const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.6 })
  const tableTop = new THREE.Mesh(tableTopGeometry, tableMaterial)
  tableTop.position.y = 0.75
  boothGroup.add(tableTop)

  // Patas de la mesa
  const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.75, 8)
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.7 })

  const legPositions = [
    { x: -1.3, z: -0.4 },
    { x: -1.3, z: 0.4 },
    { x: 1.3, z: -0.4 },
    { x: 1.3, z: 0.4 },
  ]

  legPositions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial)
    leg.position.set(pos.x, 0.375, pos.z)
    boothGroup.add(leg)
  })

  // Sillas (2 detrás de la mesa)
  const chairPositions = [
    { x: -0.8, z: -0.8 },
    { x: 0.8, z: -0.8 },
  ]

  chairPositions.forEach((pos) => {
    const chair = createChair(color)
    chair.position.set(pos.x, 0, pos.z)
    boothGroup.add(chair)
  })

  // Mantel o banner con color del stand
  const bannerGeometry = new THREE.BoxGeometry(3, 0.6, 0.05)
  const bannerMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
  const banner = new THREE.Mesh(bannerGeometry, bannerMaterial)
  banner.position.set(0, 0.4, 0.5)
  boothGroup.add(banner)

  return boothGroup
}

function createChair(color: string): THREE.Group {
  const chairGroup = new THREE.Group()

  // Asiento
  const seatGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.5)
  const chairMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
  const seat = new THREE.Mesh(seatGeometry, chairMaterial)
  seat.position.y = 0.45
  chairGroup.add(seat)

  // Respaldo
  const backGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.1)
  const back = new THREE.Mesh(backGeometry, chairMaterial)
  back.position.set(0, 0.7, -0.2)
  chairGroup.add(back)

  // Patas
  const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.45, 8)
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7 })

  const legPositions = [
    { x: -0.2, z: -0.2 },
    { x: -0.2, z: 0.2 },
    { x: 0.2, z: -0.2 },
    { x: 0.2, z: 0.2 },
  ]

  legPositions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial)
    leg.position.set(pos.x, 0.225, pos.z)
    chairGroup.add(leg)
  })

  return chairGroup
}

function createBathroom(color: string, accessible = false): THREE.Group {
  const bathroomGroup = new THREE.Group()

  // Inodoro
  const toiletBase = new THREE.CylinderGeometry(0.25, 0.3, 0.4, 16)
  const toiletMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 })
  const toilet = new THREE.Mesh(toiletBase, toiletMaterial)
  toilet.position.set(0, 0.2, 0)
  bathroomGroup.add(toilet)

  // Tapa del inodoro
  const lidGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 16)
  const lid = new THREE.Mesh(lidGeometry, toiletMaterial)
  lid.position.set(0, 0.45, 0)
  bathroomGroup.add(lid)

  // Tanque
  const tankGeometry = new THREE.BoxGeometry(0.4, 0.5, 0.2)
  const tank = new THREE.Mesh(tankGeometry, toiletMaterial)
  tank.position.set(0, 0.65, -0.25)
  bathroomGroup.add(tank)

  // Lavabo
  const sinkGeometry = new THREE.CylinderGeometry(0.25, 0.2, 0.15, 16)
  const sink = new THREE.Mesh(sinkGeometry, toiletMaterial)
  sink.position.set(0.8, 0.8, 0)
  bathroomGroup.add(sink)

  // Pedestal del lavabo
  const pedestalGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.8, 16)
  const pedestal = new THREE.Mesh(pedestalGeometry, toiletMaterial)
  pedestal.position.set(0.8, 0.4, 0)
  bathroomGroup.add(pedestal)

  // Grifo
  const faucetMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.1 })
  const faucetGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8)
  const faucet = new THREE.Mesh(faucetGeometry, faucetMaterial)
  faucet.position.set(0.8, 0.95, 0)
  bathroomGroup.add(faucet)

  // Símbolo de accesibilidad si es necesario
  if (accessible) {
    const signGeometry = new THREE.CircleGeometry(0.3, 32)
    const signMaterial = new THREE.MeshStandardMaterial({ color: 0x0066cc })
    const sign = new THREE.Mesh(signGeometry, signMaterial)
    sign.position.set(0, 1.5, 0.5)
    sign.rotation.y = Math.PI
    bathroomGroup.add(sign)
  }

  return bathroomGroup
}

function createStage(color: string): THREE.Group {
  const stageGroup = new THREE.Group()

  // Plataforma principal
  const platformGeometry = new THREE.BoxGeometry(6, 0.8, 4)
  const platformMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.2 })
  const platform = new THREE.Mesh(platformGeometry, platformMaterial)
  platform.position.y = 0.4
  stageGroup.add(platform)

  // Escalones de acceso
  const stepGeometry = new THREE.BoxGeometry(1, 0.2, 0.8)
  const stepMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7 })
  const step1 = new THREE.Mesh(stepGeometry, stepMaterial)
  step1.position.set(-2.5, 0.1, 2.5)
  stageGroup.add(step1)

  const step2 = new THREE.Mesh(stepGeometry, stepMaterial)
  step2.position.set(-2.5, 0.3, 2.5)
  stageGroup.add(step2)

  // Cortinas laterales
  const curtainGeometry = new THREE.BoxGeometry(0.2, 3, 1)
  const curtainMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.8 })

  const leftCurtain = new THREE.Mesh(curtainGeometry, curtainMaterial)
  leftCurtain.position.set(-3, 2.3, 0)
  stageGroup.add(leftCurtain)

  const rightCurtain = new THREE.Mesh(curtainGeometry, curtainMaterial)
  rightCurtain.position.set(3, 2.3, 0)
  stageGroup.add(rightCurtain)

  // Luces del escenario
  const lightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    emissive: 0xffff00,
    emissiveIntensity: 0.5,
  })
  const lightGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.3, 8)

  for (let i = -2; i <= 2; i++) {
    const light = new THREE.Mesh(lightGeometry, lightMaterial)
    light.position.set(i * 1.2, 3.5, -1.5)
    light.rotation.x = Math.PI / 4
    stageGroup.add(light)
  }

  // Micrófono
  const micStandGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8)
  const micStandMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 })
  const micStand = new THREE.Mesh(micStandGeometry, micStandMaterial)
  micStand.position.set(0, 1.55, 0)
  stageGroup.add(micStand)

  const micGeometry = new THREE.SphereGeometry(0.08, 16, 16)
  const micMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.9 })
  const mic = new THREE.Mesh(micGeometry, micMaterial)
  mic.position.set(0, 2.3, 0)
  stageGroup.add(mic)

  return stageGroup
}

function createBar(color: string): THREE.Group {
  const barGroup = new THREE.Group()

  // Mostrador
  const counterGeometry = new THREE.BoxGeometry(3, 0.1, 1.2)
  const counterMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.3, metalness: 0.4 })
  const counter = new THREE.Mesh(counterGeometry, counterMaterial)
  counter.position.y = 1
  barGroup.add(counter)

  // Base del mostrador
  const baseGeometry = new THREE.BoxGeometry(3, 1, 1)
  const baseMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.position.set(0, 0.5, 0)
  barGroup.add(base)

  // Estante trasero
  const shelfGeometry = new THREE.BoxGeometry(3, 1.5, 0.3)
  const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.6 })
  const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial)
  shelf.position.set(0, 1.5, -0.6)
  barGroup.add(shelf)

  // Botellas en el estante
  const bottleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8)
  const bottleColors = [0x00ff00, 0xff6600, 0xffff00, 0x8b4513, 0xff0000]

  for (let i = 0; i < 5; i++) {
    const bottleMaterial = new THREE.MeshStandardMaterial({
      color: bottleColors[i],
      transparent: true,
      opacity: 0.7,
      roughness: 0.2,
      metalness: 0.1,
    })
    const bottle = new THREE.Mesh(bottleGeometry, bottleMaterial)
    bottle.position.set(-1 + i * 0.5, 1.65, -0.55)
    barGroup.add(bottle)
  }

  // Vasos en el mostrador
  const glassGeometry = new THREE.CylinderGeometry(0.06, 0.05, 0.15, 8)
  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
    roughness: 0.1,
    metalness: 0.1,
  })

  for (let i = 0; i < 3; i++) {
    const glass = new THREE.Mesh(glassGeometry, glassMaterial)
    glass.position.set(-0.6 + i * 0.6, 1.13, 0.3)
    barGroup.add(glass)
  }

  // Taburetes de bar
  for (let i = 0; i < 3; i++) {
    const stool = createBarStool(color)
    stool.position.set(-1 + i, 0, 0.8)
    barGroup.add(stool)
  }

  return barGroup
}

function createBarStool(color: string): THREE.Group {
  const stoolGroup = new THREE.Group()

  // Asiento
  const seatGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.08, 16)
  const seatMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
  const seat = new THREE.Mesh(seatGeometry, seatMaterial)
  seat.position.y = 0.7
  stoolGroup.add(seat)

  // Pata central
  const legGeometry = new THREE.CylinderGeometry(0.04, 0.06, 0.7, 8)
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.3 })
  const leg = new THREE.Mesh(legGeometry, legMaterial)
  leg.position.y = 0.35
  stoolGroup.add(leg)

  // Base
  const baseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 16)
  const base = new THREE.Mesh(baseGeometry, legMaterial)
  base.position.y = 0.025
  stoolGroup.add(base)

  return stoolGroup
}

function createElevator(color: string): THREE.Group {
  const elevatorGroup = new THREE.Group()

  // Cabina
  const cabinGeometry = new THREE.BoxGeometry(1.5, 2.2, 1.5)
  const cabinMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.6, roughness: 0.3 })
  const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial)
  cabin.position.y = 1.1
  elevatorGroup.add(cabin)

  // Puertas
  const doorGeometry = new THREE.BoxGeometry(0.7, 2, 0.05)
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 })

  const leftDoor = new THREE.Mesh(doorGeometry, doorMaterial)
  leftDoor.position.set(-0.35, 1, 0.76)
  elevatorGroup.add(leftDoor)

  const rightDoor = new THREE.Mesh(doorGeometry, doorMaterial)
  rightDoor.position.set(0.35, 1, 0.76)
  elevatorGroup.add(rightDoor)

  // Panel de botones
  const panelGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.05)
  const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 })
  const panel = new THREE.Mesh(panelGeometry, panelMaterial)
  panel.position.set(0.6, 1.2, 0.76)
  elevatorGroup.add(panel)

  // Botones
  const buttonGeometry = new THREE.CircleGeometry(0.03, 16)
  const buttonMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    emissive: 0xffff00,
    emissiveIntensity: 0.3,
  })

  for (let i = 0; i < 3; i++) {
    const button = new THREE.Mesh(buttonGeometry, buttonMaterial)
    button.position.set(0.6, 1.4 - i * 0.15, 0.78)
    elevatorGroup.add(button)
  }

  return elevatorGroup
}

function createATM(color: string): THREE.Group {
  const atmGroup = new THREE.Group()

  // Cuerpo principal
  const bodyGeometry = new THREE.BoxGeometry(0.8, 1.5, 0.4)
  const bodyMaterial = new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.3 })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  body.position.y = 0.75
  atmGroup.add(body)

  // Pantalla
  const screenGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.05)
  const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0x001a33,
    emissive: 0x0066cc,
    emissiveIntensity: 0.3,
  })
  const screen = new THREE.Mesh(screenGeometry, screenMaterial)
  screen.position.set(0, 1.1, 0.21)
  atmGroup.add(screen)

  // Teclado
  const keypadGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.05)
  const keypadMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 })
  const keypad = new THREE.Mesh(keypadGeometry, keypadMaterial)
  keypad.position.set(0, 0.6, 0.21)
  atmGroup.add(keypad)

  // Ranura para tarjeta
  const slotGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.05)
  const slotMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 })
  const slot = new THREE.Mesh(slotGeometry, slotMaterial)
  slot.position.set(0, 0.3, 0.21)
  atmGroup.add(slot)

  // Dispensador de efectivo
  const dispenserGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.05)
  const dispenser = new THREE.Mesh(dispenserGeometry, slotMaterial)
  dispenser.position.set(0, 0.15, 0.21)
  atmGroup.add(dispenser)

  return atmGroup
}

function createChargingStation(color: string): THREE.Group {
  const stationGroup = new THREE.Group()

  // Poste principal
  const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16)
  const poleMaterial = new THREE.MeshStandardMaterial({ color, metalness: 0.6, roughness: 0.4 })
  const pole = new THREE.Mesh(poleGeometry, poleMaterial)
  pole.position.y = 0.75
  stationGroup.add(pole)

  // Panel superior
  const panelGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.1)
  const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 })
  const panel = new THREE.Mesh(panelGeometry, panelMaterial)
  panel.position.set(0, 1.2, 0)
  stationGroup.add(panel)

  // Pantalla
  const displayGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.05)
  const displayMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    emissive: 0x00ff00,
    emissiveIntensity: 0.4,
  })
  const display = new THREE.Mesh(displayGeometry, displayMaterial)
  display.position.set(0, 1.3, 0.06)
  stationGroup.add(display)

  // Cables (4 puertos)
  const cableGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8)
  const cableMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 })

  const cablePositions = [
    { x: -0.15, y: 0.9 },
    { x: -0.05, y: 0.9 },
    { x: 0.05, y: 0.9 },
    { x: 0.15, y: 0.9 },
  ]

  cablePositions.forEach((pos) => {
    const cable = new THREE.Mesh(cableGeometry, cableMaterial)
    cable.position.set(pos.x, pos.y, 0.05)
    stationGroup.add(cable)

    // Conector
    const connectorGeometry = new THREE.BoxGeometry(0.04, 0.08, 0.04)
    const connectorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const connector = new THREE.Mesh(connectorGeometry, connectorMaterial)
    connector.position.set(pos.x, pos.y - 0.25, 0.05)
    stationGroup.add(connector)
  })

  // Base
  const baseGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.1, 16)
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.position.y = 0.05
  stationGroup.add(base)

  return stationGroup
}

function createSeatingArea(color: string, isVIP = false): THREE.Group {
  const seatingGroup = new THREE.Group()

  // Crear filas de sillas
  const rows = 3
  const seatsPerRow = 4

  for (let row = 0; row < rows; row++) {
    for (let seat = 0; seat < seatsPerRow; seat++) {
      const chair = createChair(isVIP ? 0xffd700 : color)
      chair.position.set((seat - seatsPerRow / 2) * 0.7, 0, row * 0.8)
      seatingGroup.add(chair)
    }
  }

  // Si es VIP, agregar alfombra roja
  if (isVIP) {
    const carpetGeometry = new THREE.BoxGeometry(seatsPerRow * 0.7 + 0.5, 0.02, rows * 0.8 + 0.5)
    const carpetMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.9 })
    const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial)
    carpet.position.y = 0.01
    carpet.position.z = (rows - 1) * 0.4
    seatingGroup.add(carpet)

    // Postes con cuerda
    const postGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8)
    const postMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 })

    const corners = [
      { x: -seatsPerRow * 0.35 - 0.3, z: -0.3 },
      { x: seatsPerRow * 0.35 + 0.3, z: -0.3 },
      { x: -seatsPerRow * 0.35 - 0.3, z: rows * 0.8 + 0.3 },
      { x: seatsPerRow * 0.35 + 0.3, z: rows * 0.8 + 0.3 },
    ]

    corners.forEach((corner) => {
      const post = new THREE.Mesh(postGeometry, postMaterial)
      post.position.set(corner.x, 0.5, corner.z)
      seatingGroup.add(post)
    })
  }

  return seatingGroup
}

function createMedicalStation(color: string): THREE.Group {
  const medicalGroup = new THREE.Group()

  // Mesa de examen
  const tableGeometry = new THREE.BoxGeometry(2, 0.1, 1)
  const tableMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
  const table = new THREE.Mesh(tableGeometry, tableMaterial)
  table.position.y = 0.8
  medicalGroup.add(table)

  // Patas de la mesa
  const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8)
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.5 })

  const legPositions = [
    { x: -0.9, z: -0.4 },
    { x: -0.9, z: 0.4 },
    { x: 0.9, z: -0.4 },
    { x: 0.9, z: 0.4 },
  ]

  legPositions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial)
    leg.position.set(pos.x, 0.4, pos.z)
    medicalGroup.add(leg)
  })

  // Cruz roja
  const crossMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })

  const crossVertical = new THREE.BoxGeometry(0.2, 0.6, 0.05)
  const crossV = new THREE.Mesh(crossVertical, crossMaterial)
  crossV.position.set(0, 1.5, -0.5)
  medicalGroup.add(crossV)

  const crossHorizontal = new THREE.BoxGeometry(0.6, 0.2, 0.05)
  const crossH = new THREE.Mesh(crossHorizontal, crossMaterial)
  crossH.position.set(0, 1.5, -0.5)
  medicalGroup.add(crossH)

  // Botiquín
  const kitGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.2)
  const kitMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const kit = new THREE.Mesh(kitGeometry, kitMaterial)
  kit.position.set(0.6, 0.95, 0)
  medicalGroup.add(kit)

  // Silla
  const chair = createChair(color)
  chair.position.set(-1, 0, 0.8)
  medicalGroup.add(chair)

  return medicalGroup
}

// Crear puesto de seguridad
function createSecurityPost(color: string): THREE.Group {
  const securityGroup = new THREE.Group()

  // Escritorio
  const deskGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.8)
  const deskMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.6 })
  const desk = new THREE.Mesh(deskGeometry, deskMaterial)
  desk.position.y = 0.75
  securityGroup.add(desk)

  // Base del escritorio
  const baseGeometry = new THREE.BoxGeometry(1.5, 0.75, 0.8)
  const base = new THREE.Mesh(baseGeometry, deskMaterial)
  base.position.y = 0.375
  securityGroup.add(base)

  // Monitor
  const monitorGeometry = new THREE.BoxGeometry(0.5, 0.4, 0.05)
  const monitorMaterial = new THREE.MeshStandardMaterial({
    color: 0x001a33,
    emissive: 0x0066cc,
    emissiveIntensity: 0.2,
  })
  const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial)
  monitor.position.set(0, 1.1, 0)
  monitor.rotation.x = -0.2
  securityGroup.add(monitor)

  // Escudo de seguridad
  const shieldGeometry = new THREE.CircleGeometry(0.3, 6)
  const shieldMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8 })
  const shield = new THREE.Mesh(shieldGeometry, shieldMaterial)
  shield.position.set(0, 1.5, -0.4)
  securityGroup.add(shield)

  // Silla
  const chair = createChair(color)
  chair.position.set(0, 0, 0.6)
  securityGroup.add(chair)

  // Barrera
  const barrierPoleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8)
  const barrierPoleMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, metalness: 0.6 })

  const leftPole = new THREE.Mesh(barrierPoleGeometry, barrierPoleMaterial)
  leftPole.position.set(-1, 0.5, -0.5)
  securityGroup.add(leftPole)

  const rightPole = new THREE.Mesh(barrierPoleGeometry, barrierPoleMaterial)
  rightPole.position.set(1, 0.5, -0.5)
  securityGroup.add(rightPole)

  const barrierTapeGeometry = new THREE.BoxGeometry(2, 0.05, 0.05)
  const barrierTapeMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 })
  const tape = new THREE.Mesh(barrierTapeGeometry, barrierTapeMaterial)
  tape.position.set(0, 0.8, -0.5)
  securityGroup.add(tape)

  return securityGroup
}

function createRamp(color: string): THREE.Group {
  const rampGroup = new THREE.Group()

  // Superficie de la rampa
  const rampGeometry = new THREE.BoxGeometry(2, 0.1, 4)
  const rampMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.8 })
  const ramp = new THREE.Mesh(rampGeometry, rampMaterial)
  ramp.position.set(0, 0.4, 0)
  ramp.rotation.x = -0.2
  rampGroup.add(ramp)

  // Barandas
  const railMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3 })

  // Postes de las barandas
  for (let i = 0; i < 5; i++) {
    const postGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8)

    const leftPost = new THREE.Mesh(postGeometry, railMaterial)
    leftPost.position.set(-1, 0.45, -1.5 + i)
    rampGroup.add(leftPost)

    const rightPost = new THREE.Mesh(postGeometry, railMaterial)
    rightPost.position.set(1, 0.45, -1.5 + i)
    rampGroup.add(rightPost)
  }

  // Pasamanos
  const handrailGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4, 8)

  const leftHandrail = new THREE.Mesh(handrailGeometry, railMaterial)
  leftHandrail.position.set(-1, 0.9, 0)
  leftHandrail.rotation.x = Math.PI / 2
  rampGroup.add(leftHandrail)

  const rightHandrail = new THREE.Mesh(handrailGeometry, railMaterial)
  rightHandrail.position.set(1, 0.9, 0)
  rightHandrail.rotation.x = Math.PI / 2
  rampGroup.add(rightHandrail)

  // Símbolo de accesibilidad
  const signGeometry = new THREE.CircleGeometry(0.2, 32)
  const signMaterial = new THREE.MeshStandardMaterial({ color: 0x0066cc })
  const sign = new THREE.Mesh(signGeometry, signMaterial)
  sign.position.set(0, 0.5, -2)
  sign.rotation.x = -Math.PI / 2
  rampGroup.add(sign)

  return rampGroup
}

function createCloakroom(color: string): THREE.Group {
  const cloakroomGroup = new THREE.Group()

  // Mostrador
  const counterGeometry = new THREE.BoxGeometry(2.5, 0.1, 0.8)
  const counterMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.5 })
  const counter = new THREE.Mesh(counterGeometry, counterMaterial)
  counter.position.y = 1
  cloakroomGroup.add(counter)

  // Base del mostrador
  const baseGeometry = new THREE.BoxGeometry(2.5, 1, 0.8)
  const baseMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.position.y = 0.5
  cloakroomGroup.add(base)

  // Perchero trasero
  const rackGeometry = new THREE.CylinderGeometry(0.03, 0.03, 2.5, 8)
  const rackMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7 })
  const rack = new THREE.Mesh(rackGeometry, rackMaterial)
  rack.rotation.z = Math.PI / 2
  rack.position.set(0, 1.5, -0.5)
  cloakroomGroup.add(rack)

  // Perchas con ropa
  const hangerColors = [0xff0000, 0x0000ff, 0x00ff00, 0xffff00, 0xff00ff]

  for (let i = 0; i < 5; i++) {
    // Percha
    const hangerGeometry = new THREE.TorusGeometry(0.1, 0.01, 8, 16, Math.PI)
    const hangerMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 })
    const hanger = new THREE.Mesh(hangerGeometry, hangerMaterial)
    hanger.position.set(-1 + i * 0.5, 1.5, -0.5)
    hanger.rotation.x = Math.PI / 2
    cloakroomGroup.add(hanger)

    // Prenda de ropa
    const clothGeometry = new THREE.BoxGeometry(0.15, 0.3, 0.1)
    const clothMaterial = new THREE.MeshStandardMaterial({ color: hangerColors[i], roughness: 0.8 })
    const cloth = new THREE.Mesh(clothGeometry, clothMaterial)
    cloth.position.set(-1 + i * 0.5, 1.3, -0.5)
    cloakroomGroup.add(cloth)
  }

  // Tickets en el mostrador
  const ticketGeometry = new THREE.BoxGeometry(0.3, 0.02, 0.2)
  const ticketMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const tickets = new THREE.Mesh(ticketGeometry, ticketMaterial)
  tickets.position.set(0.5, 1.06, 0)
  cloakroomGroup.add(tickets)

  return cloakroomGroup
}

function createFoodStall(color: string): THREE.Group {
  const foodGroup = new THREE.Group()

  // Mostrador
  const counterGeometry = new THREE.BoxGeometry(2, 0.1, 1)
  const counterMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
  const counter = new THREE.Mesh(counterGeometry, counterMaterial)
  counter.position.y = 1
  foodGroup.add(counter)

  // Base
  const baseGeometry = new THREE.BoxGeometry(2, 1, 1)
  const baseMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.position.y = 0.5
  foodGroup.add(base)

  // Vitrina de comida
  const displayGeometry = new THREE.BoxGeometry(1.8, 0.4, 0.8)
  const displayMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
    roughness: 0.1,
  })
  const display = new THREE.Mesh(displayGeometry, displayMaterial)
  display.position.set(0, 1.25, 0)
  foodGroup.add(display)

  // Comida en la vitrina (hamburguesas, pizzas, etc.)
  const foodColors = [0xff6600, 0xffff00, 0xff0000, 0x00ff00]

  for (let i = 0; i < 4; i++) {
    const foodGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16)
    const foodMaterial = new THREE.MeshStandardMaterial({ color: foodColors[i] })
    const food = new THREE.Mesh(foodGeometry, foodMaterial)
    food.position.set(-0.6 + i * 0.4, 1.15, 0)
    foodGroup.add(food)
  }

  // Menú en la pared trasera
  const menuGeometry = new THREE.BoxGeometry(1.5, 1, 0.05)
  const menuMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 })
  const menu = new THREE.Mesh(menuGeometry, menuMaterial)
  menu.position.set(0, 1.8, -0.5)
  foodGroup.add(menu)

  // Toldo
  const awningGeometry = new THREE.BoxGeometry(2.2, 0.05, 0.8)
  const awningMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.8 })
  const awning = new THREE.Mesh(awningGeometry, awningMaterial)
  awning.position.set(0, 2.5, 0.2)
  awning.rotation.x = -0.3
  foodGroup.add(awning)

  return foodGroup
}

function createRegistration(color: string): THREE.Group {
  const registrationGroup = new THREE.Group()

  // Mostrador largo
  const counterGeometry = new THREE.BoxGeometry(4, 0.1, 1)
  const counterMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.4 })
  const counter = new THREE.Mesh(counterGeometry, counterMaterial)
  counter.position.y = 1
  registrationGroup.add(counter)

  // Base
  const baseGeometry = new THREE.BoxGeometry(4, 1, 1)
  const baseMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.position.y = 0.5
  registrationGroup.add(base)

  // Computadoras (3 estaciones)
  for (let i = 0; i < 3; i++) {
    // Monitor
    const monitorGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.05)
    const monitorMaterial = new THREE.MeshStandardMaterial({
      color: 0x001a33,
      emissive: 0x0066cc,
      emissiveIntensity: 0.2,
    })
    const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial)
    monitor.position.set(-1.5 + i * 1.5, 1.25, 0)
    monitor.rotation.x = -0.2
    registrationGroup.add(monitor)

    // Teclado
    const keyboardGeometry = new THREE.BoxGeometry(0.3, 0.02, 0.15)
    const keyboardMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 })
    const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial)
    keyboard.position.set(-1.5 + i * 1.5, 1.06, 0.2)
    registrationGroup.add(keyboard)
  }

  // Banner con logo
  const bannerGeometry = new THREE.BoxGeometry(4, 0.8, 0.05)
  const bannerMaterial = new THREE.MeshStandardMaterial({ color })
  const banner = new THREE.Mesh(bannerGeometry, bannerMaterial)
  banner.position.set(0, 2, -0.5)
  registrationGroup.add(banner)

  // Sillas para el personal
  for (let i = 0; i < 3; i++) {
    const chair = createChair(0x333333)
    chair.position.set(-1.5 + i * 1.5, 0, 0.7)
    registrationGroup.add(chair)
  }

  // Fila de espera con postes
  const postGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8)
  const postMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.6 })

  for (let i = 0; i < 4; i++) {
    const post = new THREE.Mesh(postGeometry, postMaterial)
    post.position.set(-1.5 + i, 0.5, -1.5)
    registrationGroup.add(post)

    if (i < 3) {
      const ropeGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 8)
      const ropeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
      const rope = new THREE.Mesh(ropeGeometry, ropeMaterial)
      rope.rotation.z = Math.PI / 2
      rope.position.set(-1 + i, 0.8, -1.5)
      registrationGroup.add(rope)
    }
  }

  return registrationGroup
}

function createPhotoBooth(color: string): THREE.Group {
  const boothGroup = new THREE.Group()

  // Cabina
  const boothGeometry = new THREE.BoxGeometry(1.5, 2.5, 1.5)
  const boothMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.3 })
  const booth = new THREE.Mesh(boothGeometry, boothMaterial)
  booth.position.y = 1.25
  boothGroup.add(booth)

  // Cortina frontal
  const curtainGeometry = new THREE.BoxGeometry(1.4, 2, 0.05)
  const curtainMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.8 })
  const curtain = new THREE.Mesh(curtainGeometry, curtainMaterial)
  curtain.position.set(0, 1, 0.76)
  boothGroup.add(curtain)

  // Cámara
  const cameraBodyGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.15)
  const cameraMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.6 })
  const cameraBody = new THREE.Mesh(cameraBodyGeometry, cameraMaterial)
  cameraBody.position.set(0, 2, 0)
  boothGroup.add(cameraBody)

  // Lente
  const lensGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 16)
  const lensMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.9,
    roughness: 0.1,
  })
  const lens = new THREE.Mesh(lensGeometry, lensMaterial)
  lens.rotation.x = Math.PI / 2
  lens.position.set(0, 2, 0.1)
  boothGroup.add(lens)

  // Flash
  const flashGeometry = new THREE.BoxGeometry(1.2, 0.1, 0.1)
  const flashMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.5,
  })
  const flash = new THREE.Mesh(flashGeometry, flashMaterial)
  flash.position.set(0, 2.3, 0.7)
  boothGroup.add(flash)

  // Asiento
  const seatGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16)
  const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 })
  const seat = new THREE.Mesh(seatGeometry, seatMaterial)
  seat.position.set(0, 0.5, 0)
  boothGroup.add(seat)

  // Poste del asiento
  const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8)
  const pole = new THREE.Mesh(poleGeometry, cameraMaterial)
  pole.position.set(0, 0.25, 0)
  boothGroup.add(pole)

  // Letrero "PHOTO BOOTH"
  const signGeometry = new THREE.BoxGeometry(1.5, 0.3, 0.05)
  const signMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    emissive: 0xffff00,
    emissiveIntensity: 0.3,
  })
  const sign = new THREE.Mesh(signGeometry, signMaterial)
  sign.position.set(0, 2.6, 0.76)
  boothGroup.add(sign)

  return boothGroup
}

const getMarkerGeometry = (type: string, color: string): THREE.Group => {
  switch (type) {
    case "entrance":
      return createDoor(color, true)

    case "exit":
    case "emergency_exit":
      return createDoor(color, false)

    case "stage":
      return createStage(color)

    case "backstage":
      const backstageGroup = new THREE.Group()
      const backstageBox = new THREE.BoxGeometry(3, 0.5, 2.5)
      const backstageMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.7 })
      const backstage = new THREE.Mesh(backstageBox, backstageMaterial)
      backstage.position.y = 0.25
      backstageGroup.add(backstage)
      return backstageGroup

    case "booth":
    case "sponsor_booth":
    case "info_booth":
    case "merchandise":
      return createBoothTable(color)

    case "food":
      return createFoodStall(color)

    case "bar":
      return createBar(color)

    case "kitchen":
      const kitchenGroup = new THREE.Group()
      // Mostrador de cocina
      const kitchenCounter = new THREE.BoxGeometry(2.5, 1, 1.5)
      const kitchenMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.5 })
      const counter = new THREE.Mesh(kitchenCounter, kitchenMaterial)
      counter.position.y = 0.5
      kitchenGroup.add(counter)
      // Estufa
      const stoveGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.8)
      const stoveMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 })
      const stove = new THREE.Mesh(stoveGeometry, stoveMaterial)
      stove.position.set(0, 1.1, 0)
      kitchenGroup.add(stove)
      // Hornillas
      for (let i = 0; i < 4; i++) {
        const burnerGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 16)
        const burnerMaterial = new THREE.MeshStandardMaterial({
          color: 0xff4400,
          emissive: 0xff4400,
          emissiveIntensity: 0.4,
        })
        const burner = new THREE.Mesh(burnerGeometry, burnerMaterial)
        burner.position.set(i % 2 === 0 ? -0.25 : 0.25, 1.23, i < 2 ? -0.25 : 0.25)
        kitchenGroup.add(burner)
      }
      return kitchenGroup

    case "bathroom":
      return createBathroom(color, false)

    case "accessible_bathroom":
      return createBathroom(color, true)

    case "stairs":
      return createStairs(color)

    case "elevator":
      return createElevator(color)

    case "escalator":
      const escalatorGroup = new THREE.Group()
      const escalatorBase = new THREE.BoxGeometry(1.2, 0.3, 4)
      const escalatorMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.6 })
      const escalatorMesh = new THREE.Mesh(escalatorBase, escalatorMaterial)
      escalatorMesh.position.set(0, 0.15, 0)
      escalatorMesh.rotation.x = -0.15
      escalatorGroup.add(escalatorMesh)
      // Escalones
      for (let i = 0; i < 10; i++) {
        const stepGeometry = new THREE.BoxGeometry(1, 0.05, 0.35)
        const stepMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7 })
        const step = new THREE.Mesh(stepGeometry, stepMaterial)
        step.position.set(0, 0.15 + i * 0.1, -1.8 + i * 0.4)
        escalatorGroup.add(step)
      }
      // Barandas móviles
      const handrailGeometry = new THREE.BoxGeometry(0.1, 0.8, 4)
      const handrailMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.3 })
      const leftHandrail = new THREE.Mesh(handrailGeometry, handrailMaterial)
      leftHandrail.position.set(-0.6, 0.9, 0)
      leftHandrail.rotation.x = -0.15
      escalatorGroup.add(leftHandrail)
      const rightHandrail = new THREE.Mesh(handrailGeometry, handrailMaterial)
      rightHandrail.position.set(0.6, 0.9, 0)
      rightHandrail.rotation.x = -0.15
      escalatorGroup.add(rightHandrail)
      return escalatorGroup

    case "ramp":
      return createRamp(color)

    case "seating":
      return createSeatingArea(color, false)

    case "vip_seating":
      return createSeatingArea(color, true)

    case "standing_area":
      const standingGroup = new THREE.Group()
      // Área delimitada con postes y cuerda
      const areaSize = 4
      const cornerPosts = [
        { x: -areaSize / 2, z: -areaSize / 2 },
        { x: areaSize / 2, z: -areaSize / 2 },
        { x: -areaSize / 2, z: areaSize / 2 },
        { x: areaSize / 2, z: areaSize / 2 },
      ]
      cornerPosts.forEach((pos) => {
        const postGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8)
        const postMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.6 })
        const post = new THREE.Mesh(postGeometry, postMaterial)
        post.position.set(pos.x, 0.5, pos.z)
        standingGroup.add(post)
      })
      // Cuerdas conectando los postes
      const ropeGeometry = new THREE.CylinderGeometry(0.02, 0.02, areaSize, 8)
      const ropeMaterial = new THREE.MeshStandardMaterial({ color })
      const ropes = [
        { pos: { x: 0, y: 0.8, z: -areaSize / 2 }, rot: { x: 0, y: 0, z: Math.PI / 2 } },
        { pos: { x: 0, y: 0.8, z: areaSize / 2 }, rot: { x: 0, y: 0, z: Math.PI / 2 } },
        { pos: { x: -areaSize / 2, y: 0.8, z: 0 }, rot: { x: 0, y: 0, z: 0 } },
        { pos: { x: areaSize / 2, y: 0.8, z: 0 }, rot: { x: 0, y: 0, z: 0 } },
      ]
      ropes.forEach((rope) => {
        const ropeMesh = new THREE.Mesh(ropeGeometry, ropeMaterial)
        ropeMesh.position.set(rope.pos.x, rope.pos.y, rope.pos.z)
        ropeMesh.rotation.set(rope.rot.x, rope.rot.y, rope.rot.z)
        standingGroup.add(ropeMesh)
      })
      return standingGroup

    case "vip_area":
      const vipGroup = new THREE.Group()
      // Alfombra roja
      const carpetGeometry = new THREE.BoxGeometry(4, 0.02, 4)
      const carpetMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.9 })
      const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial)
      carpet.position.y = 0.01
      vipGroup.add(carpet)
      // Sofás de lujo
      for (let i = 0; i < 2; i++) {
        const sofaGeometry = new THREE.BoxGeometry(1.5, 0.5, 0.8)
        const sofaMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.4 })
        const sofa = new THREE.Mesh(sofaGeometry, sofaMaterial)
        sofa.position.set(i === 0 ? -1 : 1, 0.25, 0)
        vipGroup.add(sofa)
        // Respaldo
        const backGeometry = new THREE.BoxGeometry(1.5, 0.6, 0.2)
        const back = new THREE.Mesh(backGeometry, sofaMaterial)
        back.position.set(i === 0 ? -1 : 1, 0.55, -0.3)
        vipGroup.add(back)
      }
      // Mesa de centro
      const tableGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 16)
      const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, metalness: 0.5 })
      const table = new THREE.Mesh(tableGeometry, tableMaterial)
      table.position.set(0, 0.4, 0.8)
      vipGroup.add(table)
      // Postes dorados con cuerda
      const vipPostGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8)
      const vipPostMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9 })
      const vipCorners = [
        { x: -2, z: -2 },
        { x: 2, z: -2 },
        { x: -2, z: 2 },
        { x: 2, z: 2 },
      ]
      vipCorners.forEach((corner) => {
        const post = new THREE.Mesh(vipPostGeometry, vipPostMaterial)
        post.position.set(corner.x, 0.5, corner.z)
        vipGroup.add(post)
      })
      return vipGroup

    case "press_area":
      const pressGroup = new THREE.Group()
      // Plataforma elevada
      const platformGeometry = new THREE.BoxGeometry(3, 0.3, 2)
      const platformMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
      const platform = new THREE.Mesh(platformGeometry, platformMaterial)
      platform.position.y = 0.15
      pressGroup.add(platform)
      // Cámaras en trípodes
      for (let i = 0; i < 3; i++) {
        // Trípode
        const tripodGeometry = new THREE.CylinderGeometry(0.02, 0.05, 1.2, 8)
        const tripodMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 })
        const tripod = new THREE.Mesh(tripodGeometry, tripodMaterial)
        tripod.position.set(-1 + i, 0.9, 0)
        pressGroup.add(tripod)
        // Cámara
        const cameraGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.25)
        const cameraMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.6 })
        const camera = new THREE.Mesh(cameraGeometry, cameraMaterial)
        camera.position.set(-1 + i, 1.5, 0)
        pressGroup.add(camera)
        // Lente
        const lensGeometry = new THREE.CylinderGeometry(0.08, 0.06, 0.15, 16)
        const lensMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8 })
        const lens = new THREE.Mesh(lensGeometry, lensMaterial)
        lens.rotation.x = Math.PI / 2
        lens.position.set(-1 + i, 1.5, 0.2)
        pressGroup.add(lens)
      }
      return pressGroup

    case "parking":
      const parkingGroup = new THREE.Group()
      // Crear 2 autos
      const car1 = createCar(0x0066cc)
      car1.position.set(-1.5, 0, 0)
      parkingGroup.add(car1)
      const car2 = createCar(0xff0000)
      car2.position.set(1.5, 0, 0)
      parkingGroup.add(car2)
      // Líneas de estacionamiento
      const lineGeometry = new THREE.BoxGeometry(0.1, 0.01, 5)
      const lineMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
      const line1 = new THREE.Mesh(lineGeometry, lineMaterial)
      line1.position.set(-3, 0.01, 0)
      parkingGroup.add(line1)
      const line2 = new THREE.Mesh(lineGeometry, lineMaterial)
      line2.position.set(0, 0.01, 0)
      parkingGroup.add(line2)
      const line3 = new THREE.Mesh(lineGeometry, lineMaterial)
      line3.position.set(3, 0.01, 0)
      parkingGroup.add(line3)
      return parkingGroup

    case "registration":
      return createRegistration(color)

    case "cloakroom":
      return createCloakroom(color)

    case "atm":
      return createATM(color)

    case "charging_station":
      return createChargingStation(color)

    case "photo_booth":
      return createPhotoBooth(color)

    case "security":
      return createSecurityPost(color)

    case "medical":
      return createMedicalStation(color)

    case "info":
      const infoGroup = new THREE.Group()
      // Kiosco de información
      const kioskGeometry = new THREE.CylinderGeometry(0.5, 0.6, 1.5, 8)
      const kioskMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
      const kiosk = new THREE.Mesh(kioskGeometry, kioskMaterial)
      kiosk.position.y = 0.75
      infoGroup.add(kiosk)
      // Pantalla informativa
      const screenGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.05)
      const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x0066cc,
        emissive: 0x0066cc,
        emissiveIntensity: 0.3,
      })
      const screen = new THREE.Mesh(screenGeometry, screenMaterial)
      screen.position.set(0, 1.2, 0.5)
      infoGroup.add(screen)
      // Símbolo de información
      const signGeometry = new THREE.CircleGeometry(0.2, 32)
      const signMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
      const sign = new THREE.Mesh(signGeometry, signMaterial)
      sign.position.set(0, 1.8, 0.51)
      infoGroup.add(sign)
      // Letra "i"
      const iGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.15, 8)
      const iMaterial = new THREE.MeshStandardMaterial({ color: 0x0066cc })
      const iLetter = new THREE.Mesh(iGeometry, iMaterial)
      iLetter.position.set(0, 1.75, 0.52)
      infoGroup.add(iLetter)
      const dotGeometry = new THREE.SphereGeometry(0.03, 16, 16)
      const dot = new THREE.Mesh(dotGeometry, iMaterial)
      dot.position.set(0, 1.88, 0.52)
      infoGroup.add(dot)
      return infoGroup

    default:
      // Fallback genérico
      const defaultGroup = new THREE.Group()
      const defaultGeometry = new THREE.BoxGeometry(1, 1, 1)
      const defaultMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
      const defaultMesh = new THREE.Mesh(defaultGeometry, defaultMaterial)
      defaultMesh.position.y = 0.5
      defaultGroup.add(defaultMesh)
      return defaultGroup
  }
}

// ============================================================================
// UTILIDADES
// ============================================================================

const isConnectionElement = (type: string): boolean => {
  return CONNECTION_ELEMENTS.includes(type)
}

const isCapacityElement = (type: string): boolean => {
  return CAPACITY_ELEMENTS.includes(type)
}

const getFloorColor = (texture: string): number => {
  const colors: Record<string, number> = {
    grass: 0x4a7c59,
    concrete: 0x808080,
    wood: 0x8b4513,
    tile: 0xf0f0f0,
    carpet: 0x8b0000,
  }
  return colors[texture] || 0x808080
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function Enhanced3DMapEditor() {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null)
  const [markers, setMarkers] = useState<Marker3D[]>([])
  const [currentFloor, setCurrentFloor] = useState(0)
  const [floorNames, setFloorNames] = useState<Record<number, string>>({
    0: "Planta Baja",
  })
  const [sceneConfig, setSceneConfig] = useState<SceneConfig>({
    type: "indoor",
    floors: 1,
    floorHeight: 4,
    dimensions: { width: 40, depth: 30 },
    lighting: "indoor",
    groundTexture: "concrete",
  })
  const [showSceneConfig, setShowSceneConfig] = useState(false)

  // Refs para Three.js
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const markerMeshesRef = useRef<Map<string, THREE.Group>>(new Map())
  const draggedMarkerRef = useRef<{ id: string; plane: THREE.Plane } | null>(null)
  const raycasterRef = useRef(new THREE.Raycaster())
  const mouseRef = useRef(new THREE.Vector2())
  const [isDragging, setIsDragging] = useState(false)
  const [isRotatingCamera, setIsRotatingCamera] = useState(false)

  // ============================================================================
  // INICIALIZACIÓN DE THREE.JS
  // ============================================================================

  useEffect(() => {
    if (!containerRef.current) return

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(sceneConfig.type === "outdoor" ? 0x87ceeb : 0x1a1a2e)
    scene.fog = new THREE.Fog(scene.background.getHex(), 50, 100)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(20, 25, 20)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Iluminación
    setupLighting(scene, sceneConfig)

    // Crear entorno
    createEnvironment(scene, sceneConfig, currentFloor)

    setupControls(camera, renderer.domElement)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [sceneConfig, currentFloor])

  const setupLighting = (scene: THREE.Scene, config: SceneConfig) => {
    const ambientLight = new THREE.AmbientLight(0xffffff, config.lighting === "indoor" ? 0.4 : 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, config.lighting === "indoor" ? 0.6 : 0.8)
    directionalLight.position.set(10, 20, 10)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.left = -30
    directionalLight.shadow.camera.right = 30
    directionalLight.shadow.camera.top = 30
    directionalLight.shadow.camera.bottom = -30
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    if (config.type === "indoor" || config.type === "hybrid") {
      for (let i = 0; i < 4; i++) {
        const pointLight = new THREE.PointLight(0xffa500, 0.3, 30)
        const angle = (i / 4) * Math.PI * 2
        const radius = 15
        pointLight.position.set(Math.cos(angle) * radius, 5, Math.sin(angle) * radius)
        scene.add(pointLight)
      }
    }
  }

  const createEnvironment = (scene: THREE.Scene, config: SceneConfig, floor: number) => {
    const { width, depth } = config.dimensions
    const { floors, floorHeight } = config

    for (let f = 0; f < floors; f++) {
      const floorY = f * floorHeight
      const isCurrentFloor = f === floor
      const opacity = isCurrentFloor ? 1 : 0.2

      const floorGeometry = new THREE.PlaneGeometry(width, depth)
      const floorMaterial = new THREE.MeshStandardMaterial({
        color: getFloorColor(config.groundTexture),
        roughness: 0.8,
        metalness: 0.2,
        transparent: !isCurrentFloor,
        opacity: opacity,
      })
      const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial)
      floorMesh.rotation.x = -Math.PI / 2
      floorMesh.position.y = floorY
      floorMesh.receiveShadow = true
      scene.add(floorMesh)

      if (isCurrentFloor) {
        const gridHelper = new THREE.GridHelper(Math.max(width, depth), 20, 0x444444, 0x222222)
        gridHelper.position.y = floorY + 0.01
        scene.add(gridHelper)
      }

      if (config.type === "indoor" || config.type === "hybrid") {
        createWalls(scene, width, depth, floorY, floorHeight, isCurrentFloor)
      }

      if (f < floors - 1 && config.type === "indoor") {
        const ceilingGeometry = new THREE.PlaneGeometry(width, depth)
        const ceilingMaterial = new THREE.MeshStandardMaterial({
          color: 0xf5f5f5,
          side: THREE.DoubleSide,
          transparent: !isCurrentFloor,
          opacity: opacity * 0.7,
        })
        const ceilingMesh = new THREE.Mesh(ceilingGeometry, ceilingMaterial)
        ceilingMesh.rotation.x = Math.PI / 2
        ceilingMesh.position.y = floorY + floorHeight
        scene.add(ceilingMesh)
      }
    }

    if (config.type === "outdoor") {
      const skyGeometry = new THREE.SphereGeometry(80, 32, 32)
      const skyMaterial = new THREE.MeshBasicMaterial({
        color: config.lighting === "day" ? 0x87ceeb : 0x1a1a3e,
        side: THREE.BackSide,
      })
      const sky = new THREE.Mesh(skyGeometry, skyMaterial)
      scene.add(sky)
    }
  }

  const createWalls = (
    scene: THREE.Scene,
    width: number,
    depth: number,
    floorY: number,
    height: number,
    isVisible: boolean,
  ) => {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0e0e0,
      roughness: 0.9,
      metalness: 0.1,
      transparent: !isVisible,
      opacity: isVisible ? 1 : 0.2,
    })

    const wallThickness = 0.2

    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(width, height, wallThickness), wallMaterial)
    frontWall.position.set(0, floorY + height / 2, -depth / 2)
    scene.add(frontWall)

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(width, height, wallThickness), wallMaterial)
    backWall.position.set(0, floorY + height / 2, depth / 2)
    scene.add(backWall)

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, height, depth), wallMaterial)
    leftWall.position.set(-width / 2, floorY + height / 2, 0)
    scene.add(leftWall)

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, height, depth), wallMaterial)
    rightWall.position.set(width / 2, floorY + height / 2, 0)
    scene.add(rightWall)
  }

  const setupControls = (camera: THREE.PerspectiveCamera, domElement: HTMLElement) => {
    let isRotating = false
    let previousMousePosition = { x: 0, y: 0 }
    const rotationSpeed = 0.005

    domElement.addEventListener("mousedown", (e) => {
      // Click derecho o Shift+Click izquierdo para rotar
      if (e.button === 2 || (e.button === 0 && e.shiftKey)) {
        isRotating = true
        setIsRotatingCamera(true)
        previousMousePosition = { x: e.clientX, y: e.clientY }
      }
    })

    domElement.addEventListener("mousemove", (e) => {
      if (isRotating) {
        const deltaX = e.clientX - previousMousePosition.x
        const deltaY = e.clientY - previousMousePosition.y

        const radius = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2)
        const theta = Math.atan2(camera.position.z, camera.position.x)
        const phi = Math.atan2(Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2), camera.position.y)

        const newTheta = theta - deltaX * rotationSpeed
        const newPhi = Math.max(0.1, Math.min(Math.PI - 0.1, phi + deltaY * rotationSpeed))

        camera.position.x = radius * Math.sin(newPhi) * Math.cos(newTheta)
        camera.position.y = radius * Math.cos(newPhi)
        camera.position.z = radius * Math.sin(newPhi) * Math.sin(newTheta)
        camera.lookAt(0, 0, 0)

        previousMousePosition = { x: e.clientX, y: e.clientY }
      }
    })

    domElement.addEventListener("mouseup", () => {
      isRotating = false
      setIsRotatingCamera(false)
    })

    domElement.addEventListener("wheel", (e) => {
      e.preventDefault()
      const zoomSpeed = 0.1
      const direction = e.deltaY > 0 ? 1 : -1
      const distance = Math.sqrt(camera.position.x ** 2 + camera.position.y ** 2 + camera.position.z ** 2)
      const newDistance = Math.max(10, Math.min(50, distance + direction * zoomSpeed * distance))
      const scale = newDistance / distance
      camera.position.multiplyScalar(scale)
    })

    domElement.addEventListener("contextmenu", (e) => e.preventDefault())
  }

  // ============================================================================
  // MANEJO DE MARCADORES
  // ============================================================================

  const createMarker3D = (marker: Marker3D): THREE.Group => {
    const group = new THREE.Group()

    // Obtener el objeto 3D realista según el tipo
    const object3D = getMarkerGeometry(marker.type, marker.color)

    if (marker.scale) {
      object3D.scale.set(marker.scale.x, marker.scale.y, marker.scale.z)
    }

    group.add(object3D)

    // Etiqueta con el nombre
    const canvas = document.createElement("canvas")
    canvas.width = 256
    canvas.height = 64
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillRect(0, 0, 256, 64)
    ctx.fillStyle = "white"
    ctx.font = "bold 20px Arial"
    ctx.textAlign = "center"
    ctx.fillText(marker.name, 128, 40)

    const texture = new THREE.CanvasTexture(canvas)
    const labelGeometry = new THREE.PlaneGeometry(2, 0.5)
    const labelMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide })
    const label = new THREE.Mesh(labelGeometry, labelMaterial)
    label.position.y = 2.5
    group.add(label)

    // Indicador de selección
    if (marker.id === selectedMarkerId) {
      const ringGeometry = new THREE.TorusGeometry(1.2, 0.08, 16, 100)
      const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.rotation.x = Math.PI / 2
      ring.position.y = 0.1
      group.add(ring)
    }

    group.position.set(marker.position.x, marker.position.y + marker.floor * sceneConfig.floorHeight, marker.position.z)
    group.rotation.set(marker.rotation.x, marker.rotation.y, marker.rotation.z)
    group.userData = { markerId: marker.id }

    return group
  }

  useEffect(() => {
    if (!sceneRef.current) return

    const scene = sceneRef.current

    markerMeshesRef.current.forEach((mesh) => {
      scene.remove(mesh)
    })
    markerMeshesRef.current.clear()

    markers
      .filter((m) => m.floor === currentFloor || isConnectionElement(m.type))
      .forEach((marker) => {
        const mesh = createMarker3D(marker)
        scene.add(mesh)
        markerMeshesRef.current.set(marker.id, mesh)
      })
  }, [markers, selectedMarkerId, currentFloor, sceneConfig])

  // ============================================================================
  // EVENTOS DEL MOUSE
  // ============================================================================

  useEffect(() => {
    const renderer = rendererRef.current
    if (!renderer) return

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button !== 0 || event.shiftKey || isRotatingCamera) return

      const rect = renderer.domElement.getBoundingClientRect()
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current!)

      const meshes = Array.from(markerMeshesRef.current.values())
      const intersects = raycasterRef.current.intersectObjects(meshes, true)

      if (intersects.length > 0) {
        let object = intersects[0].object
        while (object.parent && !object.userData.markerId) {
          object = object.parent as THREE.Object3D
        }

        if (object.userData.markerId) {
          setSelectedMarkerId(object.userData.markerId)

          const marker = markers.find((m) => m.id === object.userData.markerId)
          if (marker) {
            const plane = new THREE.Plane(
              new THREE.Vector3(0, 1, 0),
              -marker.position.y - marker.floor * sceneConfig.floorHeight,
            )
            draggedMarkerRef.current = { id: object.userData.markerId, plane }
            setIsDragging(true)
          }
        }
      } else {
        setSelectedMarkerId(null)
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging || !draggedMarkerRef.current || isRotatingCamera) return

      const rect = renderer.domElement.getBoundingClientRect()
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current!)

      const intersectPoint = new THREE.Vector3()
      raycasterRef.current.ray.intersectPlane(draggedMarkerRef.current.plane, intersectPoint)

      if (intersectPoint) {
        handleMarkerUpdate(draggedMarkerRef.current.id, {
          position: { x: intersectPoint.x, y: intersectPoint.y, z: intersectPoint.z },
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      draggedMarkerRef.current = null
    }

    renderer.domElement.addEventListener("mousedown", handleMouseDown)
    renderer.domElement.addEventListener("mousemove", handleMouseMove)
    renderer.domElement.addEventListener("mouseup", handleMouseUp)

    return () => {
      renderer.domElement.removeEventListener("mousedown", handleMouseDown)
      renderer.domElement.removeEventListener("mousemove", handleMouseMove)
      renderer.domElement.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, markers, isRotatingCamera])

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleAddMarker = (type: string) => {
    const newMarker: Marker3D = {
      id: Date.now().toString(),
      type: type as any,
      position: { x: 0, y: 0.75, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${markers.length + 1}`,
      color: MARKER_COLORS[type] || "#9333ea",
      icon: type,
      floor: currentFloor,
    }

    setMarkers([...markers, newMarker])
    setSelectedMarkerId(newMarker.id)
  }

  const handleMarkerUpdate = (id: string, updates: Partial<Marker3D>) => {
    setMarkers(markers.map((marker) => (marker.id === id ? { ...marker, ...updates } : marker)))
  }

  const handleMarkerDelete = () => {
    if (!selectedMarkerId) return
    setMarkers(markers.filter((marker) => marker.id !== selectedMarkerId))
    setSelectedMarkerId(null)
  }

  const handleMarkerDuplicate = () => {
    if (!selectedMarkerId) return
    const marker = markers.find((m) => m.id === selectedMarkerId)
    if (!marker) return

    const newMarker: Marker3D = {
      ...marker,
      id: Date.now().toString(),
      position: { x: marker.position.x, y: marker.position.y, z: marker.position.z }, // Keep original position for duplicate
      name: `${marker.name} (copia)`,
    }

    setMarkers([...markers, newMarker])
    setSelectedMarkerId(newMarker.id)
  }

  const handleSceneConfigUpdate = (updates: Partial<SceneConfig>) => {
    setSceneConfig({ ...sceneConfig, ...updates })
  }

  const handleAddFloor = () => {
    const newFloorNumber = sceneConfig.floors
    setSceneConfig({ ...sceneConfig, floors: sceneConfig.floors + 1 })
    setFloorNames({ ...floorNames, [newFloorNumber]: `Piso ${newFloorNumber}` })
    setCurrentFloor(newFloorNumber)
  }

  const handleRemoveFloor = (floorNumber: number) => {
    if (sceneConfig.floors <= 1) {
      alert("Debe haber al menos un piso")
      return
    }

    const markersOnFloor = markers.filter((m) => m.floor === floorNumber)
    if (markersOnFloor.length > 0) {
      if (!confirm(`Hay ${markersOnFloor.length} objetos en este piso. ¿Deseas eliminarlos?`)) {
        return
      }
    }

    // Remove markers on this floor
    setMarkers(markers.filter((m) => m.floor !== floorNumber))

    // Update floor numbers for floors above
    const updatedMarkers = markers
      .filter((m) => m.floor !== floorNumber)
      .map((m) => (m.floor > floorNumber ? { ...m, floor: m.floor - 1 } : m))
    setMarkers(updatedMarkers)

    // Update floor names
    const newFloorNames: Record<number, string> = {}
    Object.entries(floorNames).forEach(([key, value]) => {
      const floorNum = Number.parseInt(key)
      if (floorNum < floorNumber) {
        newFloorNames[floorNum] = value
      } else if (floorNum > floorNumber) {
        newFloorNames[floorNum - 1] = value
      }
    })
    setFloorNames(newFloorNames)

    setSceneConfig({ ...sceneConfig, floors: sceneConfig.floors - 1 })

    // Adjust current floor if needed
    if (currentFloor >= sceneConfig.floors - 1) {
      setCurrentFloor(Math.max(0, sceneConfig.floors - 2))
    }
  }

  const handleFloorNameChange = (floorNumber: number, newName: string) => {
    setFloorNames({ ...floorNames, [floorNumber]: newName })
  }

  const getFloorMarkerCount = (floorNumber: number) => {
    return markers.filter((m) => m.floor === floorNumber).length
  }

  const handleSave = () => {
    const saveData = { markers, sceneConfig, floorNames }
    console.log("Guardando configuración:", saveData)

    // Create downloadable JSON
    const dataStr = JSON.stringify(saveData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `mapa-3d-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)

    alert("Mapa guardado exitosamente!")
  }

  const handleReset = () => {
    if (confirm("¿Estás seguro de resetear el mapa? Se perderán todos los cambios.")) {
      setMarkers([])
      setSelectedMarkerId(null)
      setCurrentFloor(0)
      setFloorNames({ 0: "Planta Baja" })
      setSceneConfig({
        type: "indoor",
        floors: 1,
        floorHeight: 4,
        dimensions: { width: 40, depth: 30 },
        lighting: "indoor",
        groundTexture: "concrete",
      })
    }
  }

  const handleLoad = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string)
          if (data.markers) setMarkers(data.markers)
          if (data.sceneConfig) setSceneConfig(data.sceneConfig)
          if (data.floorNames) setFloorNames(data.floorNames)
          setCurrentFloor(0) // Reset to ground floor after loading
          alert("Mapa cargado exitosamente!")
        } catch (error) {
          alert("Error al cargar el archivo. Asegúrate de que sea un archivo JSON válido.")
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const selectedMarker = markers.find((m) => m.id === selectedMarkerId) || null

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Panel Lateral Izquierdo */}
      <div className="w-80 bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Editor de Mapa 3D</h2>

        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Gestión de Pisos</h3>
            <button
              onClick={handleAddFloor}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md flex items-center text-sm"
              title="Agregar nuevo piso"
            >
              <Plus size={16} className="mr-1" /> Piso
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {Array.from({ length: sceneConfig.floors }, (_, i) => i).map((floorNum) => (
              <div
                key={floorNum}
                className={`p-3 rounded-md border-2 transition-all ${
                  currentFloor === floorNum
                    ? "bg-blue-600 border-blue-400"
                    : "bg-gray-600 border-gray-500 hover:bg-gray-550"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <button onClick={() => setCurrentFloor(floorNum)} className="flex-1 text-left font-semibold">
                    {floorNames[floorNum] || `Piso ${floorNum}`}
                  </button>
                  {sceneConfig.floors > 1 && (
                    <button
                      onClick={() => handleRemoveFloor(floorNum)}
                      className="text-red-400 hover:text-red-300 ml-2"
                      title="Eliminar piso"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span>{getFloorMarkerCount(floorNum)} objetos</span>
                  {currentFloor === floorNum && (
                    <input
                      type="text"
                      value={floorNames[floorNum] || ""}
                      onChange={(e) => handleFloorNameChange(floorNum, e.target.value)}
                      onClick={(e) => e.stopPropagation()} // Prevent click from triggering floor change
                      className="bg-gray-700 border border-gray-500 rounded px-2 py-1 text-xs w-32"
                      placeholder="Nombre del piso"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 text-xs text-gray-400">
            <p>
              Piso actual:{" "}
              <span className="font-semibold text-white">{floorNames[currentFloor] || `Piso ${currentFloor}`}</span>
            </p>
            <p>
              Total de pisos: <span className="font-semibold text-white">{sceneConfig.floors}</span>
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Añadir Marcador:</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(MARKER_CATEGORIES).map(([category, items]) => (
              <div key={category} className="col-span-2">
                <span className="font-semibold text-gray-300">{category}</span>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  {items.map((item) => (
                    <button
                      key={item.type}
                      onClick={() => handleAddMarker(item.type)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md flex items-center justify-center text-xs"
                    >
                      <item.icon size={16} className="mr-1" /> {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Área Central 3D */}
      <div ref={containerRef} className="flex-1 relative">
        {selectedMarker && (
          <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-80 p-4 rounded-md shadow-lg z-10 w-72 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-3">Propiedades del Marcador</h2>
            <div className="mb-2">
              <label className="block text-sm font-medium">Nombre:</label>
              <input
                type="text"
                value={selectedMarker.name}
                onChange={(e) => handleMarkerUpdate(selectedMarker.id, { name: e.target.value })}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Tipo:</label>
              <select
                value={selectedMarker.type}
                onChange={(e) => handleMarkerUpdate(selectedMarker.id, { type: e.target.value as any })}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(MARKER_CATEGORIES)
                  .flatMap(([_, items]) => items)
                  .map((item) => (
                    <option key={item.type} value={item.type}>
                      {item.label}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Color:</label>
              <input
                type="color"
                value={selectedMarker.color}
                onChange={(e) => handleMarkerUpdate(selectedMarker.id, { color: e.target.value })}
                className="w-full h-10 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div>
                <label className="block text-sm font-medium">Pos X:</label>
                <input
                  type="number"
                  step="0.1"
                  value={selectedMarker.position.x}
                  onChange={(e) =>
                    handleMarkerUpdate(selectedMarker.id, {
                      position: { ...selectedMarker.position, x: Number.parseFloat(e.target.value) },
                    })
                  }
                  className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Pos Y:</label>
                <input
                  type="number"
                  step="0.1"
                  value={selectedMarker.position.y}
                  onChange={(e) =>
                    handleMarkerUpdate(selectedMarker.id, {
                      position: { ...selectedMarker.position, y: Number.parseFloat(e.target.value) },
                    })
                  }
                  className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Pos Z:</label>
                <input
                  type="number"
                  step="0.1"
                  value={selectedMarker.position.z}
                  onChange={(e) =>
                    handleMarkerUpdate(selectedMarker.id, {
                      position: { ...selectedMarker.position, z: Number.parseFloat(e.target.value) },
                    })
                  }
                  className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div>
                <label className="block text-sm font-medium">Rot X:</label>
                <input
                  type="number"
                  step="0.01"
                  value={selectedMarker.rotation.x}
                  onChange={(e) =>
                    handleMarkerUpdate(selectedMarker.id, {
                      rotation: { ...selectedMarker.rotation, x: Number.parseFloat(e.target.value) },
                    })
                  }
                  className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Rot Y:</label>
                <input
                  type="number"
                  step="0.01"
                  value={selectedMarker.rotation.y}
                  onChange={(e) =>
                    handleMarkerUpdate(selectedMarker.id, {
                      rotation: { ...selectedMarker.rotation, y: Number.parseFloat(e.target.value) },
                    })
                  }
                  className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Rot Z:</label>
                <input
                  type="number"
                  step="0.01"
                  value={selectedMarker.rotation.z}
                  onChange={(e) =>
                    handleMarkerUpdate(selectedMarker.id, {
                      rotation: { ...selectedMarker.rotation, z: Number.parseFloat(e.target.value) },
                    })
                  }
                  className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {isCapacityElement(selectedMarker.type) && (
              <div className="mb-2">
                <label className="block text-sm font-medium">Capacidad:</label>
                <input
                  type="number"
                  value={selectedMarker.capacity}
                  onChange={(e) => handleMarkerUpdate(selectedMarker.id, { capacity: Number.parseInt(e.target.value) })}
                  className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium">Descripción:</label>
              <textarea
                rows={3}
                value={selectedMarker.description}
                onChange={(e) => handleMarkerUpdate(selectedMarker.id, { description: e.target.value })}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleMarkerDuplicate}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md flex items-center justify-center"
              >
                <Copy size={16} className="mr-1" /> Duplicar
              </button>
              <button
                onClick={handleMarkerDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md flex items-center justify-center"
              >
                <Trash2 size={16} className="mr-1" /> Eliminar
              </button>
            </div>
          </div>
        )}
        {showSceneConfig && (
          <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-80 p-4 rounded-md shadow-lg z-10 w-72">
            <h2 className="text-xl font-bold mb-3">Configuración de Escena</h2>
            <div className="mb-2">
              <label className="block text-sm font-medium">Tipo:</label>
              <select
                value={sceneConfig.type}
                onChange={(e) => handleSceneConfigUpdate({ type: e.target.value as any })}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="indoor">Interior</option>
                <option value="outdoor">Exterior</option>
                <option value="hybrid">Híbrido</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Pisos:</label>
              <input
                type="number"
                min="1"
                value={sceneConfig.floors}
                onChange={(e) => handleSceneConfigUpdate({ floors: Number.parseInt(e.target.value) })}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Altura Piso:</label>
              <input
                type="number"
                step="0.1"
                value={sceneConfig.floorHeight}
                onChange={(e) => handleSceneConfigUpdate({ floorHeight: Number.parseFloat(e.target.value) })}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Ancho:</label>
              <input
                type="number"
                step="1"
                value={sceneConfig.dimensions.width}
                onChange={(e) =>
                  handleSceneConfigUpdate({
                    dimensions: { ...sceneConfig.dimensions, width: Number.parseFloat(e.target.value) },
                  })
                }
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Profundidad:</label>
              <input
                type="number"
                step="1"
                value={sceneConfig.dimensions.depth}
                onChange={(e) =>
                  handleSceneConfigUpdate({
                    dimensions: { ...sceneConfig.dimensions, depth: Number.parseFloat(e.target.value) },
                  })
                }
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Iluminación:</label>
              <select
                value={sceneConfig.lighting}
                onChange={(e) => handleSceneConfigUpdate({ lighting: e.target.value as any })}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="indoor">Interior</option>
                <option value="day">Día</option>
                <option value="night">Noche</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Textura Suelo:</label>
              <select
                value={sceneConfig.groundTexture}
                onChange={(e) => handleSceneConfigUpdate({ groundTexture: e.target.value as any })}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="concrete">Concreto</option>
                <option value="grass">Pasto</option>
                <option value="wood">Madera</option>
                <option value="tile">Baldosa</option>
                <option value="carpet">Alfombra</option>
              </select>
            </div>
            <button
              onClick={() => setShowSceneConfig(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md w-full mt-4"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>

      {/* Botones de acción global */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-3 z-10">
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white font-bold p-3 rounded-full shadow-lg flex items-center justify-center"
          title="Guardar Mapa"
        >
          <Save size={24} />
        </button>
        <button
          onClick={handleLoad}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-full shadow-lg flex items-center justify-center"
          title="Cargar Mapa"
        >
          <Upload size={24} />
        </button>
        <button
          onClick={handleReset}
          className="bg-red-600 hover:bg-red-700 text-white font-bold p-3 rounded-full shadow-lg flex items-center justify-center"
          title="Resetear Mapa"
        >
          <Trash2 size={24} />
        </button>
        <button
          onClick={() => setShowSceneConfig(!showSceneConfig)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold p-3 rounded-full shadow-lg flex items-center justify-center"
          title="Configuración de Escena"
        >
          <Settings size={24} />
        </button>
      </div>
    </div>
  )
}
