import React from 'react'
import { Text } from 'rebass'

import { ButtonRed } from '../Button'
import Modal from '../Modal'

interface Props {
  isOpen: boolean
  onDismiss: () => void
}

const MigrateModal = ({ isOpen, onDismiss }: Props) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxWidth={600}>
      <div style={{ padding: '50px' }}>
        <Text textAlign="center" marginBottom="20px" lineHeight="24px">
          CHKN.farm has updated 4 of its Egg FLP tokens into new Egg FLP tokens. Your old FLP tokens for CHKN-ETH,
          CHKN-USDT, CHKN-SUSHI, and CHKN-UNI need to to be migrated in order to be used to staked as Eggs to earn CHKN.
          You will receive the same amount of new Egg FLP tokens when you migrate each. Migrate now.
        </Text>
        <ButtonRed
          onClick={() => {
            console.log('migrate')
            onDismiss()
          }}
        >
          Migrate
        </ButtonRed>
      </div>
    </Modal>
  )
}

export default MigrateModal
