'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SelectField, SelectItem } from './ui/select'
import { useState } from 'react'

export default function ScenarioSelection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [scenario, setScenario] = useState(() => searchParams.get('scenario') ?? 'default')

  const handleValueChange = (value: string) => {
    setScenario(value)
    router.push(`/timeline?scenario=${value}`)
  }
  return (
    <div className="w-40">
      <SelectField id="scenario" fullWidth value={scenario} onValueChange={handleValueChange}>
        <SelectItem value="default">Default</SelectItem>
        <SelectItem value="test">Test</SelectItem>
      </SelectField>
    </div>
  )
}
