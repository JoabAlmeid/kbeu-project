import React from "react";
import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
  { href: "/calças", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/camisas", name: "T-shirts", imageUrl: "/tshirts.jpg" },
  { href: "/sapatos", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/oculos", name: "Glasses", imageUrl: "/glasses.png" },
  { href: "/jaquetas", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/terno", name: "Suits", imageUrl: "/suits.jpg" },
  { href: "/mochila", name: "Bags", imageUrl: "/bags.jpg" },
];

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
          Explore Nossas Categorias
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Descubra os artigos de roupa em tendência na moda
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>
        {!isLoading && products.length > 0 && (
          <FeaturedProducts featuredProducts={products} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
