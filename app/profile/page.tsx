"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useEventsStore } from "@/lib/stores/events-store"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { GlassCard } from "@/components/ui/glass-card"
import { FuturisticBackground } from "@/components/futuristic-background"
import { User, Mail, AtSign, Edit2, Save, Calendar, Users, Phone, X } from "lucide-react"
import toast from "react-hot-toast"
import { ImageUploader } from "@/components/media/image-uploader"

export default function ProfilePage() {
  const router = useRouter()
  const { isAuthenticated, user, updateProfile } = useAuthStore()
  const { events } = useEventsStore()
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
    socialLinks: {
      twitter: user?.socialLinks?.twitter || "",
      twitterUrl: user?.socialLinks?.twitterUrl || "",
      linkedin: user?.socialLinks?.linkedin || "",
      linkedinUrl: user?.socialLinks?.linkedinUrl || "",
      instagram: user?.socialLinks?.instagram || "",
      instagramUrl: user?.socialLinks?.instagramUrl || "",
      facebook: user?.socialLinks?.facebook || "",
      facebookUrl: user?.socialLinks?.facebookUrl || "",
    },
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        bio: user.bio || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
        socialLinks: {
          twitter: user.socialLinks?.twitter || "",
          twitterUrl: user.socialLinks?.twitterUrl || "",
          linkedin: user.socialLinks?.linkedin || "",
          linkedinUrl: user.socialLinks?.linkedinUrl || "",
          instagram: user.socialLinks?.instagram || "",
          instagramUrl: user.socialLinks?.instagramUrl || "",
          facebook: user.socialLinks?.facebook || "",
          facebookUrl: user.socialLinks?.facebookUrl || "",
        },
      })
    }
  }, [user])

  if (!isAuthenticated || !user) {
    return null
  }

  const myEvents = events.filter((event) => event.organizerId === user.id)
  const totalAttendees = myEvents.reduce((acc, event) => acc + event.registrations, 0)

  const handleSave = () => {
    console.log("[v0] Saving profile:", formData)
    updateProfile(formData)
    setIsEditing(false)
    toast.success("Perfil actualizado exitosamente")
  }

  return (
    <FuturisticBackground>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 lg:ml-64">
          <Header />

          <main className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <GlassCard className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#f1c6ff]/10 via-[#ffddff]/10 to-[#f1c6ff]/10" />
              <div className="relative flex flex-col md:flex-row items-center gap-6">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt={user.name}
                  className="w-32 h-32 rounded-full ring-4 ring-[#f1c6ff]/50"
                />
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-[#ffddff] mb-2">{user.name}</h1>
                  <p className="text-[#e2e2e2] mb-4">@{user.username}</p>
                  {user.bio && <p className="text-[#ffddff]">{user.bio}</p>}
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-3 rounded-lg border-2 border-[#f1c6ff] text-[#ffddff] hover:bg-[#f1c6ff]/10 transition-all flex items-center gap-2"
                >
                  {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                  {isEditing ? "Cancelar" : "Editar Perfil"}
                </button>
              </div>
            </GlassCard>

            {/* Edit Form */}
            {isEditing && (
              <GlassCard glow="primary">
                <h2 className="text-xl font-bold text-[#ffddff] mb-4">Editar Información</h2>
                <div className="space-y-4">
                  <ImageUploader
                    label="Foto de Perfil"
                    value={formData.avatar}
                    onChange={(url) => setFormData({ ...formData, avatar: url })}
                    onRemove={() => setFormData({ ...formData, avatar: "" })}
                    maxSizeMB={2}
                  />

                  <div>
                    <label className="block text-sm font-medium text-[#ffddff] mb-2">Nombre</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#78767b]" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1c6ff]/50 text-[#ffddff]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#ffddff] mb-2">Usuario</label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#78767b]" />
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1c6ff]/50 text-[#ffddff]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#ffddff] mb-2">Teléfono</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#78767b]" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1c6ff]/50 text-[#ffddff]"
                        placeholder="+51 999 999 999"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#ffddff] mb-2">Biografía</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1c6ff]/50 text-[#ffddff] resize-none"
                      placeholder="Cuéntanos sobre ti..."
                    />
                  </div>

                  <div className="pt-4 border-t border-[#f1c6ff]/20">
                    <h3 className="text-lg font-bold text-[#ffddff] mb-4">Redes Sociales</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Twitter/X</label>
                          <input
                            type="text"
                            value={formData.socialLinks.twitter}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                              })
                            }
                            className="w-full px-4 py-2 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1c6ff]/50 text-[#ffddff]"
                            placeholder="@usuario"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#e2e2e2] mb-2">URL Twitter</label>
                          <input
                            type="url"
                            value={formData.socialLinks.twitterUrl}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                socialLinks: { ...formData.socialLinks, twitterUrl: e.target.value },
                              })
                            }
                            className="w-full px-4 py-2 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1c6ff]/50 text-[#ffddff]"
                            placeholder="https://twitter.com/..."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#e2e2e2] mb-2">LinkedIn</label>
                          <input
                            type="text"
                            value={formData.socialLinks.linkedin}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                              })
                            }
                            className="w-full px-4 py-2 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1c6ff]/50 text-[#ffddff]"
                            placeholder="@usuario"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#e2e2e2] mb-2">URL LinkedIn</label>
                          <input
                            type="url"
                            value={formData.socialLinks.linkedinUrl}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                socialLinks: { ...formData.socialLinks, linkedinUrl: e.target.value },
                              })
                            }
                            className="w-full px-4 py-2 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1c6ff]/50 text-[#ffddff]"
                            placeholder="https://linkedin.com/in/..."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Instagram</label>
                          <input
                            type="text"
                            value={formData.socialLinks.instagram}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                              })
                            }
                            className="w-full px-4 py-2 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1c6ff]/50 text-[#ffddff]"
                            placeholder="@usuario"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#e2e2e2] mb-2">URL Instagram</label>
                          <input
                            type="url"
                            value={formData.socialLinks.instagramUrl}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                socialLinks: { ...formData.socialLinks, instagramUrl: e.target.value },
                              })
                            }
                            className="w-full px-4 py-2 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1c6ff]/50 text-[#ffddff]"
                            placeholder="https://instagram.com/..."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Facebook</label>
                          <input
                            type="text"
                            value={formData.socialLinks.facebook}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                              })
                            }
                            className="w-full px-4 py-2 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1c6ff]/50 text-[#ffddff]"
                            placeholder="@usuario"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#e2e2e2] mb-2">URL Facebook</label>
                          <input
                            type="url"
                            value={formData.socialLinks.facebookUrl}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                socialLinks: { ...formData.socialLinks, facebookUrl: e.target.value },
                              })
                            }
                            className="w-full px-4 py-2 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1c6ff]/50 text-[#ffddff]"
                            placeholder="https://facebook.com/..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] font-medium hover:shadow-[0_0_30px_rgba(241,198,255,0.6)] transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </button>
                </div>
              </GlassCard>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard hover glow="primary">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#f1c6ff] to-[#ffddff]">
                    <Calendar className="w-6 h-6 text-[#1e1732]" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#ffddff]">{myEvents.length}</p>
                    <p className="text-sm text-[#e2e2e2]">Eventos Creados</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard hover glow="secondary">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#f1c6ff] to-[#ffddff]">
                    <Users className="w-6 h-6 text-[#1e1732]" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#ffddff]">{totalAttendees}</p>
                    <p className="text-sm text-[#e2e2e2]">Total Asistentes</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Account Info */}
            <GlassCard>
              <h2 className="text-xl font-bold text-[#ffddff] mb-4">Información de Cuenta</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1e1732]/50">
                  <Mail className="w-5 h-5 text-[#78767b]" />
                  <div>
                    <p className="text-xs text-[#78767b]">Email</p>
                    <p className="text-[#ffddff]">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1e1732]/50">
                  <Calendar className="w-5 h-5 text-[#78767b]" />
                  <div>
                    <p className="text-xs text-[#78767b]">Miembro desde</p>
                    <p className="text-[#ffddff]">
                      {new Date(user.createdAt).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </main>
        </div>
      </div>
    </FuturisticBackground>
  )
}
