
const { ethers } = require("ethers");
const { GasPriceOracle } = require('gas-price-oracle');
const { FlashbotsBundleProvider} = require('@flashbots/ethers-provider-bundle')
const provider = new ethers.providers.JsonRpcProvider({ url: 'https://mainnet.infura.io/v3/1be19274630d4beaa59587d8a56fd512' })
var Web3 = require('web3');
var web3 = new Web3("https://mainnet.infura.io/v3/1be19274630d4beaa59587d8a56fd512");

// maximum profit from calling sunrise (after 300 seconds) = $1978 - gas + swap fees. 
const BeanContractAddress = "0xc1e088fc1323b20bcbee9bd1b9fc9546db5624c5" 
const BeanABI = require("./abi/beanstalk.js") // create this file
const Bean = new web3.eth.Contract(BeanABI, BeanContractAddress);

let counter = 0;

// run ->
async function initialize() {
    runOnInterval(7500, dosunrise)
}
 // every 15 seconds
// ran or running <-

// need to change unhandled promise rejection behavior via: npm run build --unhandled-rejections=strict
async function dosunrise() {
    try {
        const authSigner = new ethers.Wallet('privatekey')
        
        const flashbotsProvider = await FlashbotsBundleProvider.create(provider, authSigner)

        txnData = "0xfc06d2a6"


        newTxn = {
            to: BeanContractAddress,
            data: txnData,
            type: 2,
            maxFeePerGas: 1000000, // set this
            maxPriorityFeePerGas: 10000000, // set this
            gasLimit: 350000,
            chainId: 1,
            value: 0,
        }
        // this await needed an actual catch() beyond error log.  
        const signedBundle = await flashbotsProvider.signBundle([{
            signer: authSigner,
            transaction: newTxn
        }]).catch((e => {
            console.log(e)
        }));

        let bundleRecpt = await flashbotsProvider.sendRawBundle(signedBundle, await web3.eth.getBlockNumber() + 1).catch(e => {
            console.log(e)
        });
        counter = counter + 1;

        console.log(bundleRecpt)
        console.log('submission id' + counter)

    } catch (e) {
        console.log(e);
    }
}
function runOnInterval(interval_in_ms, function_to_run, only_run_once = false) {
    setTimeout(() => {
        function_to_run();
        if (!only_run_once) runOnInterval(...arguments);
    }, interval_in_ms - ((Date.now() - (new Date().getTimezoneOffset() * 6e4)) % interval_in_ms));
}



initialize()
