export interface AddProductInputDto {
    id?: string,
    name: string,
    description: string,
    purchasedPrice: number,
    stock: number,
}

export interface AddProductOutputDto {
    id: string,
    name: string,
    description: string,
    purchasedPrice: number,
    stock: number,
    createdAt: Date,
    updatedAt: Date,
}