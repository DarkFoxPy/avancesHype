"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useEventsStore } from "@/lib/stores/events-store"

export default function FormResponsesPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { events } = useEventsStore()
  const [responses, setResponses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const event = events.find((e) => e.id === params.id)

  useEffect(() => {
    fetchResponses()
  }, [params.id])

  const fetchResponses = async () => {
    try {
      const response = await fetch(`/api/form-responses?eventId=${params.id}`)
      if (!response.ok) throw new Error("Error al cargar respuestas")
      const data = await response.json()
      setResponses(data.responses || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las respuestas.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await fetch(`/api/form-responses/export?eventId=${params.id}`)
      if (!response.ok) throw new Error("Error al exportar")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `respuestas-${event?.title || "evento"}-${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Exportado",
        description: "Las respuestas se han descargado exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo exportar el archivo.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Evento no encontrado</p>
      </div>
    )
  }

  const formFields = event.custom_form_fields || []

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/events/${params.slug}/${params.id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al evento
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Respuestas del formulario</h1>
            <p className="text-muted-foreground">{event.title}</p>
          </div>
        </div>
        <Button onClick={handleExport} disabled={isExporting || responses.length === 0}>
          {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
          Exportar CSV
        </Button>
      </div>

      {responses.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p>No hay respuestas aún.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Total de respuestas: {responses.length}</p>
          {responses.map((response, index) => (
            <Card key={response.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Respuesta #{index + 1}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(response.submitted_at).toLocaleString("es-ES")}
                </p>
              </div>
              <div className="space-y-3">
                {formFields.map((field: any) => (
                  <div key={field.id}>
                    <p className="text-sm font-medium text-muted-foreground">{field.label}</p>
                    <p className="mt-1">
                      {Array.isArray(response.response_data[field.id])
                        ? response.response_data[field.id].join(", ")
                        : response.response_data[field.id] || "-"}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
