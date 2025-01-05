import { ApiClient } from "@/constants/ApiClient";
import BaseService from "./base.service";

export class OrderService extends BaseService {
    name: string;

    constructor() {
        super(null);
        this.name = 'order';
    }

    updateStatus(reqObj: { id: string; status: string }) {
        const { id, status } = reqObj;
        const url = `/${this.name}/${id}/status`;
        return new Promise((resolve, reject) => {
            ApiClient.put(url, { status })
                .then((response: { data: any }) => {
                    const res = response.data || {};
                    resolve(res);
                })
                .catch((err: any) => reject(err));
        });
    }

}