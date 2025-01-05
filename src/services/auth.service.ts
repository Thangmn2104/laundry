import BaseService from "./base.service";
import { ApiClient } from "@/constants/ApiClient";

class AuthService extends BaseService {
    name: any

    constructor(name: string) {
        super(null);
        this.name = name
    }

    async login(reqObj: any) {
        const url = `/${this.name}/login`
        return new Promise((resolve, reject) => {
            ApiClient.post(url, reqObj).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })

    }


    async forgotPassword(reqObj: any) {
        const url = `/${this.name}/forgot-password`
        return new Promise((resolve, reject) => {
            ApiClient.post(url, reqObj).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    async resetPassword(reqObj: any) {
        const { token } = reqObj
        delete reqObj.token
        const url = `/${this.name}/reset-password?t=${token}`
        return new Promise((resolve, reject) => {
            ApiClient.post(url, reqObj.password, {
                headers: {
                    "Content-Type": 'text/plain'
                }
            }).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })

    }

    async logOut() {
        return new Promise((resolve) => {
            resolve('Đăng xuất thành công')
        })
    }

    async me() {
        const url = `/${this.name}/me`
        return new Promise((resolve, reject) => {
            ApiClient.get(url).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })

    }

}

export default AuthService;
