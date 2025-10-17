"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import toast from "react-hot-toast"

interface ImageUploaderProps {
  label: string
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  accept?: string
  maxSizeMB?: number
}

export function ImageUploader({
  label,
  value,
  onChange,
  onRemove,
  accept = "image/*",
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | undefined>(value)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      toast.error(`El archivo debe ser menor a ${maxSizeMB}MB`)
      return
    }

    setUploading(true)

    try {
      // Convert to base64 for preview and storage
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setPreview(base64String)
        onChange(base64String)
        toast.success("Imagen cargada exitosamente")
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Error al cargar la imagen")
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (onRemove) {
      onRemove()
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#ffddff]">{label}</label>

      {preview ? (
        <div className="relative group">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-[#f1c6ff]/20"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500/90 hover:bg-red-600 rounded-full transition-colors opacity-0 group-hover:opacity-100"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#f1c6ff]/30 rounded-lg p-8 text-center cursor-pointer hover:border-[#f1c6ff]/60 hover:bg-[#f1c6ff]/5 transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <>
                <div className="w-8 h-8 border-2 border-[#f1c6ff] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[#e2e2e2]">Cargando...</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-[#f1c6ff]" />
                <p className="text-sm text-[#e2e2e2]">Click para subir imagen</p>
                <p className="text-xs text-[#78767b]">Máximo {maxSizeMB}MB</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
