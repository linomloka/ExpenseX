const ACCOUNTS_KEY = 'expense-accounts'
const SESSION_KEY = 'expense-current-user'
const LEGACY_KEYS = {
  transactions: 'expense-transactions',
  budgets: 'expense-budgets',
  goals: 'expense-goals',
  theme: 'expense-theme',
  language: 'expense-language',
  currency: 'expense-currency',
}
let legacyMigrationPromise

function readJson(key, fallback) {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch (error) {
    console.error(`Unable to read ${key} from local storage.`, error)
    return fallback
  }
}

export function getAccounts() {
  const accounts = readJson(ACCOUNTS_KEY, [])
  if (!Array.isArray(accounts)) {
    throw new Error('Saved account data is invalid. Clear this browser’s ExpenseX account data and try again.')
  }
  return accounts
}

async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure browser storage is unavailable. Open ExpenseX on localhost or a secure HTTPS connection.')
  }
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: encoder.encode(salt),
    iterations: 150000,
    hash: 'SHA-256',
  }, keyMaterial, 256)
  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function persistAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

export async function registerAccount({ name, email, password }) {
  if (!name.trim() || !email.trim() || password.length < 8) {
    throw new Error('Enter your name, a valid email address, and a password of at least 8 characters.')
  }
  const normalizedEmail = email.trim().toLowerCase()
  const accounts = getAccounts()
  if (accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error('An account with this email already exists. Sign in instead.')
  }
  const salt = crypto.randomUUID()
  const account = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    salt,
    passwordHash: await hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  }
  persistAccounts([...accounts, account])
  return account
}

export async function signInAccount(email, password) {
  const normalizedEmail = email.trim().toLowerCase()
  const account = getAccounts().find((item) => item.email === normalizedEmail)
  if (!account || (await hashPassword(password, account.salt)) !== account.passwordHash) {
    throw new Error('Email or password is incorrect.')
  }
  return account
}

export function getCurrentAccount() {
  const accountId = localStorage.getItem(SESSION_KEY)
  if (!accountId) return null
  return getAccounts().find((account) => account.id === accountId) || null
}

export function setCurrentAccount(account) {
  localStorage.setItem(SESSION_KEY, account.id)
}

export function clearCurrentAccount() {
  localStorage.removeItem(SESSION_KEY)
}

export function readAccountData(accountId, key, fallback) {
  return readJson(`expense:${accountId}:${key}`, fallback)
}

export function saveAccountData(accountId, key, value) {
  localStorage.setItem(`expense:${accountId}:${key}`, JSON.stringify(value))
}

export function migrateLegacyDemoAccount() {
  if (!legacyMigrationPromise) {
    legacyMigrationPromise = (async () => {
      if (localStorage.getItem('expense-legacy-account-migrated')) return
      const legacyData = Object.fromEntries(
        Object.entries(LEGACY_KEYS).map(([name, key]) => [name, localStorage.getItem(key)]),
      )
      const hasLegacyData = Object.values(legacyData).some((value) => value !== null)
      if (hasLegacyData && !getAccounts().some((account) => account.email === 'demo@example.com')) {
        const salt = crypto.randomUUID()
        const account = {
          id: crypto.randomUUID(),
          name: 'Jordan Davis',
          email: 'demo@example.com',
          salt,
          passwordHash: await hashPassword('password', salt),
          createdAt: new Date().toISOString(),
        }
        persistAccounts([...getAccounts(), account])
        Object.entries(legacyData).forEach(([key, raw]) => {
          if (raw !== null) localStorage.setItem(`expense:${account.id}:${key}`, raw)
        })
      }
      localStorage.setItem('expense-legacy-account-migrated', 'true')
    })()
  }
  return legacyMigrationPromise
}
