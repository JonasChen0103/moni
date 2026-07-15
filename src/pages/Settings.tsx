import { useState } from 'react'
import { CupertinoNavBar, CupertinoListGroup, CupertinoListItem, CupertinoSheet, CupertinoButton } from '../components/cupertino'
import { CupertinoInput } from '../components/cupertino/CupertinoInput'
import { pb } from '../services/pocketbase'

export default function Settings() {
  const [showSync, setShowSync] = useState(false)
  const [pbUrl, setPbUrl] = useState(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [syncStatus, setSyncStatus] = useState<string>(pb.authStore.isValid ? 'Connected' : 'Not connected')

  const handleLogin = async () => {
    try {
      pb.baseURL = pbUrl
      await pb.collection('users').authWithPassword(email, password)
      setSyncStatus('Connected')
      setShowSync(false)
    } catch {
      setSyncStatus('Login failed')
    }
  }

  const handleLogout = () => {
    pb.authStore.clear()
    setSyncStatus('Not connected')
  }

  return (
    <div className="flex-1 pb-24 bg-ios-bg dark:bg-ios-bg">
      <CupertinoNavBar
        title="Settings"
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        }
      />

      <CupertinoListGroup header="General">
        <CupertinoListItem label="Base Currency" value="TWD" />
        <CupertinoListItem label="Theme" value="System" />
      </CupertinoListGroup>

      <CupertinoListGroup header="Sync">
        <CupertinoListItem
          label="PocketBase Sync"
          value={syncStatus}
          chevron
          onClick={() => setShowSync(true)}
        />
        {pb.authStore.isValid && (
          <CupertinoListItem label="Sign Out" destructive onClick={handleLogout} />
        )}
      </CupertinoListGroup>

      <CupertinoListGroup header="Data">
        <CupertinoListItem label="Export Data" chevron />
      </CupertinoListGroup>

      <CupertinoListGroup header="About">
        <CupertinoListItem label="Version" value="0.1.0" />
        <CupertinoListItem label="Built with" value="React + Vite" />
      </CupertinoListGroup>

      <CupertinoSheet open={showSync} onClose={() => setShowSync(false)} title="PocketBase Sync">
        <div className="space-y-4">
          <CupertinoListGroup inset={false}>
            <CupertinoInput label="Server URL" value={pbUrl} onChange={(e) => setPbUrl(e.target.value)} placeholder="http://127.0.0.1:8090" />
            <CupertinoInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" />
            <CupertinoInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </CupertinoListGroup>
          <div className="px-0 pt-2">
            <CupertinoButton fullWidth onClick={handleLogin} disabled={!email || !password}>
              Connect
            </CupertinoButton>
          </div>
          {syncStatus === 'Login failed' && (
            <div className="text-ios-red text-[13px] text-center">Login failed. Check your credentials and server URL.</div>
          )}
        </div>
      </CupertinoSheet>
    </div>
  )
}
