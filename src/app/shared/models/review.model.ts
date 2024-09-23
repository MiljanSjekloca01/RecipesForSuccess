export interface Review {
    id?: string;
    user_id: string;
    commentText?: string;
    rating?: number;
    likes?: {userId: string}[];
    by: string;
}