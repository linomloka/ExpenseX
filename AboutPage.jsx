import InformationPage from './InformationPage'

export default function AboutPage() {
  return <InformationPage
    eyebrow="ABOUT EXPENSEX"
    title="About"
    subtitle="A clearer view of your money, one small step at a time."
    sections={[
      { heading: 'Your personal finance space', text: 'ExpenseX helps you organize income, expenses, budgets, and savings goals in one simple dashboard.' },
      { heading: 'Built for everyday progress', text: 'Use your activity history and budget tracking to understand your spending and make progress toward the goals that matter to you.' },
      { heading: 'A browser-based demo', text: 'This version stores account and finance information in your browser. It is a personal tracking tool, not a bank or a financial adviser.' },
    ]}
  />
}
