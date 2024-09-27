import { SelectField, SelectItem, SelectFieldProps } from './ui/select'

const currentYear = new Date().getFullYear()

type YearDropdownProps = {
  birthYear: number
  maxYear: number
  start?: boolean
} & Omit<SelectFieldProps, 'id' | 'children'>
export function YearDropdown({ birthYear, maxYear, start, ...props }: YearDropdownProps) {
  const years = Array.from({ length: maxYear - currentYear + 1 }, (_, i) => currentYear + i)
  return (
    <SelectField id={start ? 'start-year' : 'end-year'} {...props}>
      {start && <SelectItem value="existing">Existing before {currentYear}</SelectItem>}
      {years.map((year) => (
        <SelectItem key={year} value={`${year}`}>
          <span className="flex w-28 justify-between">
            <span>{year}</span> <span>(Age {year - birthYear})</span>
          </span>
        </SelectItem>
      ))}
    </SelectField>
  )
}
