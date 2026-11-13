import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useState } from 'react'
import { formatInputAmount, toBaseCurrency } from '../utils/currency'
import { useTranslate } from '../i18n/translations'

function currentDate() {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function ExpenseForm({ expenseUpdater, editingExpense, updateExpense, clearEditing, onSuccess, currency = 'TZS' }) {

    const t = useTranslate()
    const [error, setError] = useState("")
    const [description, setDescription] = useState(editingExpense?.description || "")
    const [amount, setAmount] = useState(editingExpense ? formatInputAmount(editingExpense.amount, currency) : "")
    const [category, setCategory] = useState(editingExpense?.category || "")
    const [date, setDate] = useState(editingExpense?.date || currentDate())
    const [type, setType] = useState(editingExpense?.type || "Expense")
    const [notes, setNotes] = useState(editingExpense?.notes || "")

    function resetForm() {
        setDescription("")
        setAmount("")
        setCategory("")
        setDate(currentDate())
        setType("Expense")
        setNotes("")
        setError("")
    }

    function handleSubmit(e) {
        e.preventDefault();
        setError("")
        if(!description.trim()){
            setError(t('Invalid description!'))
            return
        }

        if(!Number.isFinite(Number(amount)) || Number(amount) <= 0){
            setError(t('Invalid amount!'))
            return
        }

        if(!category.trim()) {
            setError(t('Please select a category!'))
            return
        }

        if(date === '') {
            setError(t('Please select a date!'))
            return
        }

        if(editingExpense !== null) {
            const updatedExpense ={
                id: editingExpense.id,
                description: description.trim(),
                amount: toBaseCurrency(amount, currency),
                category,
                date,
                type,
                notes: notes.trim(),
            }
            updateExpense(updatedExpense);
            clearEditing()
        }
        else{
            const newExpense = {
                id: Date.now(),
                description: description.trim(),
                amount: toBaseCurrency(amount, currency),
                category,
                date,
                type,
                notes: notes.trim(),
            }
            expenseUpdater(newExpense); 
            resetForm()
        }
        onSuccess?.()
    }

    return(
        <Stack component='form' spacing={2} onSubmit={handleSubmit}>
            <ToggleButtonGroup
                exclusive
                fullWidth
                value={type}
                onChange={(_, value) => value && setType(value)}
                aria-label={t('Transaction type')}
            >
                {['Expense', 'Income', 'Saving'].map((option) => (
                    <ToggleButton key={option} value={option}>{t(option)}</ToggleButton>
                ))}
            </ToggleButtonGroup>
            <TextField label={t('Title')}
                       value={description}
                       onChange={(e) => { setDescription(e.target.value); setError("") }}
                       autoFocus
                       required>
            </TextField>

            <TextField label={`${t('Amount')} (${currency})`}
                       type='number'
                       slotProps={{ htmlInput: { min: currency === 'TZS' ? '1' : '0.01', step: currency === 'TZS' ? '1' : '0.01' } }}
                       value={amount}
                       onChange={(e) => { setAmount(e.target.value); setError("") }}
                       required>
            </TextField>

            <FormControl required>
                <InputLabel id="transaction-category-label">{t('Category')}</InputLabel>
                <Select labelId="transaction-category-label" label={t('Category')}
                       value={category}
                       onChange={(e) => setCategory(e.target.value)}>
                    {['Food', 'Transport', 'Rent', 'Shopping', 'Utilities', 'Health', 'Salary', 'Freelance', 'Savings', 'Other'].map((option) => (
                        <MenuItem key={option} value={option}>{t(option)}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField label={t('Date')}
                       type='date'
                       slotProps={{ inputLabel: { shrink: true } }}
                       value={date}
                       onChange={(e) => setDate(e.target.value)}
                       required>
            </TextField>
            <TextField label={t('Notes (optional)')} value={notes} onChange={(e) => setNotes(e.target.value)} multiline minRows={2} />

            {error && <Typography color='error'>{error}</Typography>}

            <Button variant='contained' type='submit'>
                {t(editingExpense === null ? 'Save transaction' : 'Update transaction')}
            </Button>
        </Stack>

    )
}
export default ExpenseForm