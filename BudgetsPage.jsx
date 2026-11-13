import { Button, Chip, LinearProgress, Paper, Typography } from '@mui/material'
import { formatMoney as money } from '../utils/currency'
import PageHeader from './PageHeader'
import { useTranslate } from '../i18n/translations'

export default function BudgetsPage({ budgets, spentByCategory, onAdd, currency }) {
  const t = useTranslate()
  return <><PageHeader eyebrow="SPEND WITH INTENTION" title="Budgets" subtitle="A plan for every dollar you earn." action={<Button variant="contained" onClick={onAdd}>＋ {t('Set budget')}</Button>} />
    <div className="budget-cards-grid">{budgets.map((budget) => {
      const spent = spentByCategory(budget.category)
      const percent = Math.round(spent / budget.limit * 100)
      return <Paper className="panel budget-detail-card" key={budget.id} elevation={0}>
        <div className="budget-card-top"><span className={`category-icon ${budget.category.toLowerCase()}`}>{budget.category === 'Food' ? '♨' : budget.category === 'Rent' ? '⌂' : '↗'}</span><Chip label={percent >= 100 ? t('Over budget') : `${Math.max(0, 100 - percent)}% ${t('left')}`} size="small" className={percent >= 100 ? 'alert-chip' : 'type-chip income'} /></div>
        <Typography className="panel-title">{t(budget.category)}</Typography><Typography className="budget-big-amount">{money(spent, currency)} <small>{t('spent')}</small></Typography>
        <LinearProgress variant="determinate" value={Math.min(100, percent)} className={`budget-progress ${percent >= 100 ? 'over-budget' : percent >= budget.alert ? 'near-budget' : ''}`} />
        <Typography className="muted">{money(Math.max(0, budget.limit - spent), currency)} {t('remaining')} {t('of')} {money(budget.limit, currency)} · {t('alert at')} {budget.alert}%</Typography>
      </Paper>
    })}</div>
  </>
}
