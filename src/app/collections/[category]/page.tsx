import styles from "./page.module.css";
import Collections from "./_components/Collections/Collections";
import { getCategory } from "@/actions/category";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return {
    title: category.toUpperCase(),
    description: "", //페이지 설명
  };
}
export default async function CollectionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page: string }>;
}) {
  const categoryData = await getCategory();
  const { category } = await params;
  const { page } = await searchParams;
  // const productPageSetting = await getProductPageSetting();
  return (
    <div className={styles.collections}>
      <Collections
        categories={categoryData.category}
        category={category}
        currentPage={Number(page) || 1}
        // productMaxLength={productPageSetting.productMaxLength}
        productMaxLength={12} //product 개수
      />
    </div>
  );
}
