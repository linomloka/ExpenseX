import { Stack } from "@mui/material"
import ExpenseItem from "./ExpenseItem"

function ExpenseList({expenses, deleteExpense, editExpense}) {
    return(
        <Stack>
            {expenses.map((expense) => (
            <ExpenseItem 
                key={expense.id} 
                expense={expense} 
                deleteExpense={deleteExpense} 
                editExpense={editExpense}
            /> 
        ))}
            
        </Stack>
    ) 
}
export default ExpenseList