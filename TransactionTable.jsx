import { Chip } from '@mui/material'
import { formatMoney as money } from '../utils/currency'
import { useTranslate } from '../i18n/translations'

export default function TransactionTable({ items, onEdit, onDelete, onDetails, currency }) {
  const t = useTranslate()
  return <div className="transaction-table">
    <div className="table-head"><span>{t('Transaction')}</span><span>{t('Date')}</span><span>{t('Category')}</span><span>{t('Amount')}</span><span /></div>
    {items.length === 0 && <div className="empty-row">{t('No transactions match your search yet.')}</div>}
    {items.map((item) => <div className="transaction-row" key={item.id}>
      <button className="transaction-title" onClick={() => onDetails(item)}><span className={`transaction-icon ${item.type?.toLowerCase() || 'expense'}`}>{item.type === 'Income' ? '↙' : item.type === 'Saving' ? '▣' : '↗'}</span><span><strong>{item.description}</strong><small>{item.notes || t(item.category)}</small></span></button>
      <span className="transaction-date">{new Date(`${item.date}T12:00:00`).toLocaleDateString(document.documentElement.lang || 'en', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      <span><Chip size="small" label={t(item.type || 'Expense')} className={`type-chip ${(item.type || 'Expense').toLowerCase()}`} /></span>
      <strong className={`transaction-amount ${item.type === 'Income' ? 'positive' : ''}`}>{item.type === 'Income' ? '+' : '−'}{money(Number(item.amount), currency)}</strong>
      <div className="row-actions"><button title={t('View details')} onClick={() => onDetails(item)}>···</button><button title={t('Edit transaction')} onClick={() => onEdit(item.id)}>✎</button><button title={t('Delete transaction')} onClick={() => onDelete(item.id)}>×</button></div>
    </div>)}
  </div>
}
