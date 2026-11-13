import { Button, Divider, Paper, Stack, Typography } from '@mui/material'
import PageHeader from './PageHeader'
import { useTranslate } from '../i18n/translations'

export default function ContactPage() {
  const t = useTranslate()
  const email = 'linoxmlokadc@gmail.com'
  const mobile = '+255747945986'
  const emailHref = `mailto:${email}?subject=${encodeURIComponent('Message from ExpenseX')}`
  const smsHref = `sms:${mobile}?body=${encodeURIComponent('Hello, I would like to get in touch about ExpenseX.')}`
  return <>
    <PageHeader eyebrow={t('GET IN TOUCH')} title={t('Contact')} subtitle={t('Questions or feedback? Reach out using either option below.')} />
    <Paper className="panel contact-card" elevation={0}>
      <div className="contact-option">
        <span className="contact-icon" aria-hidden="true">✉</span>
        <div>
          <Typography className="panel-title" component="h2">{t('Email')}</Typography>
          <Typography className="muted">{t('Send us a message. Your email app will open with the address filled in.')}</Typography>
          <a className="contact-link" href={emailHref}>{email}</a>
        </div>
        <Button component="a" href={emailHref} variant="contained">{t('Send email')}</Button>
      </div>
      <Divider />
      <div className="contact-option">
        <span className="contact-icon" aria-hidden="true">☎</span>
        <div>
          <Typography className="panel-title" component="h2">{t('Mobile')}</Typography>
          <Typography className="muted">{t('Call or save this number to get in touch.')}</Typography>
          <a className="contact-link" href={`tel:${mobile}`}>+255 747 945 986</a>
        </div>
        <Stack direction="row" spacing={1}>
          <Button component="a" href={smsHref} variant="contained">{t('Send text message')}</Button>
          <Button component="a" href={`tel:${mobile}`} variant="outlined">{t('Call')}</Button>
        </Stack>
      </div>
    </Paper>
  </>
}
