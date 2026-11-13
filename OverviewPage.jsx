import { Button, Chip, LinearProgress, Paper, Skeleton, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { formatMoney as money } from '../utils/currency'
import TransactionTable from './TransactionTable'
import { useTranslate } from '../i18n/translations'

function SummaryCard({ label, value, icon, change, tone, featured, footnote, currency }) {
  return (
    <Paper className={`summary-card ${featured ? 'summary-featured' : ''}`} elevation={0}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <span className={`metric-icon ${tone}`}>{icon}</span>
        <Chip size="small" label={change} className={`trend-chip ${tone}`} />
      </Stack>
      <Typography className="summary-label">{label}</Typography>
      <Typography className="summary-value">{money(value, currency)}</Typography>
      <Typography className="summary-footnote">{footnote}</Typography>
    </Paper>
  )
}

function CashFlowCard({ income, expenses, savings, balance, currency }) {
  const t = useTranslate()
  const total = income + expenses + savings || 1
  const segments = [
    { name: 'Income', value: income, color: '#00B4D8' },
    { name: 'Expenses', value: expenses, color: '#F77F00' },
    { name: 'Savings', value: savings, color: '#2A9D8F' },
  ]
  let offset = 0
  const gradient = segments.map((segment) => {
    const start = offset
    offset += segment.value / total * 100
    return `${segment.color} ${start}% ${offset}%`
  }).join(', ')

  return (
    <Paper className="panel cashflow-panel" elevation={0}>
      <div className="panel-heading">
        <div><Typography className="panel-title">{t('Cash flow breakdown')}</Typography><Typography className="muted">{t('Where your money is going')}</Typography></div>
        <button className="more-button" aria-label={t('Cash flow details')}>···</button>
      </div>
      <div className="cashflow-content">
        <div className="donut-chart" style={{ background: `conic-gradient(${gradient})` }}>
          <div className="donut-hole"><span>{t('Balance')}</span><strong>{money(balance, currency)}</strong></div>
        </div>
        <div className="legend-list">
          {segments.map((item) => (
            <div className="legend-row" key={item.name}>
              <span className="legend-name"><i style={{ backgroundColor: item.color }} />{t(item.name)}</span>
              <strong>{money(item.value, currency)}</strong>
            </div>
          ))}
        </div>
      </div>
    </Paper>
  )
}

function TrendChart({ period, setPeriod, transactions, currency, language }) {
  const t = useTranslate()
  const locale = language === 'SW' ? 'sw-TZ' : 'en'
  const now = new Date()
  const buckets = Array.from({ length: 7 }, () => ({ income: 0, expense: 0 }))
  const monthLabels = ['1', '5', '10', '15', '20', '25', '30']
  const yearLabels = [0, 2, 4, 6, 8, 10, 11].map((month) => new Intl.DateTimeFormat(locale, { month: 'short' }).format(new Date(2026, month, 1)))
  const labels = period === 'Weekly'
    ? Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now)
      date.setDate(date.getDate() - 6 + index)
      return date.toLocaleDateString(locale, { weekday: 'short' })
    })
    : period === 'Monthly' ? monthLabels : yearLabels
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  transactions.forEach((item) => {
    if (item.type !== 'Income' && item.type !== 'Expense') return
    const date = new Date(`${item.date}T12:00:00`)
    if (Number.isNaN(date.getTime())) return
    let index
    if (period === 'Weekly') {
      date.setHours(0, 0, 0, 0)
      const daysAgo = Math.round((today.getTime() - date.getTime()) / 86400000)
      index = 6 - daysAgo
    } else if (period === 'Monthly') {
      if (date.getFullYear() !== now.getFullYear() || date.getMonth() !== now.getMonth()) return
      index = Math.min(6, Math.floor((date.getDate() - 1) / 5))
    } else {
      if (date.getFullYear() !== now.getFullYear()) return
      index = Math.min(6, Math.round(date.getMonth() / 11 * 6))
    }
    if (index >= 0 && index < buckets.length) buckets[index][item.type.toLowerCase()] += Number(item.amount)
  })
  const series = ['income', 'expense']
  const maxValue = Math.max(1, ...buckets.flatMap((bucket) => series.map((key) => bucket[key])))
  const yPosition = (value) => 110 - value / maxValue * 90
  const points = (key) => buckets.map((bucket, index) => `${index * 100},${yPosition(bucket[key])}`).join(' ')
  return (
    <Paper className="panel trend-panel" elevation={0}>
      <div className="panel-heading">
        <div><Typography className="panel-title">{t('Spending statistics')}</Typography><Typography className="muted">{t('Income vs. expenses')}</Typography></div>
        <ToggleButtonGroup size="small" exclusive value={period} onChange={(_, value) => value && setPeriod(value)}>
          {['Weekly', 'Monthly', 'Yearly'].map((item) => <ToggleButton key={item} value={item}>{t(item)}</ToggleButton>)}
        </ToggleButtonGroup>
      </div>
      <div className="chart-legend"><span><i className="income-dot" />{t('Income')}</span><span><i className="expense-dot" />{t('Expenses')}</span></div>
      <svg className="line-chart" viewBox="0 0 600 140" role="img" aria-label={t('Income and expenses chart')}>
        {[20, 50, 80, 110].map((y) => <line key={y} x1="0" x2="600" y1={y} y2={y} className="grid-line" />)}
        <polyline points={points('income')} className="line-income" />
        <polyline points={points('expense')} className="line-expense" />
        {buckets.map((bucket, index) => <g key={labels[index]}>
          <circle cx={index * 100} cy={yPosition(bucket.income)} r="3.5" className="chart-point-income"><title>{labels[index]} {t('Income')}: {money(bucket.income, currency)}</title></circle>
          <circle cx={index * 100} cy={yPosition(bucket.expense)} r="3.5" className="chart-point-expense"><title>{labels[index]} {t('Expenses')}: {money(bucket.expense, currency)}</title></circle>
          <text x={index * 100} y="135" className="chart-label">{labels[index]}</text>
        </g>)}
      </svg>
    </Paper>
  )
}

