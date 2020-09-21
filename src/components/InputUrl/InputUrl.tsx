import React, { useRef, useState } from 'react'
import { StyledInput, StyledLabel, StyledWrapper } from './styled'

const URL_PATTERN = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
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
  title,
  type = 'text',
  onChange,
  placeholder,
  ...rest
}: InputProps & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) => {
  const [isGoodUrl, setIsGoodUrl] = useState<boolean | null>(null)
  const inputEl = useRef<HTMLInputElement>(null);
  const onInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const nextValue = e.currentTarget.value.trim()
    setIsGoodUrl((URL_PATTERN.test(nextValue) && nextValue.indexOf('/pool?refferer=') !== -1) || nextValue === '')
    onChange(nextValue)
  }
  const onClick = () => {
    if(inputEl.current !== null) inputEl.current.focus();
  }

  return (
    <StyledWrapper error={isGoodUrl === false} onClick={onClick}> 
      <StyledLabel>{title}</StyledLabel>
      <StyledInput
        {...rest}
        value={value}
        error={isGoodUrl === false}
        onChange={onInputChange}
        // universal input options
        title="Referal link"
        autoComplete="off"
        autoCorrect="off"
        // text-specific options
        placeholder="Inviter"
        required
        type="url"
        ref={inputEl}
      />
    </StyledWrapper>
  )
}

export default InputUrl
