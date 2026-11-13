import InformationPage from './InformationPage'

export default function PrivacyPage() {
  return <InformationPage
    eyebrow="YOUR INFORMATION"
    title="Privacy Policy"
    subtitle="How information is handled in this ExpenseX browser demo."
    sections={[
      { heading: 'Information stored on your device', text: 'Account details and the transactions, budgets, goals, and preferences you enter are stored in browser local storage on this device. This demo does not send those records to an ExpenseX server.' },
      { heading: 'Your control', text: 'Your browser profile is used to access locally stored information. Other people with access to that browser profile or device may be able to view it. Clearing browser site data can remove your ExpenseX information, so keep any records you need separately.' },
      { heading: 'Contacting us', text: 'If you email or call us, the information you choose to share is handled by the email or phone services you use. Please do not include passwords or sensitive financial details in a message.' },
      { heading: 'Changes', text: 'This notice describes the current demo. If the way the app handles information changes, this policy should be updated to reflect those changes.' },
    ]}
  />
}
