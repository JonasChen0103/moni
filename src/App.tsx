import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { CupertinoTabBar } from './components/cupertino'
import { useAccountStore } from './stores/useAccountStore'
import { useTransactionStore } from './stores/useTransactionStore'
import { useCurrencyStore } from './stores/useCurrencyStore'
import { useInstallmentStore } from './stores/useInstallmentStore'
import { useRecurringStore } from './stores/useRecurringStore'
import { useDebtStore } from './stores/useDebtStore'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/Accounts'
import Transactions from './pages/Transactions'
import Forecast from './pages/Forecast'
import Settings from './pages/Settings'

export default function App() {
  const loadAccounts = useAccountStore((s) => s.load)
  const loadTransactions = useTransactionStore((s) => s.load)
  const loadCurrency = useCurrencyStore((s) => s.load)
  const loadInstallments = useInstallmentStore((s) => s.load)
  const loadRecurring = useRecurringStore((s) => s.load)
  const loadDebts = useDebtStore((s) => s.load)

  useEffect(() => {
    loadAccounts()
    loadTransactions()
    loadCurrency()
    loadInstallments()
    loadRecurring()
    loadDebts()
  }, [loadAccounts, loadTransactions, loadCurrency, loadInstallments, loadRecurring, loadDebts])

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <CupertinoTabBar />
    </>
  )
}
