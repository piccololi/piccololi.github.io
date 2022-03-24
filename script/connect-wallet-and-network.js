


// https://ethereum.stackexchange.com/questions/42768/how-can-i-detect-change-in-account-in-metamask
if (window.ethereum) {
    window.ethereum.on('accountsChanged', function (accounts) {
        // Time to reload your interface with accounts[0]!
        _CONNECTED_ACC_ = accounts[0];
        console.log('Account switch detected.');
        console.log(`log: wallet connected to ${_CONNECTED_ACC_}`);
    })
}


async function connectWallet() {
    if (window.ethereum) {
        try {
            _CONNECTED_ACC_ = await window.ethereum.request({ method: 'eth_requestAccounts' });
            _CONNECTED_ACC_ = _CONNECTED_ACC_[0];
            _IS_WALLET_CONNECTED_ = true;
            console.log('_CONNECTED_ACC_ ' + _CONNECTED_ACC_);
        }
        catch (error) {
            if (error.code === 4001) {
                console.log('log: connection rejected by user');
            }
            _IS_WALLET_CONNECTED_ = false;
            console.log('log: cannot connect to wallet');
        }
    }

}

async function connectNetwork(){

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: DEPLOYED_NETWORK_ID.toString(16) }],
        });

        _IS_NETWORK_CONNECTED_ = true;
        console.log(`log: connected to network ${NETWORK_NAME}`);
    }
    catch (error) {
        if (error.code === 4001) {
            console.log(`log: user rejected network switch to ${NETWORK_NAME}`);
        }

        _IS_NETWORK_CONNECTED_ = false;
        console.log(`log: cannot connect to network ${NETWORK_NAME}`);
    }

    console.log('_IS_WALLET_CONNECTED_ ' + _IS_WALLET_CONNECTED_);
    console.log('_IS_NETWORK_CONNECTED_ ' + _IS_NETWORK_CONNECTED_);

}