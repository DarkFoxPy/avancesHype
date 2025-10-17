"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, ImageIcon, Video } from "lucide-react"
import toast from "react-hot-toast"

interface GalleryUploaderProps {
  label: string
  images?: string[]
  videos?: string[]
  onImagesChange: (urls: string[]) => void
  onVideosChange: (urls: string[]) => void
  maxImages?: number
  maxVideos?: number
  maxSizeMB?: number
}

export function GalleryUploader({
  label,
  images = [],
  videos = [],
  onImagesChange,
  onVideosChange,
  maxImages = 10,
  maxVideos = 5,
  maxSizeMB = 10,
}: GalleryUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    if (images.length + files.length > maxImages) {
      toast.error(`Máximo ${maxImages} imágenes permitidas`)
      return
    }

    setUploading(true)

    try {
      const newImages: string[] = []

      for (const file of files) {
        const fileSizeMB = file.size / (1024 * 1024)
        if (fileSizeMB > maxSizeMB) {
          toast.error(`${file.name} es muy grande (máx ${maxSizeMB}MB)`)
          continue
        }

        const reader = new FileReader()
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })

        const base64 = await base64Promise
        newImages.push(base64)
      }

      onImagesChange([...images, ...newImages])
      toast.success(`${newImages.length} imagen(es) agregada(s)`)
    } catch (error) {
      console.error("Error uploading images:", error)
      toast.error("Error al cargar imágenes")
    } finally {
      setUploading(false)
      if (imageInputRef.current) {
        imageInputRef.current.value = ""
      }
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    if (videos.length + files.length > maxVideos) {
      toast.error(`Máximo ${maxVideos} videos permitidos`)
      return
    }

    setUploading(true)

    try {
      const newVideos: string[] = []

      for (const file of files) {
        const fileSizeMB = file.size / (1024 * 1024)
        if (fileSizeMB > maxSizeMB) {
          toast.error(`${file.name} es muy grande (máx ${maxSizeMB}MB)`)
          continue
        }

        const reader = new FileReader()
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })

        const base64 = await base64Promise
        newVideos.push(base64)
      }

      onVideosChange([...videos, ...newVideos])
      toast.success(`${newVideos.length} video(s) agregado(s)`)
    } catch (error) {
      console.error("Error uploading videos:", error)
      toast.error("Error al cargar videos")
    } finally {
      setUploading(false)
      if (videoInputRef.current) {
        videoInputRef.current.value = ""
      }
    }
  }

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
    toast.success("Imagen eliminada")
  }

  const removeVideo = (index: number) => {
    onVideosChange(videos.filter((_, i) => i !== index))
    toast.success("Video eliminado")
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-[#ffddff]">{label}</label>

      {/* Images Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-[#e2e2e2] flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Imágenes ({images.length}/{maxImages})
          </h4>
          <button
            onClick={() => imageInputRef.current?.click()}
            disabled={uploading || images.length >= maxImages}
            className="px-3 py-1.5 text-sm bg-[#f1c6ff]/20 hover:bg-[#f1c6ff]/30 text-[#ffddff] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Agregar Imágenes
          </button>
        </div>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img || "/placeholder.svg"}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-[#f1c6ff]/20"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1.5 bg-red-500/90 hover:bg-red-600 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Videos Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-[#e2e2e2] flex items-center gap-2">
            <Video className="w-4 h-4" />
            Videos ({videos.length}/{maxVideos})
          </h4>
          <button
            onClick={() => videoInputRef.current?.click()}
            disabled={uploading || videos.length >= maxVideos}
            className="px-3 py-1.5 text-sm bg-[#f1c6ff]/20 hover:bg-[#f1c6ff]/30 text-[#ffddff] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Agregar Videos
          </button>
        </div>

        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleVideoUpload}
          className="hidden"
        />

        {videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {videos.map((video, index) => (
              <div key={index} className="relative group">
                <video
                  src={video}
                  controls
                  className="w-full h-48 object-cover rounded-lg border border-[#f1c6ff]/20"
                />
                <button
                  onClick={() => removeVideo(index)}
                  className="absolute top-1 right-1 p-1.5 bg-red-500/90 hover:bg-red-600 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {uploading && (
        <div className="flex items-center justify-center gap-2 p-4 bg-[#f1c6ff]/10 rounded-lg">
          <div className="w-5 h-5 border-2 border-[#f1c6ff] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[#e2e2e2]">Cargando archivos...</span>
        </div>
      )}
    </div>
  )
}
