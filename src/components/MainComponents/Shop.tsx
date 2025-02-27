import { observer } from "mobx-react-lite"
import styles from "./mainComponents.module.css"
import TicketsDrawer from "./RaffleComponents/TicketsDrawer"
import CurrentRaffle from "./RaffleComponents/CurrentRaffle"

const Shop: React.FC = observer(() => { 
  return (
    <div className={styles.productsContainer}>
      
      <CurrentRaffle />
      <TicketsDrawer />
    </div>
  )
})

export default Shop