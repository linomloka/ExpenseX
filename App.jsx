import { useEffect, useMemo, useState } from 'react'
import {
  Avatar, Badge, Button, CssBaseline, Dialog, DialogActions,
  DialogContent, DialogTitle, Divider, Drawer, IconButton,
  InputAdornment, Menu, MenuItem, Paper, Select, Stack, TextField,
  ThemeProvider, Typography,
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import { getAppTheme } from './theme/theme'
import { translate, TranslationProvider } from './i18n/translations'
import ExpenseXLogo from './components/ExpenseXLogo'
import ExpenseForm from './components/ExpenseForm'
import AboutPage from './components/AboutPage'
import ActivitiesPage from './components/ActivitiesPage'
import BudgetsPage from './components/BudgetsPage'
import ContactPage from './components/ContactPage'
import GoalsPage from './components/GoalsPage'
import OverviewPage from './components/OverviewPage'
import PrivacyPage from './components/PrivacyPage'
import ProfilePage from './components/ProfilePage'
import SettingsPage from './components/SettingsPage'
import TermsPage from './components/TermsPage'
import { formatMoney as money, toBaseCurrency } from './utils/currency'
import {
  clearCurrentAccount,
  getCurrentAccount,
  migrateLegacyDemoAccount,
  readAccountData,
  registerAccount,
  saveAccountData,
  setCurrentAccount,
  signInAccount,
} from './utils/accounts'
import './App.css'

const navigation = [
  ['Overview', '⌂'], ['Activities', '↗'], ['Budgets', '▤'],
  ['My Goals', '◎'], ['Profile', '◉'], ['Settings', '⚙'],
  ['About', 'ⓘ'], ['Terms of Service', '▧'],
  ['Privacy Policy', '◈'], ['Contact', '✉'],
]
const pagePaths = {
  Overview: '/overview',
  Activities: '/activities',
  Budgets: '/budgets',
  'My Goals': '/goals',
  Profile: '/profile',
  Settings: '/settings',
  About: '/about',
  'Terms of Service': '/terms',
  'Privacy Policy': '/privacy',
  Contact: '/contact',
}
const pathPages = Object.fromEntries(Object.entries(pagePaths).map(([page, path]) => [path, page]))

function IconText({ children, className = '' }) {
  return <span className={`icon-text ${className}`} aria-hidden="true">{children}</span>
}

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentUser, setCurrentUser] = useState(() => getCurrentAccount())
  const [authReady, setAuthReady] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const [mode, setMode] = useState(() => currentUser ? readAccountData(currentUser.id, 'theme', 'dark') : 'dark')
  const [language, setLanguage] = useState(() => currentUser ? readAccountData(currentUser.id, 'language', 'EN') : 'EN')
  const [currency, setCurrency] = useState(() => currentUser ? readAccountData(currentUser.id, 'currency', 'TZS') : 'TZS')
  const [profilePhoto, setProfilePhoto] = useState(() => currentUser ? readAccountData(currentUser.id, 'profilePhoto', '') : '')
  const [transactions, setTransactions] = useState(() => currentUser ? readAccountData(currentUser.id, 'transactions', []) : [])
  const [budgets, setBudgets] = useState(() => currentUser ? readAccountData(currentUser.id, 'budgets', []) : [])
  const [goals, setGoals] = useState(() => currentUser ? readAccountData(currentUser.id, 'goals', []) : [])
  const activePage = pathPages[location.pathname] || 'Overview'
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [period, setPeriod] = useState('Weekly')
  const [dialog, setDialog] = useState('')
  const [editingExpense, setEditingExpense] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [detailsExpense, setDetailsExpense] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [toast, setToast] = useState('')
  const [budgetForm, setBudgetForm] = useState({ category: 'Food', limit: '', alert: '80' })
  const [goalForm, setGoalForm] = useState({ name: '', target: '' })
  const [loading, setLoading] = useState(true)
  const theme = useMemo(() => getAppTheme(mode), [mode])
  const t = (text) => translate(language, text)

  useEffect(() => {
    document.documentElement.lang = language === 'SW' ? 'sw' : 'en'
  }, [language])

  useEffect(() => {
    let active = true
    migrateLegacyDemoAccount()
      .then(() => {
        if (!active) return
        setCurrentUser(getCurrentAccount())
        setAuthReady(true)
      })
      .catch((error) => {
        console.error('Unable to prepare local accounts.', error)
        if (!active) return
        setAuthError(error.message || 'Account storage could not be initialized.')
        setAuthReady(true)
      })
    return () => { active = false }
  }, [])
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 350)
    return () => window.clearTimeout(timer)
  }, [])
  useEffect(() => {
    if (!authReady) return
    if (currentUser && ['/', '/signin', '/signup'].includes(location.pathname)) navigate('/overview', { replace: true })
    if (!currentUser && !['/', '/signin', '/signup'].includes(location.pathname)) {
      navigate(location.pathname === '/' ? '/signup' : '/signin', { replace: true })
    }
  }, [authReady, currentUser, location.pathname, navigate])
  useEffect(() => { if (currentUser) saveAccountData(currentUser.id, 'theme', mode) }, [currentUser, mode])
  useEffect(() => { if (currentUser) saveAccountData(currentUser.id, 'language', language) }, [currentUser, language])
  useEffect(() => { if (currentUser) saveAccountData(currentUser.id, 'currency', currency) }, [currentUser, currency])
  useEffect(() => { if (currentUser) saveAccountData(currentUser.id, 'profilePhoto', profilePhoto) }, [currentUser, profilePhoto])
  useEffect(() => { if (currentUser) saveAccountData(currentUser.id, 'transactions', transactions) }, [currentUser, transactions])
  useEffect(() => { if (currentUser) saveAccountData(currentUser.id, 'budgets', budgets) }, [currentUser, budgets])
  useEffect(() => { if (currentUser) saveAccountData(currentUser.id, 'goals', goals) }, [currentUser, goals])

  const income = transactions.filter((item) => item.type === 'Income').reduce((sum, item) => sum + Number(item.amount), 0)
  const expenses = transactions.filter((item) => item.type === 'Expense').reduce((sum, item) => sum + Number(item.amount), 0)
  const savings = transactions.filter((item) => item.type === 'Saving').reduce((sum, item) => sum + Number(item.amount), 0)
  const balance = income - expenses - savings
  const budgetRemaining = budgets.reduce((sum, item) => sum + Number(item.limit), 0) - expenses
  const filteredTransactions = useMemo(() => transactions
    .filter((item) => filter === 'All' || item.type === filter)
    .filter((item) => `${item.description} ${item.category}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date)), [transactions, filter, search])

  function showToast(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }
  function activateAccount(account) {
    setCurrentAccount(account)
    setCurrentUser(account)
    setTransactions(readAccountData(account.id, 'transactions', []))
    setBudgets(readAccountData(account.id, 'budgets', []))
    setGoals(readAccountData(account.id, 'goals', []))
    setMode(readAccountData(account.id, 'theme', 'dark'))
    setLanguage(readAccountData(account.id, 'language', 'EN'))
    setCurrency(readAccountData(account.id, 'currency', 'TZS'))
    setProfilePhoto(readAccountData(account.id, 'profilePhoto', ''))
    setAuthError('')
  }
  async function handleAuthSubmit(event) {
    event.preventDefault()
    setAuthError('')
    setAuthBusy(true)
    const formData = new FormData(event.currentTarget)
    try {
      const account = location.pathname === '/signin'
        ? await signInAccount(String(formData.get('email') || ''), String(formData.get('password') || ''))
        : await registerAccount({
          name: String(formData.get('name') || ''),
          email: String(formData.get('email') || ''),
          password: String(formData.get('password') || ''),
        })
      activateAccount(account)
      setAuthReady(true)
      navigate('/overview', { replace: true })
    } catch (error) {
      setAuthError(error.message || 'Unable to continue. Please try again.')
    } finally {
      setAuthBusy(false)
    }
  }
  function openAddTransaction() {
    setEditingExpense(null)
    setDialog('transaction')
  }
  function startEdit(id) {
    const item = transactions.find((transaction) => transaction.id === id)
    if (item) {
      setEditingExpense(item)
      setDialog('transaction')
    }
  }
  function updateExpense(updated) {
    setTransactions((items) => items.map((item) => item.id === updated.id ? updated : item))
    showToast(t('Transaction updated'))
  }
  function addExpense(item) {
    setTransactions((items) => [item, ...items])
    showToast(t('Transaction added'))
  }
  function deleteExpense(id) {
    const item = transactions.find((transaction) => transaction.id === id)
    if (item) setPendingDelete(item)
  }
  function confirmDelete() {
    if (!pendingDelete) return
    setTransactions((items) => items.filter((item) => item.id !== pendingDelete.id))
    setPendingDelete(null)
    showToast(t('Transaction deleted'))
  }
  function saveBudget(event) {
    event.preventDefault()
    const limit = toBaseCurrency(budgetForm.limit, currency)
    if (!Number.isFinite(limit) || limit <= 0) return
    setBudgets((items) => {
      const current = items.find((item) => item.category === budgetForm.category)
      return current
        ? items.map((item) => item.category === budgetForm.category ? { ...item, limit, alert: Number(budgetForm.alert) } : item)
        : [...items, { id: crypto.randomUUID(), category: budgetForm.category, limit, alert: Number(budgetForm.alert) }]
    })
    setDialog('')
    setBudgetForm({ category: 'Food', limit: '', alert: '80' })
    showToast(t('Budget saved'))
  }
  function saveGoal(event) {
    event.preventDefault()
    if (!goalForm.name.trim() || Number(goalForm.target) <= 0) return
    setGoals((items) => [...items, { id: crypto.randomUUID(), name: goalForm.name.trim(), target: toBaseCurrency(goalForm.target, currency), saved: 0, icon: '☆' }])
    setGoalForm({ name: '', target: '' })
    setDialog('')
    showToast(t('Goal created'))
  }
  function signOut() {
    clearCurrentAccount()
    setCurrentUser(null)
    setMenuAnchor(null)
    navigate('/signin')
  }
  function goToPage(page) {
    navigate(pagePaths[page] || '/overview')
    setMobileOpen(false)
  }

  const sidebarContent = (
      <div className="sidebar-content">
        <div className="brand"><ExpenseXLogo /></div>
        <div className="nav-caption">{t('MENU')}</div>
        <nav className="side-nav" aria-label={t('Main navigation')}>
          {navigation.map(([label, icon]) => (
            <button key={label} className={`nav-item ${activePage === label ? 'active' : ''}`} onClick={() => goToPage(label)}>
              <IconText>{icon}</IconText><span>{t(label)}</span>{label === 'Activities' && <span className="nav-count">{transactions.length}</span>}
            </button>
          ))}
        </nav>
        <Paper className="tips-card" elevation={0}>
          <span className="tips-spark"></span>
          <Typography className="tips-title">{t('Make your money work smarter')}</Typography>
          <Typography className="muted">{t('Small steps today make a big difference tomorrow.')}</Typography>
          <button onClick={() => goToPage('My Goals')}>{t('Explore tips')} <span>→</span></button>
        </Paper>
        <button className="logout-button" onClick={signOut}><IconText>⇥</IconText>{t('Log out')}</button>
      </div>
  )

  if (!authReady) {
    return <ThemeProvider theme={theme}><CssBaseline /><div className="auth-page"><Paper className="auth-card auth-loading" elevation={0}><ExpenseXLogo /><Typography className="muted">{t('Preparing your account…')}</Typography></Paper></div></ThemeProvider>
  }

  if (!currentUser || location.pathname === '/signin' || location.pathname === '/signup') {
    const isRegister = location.pathname !== '/signin'
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="auth-page">
          <Paper className="auth-card" elevation={0}>
            <div className="brand auth-brand"><ExpenseXLogo tagline taglineText={t('Your Personal Finance Tracker')} /></div>
            <div className="auth-art"><Typography variant="h4">{t('Your money. Your goals. Your space.')}</Typography><Typography>{t('Create an account to keep your financial information personal and organized.')}</Typography></div>
            <form className="auth-form" onSubmit={handleAuthSubmit}>
              <Typography variant="h5" fontWeight={800}>{isRegister ? 'Create your account' : 'Welcome back'}</Typography>
              <Typography className="muted">{isRegister ? 'Register to start your personal finance space.' : 'Sign in to access your personal dashboard.'}</Typography>
              {isRegister && <TextField name="name" label={t('Full name')} autoComplete="name" required fullWidth />}
              <TextField name="email" label={t('Email address')} type="email" autoComplete="email" required fullWidth />
              <TextField name="password" label={t('Password')} type={showPassword ? 'text' : 'password'} autoComplete={isRegister ? 'new-password' : 'current-password'} required fullWidth
                slotProps={{ htmlInput: { minLength: 8 }, input: { endAdornment: <InputAdornment position="end"><IconButton aria-label={t(showPassword ? 'Hide password' : 'Show password')} onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? '◉' : '◎'}</IconButton></InputAdornment> } }} />
              {isRegister && <Typography className="muted auth-password-hint">{t('Use at least 8 characters. Your data is saved in this browser.')}</Typography>}
              {authError && <Typography className="auth-error" role="alert">{t(authError)}</Typography>}
              <Button variant="contained" type="submit" fullWidth disabled={authBusy}>{t(authBusy ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in')}</Button>
              <Typography className="muted auth-demo-note">{t(isRegister ? 'Already have an account?' : 'New to ExpenseX?')}</Typography>
              <Button type="button" onClick={() => navigate(isRegister ? '/signin' : '/signup')}>{t(isRegister ? 'Sign in' : 'Create account')}</Button>
            </form>
          </Paper>
        </div>
      </ThemeProvider>
    )
  }

  const allOutgoings = expenses + savings
  const spentByCategory = (category) => transactions.filter((item) => item.type === 'Expense' && item.category === category).reduce((sum, item) => sum + Number(item.amount), 0)

  return (
    <TranslationProvider language={language}><ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={`app-shell ${mode === 'light' ? 'light-mode' : ''}`}>
        <main className="main-content">
          <header className="topbar">
            <IconButton className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label={t('Open navigation')}>☰</IconButton>
            <div className="search-field">
              <IconText>⌕</IconText>
              <input aria-label={t('Search transactions')} placeholder={t('Search transactions...')} value={search} onChange={(event) => setSearch(event.target.value)} />
              {search && <button aria-label={t('Clear search')} onClick={() => setSearch('')}>×</button>}
              <kbd>⌘ K</kbd>
            </div>
            <div className="topbar-actions">
              <Button className="add-transaction" variant="contained" onClick={openAddTransaction}><span>＋</span>{t('Add transaction')}</Button>
              <IconButton aria-label={t('Toggle theme')} onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>{mode === 'dark' ? '☼' : '☾'}</IconButton>
              <Button className="currency-button" aria-label={t(`Switch currency to ${currency === 'TZS' ? 'USD' : 'TZS'}`)} onClick={() => setCurrency(currency === 'TZS' ? 'USD' : 'TZS')}>{currency}</Button>
              <Button className="language-button" onClick={() => setLanguage(language === 'EN' ? 'SW' : 'EN')}>{language} <span>⌄</span></Button>
              <IconButton aria-label={t('Notifications')} onClick={() => showToast(t('You’re all caught up'))}><Badge variant="dot" color="error"><NotificationsActiveOutlinedIcon /></Badge></IconButton>
              <button className="profile-button" onClick={(event) => setMenuAnchor(event.currentTarget)}><Avatar className="user-avatar">{currentUser.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</Avatar><span className="profile-name">{currentUser.name}</span><span>⌄</span></button>
            </div>
          </header>

          <section className="page-content">
            {activePage === 'Overview' && <OverviewPage
              user={currentUser}
              t={t}
              language={language}
              loading={loading}
              balance={balance}
              income={income}
              expenses={expenses}
              savings={savings}
              allOutgoings={allOutgoings}
              budgetRemaining={budgetRemaining}
              currency={currency}
              transactions={transactions}
              filteredTransactions={filteredTransactions}
              filter={filter}
              setFilter={setFilter}
              period={period}
              setPeriod={setPeriod}
              onGoToActivities={() => goToPage('Activities')}
              onEdit={startEdit}
              onDelete={deleteExpense}
              onDetails={setDetailsExpense}
              budgets={budgets}
              spentByCategory={spentByCategory}
              onAddBudget={() => setDialog('budget')}
              onAddGoal={() => setDialog('goal')}
              goals={goals}
            />}
            {activePage === 'Activities' && <ActivitiesPage transactions={filteredTransactions} filter={filter} setFilter={setFilter} onEdit={startEdit} onDelete={deleteExpense} onDetails={setDetailsExpense} onAdd={openAddTransaction} currency={currency} />}
            {activePage === 'Budgets' && <BudgetsPage budgets={budgets} spentByCategory={spentByCategory} onAdd={() => setDialog('budget')} currency={currency} />}
            {activePage === 'My Goals' && <GoalsPage goals={goals} onAdd={() => setDialog('goal')} onDelete={(id) => setGoals((items) => items.filter((item) => item.id !== id))} currency={currency} />}
            {activePage === 'Profile' && <ProfilePage onSignOut={signOut} currency={currency} user={currentUser} language={language} profilePhoto={profilePhoto} onProfilePhotoChange={setProfilePhoto} />}
            {activePage === 'Settings' && <SettingsPage mode={mode} setMode={setMode} language={language} setLanguage={setLanguage} currency={currency} setCurrency={setCurrency} />}
            {activePage === 'About' && <AboutPage />}
            {activePage === 'Terms of Service' && <TermsPage />}
            {activePage === 'Privacy Policy' && <PrivacyPage />}
            {activePage === 'Contact' && <ContactPage />}
          </section>
          <footer className="app-footer"><span>© {new Date().getFullYear()} ExpenseX</span><span>{t('Made for a healthier financial future')}</span><button onClick={() => goToPage('Settings')}>{t('Help & support')}</button></footer>
        </main>
        <aside className="right-sidebar">{sidebarContent}</aside>
        <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} slotProps={{ paper: { className: 'mobile-drawer' } }}>{sidebarContent}</Drawer>
      </div>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={() => { goToPage('Profile'); setMenuAnchor(null) }}>{t('My profile')}</MenuItem>
        <MenuItem onClick={() => { goToPage('Settings'); setMenuAnchor(null) }}>{t('Settings')}</MenuItem>
        <MenuItem onClick={signOut}>{t('Log out')}</MenuItem>
      </Menu>
      <Dialog open={dialog === 'transaction'} onClose={() => { setDialog(''); setEditingExpense(null) }} fullWidth maxWidth="xs">
        <DialogTitle>{t(editingExpense ? 'Edit transaction' : 'Add transaction')}</DialogTitle>
        <DialogContent><ExpenseForm key={`${editingExpense?.id || 'new'}-${currency}`} expenseUpdater={addExpense} editingExpense={editingExpense} updateExpense={updateExpense} clearEditing={() => setEditingExpense(null)} onSuccess={() => { setDialog(''); setEditingExpense(null) }} currency={currency} /></DialogContent>
      </Dialog>
      <Dialog open={dialog === 'budget'} onClose={() => setDialog('')} fullWidth maxWidth="xs">
        <form onSubmit={saveBudget}>
          <DialogTitle>{t('Set a monthly budget')}</DialogTitle>
          <DialogContent className="dialog-form">
            <Typography className="muted">{t('Choose a category and set your spending limit.')}</Typography>
            <Select value={budgetForm.category} onChange={(event) => setBudgetForm({ ...budgetForm, category: event.target.value })} fullWidth>
              {['Food', 'Transport', 'Rent', 'Shopping', 'Utilities', 'Health', 'Other'].map((item) => <MenuItem key={item} value={item}>{t(item)}</MenuItem>)}
            </Select>
            <TextField label={`${t('Monthly limit')} (${currency})`} type="number" value={budgetForm.limit} onChange={(event) => setBudgetForm({ ...budgetForm, limit: event.target.value })} slotProps={{ htmlInput: { min: 1, step: currency === 'TZS' ? '1' : '0.01' } }} required fullWidth />
            <TextField label={t('Alert at (%)')} type="number" value={budgetForm.alert} onChange={(event) => setBudgetForm({ ...budgetForm, alert: event.target.value })} slotProps={{ htmlInput: { min: 1, max: 100 } }} required fullWidth />
          </DialogContent>
          <DialogActions><Button onClick={() => setDialog('')}>{t('Cancel')}</Button><Button type="submit" variant="contained">{t('Save budget')}</Button></DialogActions>
        </form>
      </Dialog>
      <Dialog open={dialog === 'goal'} onClose={() => setDialog('')} fullWidth maxWidth="xs">
        <form onSubmit={saveGoal}>
          <DialogTitle>{t('Create a savings goal')}</DialogTitle>
          <DialogContent className="dialog-form">
            <Typography className="muted">{t('Give your next milestone a name and a target.')}</Typography>
            <TextField label={t('Goal name')} value={goalForm.name} onChange={(event) => setGoalForm({ ...goalForm, name: event.target.value })} required fullWidth />
            <TextField label={`${t('Target amount')} (${currency})`} type="number" value={goalForm.target} onChange={(event) => setGoalForm({ ...goalForm, target: event.target.value })} slotProps={{ htmlInput: { min: 1, step: currency === 'TZS' ? '1' : '0.01' } }} required fullWidth />
          </DialogContent>
          <DialogActions><Button onClick={() => setDialog('')}>{t('Cancel')}</Button><Button type="submit" variant="contained">{t('Create goal')}</Button></DialogActions>
        </form>
      </Dialog>
      <Dialog open={Boolean(pendingDelete)} onClose={() => setPendingDelete(null)}>
        <DialogTitle>{t('Delete this transaction?')}</DialogTitle>
        <DialogContent><Typography className="muted">“{pendingDelete?.description}” {t('will be permanently removed from your activity.')}</Typography></DialogContent>
        <DialogActions><Button onClick={() => setPendingDelete(null)}>{t('Keep transaction')}</Button><Button color="error" variant="contained" onClick={confirmDelete}>{t('Delete')}</Button></DialogActions>
      </Dialog>
      <Dialog open={Boolean(detailsExpense)} onClose={() => setDetailsExpense(null)} fullWidth maxWidth="xs">
        <DialogTitle>{t('Transaction details')}</DialogTitle>
        <DialogContent>{detailsExpense && <Stack spacing={1.5} className="details-content"><Typography variant="h5" fontWeight={800}>{detailsExpense.description}</Typography><Typography>{money(Number(detailsExpense.amount), currency)} · {t(detailsExpense.type || 'Expense')}</Typography><Divider /><Typography>{t('Category')}: {t(detailsExpense.category)}</Typography><Typography>{t('Date')}: {detailsExpense.date}</Typography><Typography>{t('Notes')}: {detailsExpense.notes || t('No notes added')}</Typography></Stack>}</DialogContent>
        <DialogActions><Button onClick={() => setDetailsExpense(null)}>{t('Close')}</Button></DialogActions>
      </Dialog>
      {toast && <div role="status" className="toast-message">{toast}</div>}
    </ThemeProvider></TranslationProvider>
  )
}

export default App
