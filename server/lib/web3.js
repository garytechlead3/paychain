import Web3 from 'web3';
import config from '../../config/config';

const web3 = new Web3(config.web3.provider_url);

const createAccount = () => {
    return web3.eth.personal.newAccount(config.web3.entropy);
};

const getAllAccounts = () => {
    return web3.eth.getAccounts();
};

const unlockAccount = (address) => {
    return web3.eth.personal.unlockAccount(address, config.web3.entropy);
};

const getTransactionCount = (address) => {
    return web3.eth.getTransactionCount(address);
};

const transfer = (params) => {
    return new Promise((resolve, reject) => {
        getTransactionCount(params.from)
            .then((count) => {
                unlockAccount(params.from);
                const txOptions = {
                    nonce: web3.utils.toHex(count.toString()),
                    gasLimit: web3.utils.toHex('210000'),
                    gasPrice: web3.utils.toHex('3000000000'),
                    from: params.from,
                };

                txOptions.to = params.contractAddress;
                txOptions.data = web3.eth.abi.encodeFunctionCall({
                    name: 'transfer',
                    type: 'function',
                    inputs: [{
                        type: 'address',
                        name: 'to',
                    }, {
                        type: 'uint256',
                        name: 'tokens',
                    }],
                }, [params.to, params.amount]);

                web3.eth.sendTransaction(txOptions)
                .then((reciept) => {
                    resolve(reciept);
                })
                .catch((error) => {
                    reject(error);
                });
            })
            .catch((error) => {
                reject(error);
            });
    });
};

module.exports = {
    createAccount,
    getAllAccounts,
    transfer,
};
