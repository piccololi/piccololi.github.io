let isRunning = false;

async function showPiccololis() {

    if (isRunning == false) {
        isRunning = true;

        document.getElementById('button-show-Piccololis').innerHTML = 'Loading... ' + SPINNING_WHEEL_IMG;
        document.getElementById('button-show-Piccololis').disabled = true;

        await connectWallet();
        await connectNetwork();
        console.log('_CONNECTED_ACC_ ' + _CONNECTED_ACC_);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log(`log: contract address set to ${CONTRACT_ADDR}`);

        const piccololiContract = new ethers.Contract(CONTRACT_ADDR, CONTRACT_ABI, provider);
        const balanceOf = Number(await piccololiContract.balanceOf(_CONNECTED_ACC_));
        console.log('balanceOf: ' + balanceOf);


        document.getElementById('list-of-Piccololis').innerHTML = '';

        for (let i = 0; i < balanceOf; i++){
            let tokenId;
            let tokenURI;
            let nftJSON;
            try {
                tokenId = await piccololiContract.tokenOfOwnerByIndex(_CONNECTED_ACC_, i);
                tokenURI = await piccololiContract.tokenURI(tokenId);
                nftJSON = await fetchJSON(tokenURI);;
            } catch (e) {
                console.log(e);
                continue;
            }

            document.getElementById('list-of-Piccololis').innerHTML +=
`<span class="img-span">
    <a href="piccololi.html?p=${tokenId}"><img class="demo" src="${nftJSON.image}" title="#${tokenId}: ${nftJSON.name}"></a>
</span>`;

        }

        isRunning = false;
        document.getElementById('button-show-Piccololis').style.display = 'none';

    }
    
}
