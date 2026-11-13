import { Button, Paper } from '@mui/material'
import PageHeader from './PageHeader'
import TransactionTable from './TransactionTable'
import { useTranslate } from '../i18n/translations'

export default function ActivitiesPage({ transactions, filter, setFilter, onEdit, onDelete, onDetails, onAdd, currency }) {
  const t = useTranslate()
  return <><PageHeader eyebrow="YOUR MONEY, IN MOTION" title="Activities" subtitle="Every transaction, all in one place." action={<Button variant="contained" onClick={onAdd}>＋ {t('Add transaction')}</Button>} />
    <Paper className="panel full-table-panel" elevation={0}>
      <div className="filter-row">{['All', 'Income', 'Expense', 'Saving'].map((item) => <button key={item} onClick={() => setFilter(item)} className={`filter-chip ${filter === item ? 'selected' : ''}`}>{t(item)}</button>)}</div>
      <TransactionTable items={transactions} onEdit={onEdit} onDelete={onDelete} onDetails={onDetails} currency={currency} />
    </Paper>
  </>
}
