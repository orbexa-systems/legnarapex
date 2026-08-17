'use client'

import { useEffect, useRef, useState } from 'react'

const DAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá']
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

interface DatePickerProps {
  value: string // YYYY-MM-DD
  onChange: (value: string) => void
}

function parseLocal(dateStr: string): Date | null {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toLocalISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = parseLocal(value)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [cursor, setCursor] = useState(() => {
    const base = selected ?? today
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [])

  function prevMonth() {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
  }
  function nextMonth() {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
  }

  function buildDays(): (Date | null)[] {
    const firstDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay()
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
    const cells: (Date | null)[] = Array(firstDay).fill(null)
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d))
    }
    return cells
  }

  function selectDay(day: Date) {
    onChange(toLocalISO(day))
    setOpen(false)
  }

  const displayLabel = selected
    ? selected.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'Selecciona una fecha'

  const days = buildDays()

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-legnar-dark px-3 py-2.5 text-sm transition-colors outline-none ${
          open ? 'border-legnar-red' : 'border-legnar-border'
        } ${selected ? 'text-legnar-white' : 'text-legnar-gray/60'}`}
      >
        <span>{displayLabel}</span>
        <svg className="h-4 w-4 shrink-0 text-legnar-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-72 rounded-xl border border-legnar-border bg-legnar-dark shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between border-b border-legnar-border px-4 py-3">
            <button
              type="button"
              onClick={prevMonth}
              className="rounded-md p-1 text-legnar-gray transition-colors hover:text-legnar-white"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-semibold uppercase tracking-widest text-legnar-white">
              {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="rounded-md p-1 text-legnar-gray transition-colors hover:text-legnar-white"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="p-3">
            <div className="mb-1 grid grid-cols-7">
              {DAYS.map((d) => (
                <div key={d} className="py-1 text-center text-[10px] font-semibold uppercase tracking-widest text-legnar-gray">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-0.5">
              {days.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />

                const isSelected = selected && toLocalISO(day) === toLocalISO(selected)
                const isToday = toLocalISO(day) === toLocalISO(today)

                return (
                  <button
                    key={toLocalISO(day)}
                    type="button"
                    onClick={() => selectDay(day)}
                    className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors
                      ${isSelected
                        ? 'bg-legnar-red text-white'
                        : isToday
                        ? 'border border-legnar-gold text-legnar-gold hover:bg-legnar-gold/10'
                        : 'text-legnar-white hover:bg-legnar-border/60'
                      }`}
                  >
                    {day.getDate()}
                  </button>
                )
              })}
            </div>

            {value && (
              <div className="mt-3 border-t border-legnar-border pt-3 text-center">
                <button
                  type="button"
                  onClick={() => { onChange(''); setOpen(false) }}
                  className="text-xs text-legnar-gray transition-colors hover:text-legnar-white"
                >
                  Limpiar fecha
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
