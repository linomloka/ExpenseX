import { Button, LinearProgress, Paper, Typography } from '@mui/material'
import { formatMoney as money } from '../utils/currency'
import PageHeader from './PageHeader'
import { useTranslate } from '../i18n/translations'

export default function GoalsPage({ goals, onAdd, onDelete, currency }) {
  const t = useTranslate()
  return <><PageHeader eyebrow="SMALL STEPS, BIG DREAMS" title="My goals" subtitle="Celebrate progress toward what matters to you." action={<Button variant="contained" onClick={onAdd}>＋ {t('Add new goal')}</Button>} />
    <div className="goals-page-grid">{goals.map((goal) => {
      const percent = Math.min(100, Math.round(goal.saved / goal.target * 100))
      return <Paper className="panel goal-detail-card" key={goal.id} elevation={0}>
        <div className="goal-card-top"><span className="large-goal-icon">{goal.icon}</span><button className="more-button" aria-label={`${t('Delete')} ${goal.name}`} onClick={() => onDelete(goal.id)}>×</button></div>
        <Typography className="panel-title">{goal.name}</Typography><Typography className="muted">{money(goal.saved, currency)} {t('saved')} {t('of')} {money(goal.target, currency)}</Typography>
        <LinearProgress variant="determinate" value={percent} className="goal-progress" />
        <div className="goal-progress-caption"><span>{percent}% {t('complete')}</span><strong>{money(Math.max(0, goal.target - goal.saved), currency)} {t('to go')}</strong></div>
      </Paper>
    })}<button className="new-goal-card" onClick={onAdd}><span>＋</span><strong>{t('Start a new goal')}</strong><small>{t('Give your next big idea a plan.')}</small></button></div>
  </>
}
