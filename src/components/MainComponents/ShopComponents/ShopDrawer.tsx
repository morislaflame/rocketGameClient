import React, { useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Context, IStoreContext } from '@/store/StoreProvider';
import styles from './ShopComponents.module.css';
import { FaShoppingCart } from "react-icons/fa";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ProductList from './ProductList';
import { Button } from '@/components/ui/button';

const ShopDrawer: React.FC = observer(() => {
  const { product } = React.useContext(Context) as IStoreContext;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Вызываем fetchProducts при открытии Drawer и устанавливаем состояние загрузки
  const handleShopOpen = useCallback(async () => {
    try {
      setIsLoading(true);
      await product.fetchProducts();
    } catch (error) {
      console.error("Error during fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [product]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          className={styles.shopButton}
          onClick={handleShopOpen}
          variant="secondary"
        >
          <FaShoppingCart /> Buy Rockets
        </Button>
      </DrawerTrigger>
      <DrawerContent className={styles.drawerContent}>
        <DrawerHeader>
          <DrawerTitle>Shop</DrawerTitle>
          <DrawerDescription>
            Buy additional rocket launches
          </DrawerDescription>
        </DrawerHeader>
        <ProductList isLoading={isLoading} />
      </DrawerContent>
    </Drawer>
  );
});

export default ShopDrawer;