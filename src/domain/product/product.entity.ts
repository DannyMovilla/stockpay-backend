export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public price: number,
    public stock: number,
    public imageUrl: string,
    public active: boolean,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
