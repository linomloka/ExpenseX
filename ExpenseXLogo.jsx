import styles from './ExpenseXLogo.module.css'

export function ExpenseXIcon({ className = '', decorative = false }) {
  return (
    <svg
      className={`${styles.icon} ${className}`.trim()}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : 'ExpenseX'}
    >
      <path d="M12 14.5 31.7 5.2a3.2 3.2 0 0 1 4.3 1.5l2 4.2" stroke="#2EC4B6" strokeWidth="4" strokeLinecap="round" />
      <path d="m9 17.5 24-9.4a3.2 3.2 0 0 1 4.2 1.7l2.1 5" stroke="#00B4D8" strokeWidth="4" strokeLinecap="round" />
      <rect x="4" y="13" width="40" height="29" rx="7" fill="#003049" stroke="#00B4D8" strokeWidth="1.5" />
      <path d="M8 18h16" stroke="#9CB3C2" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
      <path d="M13 32v4m5-8v8m5-12v12" stroke="#2EC4B6" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 25h10a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H30a5.5 5.5 0 0 1 0-11Z" fill="#00B4D8" />
      <circle cx="32.5" cy="30.5" r="1.5" fill="#003049" />
    </svg>
  )
}

export default function ExpenseXLogo({ iconOnly = false, className = '', tagline = false, taglineText = 'Your Personal Finance Tracker' }) {
  return (
    <span className={`${styles.logo} ${iconOnly ? styles.iconOnly : ''} ${className}`.trim()} role="img" aria-label="ExpenseX">
      <ExpenseXIcon decorative />
      {!iconOnly && (
        <span className={styles.wordmark} aria-hidden="true">
          <span>Expense</span><span className={styles.accent}>X</span>
          {tagline && <span className={styles.tagline}>{taglineText}</span>}
        </span>
      )}
    </span>
  )
}
