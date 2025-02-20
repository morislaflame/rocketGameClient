// src/components/ProductsList.tsx
import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "@/main"; 
// Или если вы отдельно импортируете productStore
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import styles from "./ShopComponents.module.css";
import { getTriesImg } from "@/utils/getPlanetImg";
import starImg from "@/assets/stars.svg";

const ProductsList: React.FC = observer(() => {
  // Предположим, вы храните productStore в Context
  const { product } = useContext(Context);

  useEffect(() => {
    product.fetchProducts();
  }, [product]);

//   if (product.loading) {
//     return <div>Loading products...</div>;
//   }

  const rewardImg = <img src={getTriesImg()} alt="Tries" />;

  return (
    <div className={styles.productList}>
        <ScrollArea className="h-[70vh] w-[100%] rounded-md" scrollHideDelay={1000}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {product.products.map((p: Product) => (
              
                <Card key={p.id} className={styles.productCard}>
                <CardHeader className={styles.productCardHeader}>
                    <CardTitle className={styles.productCardTitle}>
                        +{p.attempts} Launches {rewardImg}
                    </CardTitle>
                </CardHeader>
                <CardContent className={styles.productCardContent}>
                    <p>{p.starsPrice} </p>
                    <img src={starImg} alt="Star" className={styles.productCardStar} />
                    <Button onClick={() => product.buyProduct(p.id)}>Buy</Button>
                </CardContent>
                </Card>
            ))}
            </div>
        </ScrollArea>
    </div>
  );
});

export default ProductsList;
