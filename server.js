const Web3 = require('web3');
require('dotenv').config();
const projectId = process.env.WEB3_INFURA_PROJECT_ID;
const accountAddress = process.env.ACCOUNT_ADDRESS;
const timeAlert = process.env.TIME_DAILY;
const amountBalance = process.env.ETHER_AMOUNT;
 
class TransactionChecker {
    web3;
    web3ws;
    account;
    subscription;

    constructor(projectId, account) {
        this.web3ws = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/' + projectId));
        this.web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/' + projectId));
        this.account = account.toLowerCase();
    }

    subscribe(topic) {
        this.subscription = this.web3ws.eth.subscribe(topic, (err, res) => {
            if (err) console.error(err);
        });
    }

    watchTransactions() {
        
        console.log('Watching all pending transactions...');
        this.subscription.on('data', (txHash) => {
            setTimeout(async () => {
                try {
                    let tx = await this.web3.eth.getTransaction(txHash);            
                    if (tx != null) {
                        console.log(34, tx)
                        if (this.account === tx.from.toLowerCase()) {
                            let balance = await this.web3.eth.getBalance(accountAddress);
                            balance = this.web3.utils.fromWei(balance,'ether')
                            // we can call method to post balance value to Discord/Telegram at here. 
                            // we set logic to check balance of account with balance threshold that we need to notify
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            }, timeAlert)
        });
    }
}

let txChecker = new TransactionChecker(projectId, accountAddress);
txChecker.subscribe('pendingTransactions');
txChecker.watchTransactions();