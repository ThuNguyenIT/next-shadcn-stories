export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    created_at: string;
    updated_at: string;
}
export interface GetCategoryResponse<T> {
    message: string;
    data: T;
}