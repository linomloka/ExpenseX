import { Button, Stack, Typography } from "@mui/material"
import { useTranslate } from '../i18n/translations'

function ExpenseItem({expense, deleteExpense, editExpense}) {
    const t = useTranslate()
    return(
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography sx={{ flex: 1 }}>{expense.description}</Typography>
            <Button size="small" onClick={() => editExpense(expense.id)}>{t('Edit')}</Button>
            <Button size="small" color="error" onClick={() => deleteExpense(expense.id)}>{t('Delete')}</Button>
        </Stack>
    )
}
export default ExpenseItem