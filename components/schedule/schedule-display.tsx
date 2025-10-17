"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Calendar, Clock, MapPin, User } from "lucide-react"
import type { ScheduleItem } from "@/lib/types"

interface ScheduleDisplayProps {
  schedule: ScheduleItem[]
  eventDurationDays: number
}

export function ScheduleDisplay({ schedule, eventDurationDays }: ScheduleDisplayProps) {
  if (!schedule || schedule.length === 0) {
    return (
      <GlassCard>
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Sin cronograma disponible</h3>
          <p className="text-muted">El organizador aún no ha publicado el cronograma del evento</p>
        </div>
      </GlassCard>
    )
  }

  // Group schedule by day
  const scheduleByDay = schedule.reduce(
    (acc, item) => {
      if (!acc[item.day]) acc[item.day] = []
      acc[item.day].push(item)
      return acc
    },
    {} as Record<number, ScheduleItem[]>,
  )

  // Sort items by time within each day
  Object.keys(scheduleByDay).forEach((day) => {
    scheduleByDay[Number(day)].sort((a, b) => a.time.localeCompare(b.time))
  })

  return (
    <div className="space-y-6">
      {Array.from({ length: eventDurationDays }, (_, i) => i + 1).map((day) => {
        const dayItems = scheduleByDay[day] || []
        if (dayItems.length === 0) return null

        return (
          <GlassCard key={day} glow="primary">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary">
                <span className="text-2xl font-bold text-white">{day}</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold gradient-text">Día {day}</h3>
                <p className="text-sm text-muted">{dayItems.length} actividades programadas</p>
              </div>
            </div>

            <div className="space-y-4">
              {dayItems.map((item, index) => (
                <div
                  key={item.id}
                  className="relative pl-8 pb-6 last:pb-0 border-l-2 border-primary/30 last:border-transparent"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full bg-gradient-to-br from-primary to-secondary glow-primary" />

                  <div className="bg-surface/50 rounded-lg p-4 hover:bg-surface transition-all">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                          <Clock className="w-4 h-4" />
                          <span className="font-semibold text-sm">{item.time}</span>
                        </div>
                        <h4 className="text-lg font-bold text-foreground">{item.title}</h4>
                      </div>
                    </div>

                    {item.description && <p className="text-muted mb-3 leading-relaxed">{item.description}</p>}

                    <div className="flex flex-wrap gap-4 text-sm">
                      {item.location && (
                        <div className="flex items-center gap-2 text-muted">
                          <MapPin className="w-4 h-4" />
                          <span>{item.location}</span>
                        </div>
                      )}
                      {item.speaker && (
                        <div className="flex items-center gap-2 text-muted">
                          <User className="w-4 h-4" />
                          <span>{item.speaker}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )
      })}
    </div>
  )
}
