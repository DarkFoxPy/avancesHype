"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

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
      const chair = createChair(isVIP ? "#ffd700" : color)
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

function createVIPArea(color: string): THREE.Group {
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
}

function createInfoBooth(color: string): THREE.Group {
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
}

// ============================================================================
// FUNCIÓN PRINCIPAL PARA CREAR OBJETOS 3D
// ============================================================================

const getMarkerGeometry = (type: string, color: string): THREE.Group => {
  switch (type) {
    case "entrance":
      return createDoor(color, true)
    case "exit":
    case "emergency_exit":
      return createDoor(color, false)
    case "stage":
      return createStage(color)
    case "bar":
      return createBar(color)
    case "food":
      return createFoodStall(color)
    case "bathroom":
      return createBathroom(color, false)
    case "accessible_bathroom":
      return createBathroom(color, true)
    case "seating":
      return createSeatingArea(color, false)
    case "vip_seating":
      return createSeatingArea(color, true)
    case "vip_area":
      return createVIPArea(color)
    case "info":
      return createInfoBooth(color)
    case "booth":
    case "sponsor_booth":
    case "info_booth":
      return createBoothTable(color)
        case "parking":
      const parkingGroup = new THREE.Group()
      const car1 = createCar("#0066cc")
      car1.position.set(-1.5, 0, 0)
      parkingGroup.add(car1)
      const car2 = createCar("#ff0000")
      car2.position.set(1.5, 0, 0)
      parkingGroup.add(car2)
      return parkingGroup
    case "medical":
      return createMedicalStation(color)
    case "security":
      return createSecurityPost(color)
    case "charging_station":
      return createChargingStation(color)
    case "atm":
      return createATM(color)
    case "elevator":
      return createElevator(color)
    case "stairs":
      return createStairs(color)
    default:
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
// COMPONENTE PRINCIPAL
// ============================================================================

interface PreviewMarker {
  id: string
  type: string
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  color: string
  name: string
}

export default function LandingMapPreview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
const animationRef = useRef<number | undefined>(undefined)
  const markerMeshesRef = useRef<THREE.Group[]>([])

  // Marcadores de ejemplo para la preview
  const markers: PreviewMarker[] = [
    { 
      id: "1", 
      type: "stage", 
      position: { x: 0, y: 0, z: 0 }, 
      rotation: { x: 0, y: 0, z: 0 }, 
      color: MARKER_COLORS.stage,
      name: "Escenario Principal"
    },
    { 
      id: "2", 
      type: "bar", 
      position: { x: 10, y: 0, z: -8 }, 
      rotation: { x: 0, y: Math.PI/2, z: 0 }, 
      color: MARKER_COLORS.bar,
      name: "Bar Principal"
    },
    { 
      id: "3", 
      type: "food", 
      position: { x: -10, y: 0, z: -8 }, 
      rotation: { x: 0, y: -Math.PI/2, z: 0 }, 
      color: MARKER_COLORS.food,
      name: "Puesto de Comida"
    },
    { 
      id: "4", 
      type: "seating", 
      position: { x: 0, y: 0, z: 12 }, 
      rotation: { x: 0, y: Math.PI, z: 0 }, 
      color: MARKER_COLORS.seating,
      name: "Área de Asientos"
    },
    { 
      id: "5", 
      type: "vip_area", 
      position: { x: -12, y: 0, z: 8 }, 
      rotation: { x: 0, y: Math.PI/4, z: 0 }, 
      color: MARKER_COLORS.vip_area,
      name: "Área VIP"
    },
    { 
      id: "6", 
      type: "info", 
      position: { x: 12, y: 0, z: 8 }, 
      rotation: { x: 0, y: -Math.PI/4, z: 0 }, 
      color: MARKER_COLORS.info,
      name: "Punto de Información"
    },
    { 
      id: "7", 
      type: "entrance", 
      position: { x: 0, y: 0, z: -15 }, 
      rotation: { x: 0, y: 0, z: 0 }, 
      color: MARKER_COLORS.entrance,
      name: "Entrada Principal"
    },
    { 
      id: "8", 
      type: "bathroom", 
      position: { x: -15, y: 0, z: -5 }, 
      rotation: { x: 0, y: Math.PI/2, z: 0 }, 
      color: MARKER_COLORS.bathroom,
      name: "Baños"
    },
    { 
      id: "9", 
      type: "booth", 
      position: { x: 15, y: 0, z: -5 }, 
      rotation: { x: 0, y: -Math.PI/2, z: 0 }, 
      color: MARKER_COLORS.booth,
      name: "Stand General"
    },
  ]

  useEffect(() => {
    if (!containerRef.current) return

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a2e)
    scene.fog = new THREE.Fog(0x1a1a2e, 30, 80)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(25, 20, 25)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

// Estilos del canvas
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(15, 25, 15)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.left = -20
    directionalLight.shadow.camera.right = 20
    directionalLight.shadow.camera.top = 20
    directionalLight.shadow.camera.bottom = -20
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    scene.add(directionalLight)

    // Point lights para mejor iluminación
    const pointLight1 = new THREE.PointLight(0xffa500, 0.4, 50)
    pointLight1.position.set(10, 8, 10)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x0066ff, 0.3, 50)
    pointLight2.position.set(-10, 8, -10)
    scene.add(pointLight2)

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(50, 40)
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x404040,
      roughness: 0.8,
      metalness: 0.2,
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    // Grid helper
    const gridHelper = new THREE.GridHelper(50, 25, 0x444444, 0x222222)
    gridHelper.position.y = 0.01
    scene.add(gridHelper)

    // Create marker objects
    markers.forEach(marker => {
      const object3D = getMarkerGeometry(marker.type, marker.color)
      object3D.position.set(marker.position.x, marker.position.y, marker.position.z)
      object3D.rotation.set(marker.rotation.x, marker.rotation.y, marker.rotation.z)
      
      // Habilitar sombras para todos los objetos
      object3D.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
      
      scene.add(object3D)
      markerMeshesRef.current.push(object3D)
    })

// Animation - Rotación continua
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      // Rotación de la cámara alrededor del centro
      if (cameraRef.current) {
        const time = Date.now() * 0.0003 // Velocidad de rotación
        const radius = 30
        cameraRef.current.position.x = Math.cos(time) * radius
        cameraRef.current.position.z = Math.sin(time) * radius
        cameraRef.current.position.y = 15 + Math.sin(time * 0.5) * 3
        cameraRef.current.lookAt(0, 0, 0)
      }

      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      rendererRef.current?.dispose()
if (containerRef.current && rendererRef.current?.domElement && containerRef.current.contains(rendererRef.current.domElement)) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
    }
  }, [])

return (
    <div 
      ref={containerRef} 
      className="w-full h-full rounded-2xl overflow-hidden relative bg-gradient-to-br from-[#f1c6ff]/10 via-[#ffddff]/5 to-[#f1c6ff]/10"
    >
      <div className="absolute bottom-4 left-4 bg-[#1e1732]/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-[#f1c6ff]/30 z-10 pointer-events-none">
        <p className="text-[#f1c6ff] text-sm font-medium">Demo Interactiva - Editor 3D</p>
      </div>
      
      {/* Overlay de instrucciones */}
      <div className="absolute top-4 right-4 bg-[#1e1732]/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-[#f1c6ff]/30 z-10 pointer-events-none">
        <p className="text-[#ffddff] text-xs">Cámara girando automáticamente</p>
      </div>
    </div>
  )
}
