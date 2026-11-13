import { Chip, Divider, MenuItem, Paper, Select } from '@mui/material'
import PageHeader from './PageHeader'
import { useTranslate } from '../i18n/translations'

export default function SettingsPage({ mode, setMode, language, setLanguage, currency, setCurrency }) {
  const t = useTranslate()
  return <><PageHeader eyebrow={t('MAKE IT YOURS')} title={t('Settings')} subtitle={t('Tune your ExpenseX experience.')} />
    <Paper className="panel settings-card" elevation={0}><div className="settings-row"><div><strong>{t('Appearance')}</strong><small>{t('Choose the look that feels right for you.')}</small></div><Select size="small" value={mode} onChange={(event) => setMode(event.target.value)}><MenuItem value="dark">{t('Dark mode')}</MenuItem><MenuItem value="light">{t('Light mode')}</MenuItem></Select></div><Divider /><div className="settings-row"><div><strong>{t('Language')}</strong><small>{t('Switch the interface language.')}</small></div><Select size="small" value={language} onChange={(event) => setLanguage(event.target.value)}><MenuItem value="EN">{t('English')}</MenuItem><MenuItem value="SW">{t('Kiswahili')}</MenuItem></Select></div><Divider /><div className="settings-row"><div><strong>{t('Currency')}</strong><small>{t('1 USD = TZS 2,500 for this demo; no live exchange-rate feed.')}</small></div><Select size="small" value={currency} onChange={(event) => setCurrency(event.target.value)}><MenuItem value="TZS">TZS · {t('Tanzanian shilling')}</MenuItem><MenuItem value="USD">USD · {t('US dollar')}</MenuItem></Select></div><Divider /><div className="settings-row"><div><strong>{t('Local data')}</strong><small>{t('Your demo data is stored in this browser.')}</small></div><Chip color="success" label={t('Saved automatically')} /></div></Paper>
  </>
}
