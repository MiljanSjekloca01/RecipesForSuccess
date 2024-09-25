import { Review } from "./review.model";

export interface Recipe{
    id: string;
    title: string;
    description: string;
    imageUrl: string; // dodati Upload kasnije
    prepTime: string;
    cousine?: string;
    type?: "public" | "private";
    owner: string;
    tags: string[];
    servings: string;
    ingredients?: string[];
    steps?:string[]
    reviews?: Review[];
    ratings?: number[];
    userId?: string;
    //nutrition: Maybe
    //publishedOnDate
}

