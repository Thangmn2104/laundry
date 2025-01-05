import { ApiClient } from "@/constants/ApiClient";
import BaseService from "./base.service";

export class DashboardService extends BaseService {
    name: string;

    constructor() {
        super(null);
        this.name = 'dashboard';
    }

    getDashboard(reqObj: { timeRange: string, from: Date, to: Date }) {
        const { timeRange, from, to } = reqObj;
        const url = `/${this.name}?timeRange=${timeRange}&from=${from}&to=${to}`;
        return new Promise((resolve, reject) => {
            ApiClient.get(url)
                .then((response: { data: any }) => {
                    const res = response.data || {};
                    resolve(res);
                })
                .catch((err: any) => reject(err));
        });
    }

}