import { Avatar, Button, Divider, Paper, Typography } from '@mui/material'
import { useState } from 'react'
import PageHeader from './PageHeader'
import { useTranslate } from '../i18n/translations'

export default function ProfilePage({ onSignOut, currency, user, language, profilePhoto, onProfilePhotoChange }) {
  const t = useTranslate()
  const [photoError, setPhotoError] = useState('')
  const memberSince = new Intl.DateTimeFormat(language === 'SW' ? 'sw-TZ' : 'en', { month: 'long', year: 'numeric' }).format(new Date(user.createdAt))
  const initials = user.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setPhotoError(t('Choose an image file.'))
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError(t('Choose an image smaller than 10 MB.'))
      return
    }

    try {
      const source = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Photo could not be read.'))
        reader.readAsDataURL(file)
      })
      const image = await new Promise((resolve, reject) => {
        const loadedImage = new Image()
        loadedImage.onload = () => resolve(loadedImage)
        loadedImage.onerror = () => reject(new Error('Photo could not be processed.'))
        loadedImage.src = source
      })
      const size = 512
      const cropSize = Math.min(image.naturalWidth, image.naturalHeight)
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      canvas.getContext('2d').drawImage(
        image,
        (image.naturalWidth - cropSize) / 2,
        (image.naturalHeight - cropSize) / 2,
        cropSize,
        cropSize,
        0,
        0,
        size,
        size,
      )
      onProfilePhotoChange(canvas.toDataURL('image/jpeg', 0.86))
      setPhotoError('')
    } catch {
      setPhotoError(t('Photo could not be processed.'))
    }
  }

  function removePhoto() {
    onProfilePhotoChange('')
    setPhotoError('')
  }

  return <><PageHeader eyebrow="YOUR ACCOUNT" title="Profile" subtitle="Your personal details and account preferences." />
    <Paper className="panel profile-card" elevation={0}>
      <div className="profile-identity">
        <Avatar src={profilePhoto || undefined} alt={t('Profile photo')} className="profile-large-avatar">{initials}</Avatar>
        <div><Typography variant="h5" fontWeight={800}>{user.name}</Typography><Typography className="muted">{user.email}</Typography></div>
      </div>
      <div className="profile-photo-actions">
        <Button component="label" variant="outlined">
          {t(profilePhoto ? 'Change photo' : 'Add profile photo')}
          <input hidden type="file" accept="image/*" onChange={handlePhotoChange} />
        </Button>
        {profilePhoto && <Button color="error" onClick={removePhoto}>{t('Remove photo')}</Button>}
      </div>
      {photoError && <Typography className="auth-error" role="alert">{photoError}</Typography>}
      <Divider />
      <div className="profile-info-grid"><span>{t('Account type')}</span><strong>{t('Personal')}</strong><span>{t('Member since')}</span><strong>{memberSince}</strong><span>{t('Preferred currency')}</span><strong>{currency === 'TZS' ? `TZS — ${t('Tanzanian shilling')}` : `USD — ${t('US dollar')}`}</strong></div>
      <Button color="error" variant="outlined" onClick={onSignOut}>{t('Log out')}</Button>
    </Paper>
  </>
}
