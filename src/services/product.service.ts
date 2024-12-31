import BaseService from "./base.service";

export class ProductService extends BaseService {
    name: any

    constructor() {
        super(null);
        this.name = 'product'
    }
}