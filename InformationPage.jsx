import { Paper, Typography } from '@mui/material'
import PageHeader from './PageHeader'
import { useTranslate } from '../i18n/translations'

export default function InformationPage({ eyebrow, title, subtitle, sections }) {
  const t = useTranslate()
  return <>
    <PageHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
    <Paper className="panel information-card" elevation={0}>
      {sections.map(({ heading, text }) => (
        <section className="information-section" key={heading}>
          <Typography className="panel-title" component="h2">{t(heading)}</Typography>
          <Typography className="muted">{t(text)}</Typography>
        </section>
      ))}
    </Paper>
  </>
}
