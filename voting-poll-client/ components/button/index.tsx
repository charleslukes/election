import styles from './styles.module.css'

type IVotaButton = {
  handleClick: () => void 
}

const VotaButton = ({handleClick}: IVotaButton) => {
  return <button onClick={handleClick} className={styles.btn}>
    Connect Wallet
  </button>
    
}


export default VotaButton
