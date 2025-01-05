import { ApiClient } from "@/constants/ApiClient";
import BaseService from "./base.service";

export class ProductService extends BaseService {
    name: any

    constructor() {
        super(null);
        this.name = 'product'
    }

    removeMany(reqObj: { ids: string[]; }) {
        const { ids } = reqObj;
        const url = `/${this.name}/removeMany`;
        return new Promise((resolve, reject) => {
            ApiClient.post(url, { ids })
                .then((response: { data: {}; }) => {
                    const res = response.data || {};
                    resolve(res);
                })
                .catch((err: any) => reject(err));
        });
    }

    importProducts(formData: FormData) {
        const url = `/${this.name}/import`;
        return new Promise((resolve, reject) => {
            ApiClient.post(url, formData)
                .then((response: { data: {}; }) => {
                    const res = response.data || {};
                    resolve(res);
                })
                .catch((err: any) => reject(err));
        });
    }
}