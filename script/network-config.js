/* -------------------------------------------------------------------------------------- */
// Network selector

// const DEPLOYED_NETWORK_ID = '0x4';    // Testnet Rinkeby
// const DEPLOYED_NETWORK_ID = '0x2711';       // Amber Testnet;
const DEPLOYED_NETWORK_ID = '0x2710';       // smartBCH;

const NETWORK_NAMES = {
	'0x4': 'Testnet Rinkeby', 
    '0x2711': 'Amber Testnet', 
	'0x2710': 'smartBCH'
}

const NETWORK_NAME = NETWORK_NAMES[DEPLOYED_NETWORK_ID];

/* -------------------------------------------------------------------------------------- */
// Global variables
// Convention: _GLOBAL_VARIABLE_  vs.  GLOBAL_CONSTANT
// Do not change GLOBAL_CONSTANT values although some of them are declared using let
// instead of const for convenience reasons.
// Values of _GLOBAL_VARIABLE_ on the other hand may be changed.

let _CONNECTED_ACC_;
let _IS_WALLET_CONNECTED_;
let _IS_NETWORK_CONNECTED_;

const SPINNING_WHEEL_IMG = '<img src="./image/Spinner-1s-30px.png">';
const LOADING_MESSAGE = 'Loading... ' + SPINNING_WHEEL_IMG;


/* -------------------------------------------------------------------------------------- */
// Miscellaneous variable settings


// IPFS gateways
const IPFS_GATEWAYS = [];
    IPFS_GATEWAYS[0] = 'https://ipfs.io/ipfs/';
    IPFS_GATEWAYS[1] = 'https://gateway.ipfs.io/ipfs/';
    IPFS_GATEWAYS[2] = 'https://infura-ipfs.io/ipfs/';
    IPFS_GATEWAYS[3] = 'https://gateway.pinata.cloud/ipfs/';
    IPFS_GATEWAYS[4] = 'https://cloudflare-ipfs.com/ipfs/';
const IPFS_GATEWAY = IPFS_GATEWAYS[2];


// Rinkeby
const RINKEBY_RPCS = [];
    RINKEBY_RPCS[0] = 'https://rinkeby-light.eth.linkpool.io/';
    RINKEBY_RPCS[1] = 'https://rinkeby.infura.io/v3/2c1d58028d4343dbb2680897c28b8bc2';
const RINKEBY_RPC = RINKEBY_RPCS[1];

const RINKEBY_SCANNER = 'https://rinkeby.etherscan.io/address/';

const RINKEBY_BLOCK_INTERVAL = 13;   // 1 block every 13 seconds on average
// In Ethereum, the average block time is between 12 to 14 seconds and is evaluated after each block.
// https://ethereum.org/en/developers/docs/blocks/
// https://ycharts.com/indicators/ethereum_average_block_time

// smartBCH
const SMARTBCH_RPCS = [];
    SMARTBCH_RPCS[0] = 'https://smartbch.greyh.at';
    SMARTBCH_RPCS[1] = 'https://smartbch.fountainhead.cash/mainnet';
    SMARTBCH_RPCS[2] = 'https://global.uat.cash';
    SMARTBCH_RPCS[3] = 'https://rpc.uatvo.com';
const SMARTBCH_RPC = SMARTBCH_RPCS[0];

const SMARTBCH_SCANNER = 'https://www.smartscan.cash/address/';

const SMARTBCH_BLOCK_INTERVAL = 5.5;   // 1 block every 5.5 seconds on average

// Amber Testnet
const AMBER_RPCS = [];
    AMBER_RPCS[0] = 'https://moeing.tech:9545';
    AMBER_RPCS[1] = 'http://35.220.203.194:8545';
const AMBER_RPC = AMBER_RPCS[0];

const AMBER_SCANNER = 'https://www.smartscan.cash/address/';

const AMBER_BLOCK_INTERVAL = 5.5;   // 1 block every 5.5 seconds on average


// switch between networks

let HTTPS_RPC;
let NETWORK_SCANNER;
let BLOCK_INTERVAL;
let TESTNET_MARKER;
let CURRENCY_NAME;

switch ( Number(DEPLOYED_NETWORK_ID) ){
    case 0x4:       // Testnet Rinkeby
        HTTPS_RPC = RINKEBY_RPC;
        NETWORK_SCANNER = RINKEBY_SCANNER;
        BLOCK_INTERVAL = RINKEBY_BLOCK_INTERVAL;
        TESTNET_MARKER = '&nbsp;&nbsp;&nbsp;&nbsp;* Testnet Rinkeby *';
        CURRENCY_NAME = 'testETH';
        break;
    case 0x2711:    // Amber Testnet
        HTTPS_RPC = AMBER_RPC;
        NETWORK_SCANNER = AMBER_SCANNER;
		BLOCK_INTERVAL = AMBER_BLOCK_INTERVAL;
        TESTNET_MARKER = '';
        CURRENCY_NAME = 'testBCH';
        break;
    case 0x2710:    // smartBCH
        HTTPS_RPC = SMARTBCH_RPC;
        NETWORK_SCANNER = SMARTBCH_SCANNER;
		BLOCK_INTERVAL = SMARTBCH_BLOCK_INTERVAL;
        TESTNET_MARKER = '';
        CURRENCY_NAME = 'BCH';
        break;
}
