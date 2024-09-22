export const getCoinDecimals = async (coin: string): Promise<number | null> => {
    const url = 'https://fullnode.mainnet.sui.io:443';

    const body = {
        jsonrpc: "2.0",
        id: 1,
        method: "suix_getCoinMetadata",
        params: [
            coin
        ]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        const decimals = data.result.decimals;
        return decimals;
    } catch (error) {
        // console.error('Error fetching coin metadata:', error);
        return null;
    }
};

export const getCoinBalance = async (address: string, coin: string): Promise<number | null> => {
    const url = 'https://fullnode.mainnet.sui.io:443';

    const body = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "suix_getBalance",
        "params": [
            address,
            coin
        ]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const coin_decimal = await getCoinDecimals(coin);
        if (coin_decimal !== null) {
            const data = await response.json();
            const balance = data.result.totalBalance;
            const main_balance = Number(balance) * 10 ** (-1 * coin_decimal);
            return main_balance;
        }
        return null

    } catch (error) {
        // console.error('Error fetching coin metadata:', error);
        return null;
    }

};

export const getAllBalances = async (address: string) => {
    const url = 'https://fullnode.mainnet.sui.io:443';
    const body = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "suix_getAllBalances",
        "params": [
            address
        ]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        if (data.result !== null) {
            const coinDictionary = data.result.reduce((acc: { [key: string]: string }, item: { coinType: string, totalBalance: string }) => {
                // Extract the part after the last "::"
                const coinName = item.coinType.split('::').pop();
                if (coinName) {
                    acc[coinName] = item.totalBalance;
                }
                return acc;
            }, {});

            console.log(coinDictionary);
            return coinDictionary;
        }
        return null

    } catch (error) {
        // console.error('Error fetching coin metadata:', error);
        return null;
    }
}

export const getCoinNames = async (address: string) => {
    const url = 'https://fullnode.mainnet.sui.io:443';
    const body = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "suix_getAllBalances",
        "params": [
            address
        ]
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        if (data.result !== null) {
            const coinNames = data.result.map((item: { coinType: string, totalBalance: string }) => item.coinType.split('::').pop());
            return coinNames;
        }
        return null;
    
    } catch (error) {
        // console.error('Error fetching coin metadata:', error);
        return null;
    }
}
// console.log(await getCoinBalance("0x48dfdd7c1acb1b4919e1b4248206af584bef882f126f1733521ac41eb13fb77b",'0x2::sui::SUI'))
console.log(await getCoinNames("0x48dfdd7c1acb1b4919e1b4248206af584bef882f126f1733521ac41eb13fb77b"))
