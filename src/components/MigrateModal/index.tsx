import React, { useState } from 'react'
import { Pair } from '@uniswap/sdk'
// import { splitSignature } from '@ethersproject/bytes'
// import { Contract } from '@ethersproject/contracts'
import { Text } from 'rebass'

// import { ROUTER_ADDRESS } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import {
  useMigratorContract
  // usePairContract
} from '../../hooks/useContract'
// import { useDerivedBurnInfo } from '../../state/burn/hooks'
// import {
//   ApprovalState
//   useApproveCallback
// } from '../../hooks/useApproveCallback'
import {
  // ButtonPink,
  ButtonRed
} from '../Button'
import Modal from '../Modal'
// import { Field } from '../../state/burn/actions'
// import { useCurrency } from '../../hooks/Tokens'
// import { useUserDeadline } from '../../state/user/hooks'

interface Props {
  isOpen: boolean
  pair: Pair
  userPoolBalance?: any
  onDismiss: () => void
}

const MigrateModal = ({ isOpen, onDismiss, userPoolBalance, pair }: Props) => {
  const migrateContract = useMigratorContract()
  const {
    account
    // chainId, library
  } = useActiveWeb3React()

  const [error, setError] = useState<string | undefined>()
  // const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)
  // const { parsedAmounts } = useDerivedBurnInfo(
  //   useCurrency(pair.token0.address) ?? undefined,
  //   useCurrency(pair.token1.address) ?? undefined
  // )

  // const [deadline] = useUserDeadline()
  // const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  // const [approval, approveCallback] = useApproveCallback(parsedAmounts[Field.LIQUIDITY], ROUTER_ADDRESS)
  // const onAttemptToApprove = async () => {
  //   console.log('LIB', library)
  //   console.log('PAIR', pair)
  //   console.log('PAIR CONT', pairContract)
  //   if (!pairContract || !pair || !library) throw new Error('missing dependencies')
  //   const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
  //   if (!liquidityAmount) throw new Error('missing liquidity amount')
  //   // try to gather a signature for permission
  //   const nonce = await pairContract.nonces(account)

  //   const deadlineForSignature: number = Math.ceil(Date.now() / 1000) + deadline

  //   const EIP712Domain = [
  //     { name: 'name', type: 'string' },
  //     { name: 'version', type: 'string' },
  //     { name: 'chainId', type: 'uint256' },
  //     { name: 'verifyingContract', type: 'address' }
  //   ]
  //   const domain = {
  //     name: 'CHKN.farm LP Token',
  //     version: '1',
  //     chainId: chainId,
  //     verifyingContract: pair.liquidityToken.address
  //   }
  //   const Permit = [
  //     { name: 'owner', type: 'address' },
  //     { name: 'spender', type: 'address' },
  //     { name: 'value', type: 'uint256' },
  //     { name: 'nonce', type: 'uint256' },
  //     { name: 'deadline', type: 'uint256' }
  //   ]
  //   const message = {
  //     owner: account,
  //     spender: ROUTER_ADDRESS,
  //     value: liquidityAmount.raw.toString(),
  //     nonce: nonce.toHexString(),
  //     deadline: deadlineForSignature
  //   }
  //   const data = JSON.stringify({
  //     types: {
  //       EIP712Domain,
  //       Permit
  //     },
  //     domain,
  //     primaryType: 'Permit',
  //     message
  //   })

  //   library
  //     .send('eth_signTypedData_v4', [account, data])
  //     .then(splitSignature)
  //     .then(signature => {
  //       setSignatureData({
  //         v: signature.v,
  //         r: signature.r,
  //         s: signature.s,
  //         deadline: deadlineForSignature
  //       })
  //       console.log('sig daya', signatureData)
  //     })
  //     .catch(error => {
  //       // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
  //       if (error?.code !== 4001) {
  //         approveCallback()
  //       }
  //     })
  // }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxWidth={600}>
      <div style={{ padding: '50px' }}>
        <Text textAlign="center" marginBottom="20px" lineHeight="24px">
          CHKN.farm has updated 4 of its Egg FLP tokens into new Egg FLP tokens. Your old FLP tokens for CHKN-ETH,
          CHKN-USDT, CHKN-SUSHI, and CHKN-UNI need to to be migrated in order to be used to staked as Eggs to earn CHKN.
          You will receive the same amount of new Egg FLP tokens when you migrate each. Migrate now.
        </Text>
        {/* <ButtonPink onClick={onAttemptToApprove}>Approve</ButtonPink> */}
        <ButtonRed
          // disabled={approval !== ApprovalState.APPROVED}
          onClick={async () => {
            try {
              await migrateContract?.migrate.call(userPoolBalance, pair.token0.address, pair.token1.address, account)
              onDismiss()
              setError('')
            } catch (err) {
              setError('Error on the page. Please try again later')
              console.error(err)
            }
          }}
        >
          Migrate
        </ButtonRed>
        {error && <div>Error: {error}</div>}
      </div>
    </Modal>
  )
}

export default MigrateModal
