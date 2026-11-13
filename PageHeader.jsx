import { Typography } from '@mui/material'
import { useTranslate } from '../i18n/translations'

export default function PageHeader({ eyebrow, title, subtitle, action }) {
  const t = useTranslate()
  return (
    <div className="welcome-row page-header-row">
      <div>
        <Typography className="eyebrow">{t(eyebrow)}</Typography>
        <Typography className="page-title">{t(title)}</Typography>
        <Typography className="muted">{t(subtitle)}</Typography>
      </div>
      {action}
    </div>
  )
}
