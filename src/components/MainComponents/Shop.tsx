import { observer } from "mobx-react-lite"
import ProductsList from "./ShopComponents/ProductList"
import styles from "./mainComponents.module.css"

const Shop: React.FC = observer(() => { 
  return (
    <div className={styles.productsContainer}>
      <div className='grid gap-1.5 p-4 text-center sm:text-left'>
        <h2 className='text-lg font-semibold leading-none tracking-tight'>Shop</h2>
        <p className="text-sm text-muted-foreground">Buy products to get stars</p>
      </div>
      <ProductsList />
    </div>
  )
})

export default Shop