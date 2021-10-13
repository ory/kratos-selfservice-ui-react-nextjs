import { FormEvent } from 'react'

export type ValueSetter = (
  value: string | number | boolean | undefined
) => Promise<void>
export type FormDispatcher = (e: MouseEvent | FormEvent) => Promise<void>
