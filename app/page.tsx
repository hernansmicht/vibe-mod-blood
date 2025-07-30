'use client'

import TicTacToe from '../components/TicTacToe'
import styles from '../styles/home.module.css'

export default () => {
  return (
    <main className={styles.main}>
      <TicTacToe />
    </main>
  );
}
