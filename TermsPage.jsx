import InformationPage from './InformationPage'

export default function TermsPage() {
  return <InformationPage
    eyebrow="PLEASE READ"
    title="Terms of Service"
    subtitle="These terms describe the use of the ExpenseX browser demo."
    sections={[
      { heading: 'Using ExpenseX', text: 'ExpenseX is provided as a personal expense-tracking tool. You are responsible for the accuracy of the information you enter and for keeping access to your device and browser profile secure.' },
      { heading: 'Not financial advice', text: 'ExpenseX provides general organization and budgeting features only. Nothing in the app is financial, investment, tax, or legal advice. Make financial decisions using your own judgment and consult a qualified professional when needed.' },
      { heading: 'Demo limitations', text: 'This version stores information in the current browser and does not provide a server account or guaranteed backup. Do not rely on it as the sole copy of important financial records. Features may change and are provided without a guarantee of uninterrupted availability.' },
      { heading: 'Acceptable use', text: 'Use the app only for lawful purposes and do not attempt to disrupt its operation or access another person’s information.' },
    ]}
  />
}
