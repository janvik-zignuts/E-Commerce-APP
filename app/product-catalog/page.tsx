import Header from '@/componnets/common/header';
import ProductCatalogInteractive from './componnets/productCatalogInteractive';
import { getProducts } from '../actions/getProducts';

export const metadata = {
  title: 'Product Catalog - FashionHub Commerce',
  description: 'Browse our extensive collection of fashion products including mens and womens clothing, accessories, and more. Filter by category, price, size, and brand.'
};


export default async function ProductCatalogPage() {
const products = await getProducts();
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        <ProductCatalogInteractive initialProducts={products as any} />
      </main>
    </> 
  );

}