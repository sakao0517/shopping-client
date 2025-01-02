import styles from "./page.module.css";
import Product from "./_components/Product/Product";
import { getProduct } from "@/actions/product";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(id);

  return {
    title: product?.name,
    description: product?.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className={styles.product}>
      <Product id={id} />
    </div>
  );
}
