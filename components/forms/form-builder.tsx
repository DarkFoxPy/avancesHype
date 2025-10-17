"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react"
import type { FormField } from "@/lib/types"

interface FormBuilderProps {
  fields: FormField[]
  onChange: (fields: FormField[]) => void
}

const fieldTypes = [
  { value: "text", label: "Texto corto" },
  { value: "textarea", label: "Texto largo" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Teléfono" },
  { value: "number", label: "Número" },
  { value: "select", label: "Selección única" },
  { value: "checkbox", label: "Casillas de verificación" },
  { value: "radio", label: "Opción única" },
  { value: "date", label: "Fecha" },
]

export function FormBuilder({ fields, onChange }: FormBuilderProps) {
  const [expandedField, setExpandedField] = useState<string | null>(null)

  const addField = () => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type: "text",
      label: "Nueva pregunta",
      required: false,
      order: fields.length,
    }
    onChange([...fields, newField])
    setExpandedField(newField.id)
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    onChange(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
  }

  const deleteField = (id: string) => {
    onChange(fields.filter((field) => field.id !== id))
  }

  const moveField = (id: string, direction: "up" | "down") => {
    const index = fields.findIndex((f) => f.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === fields.length - 1)) {
      return
    }

    const newFields = [...fields]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    ;[newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]]

    // Update order
    newFields.forEach((field, idx) => {
      field.order = idx
    })

    onChange(newFields)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Formulario personalizado</h3>
        <Button onClick={addField} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Agregar pregunta
        </Button>
      </div>

      {fields.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p>No hay preguntas en el formulario.</p>
          <p className="text-sm mt-2">Haz clic en "Agregar pregunta" para comenzar.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => moveField(field.id, "up")}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => moveField(field.id, "down")}
                    disabled={index === fields.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Pregunta</Label>
                      <Input
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        placeholder="Escribe tu pregunta"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de campo</Label>
                      <Select
                        value={field.type}
                        onValueChange={(value) => updateField(field.id, { type: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {(field.type === "select" || field.type === "checkbox" || field.type === "radio") && (
                    <div className="space-y-2">
                      <Label>Opciones (una por línea)</Label>
                      <Textarea
                        value={field.options?.join("\n") || ""}
                        onChange={(e) =>
                          updateField(field.id, {
                            options: e.target.value.split("\n").filter((o) => o.trim()),
                          })
                        }
                        placeholder="Opción 1&#10;Opción 2&#10;Opción 3"
                        rows={4}
                      />
                    </div>
                  )}

                  {field.type === "text" && (
                    <div className="space-y-2">
                      <Label>Placeholder (opcional)</Label>
                      <Input
                        value={field.placeholder || ""}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        placeholder="Texto de ejemplo"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={field.required}
                      onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                    />
                    <Label>Campo obligatorio</Label>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteField(field.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
