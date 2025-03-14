// src/components/ProductsList.tsx
import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Context, IStoreContext } from "@/store/StoreProvider"; 
// Или если вы отдельно импортируете productStore
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import styles from "./ShopComponents.module.css";
import { getTriesImg } from "@/utils/getPlanetImg";
import starImg from "@/assets/stars.svg";
import { generateInvoice } from "@/http/productAPI";
import ListSkeleton from '../ListSkeleton';

interface ProductListProps {
  isLoading: boolean;
}

const ProductList: React.FC<ProductListProps> = observer(({ isLoading }) => {
  // Предположим, вы храните productStore в Context
  const { product, user } = useContext(Context) as IStoreContext;

  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    product.fetchProducts();
  }, [product]);

const buyProduct = async (productId: number) => {
  try {
    // 1) Запрос на сервер: получаем invoiceLink
    const invoiceLink = await generateInvoice(productId);
    console.log("invoiceLink =>", invoiceLink);
    try {
      tg?.openInvoice(invoiceLink, (status: string) => {
        console.log("status =>", status);
        if (status === "paid") {
          user.fetchMyInfo();
        }
      });
    } catch (error) {
      console.error("Error opening invoice:", error);
    }
  } catch (error) {
    console.error("Error generating invoice:", error);
  } 
}

  const rewardImg = <img src={getTriesImg()} alt="Tries" width={18} height={18}/>;

  return (
    <ScrollArea className="h-[70vh] w-[100%] rounded-md" scrollHideDelay={1000}>
      <div className={styles.productList}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
          {isLoading ? (
            <ListSkeleton count={5}/>
          ) : product.products.length ? (
            product.products.map((p: Product) => (
              <Card key={p.id} className="flex flex-row justify-between p-4">
                <CardHeader className="flex flex-col p-0">
                    <CardTitle className="text-m font-bold">
                        {p.name}
                    </CardTitle>
                    <CardDescription style={{ color: "#8E8E93" }} className='flex flex-row items-center gap-2'>
                      +{p.attempts} Launches {rewardImg}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-row gap-2 items-center p-0">
                    
                    <Button 
                    onClick={() => buyProduct(p.id)} 
                    variant="secondary" 
                    style={{
                      minWidth: "70px",
                      border: "1px solid hsl(0deg 0.67% 27.27%)",
                    }}
                    >
                      {p.starsPrice}
                      <img src={starImg} alt="Star" className={styles.productCardStar} />
                      
                    </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>Товары не найдены</p>
          )}
        </div>
      </div>
    </ScrollArea>
  );
});

export default ProductList;
