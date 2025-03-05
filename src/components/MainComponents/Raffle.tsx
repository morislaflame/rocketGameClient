import { observer } from "mobx-react-lite"
  import styles from "./mainComponents.module.css"
  import CurrentRaffle from "./RaffleComponents/CurrentRaffle"

const Shop: React.FC = observer(() => { 
  return (
    <div className={styles.Container}>
      <CurrentRaffle />
    </div>
  )
})

export default Shop