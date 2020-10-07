import React, { useState } from 'react'
import { Pair, TokenAmount } from '@uniswap/sdk'
import { TransactionResponse } from '@ethersproject/providers'
// import { splitSignature } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { Text } from 'rebass'

// import { ROUTER_ADDRESS } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { useMigratorContract, usePairContract } from '../../hooks/useContract'
// import { useDerivedBurnInfo } from '../../state/burn/hooks'
// import {
//   ApprovalState
//   useApproveCallback
// } from '../../hooks/useApproveCallback'
import { ButtonPink, ButtonRed } from '../Button'
import Modal from '../Modal'
import { useDerivedBurnInfo } from '../../state/burn/hooks'
import { useCurrency } from '../../hooks/Tokens'
import { Field } from '../../state/burn/actions'
import { useTransactionAdder } from '../../state/transactions/hooks'
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
  console.log('userPoolBalance', userPoolBalance)

  const [isApproved, setIsApproved] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)
  // const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)
  const { parsedAmounts } = useDerivedBurnInfo(
    useCurrency(pair.token0.address) ?? undefined,
    useCurrency(pair.token1.address) ?? undefined
  )

  const amountToApprove = parsedAmounts[Field.LIQUIDITY]
  const addTransaction = useTransactionAdder()
  const token = amountToApprove instanceof TokenAmount ? amountToApprove?.token : undefined
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

  const approve = () => {
    if (!account) {
      setError('No account')
      console.error('No account', account)
      return
    }

    if (!amountToApprove) {
      setError('No amount')
      console.error('No amount', amountToApprove)
      return
    }

    if (!token) {
      setError('No token')
      console.error('No token', token)
      return
    }

    return pairContract
      ?.approve(account, amountToApprove?.raw.toString(), {
        gasLimit: 3000000
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Approve ' + amountToApprove?.currency.symbol,
          approval: { tokenAddress: token.address, spender: account }
        })
      })
      .then(() => {
        setIsApproved(true)
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxWidth={600}>
      <div style={{ padding: '50px' }}>
        <Text textAlign="center" marginBottom="20px" lineHeight="24px">
          CHKN.farm has updated 4 of its Egg FLP tokens into new Egg FLP tokens. Your old FLP tokens for CHKN-ETH,
          CHKN-USDT, CHKN-SUSHI, and CHKN-UNI need to to be migrated in order to be used to staked as Eggs to earn CHKN.
          You will receive the same amount of new Egg FLP tokens when you migrate each. Migrate now.
        </Text>
        <div style={{ display: 'flex', marginTop: '15px' }}>
          <ButtonPink onClick={approve} disabled={isApproved}>
            Approve
          </ButtonPink>
          <ButtonRed
            style={{ marginLeft: '10px' }}
            disabled={!isApproved}
            onClick={async () => {
              try {
                setError('')
                await migrateContract?.migrate.call(
                  amountToApprove?.raw.toString(),
                  pair.token0.address,
                  pair.token1.address,
                  account
                )
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
        </div>
        {error && <div style={{ marginTop: '10px' }}>Error: {error}</div>}
      </div>
    </Modal>
  )
}

export default MigrateModal
