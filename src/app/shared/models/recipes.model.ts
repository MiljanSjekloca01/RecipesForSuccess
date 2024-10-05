import { Review } from "./review.model";

export interface Recipe{
    id: string;
    title: string;
    description: string;
    imageUrl: string; // dodati Upload kasnije
    prepTime: string;
    cuisine?: string;
    type?: "public" | "private";
    owner: string;
    tags: string[];
    servings: string;
    ingredients?: string[];
    steps?:string[]
    reviews?: Review[];
    ratings?: number[];
    userId?: string;
    cookTime?: string;
    dietPreference?: string;
    //nutrition: Maybe
    //publishedOnDate
}

