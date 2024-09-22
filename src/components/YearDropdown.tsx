import { SelectField, SelectItem, SelectFieldProps } from './ui/select'

const currentYear = new Date().getFullYear()

type YearDropdownProps = {
  maxYear: number
  start?: boolean
} & Omit<SelectFieldProps, 'id' | 'children'>
export function YearDropdown({ maxYear, start, ...props }: YearDropdownProps) {
  const years = Array.from({ length: maxYear - currentYear + 1 }, (_, i) => currentYear + i)
  return (
    <SelectField id={start ? 'start-year' : 'end-year'} {...props}>
      {start && <SelectItem value="existing">Existing before {currentYear}</SelectItem>}
      {years.map((year) => (
        <SelectItem key={year} value={`${year}`}>
          {year}
        </SelectItem>
      ))}
    </SelectField>
  )
}
