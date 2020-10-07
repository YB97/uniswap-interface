import React, { useState } from 'react'
import ReactGA from 'react-ga'
import { Pair, TokenAmount, Percent, Currency } from '@uniswap/sdk'
import { TransactionResponse } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { Text } from 'rebass'

import { useActiveWeb3React } from '../../hooks'
import { useMigratorContract, usePairContract } from '../../hooks/useContract'
import { ButtonPink, ButtonRed } from '../Button'
import Modal from '../Modal'
import { useCurrency } from '../../hooks/Tokens'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useTokenBalances } from '../../state/wallet/hooks'
import { usePair } from '../../data/Reserves'

interface Props {
  isOpen: boolean
  pair: Pair
  userPoolBalance?: any
  onDismiss: () => void
}

const MigrateModal = ({ isOpen, onDismiss, pair }: Props) => {
  const migrateContract = useMigratorContract()
  const { account } = useActiveWeb3React()

  const [isApproved, setIsApproved] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)
  const relevantTokenBalances = useTokenBalances(account ?? undefined, [pair?.liquidityToken])
  const userLiquidity: undefined | TokenAmount = relevantTokenBalances?.[pair?.liquidityToken?.address ?? '']
  const amountToApprove = userLiquidity
    ? new TokenAmount(userLiquidity.token, new Percent('1').multiply(userLiquidity.raw).quotient)
    : undefined
  const addTransaction = useTransactionAdder()
  const token = amountToApprove instanceof TokenAmount ? amountToApprove?.token : undefined

  const getPairAddr = (addr: string) => {
    console.log('getPairAddr', addr, addr === '0x1421952CB28739568DA9f8433B5f3634899781e6')
    if (addr === '0x1421952CB28739568DA9f8433B5f3634899781e6') {
      return '0x297C338Da24BeEcD4C412a3537650AC9010ea628'
    }

    return addr
  }

  const currencyA = useCurrency(getPairAddr(pair.token0.address)) as Currency
  const currencyB = useCurrency(getPairAddr(pair.token1.address)) as Currency

  const [, outPair] = usePair(currencyA, currencyB)

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

    if (!migrateContract?.address) {
      setError('No mirgate address')
      return
    }

    return pairContract
      ?.approve(migrateContract?.address, amountToApprove?.raw.toString(), {
        gasLimit: 100000
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Approve ' + amountToApprove?.currency.symbol,
          approval: { tokenAddress: token.address, spender: migrateContract.address }
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
                await migrateContract
                  ?.migrate(
                    amountToApprove?.raw.toString(),
                    pair?.liquidityToken?.address,
                    outPair?.liquidityToken.address,
                    account,
                    {
                      gasLimit: 3000000
                    }
                  )
                  .then((response: TransactionResponse) => {
                    ReactGA.event({
                      category: 'Migration',
                      action: 'Migration',
                      label: 'migration'
                    })
                    addTransaction(response, {
                      summary: 'Approve ' + amountToApprove?.currency.symbol
                      // approval: { tokenAddress: pair?.liquidityToken?.address, spender: migrateContract.address }
                    })
                  })
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
