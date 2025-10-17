"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import type { FormField } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface FormRendererProps {
  fields: FormField[]
  eventId: string
  eventEnded: boolean
  onSubmit?: () => void
}

export function FormRenderer({ fields, eventId, eventEnded, onSubmit }: FormRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const missingFields = fields.filter((field) => field.required && !formData[field.id]).map((field) => field.label)

    if (missingFields.length > 0) {
      toast({
        title: "Campos requeridos",
        description: `Por favor completa: ${missingFields.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/form-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          responseData: formData,
        }),
      })

      if (!response.ok) throw new Error("Error al enviar el formulario")

      toast({
        title: "Formulario enviado",
        description: "Tu respuesta ha sido registrada exitosamente.",
      })

      setFormData({})
      onSubmit?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el formulario. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  if (fields.length === 0) {
    return null
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Formulario de registro</h3>
          <p className="text-sm text-muted-foreground">
            Por favor completa la siguiente información para registrarte en el evento.
          </p>
        </div>

        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>

              {field.type === "text" && (
                <Input
                  value={formData[field.id] || ""}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  disabled={eventEnded}
                />
              )}

              {field.type === "textarea" && (
                <Textarea
                  value={formData[field.id] || ""}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  disabled={eventEnded}
                  rows={4}
                />
              )}

              {field.type === "email" && (
                <Input
                  type="email"
                  value={formData[field.id] || ""}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  disabled={eventEnded}
                />
              )}

              {field.type === "phone" && (
                <Input
                  type="tel"
                  value={formData[field.id] || ""}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  disabled={eventEnded}
                />
              )}

              {field.type === "number" && (
                <Input
                  type="number"
                  value={formData[field.id] || ""}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  disabled={eventEnded}
                />
              )}

              {field.type === "date" && (
                <Input
                  type="date"
                  value={formData[field.id] || ""}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  required={field.required}
                  disabled={eventEnded}
                />
              )}

              {field.type === "select" && (
                <Select
                  value={formData[field.id] || ""}
                  onValueChange={(value) => updateField(field.id, value)}
                  disabled={eventEnded}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === "radio" && (
                <RadioGroup
                  value={formData[field.id] || ""}
                  onValueChange={(value) => updateField(field.id, value)}
                  disabled={eventEnded}
                >
                  {field.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                      <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {field.type === "checkbox" && (
                <div className="space-y-2">
                  {field.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${field.id}-${option}`}
                        checked={Array.isArray(formData[field.id]) && formData[field.id].includes(option)}
                        onCheckedChange={(checked) => {
                          const current = Array.isArray(formData[field.id]) ? formData[field.id] : []
                          if (checked) {
                            updateField(field.id, [...current, option])
                          } else {
                            updateField(
                              field.id,
                              current.filter((v: string) => v !== option),
                            )
                          }
                        }}
                        disabled={eventEnded}
                      />
                      <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <Button type="submit" disabled={isSubmitting || eventEnded} className="w-full">
          {eventEnded ? "El evento ha finalizado" : isSubmitting ? "Enviando..." : "Enviar formulario"}
        </Button>
      </form>
    </Card>
  )
}
