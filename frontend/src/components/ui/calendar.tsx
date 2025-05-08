'use client'

import * as React from 'react'
import { DayPicker, DateRange } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

export interface CalendarProps {
  selected?: DateRange
  onSelect?: (date: DateRange | undefined) => void
  numberOfMonths?: number
  defaultMonth?: Date
  showOutsideDays?: boolean
  required?: boolean
}

export function Calendar({
  selected,
  onSelect,
  numberOfMonths = 1,
  defaultMonth,
  showOutsideDays = true,
  required = false,
}: CalendarProps) {
  return (
    <DayPicker
      mode="range"
      selected={selected}
      onSelect={onSelect}
      numberOfMonths={numberOfMonths}
      defaultMonth={defaultMonth}
      showOutsideDays={showOutsideDays}
      required={required}
    />
  )
}