function GoalsWidget({ goals, onAdd, currency }) {
  const t = useTranslate()
  return <Paper className="panel goals-widget" elevation={0}>
    <div className="panel-heading"><div><Typography className="panel-title">{t('My goals')}</Typography><Typography className="muted">{t('Dream it. Save for it.')}</Typography></div><button className="more-button" aria-label={t('Goal options')}>···</button></div>
    {goals.slice(0, 2).map((goal) => <div className="goal-compact" key={goal.id}>
      <span className="goal-icon">{goal.icon}</span><div className="goal-info"><div><strong>{goal.name}</strong><small>{money(goal.saved, currency)} {t('of')} {money(goal.target, currency)}</small></div><div className="goal-bar"><span style={{ width: `${Math.min(100, goal.saved / goal.target * 100)}%` }} /></div></div><b>{Math.round(goal.saved / goal.target * 100)}%</b>
    </div>)}
    <Button className="outlined-action" fullWidth onClick={onAdd}>＋ {t('Add new goal')}</Button>
  </Paper>
}

export default function OverviewPage({
  user, t, loading, balance, income, expenses, savings, allOutgoings, budgetRemaining,
  currency, transactions, filteredTransactions, filter, setFilter, period, setPeriod,
  onGoToActivities, onEdit, onDelete, onDetails, budgets, spentByCategory,
  onAddBudget, onAddGoal, goals, language,
}) {
  const text = useTranslate()
  const hour = new Date().getHours()
  const greeting = hour >= 5 && hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Good night'
  const locale = language === 'SW' ? 'sw-TZ' : 'en'
  return <>
    <div className="welcome-row">
      <div><Typography className="eyebrow">{new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</Typography><Typography className="page-title">{t(greeting)}, {user.name.split(' ')[0]}</Typography><Typography className="muted">{text('Here’s your financial snapshot for today.')}</Typography></div>
      <Button className="period-button" variant="outlined">{text('This month')} <span>⌄</span></Button>
    </div>
    <div className="summary-grid">
      {loading ? Array.from({ length: 4 }, (_, index) => <Paper key={index} className="summary-card"><Skeleton height={128} /></Paper>) : <>
        <SummaryCard label={t('Total balance')} value={balance} icon="◈" change="+12.8%" tone="cyan" featured footnote={text('↑ 8.2% from last month')} currency={currency} />
        <SummaryCard label={t('Total income')} value={income} icon="↙" change="+8.2%" tone="green" footnote={text('vs. previous month')} currency={currency} />
        <SummaryCard label={t('Total expenses')} value={allOutgoings} icon="↗" change="-2.4%" tone="amber" footnote={text('vs. previous month')} currency={currency} />
        <SummaryCard label={t('Total savings')} value={savings} icon="▣" change={text('On track')} tone="blue" footnote={`${money(Math.max(0, budgetRemaining), currency)} ${text('budget remaining')}`} currency={currency} />
      </>}
    </div>
    <div className="analytics-grid">
      <CashFlowCard income={income} expenses={expenses} savings={savings} balance={balance} currency={currency} />
      <TrendChart period={period} setPeriod={setPeriod} transactions={transactions} currency={currency} language={language} />
    </div>
    <div className="bottom-grid">
      <Paper className="panel activity-panel" elevation={0}>
        <div className="panel-heading activity-heading"><div><Typography className="panel-title">{t('Recent activities')}</Typography><Typography className="muted">{text('Keep track of your latest transactions')}</Typography></div><Button onClick={onGoToActivities}>{text('View all')} <span>→</span></Button></div>
        <div className="filter-row">
          {['All', 'Income', 'Expense', 'Saving'].map((item) => <button key={item} onClick={() => setFilter(item)} className={`filter-chip ${filter === item ? 'selected' : ''}`}>{text(item)}</button>)}
        </div>
        <TransactionTable items={filteredTransactions.slice(0, 5)} onEdit={onEdit} onDelete={onDelete} onDetails={onDetails} currency={currency} />
      </Paper>
      <div className="widgets-column">
        <Paper className="panel budget-panel" elevation={0}>
          <div className="panel-heading"><div><Typography className="panel-title">{t('Monthly budget')}</Typography><Typography className="muted">{text('Track your spending limits')}</Typography></div><button className="more-button" aria-label={text('Budget options')}>···</button></div>
          <div className="budget-list">
            {budgets.map((budget) => {
              const spent = spentByCategory(budget.category)
              const percent = Math.min(100, Math.round(spent / Number(budget.limit) * 100))
              return <div className="budget-row" key={budget.id}>
                <div className="budget-row-heading"><span><i className={`category-icon ${budget.category.toLowerCase()}`}>{budget.category === 'Food' ? '♨' : budget.category === 'Rent' ? '⌂' : '↗'}</i>{text(budget.category)}</span><strong>{money(spent, currency)} <small>/ {money(budget.limit, currency)}</small></strong></div>
                <LinearProgress variant="determinate" value={percent} className={`budget-progress ${percent >= 100 ? 'over-budget' : percent >= budget.alert ? 'near-budget' : ''}`} />
              </div>
            })}
          </div>
          <Button className="outlined-action" fullWidth onClick={onAddBudget}>＋ {text('Set budget')}</Button>
        </Paper>
        <GoalsWidget goals={goals} onAdd={onAddGoal} currency={currency} />
      </div>
    </div>
  </>
}
