export type Category = "hand-tools" | "kitchen-electrics" | "home-appliances";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "hand-tools", label: "أدوات مطبخ يدوية" },
  { id: "kitchen-electrics", label: "كهربائيات المطبخ" },
  { id: "home-appliances", label: "أجهزة منزلية عامة" },
];

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  image_url: string | null;
  in_stock: boolean;
  created_at: string;
};
