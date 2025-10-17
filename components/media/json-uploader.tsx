"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, FileJson, Download } from "lucide-react"
import toast from "react-hot-toast"

interface JsonUploaderProps {
  label: string
  value?: string
  onChange: (jsonString: string) => void
  onRemove?: () => void
  placeholder?: string
}

export function JsonUploader({ label, value, onChange, onRemove, placeholder }: JsonUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [fileName, setFileName] = useState<string>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".json")) {
      toast.error("Por favor selecciona un archivo JSON válido")
      return
    }

    setUploading(true)

    try {
      const text = await file.text()
      const json = JSON.parse(text) // Validate JSON
      onChange(JSON.stringify(json))
      setFileName(file.name)
      toast.success("JSON cargado exitosamente")
    } catch (error) {
      console.error("Error parsing JSON:", error)
      toast.error("Error: El archivo no es un JSON válido")
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setFileName(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (onRemove) {
      onRemove()
    }
  }

  const handleDownload = () => {
    if (!value) return

    const blob = new Blob([value], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName || "data.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#ffddff]">{label}</label>

      {value && fileName ? (
        <div className="flex items-center gap-3 p-4 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg">
          <FileJson className="w-8 h-8 text-[#f1c6ff]" />
          <div className="flex-1">
            <p className="text-sm font-medium text-[#ffddff]">{fileName}</p>
            <p className="text-xs text-[#78767b]">JSON cargado</p>
          </div>
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-[#f1c6ff]/10 rounded-lg transition-colors"
            title="Descargar JSON"
          >
            <Download className="w-4 h-4 text-[#f1c6ff]" />
          </button>
          <button
            onClick={handleRemove}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Eliminar"
          >
            <X className="w-4 h-4 text-red-400" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#f1c6ff]/30 rounded-lg p-6 text-center cursor-pointer hover:border-[#f1c6ff]/60 hover:bg-[#f1c6ff]/5 transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
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
                <FileJson className="w-8 h-8 text-[#f1c6ff]" />
                <p className="text-sm text-[#e2e2e2]">Click para subir archivo JSON</p>
                {placeholder && <p className="text-xs text-[#78767b]">{placeholder}</p>}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
