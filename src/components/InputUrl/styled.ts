import styled from 'styled-components'

export const StyledInput = styled.input<{ error?: boolean; fontSize?: string; align?: string }>`
  color: ${({ error, theme }) => (error ? theme.red1 : theme.text1)};
  font-weight: 500;
  width: 100%;
  border: none;
  outline: none;
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.bg1};
  font-size: ${({ fontSize }) => fontSize ?? '14px'};
  text-align: ${({ align }) => align && align};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
`;

export const StyledWrapper = styled.div<{ error?: boolean }>`
  width: 100%;
  border-radius: 20px;
  padding: 12px 12px 12px 16px;
  position: relative;
  border: 1px solid ${({ error }) => (error ? '#E14646' : '#fdf5eb')};
  &:hover {
    cursor: text;
  }
`

export const StyledLabel = styled.label`
  display: inline-block;
  font-weight: 500;
  font-size: 14px;
  color: #565A69;
  margin-bottom: 12px;
`
