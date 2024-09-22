import { getQuote, buildTx, getSuiPrice, estimateGasFee } from "@7kprotocol/sdk-ts";
import { getCoinDecimals } from "./get_coin_data";
import { SUI_CLIENT } from "./suiClient";
import { AuthService } from "./authService";

export class SuiTransactionProcessor {
    partner_address: string;
    constructor() {
        this.partner_address = "0x48dfdd7c1acb1b4919e1b4248206af584bef882f126f1733521ac41eb13fb77b";
    }
    async getQuote(tokenIn: string, tokenOut: string, amountIn: number) {
        const decimals = await getCoinDecimals(tokenIn);
        if (decimals === null) {
            return null
        } else {
            const quoteResponse = await getQuote({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                amountIn: (amountIn * 10 ** decimals).toString(),
            });
            return quoteResponse;
        }
    }

    async getGasFeesAndReturnAmount(tokenIn: string, tokenOut: string, amountIn: number, slippage: number) {
        const quoteResponse = await this.getQuote(tokenIn, tokenOut, amountIn)
        if (quoteResponse) {
            const account_address = AuthService.walletAddress()
            const suiPrice = await getSuiPrice();
            const GasfeeInUsd = await estimateGasFee({
                quoteResponse,
                accountAddress: account_address,
                slippage: slippage, // 1%
                suiPrice,
                commission: {
                    partner: this.partner_address,
                    commissionBps: 50, // 0 means no fee, 1bps = 0.01%, for example, 20bps = 0.2%
                },
            });
            const ReturnAmount = quoteResponse.returnAmount;
            return { ReturnAmount, GasfeeInUsd };
        } else {
            return null;
        }

    }

    async convert(tokenIn: string, tokenOut: string, amountIn: number, slippage: number) {
        const quoteResponse = await this.getQuote(tokenIn, tokenOut, amountIn)
        if (quoteResponse) {
            const account_address = AuthService.walletAddress()
            const result = await buildTx({
                quoteResponse,
                accountAddress: account_address,
                slippage: slippage, // 1%
                commission: {
                    partner: this.partner_address,
                    commissionBps: 10, // 0 means no fee, 1bps = 0.01%, for example, 20bps = 0.2%
                },
            });

            const { tx, coinOut } = result || {};
            const tx_result = await this.transact(tx);
            console.log(tx_result)
        }
    }

    private async transact(tx: any) {
        const keypair = AuthService.getEd25519Keypair();
        const sender = AuthService.walletAddress()
        tx.setSender(sender);
        const { bytes, signature: userSignature } = await tx.sign({
            client: SUI_CLIENT,
            signer: keypair,
        });
        const zkLoginSignature : any= await AuthService.generateZkLoginSignature(userSignature);
        return SUI_CLIENT.executeTransactionBlock({
            transactionBlock: bytes,
            signature: zkLoginSignature,
        });
        // return SUI_CLIENT.signAndExecuteTransaction({
        //     signer: keypair,
        //     transaction: tx,
        //     options: {
        //         showBalanceChanges: true,
        //         showEvents: true,
        //         showInput: false,
        //         showEffects: true,
        //         showObjectChanges: true,
        //         showRawInput: false,
        //     }
        // });
    }
}

// let tx = new SuiTransactionProcessor()
// const result = await tx.getGasFeesAndReturnAmount("0x48dfdd7c1acb1b4919e1b4248206af584bef882f126f1733521ac41eb13fb77b", '0x2::sui::SUI', '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS', 1, 0.01);

// if (result !== null) {
//     console.log(result.ReturnAmount);
//     console.log(result.GasfeeInUsd);
// } else {
//     console.log('Invalid token or quote data');
// }