import React from 'react'
import { URL_PATTERN } from './constants'
import { StyledInput } from './styled'

interface InputProps {
  value: string | number
  type: string
  onChange: (input: string) => void
  error?: boolean
  fontSize?: string
  align?: 'right' | 'left'
}

const InputUrl = ({
  value,
  type = 'text',
  onChange,
  placeholder,
  ...rest
}: InputProps & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) => {
  const onInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const nextValue = e.currentTarget.value.trim()
    if(new RegExp(URL_PATTERN).test(nextValue)) {

    }
    onChange(nextValue)
  }

  return (
    <StyledInput
      {...rest}
      value={value}
      onChange={onInputChange}
      // universal input options
      title="Referal link"
      autoComplete="off"
      autoCorrect="off"
      // text-specific options
      pattern={URL_PATTERN}
      placeholder='Inviter'
      required
      type="url"
    />
  )
}

export default InputUrl
