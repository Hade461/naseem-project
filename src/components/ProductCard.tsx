import { Product, categoryLabel } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-paper border border-line rounded-sm overflow-hidden">
      <div className="aspect-square bg-paper-2 flex items-center justify-center text-text-mute overflow-hidden">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">🧺</span>
        )}
      </div>
      <div className="p-4">
        <h4 className="font-bold text-[1rem]">{product.name}</h4>
        <div className="text-text-mute text-[.8rem] mt-0.5">{categoryLabel(product.category)}</div>
        <div className="flex items-center justify-between mt-3.5">
          <span className="font-[Cairo] font-extrabold text-brass-dim text-[1.05rem]">{product.price}$</span>
          <span className={`text-[.75rem] ${product.in_stock ? "text-[#5C7A5A]" : "text-[#A34C3F]"}`}>
            {product.in_stock ? "متوفر" : "غير متوفر حالياً"}
          </span>
        </div>
      </div>
    </div>
  );
}
