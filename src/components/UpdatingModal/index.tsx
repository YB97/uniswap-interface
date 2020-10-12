import React, { FC } from 'react'
import { Text } from 'rebass'

import Logo from '../../assets/svg/logo.svg'
import Modal from '../Modal'

interface Props {
  isOpen: boolean
  onDismiss: () => void
}

const UpdatingModal: FC<Props> = ({ isOpen, onDismiss }: Props) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxWidth={600}>
      <div
        style={{
          padding: '50px',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <img src={Logo} alt="logo" width="70px" />
        </div>
        <Text textAlign="center" marginBottom="20px" lineHeight="24px">
          We&apos;re doing a system upgrade. Site will be live again soon.
        </Text>
      </div>
    </Modal>
  )
}

export default UpdatingModal
