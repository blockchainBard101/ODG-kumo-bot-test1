import { SUI_CLIENT } from "./suiClient.ts";

export class SuiService {
    async getFormattedBalance(owner: string) {
        const res = await SUI_CLIENT.getBalance({
            owner,
        });
        return Number(Number(res.totalBalance) / 1000_000_000).toFixed(2);
    }

    async getEDXBalance(owner : string){
        const res = await SUI_CLIENT.getBalance({
            owner :owner,
            coinType : "0x25f8e17686a0bf2e8c0a67ea355b58e219700ae46f59eada4527f1fb1d30174a::my_first_coin::MY_FIRST_COIN"
        });
        console.log(Number(Number(res.totalBalance) / 1000_000).toFixed(2))
        return Number(Number(res.totalBalance) / 1000_000).toFixed(2);
    }

}

let ss = new SuiService()

console.log(ss.getFormattedBalance("0x2fe3a3c705a0b53592e8a71e281f22520b78b53b2db83ee88c63ef4e4acf0a72"))