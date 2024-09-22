import { getCoinDecimals } from "./get_coin_data";
export class Coins{
    coins : { [key: string]: string } = {
        "SUI": "0x2::sui::SUI",
        "FUD": "0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD",
        "BLUB": "0xfa7ac3951fdca92c5200d468d31a365eb03b2be9936fde615e69f0c1274ad3a0::BLUB::BLUB"
    };
    constructor(){

    }

    get_coins(){
        return Object.keys(this.coins)
    }

    get_coin_address(coin: string){
        const coin_address = this.coins[coin]
        if (coin_address === undefined){
            return null
        }
        return coin_address
    }

    async get_coin_name(coin_address: string){
        const decimals = await getCoinDecimals(coin_address);
        if (decimals !== null){
            return coin_address.substring(coin_address.lastIndexOf('::') + 2);
        }
        return null
    }
}

const coins = new Coins()
console.log(await coins.get_coin_name("0x::sui::SUI"))