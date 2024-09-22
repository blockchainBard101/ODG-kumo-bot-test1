import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

const rpcUrl = getFullnodeUrl("mainnet");

export const SUI_CLIENT = new SuiClient({ url: rpcUrl});

