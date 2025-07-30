import styles from './Cell.module.css'

export default function Cell({ value, onClick, disabled }) {
  return (
    <button 
      className={styles.cell} 
      onClick={onClick} 
      disabled={disabled}
    >
      {value}
    </button>
  )
}