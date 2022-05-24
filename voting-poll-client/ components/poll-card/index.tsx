import styles from './styles.module.css';
import Link from "next/link";

const PollCard = ({title, description, id}: {title: string; description: string, id: string}) => {
    
    return (
         <Link href={`/${id}`}><a className={styles.card}>
            <h2>{title} &rarr;</h2>
            <p>{description}</p>
          </a></Link>
    )
}

export default PollCard;