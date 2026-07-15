'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from './button'
import { Input } from './input'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { cn } from '@/lib/utils'
import { useCountries } from '@/lib/api/countries/queries'

export interface PhoneInputValue {
  /** ISO 3166-1 alpha-2 country code, e.g. "NG" */
  country: string
  /** National phone number as typed by the user (not E.164). */
  phoneNumber: string
}

interface PhoneInputProps {
  value?: PhoneInputValue
  onChange: (value: PhoneInputValue) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

/**
 * Phone input with a searchable country selector (flag + dialing code) and a
 * national-number field. Emits `{ country, phoneNumber }` — the backend
 * converts this to E.164 (it handles per-country trunk-prefix rules), so we
 * intentionally send the number as typed rather than composing E.164 here.
 */
export function PhoneInput({
  value,
  onChange,
  disabled,
  className,
  placeholder = 'Phone number',
}: PhoneInputProps) {
  const { data: countries = [], isLoading } = useCountries()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const country = value?.country ?? ''
  const phoneNumber = value?.phoneNumber ?? ''

  const selected = useMemo(
    () => countries.find((c) => c.iso2 === country),
    [countries, country]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return countries
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.iso2.toLowerCase().includes(q)
    )
  }, [countries, search])

  return (
    <div className={cn('flex gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-label="Select country calling code"
            disabled={disabled || isLoading}
            className="h-10 md:h-12 shrink-0 justify-between rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent px-3 text-sm font-normal text-white hover:bg-transparent hover:text-white"
          >
            {selected ? (
              <span className="flex items-center gap-1.5">
                <span className="text-base leading-none">{selected.flag}</span>
                <span>{selected.dialCode}</span>
              </span>
            ) : (
              <span className="text-gray-400">{isLoading ? '…' : 'Code'}</span>
            )}
            <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[280px] border-white/10 bg-[#1a1b1e] p-0 text-white"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="border-b border-white/10 p-2">
            <Input
              placeholder="Search country or code…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 border-white/10 bg-transparent text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
          </div>
          <div className="max-h-[280px] overflow-y-auto p-1">
            {filtered.map((c) => (
              <div
                key={c.iso2}
                onClick={() => {
                  onChange({ country: c.iso2, phoneNumber })
                  setOpen(false)
                  setSearch('')
                }}
                className={cn(
                  'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-gray-300 outline-none hover:bg-white/10',
                  c.iso2 === country && 'bg-white/10 text-white'
                )}
              >
                <Check
                  className={cn(
                    'h-4 w-4 shrink-0',
                    c.iso2 === country ? 'opacity-100' : 'opacity-0'
                  )}
                />
                <span className="text-base leading-none">{c.flag}</span>
                <span className="flex-1 truncate">{c.name}</span>
                <span className="text-gray-400">{c.dialCode}</span>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No country found.
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <Input
        type="tel"
        inputMode="tel"
        disabled={disabled}
        placeholder={placeholder}
        value={phoneNumber}
        onChange={(e) => onChange({ country, phoneNumber: e.target.value })}
        className="h-10 w-full rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent px-4 text-sm text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none md:h-12"
      />
    </div>
  )
}
