export interface NutritionModel {
    title: string;
    imageUrl: string;
    text: string;
    group: "ingredients" | "vitamins" | "minerals"; // Ova svojstva mogu biti 'ingredients', 'vitamins', 'minerals'
  }