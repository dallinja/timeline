'use client'

import React, { FormEvent, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Text } from './ui/text'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Switch } from './ui/switch'
import { createTimeline } from '@/actions/createTimeline'
import { getEntries } from '@/services/local'
import { useCreateEntries, useDeleteEntries } from '@/queries/entries'

export interface InitialDataDialogProps {
  children?: React.ReactNode
}

const InitialDataDialog = ({ children }: InitialDataDialogProps) => {
  const [open, setOpen] = useState(false)

  const [haveMortgage, setHaveMortgage] = useState('yes')
  const [home, setHome] = useState('rent')

  const { mutate: createEntries } = useCreateEntries()
  const { mutate: deleteEntries } = useDeleteEntries({ skipInvalidation: true })

  useEffect(() => {
    const entries = getEntries()
    if (!entries) {
      setOpen(true)
    }
  }, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.target as HTMLFormElement)
    deleteEntries([{ id: undefined, scenario: 'default' }], {
      onSuccess: () => {
        console.log('hey buddy')
        const entries = createTimeline(data)
        createEntries(entries)
        setOpen(false)
      },
    })
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open initial dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full sm:max-w-4xl">
          <form className="w-full" onSubmit={handleSubmit} noValidate>
            <DialogHeader>
              <DialogTitle>Your timeline</DialogTitle>
              <DialogDescription>
                To get your inital timeline, enter your current financial situation below. You can
                change all of these later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Text className="mb-3" bold>
                  General
                </Text>
                <div className="grid gap-4 rounded-lg border p-4">
                  <Input name="age" label="What is your age?" />
                  <Input
                    name="initialCash"
                    label="What is your current balance of savings and checking accounts?"
                  />
                </div>
              </div>
              <div>
                <Text className="mb-3" bold>
                  Income
                </Text>
                <div className="grid gap-4 rounded-lg border p-4">
                  <Input name="income" label="What is your household annual income? (pre-tax)" />
                </div>
              </div>
              <div>
                <Text className="mb-3" bold>
                  Expenses
                </Text>
                <div className="grid gap-4 rounded-lg border p-4">
                  <Input
                    name="expenses"
                    label="How much are your yearly expenses minus your mortgage, income taxes, investments, and other loan payments?"
                  />
                </div>
              </div>
              <div>
                <Text className="mb-3" bold>
                  Property
                </Text>
                <div className="grid gap-4 rounded-lg border p-4">
                  <div className="flex w-full items-center justify-between">
                    <Text fontSize="sm" className="font-semibold">
                      Do you own your home?
                    </Text>
                    <Switch
                      checked={home === 'own'}
                      onCheckedChange={(val) => setHome(val ? 'own' : 'rent')}
                    />
                  </div>
                  <Collapse open={home === 'own'}>
                    <div className="rounded bg-gray-100 p-4">
                      <Input name="homeValue" label="What is your home's value?" />
                      <div className="mt-4 flex items-center gap-4 ">
                        <Text fontSize="sm" className="font-semibold">
                          Do you have a mortgage?
                        </Text>
                        <RadioGroup
                          className="pl-2"
                          name="haveMortgage"
                          value={haveMortgage}
                          onValueChange={setHaveMortgage}
                          row
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="yes" />
                            <Text fontSize="sm" className="font-semibold" asChild>
                              <label htmlFor="yes">Yes</label>
                            </Text>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="no" />
                            <Text fontSize="sm" className="font-semibold" asChild>
                              <label htmlFor="no">No</label>
                            </Text>
                          </div>
                        </RadioGroup>
                      </div>
                      <Collapse open={haveMortgage === 'yes'} padding={6}>
                        <div className="mt-4 grid grid-cols-3 gap-1">
                          <Input name="mortgageAmount" label="Rem. amount" />
                          <Input name="mortgageYears" label="Rem. years" />
                          <Input name="mortgageRate" label="Loan rate" />
                        </div>
                      </Collapse>
                    </div>
                  </Collapse>
                </div>
              </div>
              <div>
                <Text className="mb-3" bold>
                  Investments
                </Text>
                <div className="grid gap-4 rounded-lg border p-4">
                  <Input
                    name="tradInvestments"
                    label="How much to you have in pre-tax investments? (traditional)"
                  />
                  <Input
                    name="rothInvestments"
                    label="How much to you have in post-tax investments? (Roth)"
                  />
                </div>
              </div>
              <div>
                <Text className="mb-3" bold>
                  Other
                </Text>
                <div className="grid gap-4 rounded-lg border p-4">
                  <Input name="studentLoanAmount" label="How much Student Loan debt do you have?" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create my timeline!</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default InitialDataDialog

function Collapse({
  open,
  children,
  padding,
}: {
  open?: boolean
  children?: React.ReactNode
  padding?: number
}) {
  return (
    <div
      className="grid"
      style={{
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: 'grid-template-rows 500ms',
        ...(padding ? { padding, margin: -padding } : {}),
      }}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}
