"use client"

import { useEffect, useState } from "react"
import {
  Sparkles,
  Zap,
  Globe,
  Users,
  Calendar,
  ArrowRight,
  Play,
  CheckCircle2,
  Menu,
  X,
  Rocket,
  Star,
} from "lucide-react"
import Link from "next/link"

export default function HypeLanding() {
  const [mounted, setMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrollY(window.scrollY)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1e1732] overflow-hidden">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-[#f1c6ff] border-t-transparent animate-spin" />
          <div className="absolute inset-0 w-24 h-24 rounded-full bg-[#f1c6ff] opacity-40 blur-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  const features = [
    {
      icon: Globe,
      title: "Editor 3D Interactivo",
      desc: "Diseña espacios de eventos en 3D con marcadores interactivos, entradas, salidas, escenarios y más.",
      color: "from-[#f1c6ff] to-[#ffddff]",
    },
    {
      icon: Users,
      title: "Gestión de Invitados",
      desc: "Administra registros, aprueba solicitudes y visualiza estadísticas en tiempo real de tus asistentes.",
      color: "from-[#ffddff] to-[#f1c6ff]",
    },
    {
      icon: Calendar,
      title: "Descubrimiento Fácil",
      desc: "Los usuarios pueden descubrir y registrarse a eventos con búsqueda avanzada y filtros inteligentes.",
      color: "from-[#f1c6ff] to-[#ffddff]",
    },
    {
      icon: Zap,
      title: "Diseño Futurista",
      desc: "Interfaz inmersiva con efectos glassmorphism, gradientes animados y transiciones suaves.",
      color: "from-[#ffddff] to-[#f1c6ff]",
    },
    {
      icon: Sparkles,
      title: "Experiencia Inmersiva",
      desc: "Visualización 3D pública para que los asistentes exploren el espacio del evento antes de llegar.",
      color: "from-[#f1c6ff] to-[#ffddff]",
    },
    {
      icon: CheckCircle2,
      title: "Fácil de Usar",
      desc: "Interfaz intuitiva que no requiere conocimientos técnicos. Crea eventos profesionales en minutos.",
      color: "from-[#ffddff] to-[#f1c6ff]",
    },
  ]

  const steps = [
    {
      step: "01",
      title: "Crea tu Evento",
      desc: "Completa la información básica: nombre, fecha, ubicación y capacidad. Nuestro formulario intuitivo te guía en cada paso.",
      icon: Rocket,
    },
    {
      step: "02",
      title: "Diseña el Espacio 3D",
      desc: "Usa nuestro editor 3D para crear el layout del evento. Agrega marcadores para entradas, salidas, escenarios, baños y áreas de comida.",
      icon: Globe,
    },
    {
      step: "03",
      title: "Publica y Gestiona",
      desc: "Comparte tu evento, recibe registros y gestiona invitados desde un dashboard completo con estadísticas en tiempo real.",
      icon: Zap,
    },
  ]

  return (
    <div className="min-h-screen bg-[#1e1732] text-[#e2e2e2] overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#f1c6ff] rounded-full opacity-20 blur-3xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#ffddff] rounded-full opacity-20 blur-3xl animate-float-delayed" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-[#f1c6ff] rounded-full opacity-15 blur-3xl animate-float-slow" />

        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#f1c6ff] rounded-full animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Cursor Glow */}
      <div
        className="fixed w-96 h-96 bg-[#f1c6ff] rounded-full opacity-10 blur-3xl pointer-events-none transition-all duration-300 ease-out z-50"
        style={{
          left: mousePos.x - 192,
          top: mousePos.y - 192,
        }}
      />

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50
            ? "bg-[#1e1732]/95 backdrop-blur-2xl border-b border-[#f1c6ff]/30 shadow-2xl shadow-[#f1c6ff]/10"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f1c6ff] to-[#ffddff] rotate-45 group-hover:rotate-[405deg] transition-all duration-700 ease-out" />
              <div className="absolute inset-0 w-10 h-10 rounded-xl bg-[#f1c6ff] opacity-40 blur-lg group-hover:opacity-70 group-hover:blur-xl transition-all duration-500" />
              <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-[#1e1732] animate-pulse" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-[#f1c6ff] via-[#ffddff] to-[#f1c6ff] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              HYPE
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Características", href: "#características" },
              { label: "Cómo Funciona", href: "#cómo-funciona" },
              { label: "Editor", href: "/editor" },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="text-[#e2e2e2] hover:text-[#f1c6ff] transition-all duration-300 relative group"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] group-hover:w-full transition-all duration-500" />
                <span className="absolute inset-0 bg-[#f1c6ff] opacity-0 group-hover:opacity-10 blur-xl transition-all duration-300 rounded-lg" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/editor">
              <button className="px-6 py-2.5 text-[#e2e2e2] hover:text-[#f1c6ff] transition-all duration-300 relative group">
                <span className="relative z-10">Probar Editor</span>
                <span className="absolute inset-0 border border-[#f1c6ff]/0 group-hover:border-[#f1c6ff]/50 rounded-full transition-all duration-300" />
              </button>
            </Link>
            <Link href="/editor">
              <button className="relative px-6 py-2.5 rounded-full bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] font-bold overflow-hidden group transform hover:scale-110 transition-all duration-300">
                <span className="relative z-10 flex items-center gap-2">
                  Comenzar
                  <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#ffddff] to-[#f1c6ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-[#f1c6ff] opacity-50 blur-xl group-hover:opacity-80 transition-all duration-300" />
              </button>
            </Link>
          </div>

          <button
            className="md:hidden text-[#e2e2e2] hover:text-[#f1c6ff] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1e1732]/98 backdrop-blur-2xl border-t border-[#f1c6ff]/30">
            <div className="container mx-auto px-6 py-6 space-y-4">
              {[
                { label: "Características", href: "#características" },
                { label: "Cómo Funciona", href: "#cómo-funciona" },
                { label: "Editor", href: "/editor" },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="block text-[#e2e2e2] hover:text-[#f1c6ff] transition-all duration-300 transform hover:translate-x-2"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 space-y-3">
                <Link href="/editor" className="block">
                  <button className="w-full px-6 py-2.5 text-[#e2e2e2] border border-[#f1c6ff]/30 rounded-full hover:bg-[#f1c6ff]/10 hover:border-[#f1c6ff] transition-all duration-300">
                    Probar Editor
                  </button>
                </Link>
                <Link href="/editor" className="block">
                  <button className="w-full px-6 py-2.5 rounded-full bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] font-bold transform hover:scale-105 transition-all duration-300">
                    Comenzar
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center space-y-8 mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#f1c6ff]/40 bg-[#f1c6ff]/5 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-[#f1c6ff] animate-spin-slow" />
              <span className="text-sm text-[#f1c6ff] font-medium">Visualización 3D Inmersiva</span>
              <Star className="w-4 h-4 text-[#ffddff] animate-pulse" />
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-tight">
              <span className="block text-[#e2e2e2]">Gestiona Eventos en</span>
              <span className="block bg-gradient-to-r from-[#f1c6ff] via-[#ffddff] to-[#f1c6ff] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Tres Dimensiones
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-[#78767b] max-w-3xl mx-auto leading-relaxed">
              La plataforma <span className="text-[#f1c6ff] font-semibold">futurista</span> que transforma la gestión de
              eventos con espacios 3D interactivos, diseño inmersivo y experiencias{" "}
              <span className="text-[#ffddff] font-semibold">inolvidables</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6">
              <Link href="/editor">
                <button className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] font-bold text-lg overflow-hidden transform hover:scale-110 hover:rotate-1 transition-all duration-500 shadow-2xl shadow-[#f1c6ff]/50 hover:shadow-[#f1c6ff]/70">
                  <span className="relative z-10 flex items-center gap-2">
                    Probar Editor 3D
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ffddff] to-[#f1c6ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] opacity-70 blur-lg group-hover:opacity-100 group-hover:blur-xl transition-all duration-500 animate-pulse" />
                </button>
              </Link>
              <Link href="/viewer">
                <button className="group px-8 py-4 rounded-full border-2 border-[#f1c6ff]/40 bg-[#1e1732]/50 backdrop-blur-sm text-[#e2e2e2] font-semibold text-lg hover:bg-[#f1c6ff]/20 hover:border-[#f1c6ff] transition-all duration-500 flex items-center gap-2 transform hover:scale-105">
                  <Play className="w-5 h-5 text-[#f1c6ff] group-hover:animate-pulse" />
                  Ver Demo
                </button>
              </Link>
            </div>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-[#f1c6ff]/30 to-[#ffddff]/30 blur-3xl animate-pulse-slow" />
            <div className="relative rounded-3xl border border-[#f1c6ff]/30 bg-gradient-to-br from-[#1e1732]/80 to-[#1e1732]/60 backdrop-blur-xl p-8 overflow-hidden transform hover:scale-[1.02] transition-all duration-700">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#f1c6ff] to-transparent animate-shimmer" />

              <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#f1c6ff]/10 via-[#ffddff]/5 to-[#f1c6ff]/10 overflow-hidden relative">
                <iframe src="/viewer" className="w-full h-full border-0" title="Vista Previa del Editor 3D" />
                <div className="absolute bottom-4 left-4 bg-[#1e1732]/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-[#f1c6ff]/30 pointer-events-none">
                  <p className="text-[#f1c6ff] text-sm font-medium">Vista Previa del Editor 3D</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="características" className="py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 mb-6">
              <Zap className="w-6 h-6 text-[#f1c6ff] animate-pulse" />
              <span className="text-sm text-[#f1c6ff] font-medium uppercase tracking-wider">Súper Poderes</span>
              <Zap className="w-6 h-6 text-[#ffddff] animate-pulse" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-[#f1c6ff] via-[#ffddff] to-[#f1c6ff] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Características Épicas
            </h2>
            <p className="text-[#78767b] text-xl">
              Todo lo que necesitas para crear eventos <span className="text-[#f1c6ff]">legendarios</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f1c6ff]/0 to-[#ffddff]/0 group-hover:from-[#f1c6ff]/20 group-hover:to-[#ffddff]/20 rounded-3xl transition-all duration-700 blur-xl" />
                <div className="relative h-full rounded-3xl border border-[#f1c6ff]/20 bg-gradient-to-br from-[#1e1732]/80 to-[#1e1732]/60 backdrop-blur-xl p-8 hover:border-[#f1c6ff]/60 transition-all duration-700 hover:transform hover:scale-[1.05] hover:-rotate-1 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#f1c6ff] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 relative`}
                  >
                    <feature.icon className="w-8 h-8 text-[#1e1732] relative z-10 group-hover:animate-bounce" />
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-50 blur-xl group-hover:opacity-100 transition-all duration-500`}
                    />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-[#e2e2e2] group-hover:text-[#f1c6ff] transition-all duration-500">
                    {feature.title}
                  </h3>
                  <p className="text-[#78767b] leading-relaxed group-hover:text-[#e2e2e2] transition-colors duration-500">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="cómo-funciona" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f1c6ff]/5 via-transparent to-[#ffddff]/5" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] bg-clip-text text-transparent">
              Tres Pasos Mágicos
            </h2>
            <p className="text-[#78767b] text-xl">
              Crea eventos <span className="text-[#f1c6ff] font-bold">increíbles</span> en minutos
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((item, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#f1c6ff]/20 to-[#ffddff]/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="relative rounded-3xl border border-[#f1c6ff]/20 bg-gradient-to-br from-[#1e1732]/80 to-[#1e1732]/60 backdrop-blur-xl p-10 hover:border-[#f1c6ff]/60 transition-all duration-700 flex gap-8 items-start overflow-hidden transform hover:scale-[1.02] hover:rotate-1">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#f1c6ff]/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative">
                    <div className="text-8xl font-black bg-gradient-to-br from-[#f1c6ff]/30 to-[#ffddff]/30 bg-clip-text text-transparent group-hover:from-[#f1c6ff] group-hover:to-[#ffddff] transition-all duration-700 group-hover:scale-110 transform">
                      {item.step}
                    </div>
                    <div className="absolute -top-4 -right-4">
                      <item.icon className="w-8 h-8 text-[#f1c6ff] opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500" />
                    </div>
                  </div>

                  <div className="flex-1 relative z-10">
                    <h3 className="text-3xl font-bold mb-4 text-[#e2e2e2] group-hover:text-[#f1c6ff] transition-all duration-500">
                      {item.title}
                    </h3>
                    <p className="text-[#78767b] text-lg leading-relaxed group-hover:text-[#e2e2e2] transition-colors duration-500">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#f1c6ff]/30 via-[#ffddff]/30 to-[#f1c6ff]/30 rounded-3xl blur-3xl animate-pulse" />
            <div className="relative rounded-3xl border-2 border-[#f1c6ff]/40 bg-gradient-to-br from-[#1e1732]/90 to-[#1e1732]/70 backdrop-blur-xl p-16 text-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#f1c6ff] to-transparent animate-shimmer" />

              <div className="relative z-10">
                <div className="flex justify-center gap-3 mb-6">
                  <Star className="w-8 h-8 text-[#f1c6ff] animate-pulse" />
                  <Star className="w-10 h-10 text-[#ffddff] animate-pulse" />
                  <Star className="w-8 h-8 text-[#f1c6ff] animate-pulse" />
                </div>

                <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-[#f1c6ff] via-[#ffddff] to-[#f1c6ff] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  ¡El Futuro es Ahora!
                </h2>
                <p className="text-[#78767b] text-xl mb-10 max-w-2xl mx-auto">
                  Únete a la <span className="text-[#f1c6ff] font-bold">revolución</span> de eventos 3D
                </p>
                <Link href="/editor">
                  <button className="group relative px-10 py-5 rounded-full bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] font-bold text-xl overflow-hidden transform hover:scale-110 transition-all duration-300">
                    <span className="relative z-10 flex items-center gap-2">
                      Comenzar Ahora
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-[#f1c6ff] opacity-50 blur-xl group-hover:opacity-80 transition-all" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#f1c6ff]/20 py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f1c6ff] to-[#ffddff] rotate-45" />
                <span className="font-bold text-xl text-[#e2e2e2]">HYPE</span>
              </div>
              <p className="text-[#78767b]">Gestión de eventos con visualización 3D inmersiva</p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-[#e2e2e2]">Producto</h4>
              <ul className="space-y-3 text-[#78767b]">
                <li>
                  <a href="#características" className="hover:text-[#f1c6ff] transition-colors">
                    Características
                  </a>
                </li>
                <li>
                  <Link href="/editor" className="hover:text-[#f1c6ff] transition-colors">
                    Editor
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-[#f1c6ff] transition-colors">
                    Precios
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-[#e2e2e2]">Empresa</h4>
              <ul className="space-y-3 text-[#78767b]">
                <li>
                  <a href="#" className="hover:text-[#f1c6ff] transition-colors">
                    Sobre Nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#f1c6ff] transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#f1c6ff] transition-colors">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-[#e2e2e2]">Legal</h4>
              <ul className="space-y-3 text-[#78767b]">
                <li>
                  <a href="#" className="hover:text-[#f1c6ff] transition-colors">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#f1c6ff] transition-colors">
                    Términos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#f1c6ff] transition-colors">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#f1c6ff]/20 text-center text-[#78767b]">
            <p>© 2025 HYPE. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(20px) translateX(-10px); }
        }
        @keyframes particle {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) scale(0); opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }
        
        .animate-gradient { animation: gradient 3s ease infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-particle { animation: particle linear infinite; }
        .animate-shimmer { animation: shimmer 2s linear infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
