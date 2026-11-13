const today = new Date()
const toLocalDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const day = (offset) => {
  const date = new Date(today)
  date.setDate(date.getDate() - offset)
  return toLocalDate(date)
}

export const initialTransactions = [
  { id: 1, description: 'Monthly salary', amount: 3200, category: 'Salary', date: day(0), type: 'Income', notes: 'Monthly pay' },
  { id: 2, description: 'Grocery shopping', amount: 86.4, category: 'Food', date: day(1), type: 'Expense', notes: '' },
  { id: 3, description: 'Rent payment', amount: 950, category: 'Rent', date: day(2), type: 'Expense', notes: '' },
  { id: 4, description: 'Savings transfer', amount: 250, category: 'Savings', date: day(3), type: 'Saving', notes: 'Emergency fund' },
  { id: 5, description: 'Freelance project', amount: 480, category: 'Freelance', date: day(5), type: 'Income', notes: '' },
  { id: 6, description: 'Fuel', amount: 54, category: 'Transport', date: day(6), type: 'Expense', notes: '' },
  { id: 7, description: 'Coffee with friends', amount: 18.5, category: 'Food', date: day(8), type: 'Expense', notes: '' },
]

export const initialBudgets = [
  { id: 'food', category: 'Food', limit: 450, alert: 80 },
  { id: 'transport', category: 'Transport', limit: 220, alert: 80 },
  { id: 'rent', category: 'Rent', limit: 1000, alert: 90 },
]

export const initialGoals = [
  { id: 'trip', name: 'Summer getaway', target: 2400, saved: 1320, icon: '✈' },
  { id: 'laptop', name: 'New laptop', target: 1800, saved: 900, icon: '⌘' },
]
