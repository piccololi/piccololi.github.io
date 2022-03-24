

function checkMintQuantity(){
    const maxMintQuantity = 10;
    const minMinQuantity = 1;
    if ( document.getElementById('mint-quantity').value > maxMintQuantity ){
        document.getElementById('mint-quantity').value = maxMintQuantity
    }

    if ( document.getElementById('mint-quantity').value < minMinQuantity ){
        document.getElementById('mint-quantity').value = minMinQuantity
    }
}


function showSubmit(){

    clearInterval(getMintStatsInterval);
    
    document.getElementById('div-mint-info').style.display = 'block';
    document.getElementById('button-sign-with-wallet').style.display = 'inline';
    document.getElementById('button-mint').style.display = 'none';

    document.getElementById('div-mint-stats-1').style.display = 'none';
    document.getElementById('div-what-is-piccololi').style.display = 'none';
    // document.getElementById('leaves').style.opacity = 0;
    // showNewPiccololi(1);

}


async function getMintStats(){

    const provider = new ethers.providers.JsonRpcProvider(HTTPS_RPC);
    const piccololiContract = new ethers.Contract(CONTRACT_ADDR, CONTRACT_ABI, provider);

    const currentBlockNumber = await provider.getBlockNumber();

    const totalSupply = await piccololiContract.totalSupply();
    const tokensLimit = await piccololiContract.tokensLimit();
    const totalMintFee = ( await piccololiContract.totalMintFee() ) * 1e-18;

    const isMintAvailable = await piccololiContract.isMintAvailable();
    const mintOpenBlockNumber = await piccololiContract.mintOpenBlockNumber();

    const whitelistWaiver = await piccololiContract.whitelistWaiver();

    // console.log(whitelistWaiver);
    // let whitelistWaiverMessage = '';
    // if ( whitelistWaiver == false ){
    //     whitelistWaiverMessage = ' (whitelisted users only)';
    // }

    document.getElementById('div-mint-stats-1').innerHTML = `<span style="display: inline-block; width: 350px">${totalSupply} / ${tokensLimit} minted &nbsp;&nbsp;&nbsp; ${totalMintFee} BCH per mint</span>`;

    if ( isMintAvailable == true ){
        document.getElementById('div-mint-stats-1').innerHTML += `<span style="display: inline-block; width: 350px">Mint Opens at Block Height ${mintOpenBlockNumber}`;
        document.getElementById('div-mint-stats-1').innerHTML += `<span style="display: inline-block; width: 350px">(Current Block Height ~ ${currentBlockNumber})</span>`;
        
        if ( whitelistWaiver == false ){
            document.getElementById('div-mint-stats-1').innerHTML += `<span style="display: inline-block; width: 350px"> * Whitelisted Users Only * </span>`;
        } else {
            document.getElementById('div-mint-stats-1').innerHTML += `<span style="display: inline-block; width: 350px">&nbsp;</span>`;
        }

    } else {
        document.getElementById('div-mint-stats-1').innerHTML += `<span style="display: inline-block; width: 350px">Mint Currently Not Available</span>`;

        document.getElementById('div-mint-stats-1').innerHTML += `<span style="display: inline-block; width: 350px">&nbsp;</span>`;
    }

    // document.getElementById('div-mint-stats-2').innerHTML = `${totalSupply} / ${tokensLimit} minted &nbsp;&nbsp;&nbsp; ${totalMintFee} BCH per mint`;

}

getMintStats();
let getMintStatsInterval = setInterval(getMintStats, 5000);


let fetchInterval;
let createdTokenId;
let confettiInterval;
let confettiCount = 0;

async function mintPiccololi(){

    await connectWallet();
    await connectNetwork();

    if ( _IS_WALLET_CONNECTED_ == undefined) {
        alert('A web3 wallet such as MetaMask is required.');

        return;
    }

    document.getElementById('div-mint-info').innerHTML = 'Minting Piccololi... ' + SPINNING_WHEEL_IMG;
    document.getElementById('div-mint-info').style.textAlign = 'center';
    
    document.getElementById('button-sign-with-wallet').disabled = true;


    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const piccololiContract = new ethers.Contract(CONTRACT_ADDR, CONTRACT_ABI, signer);

    const mintFee = await piccololiContract.totalMintFee();

    try {
        const contractFunction = await piccololiContract.createToken(
            { value: BigInt(mintFee) }
        );

        const tx = await contractFunction.wait();

        // let createdTokenId;
        for (let i = 0; i < tx.events.length; i++){
            if (tx.events[i].event == 'Transfer'){
                createdTokenId = tx.events[i].args[2].toNumber();
            }
        }

        document.getElementById('div-mint-info').innerHTML = `Piccololi #${createdTokenId} has been created. Sending image on-chain... ` + SPINNING_WHEEL_IMG;

        executeMint();
        fetchInterval = setInterval(executeMint, 10000);

    } catch(e) {
        console.log(e);

        document.getElementById('div-mint-info').innerHTML = '';

        document.getElementById('button-sign-with-wallet').disabled = false;

        if ( e.code == 4001 ){
            alert("MetaMask Tx Signature: User denied transaction signature.");
        } else if ( e.code == -32603 ) {
            alert(e.data.message);
        } else {
            alert(e);
        }
    }

}


async function executeMint() {
    const apiBaseUrl = 'https://piccololi.herokuapp.com/mint?tokenID=';

	// let response = await fetch(api_uri, {mode: 'no-cors'});
    let response = await fetch(apiBaseUrl + createdTokenId, {mode: 'cors'});
	
	if ( !response.ok ) {
	    throw new Error(`HTTP error! status: ${response.status}`);
	}
	
	let myJSON = await response.json();
	
    // console.log(response);
    console.log(myJSON);

    if ( myJSON.Status == "Sending image on-chain, check again later." ){
        // setTimeout(tryAgain(_tokenId), 3000);

    } else if ( myJSON.Status == "Image is on-chain." ){

        document.getElementById('div-mint-info').innerHTML = `Piccololi #${createdTokenId} has been created. Image is now on-chain.`;

        clearInterval(fetchInterval);

        showNewPiccololi(createdTokenId);

        document.getElementById('button-sign-with-wallet').innerHTML = "MINT another Piccololi";

        document.getElementById('button-sign-with-wallet').disabled = false;

    } else if ( myJSON.Status == "Error: Insufficient backend balance." ){

        document.getElementById('div-mint-info').innerHTML = `Piccololi #${createdTokenId} has been created. Error sending image on-chain (insufficient server balance). Don't worry; image will be uploaded later. Please contact admin in case you have further questions.`;

        clearInterval(fetchInterval);

        document.getElementById('button-sign-with-wallet').disabled = false;

    } else if ( myJSON.Status == "Error: Gas price too high, image will be uploaded later." ){

        document.getElementById('div-mint-info').innerHTML = `Piccololi #${createdTokenId} is created. Error sending image on-chain (gas price too high). Don't worry; image will be uploaded later. Please contact admin in case you have further questions.`;

        clearInterval(fetchInterval);

        document.getElementById('button-sign-with-wallet').disabled = false;

    } else if ( myJSON.Status == "Error: Server is busy, image will be uploaded later." ){

    }

}


async function showNewPiccololi(_tokenID){

    const provider = new ethers.providers.JsonRpcProvider(HTTPS_RPC);
    const piccololiContract = new ethers.Contract(CONTRACT_ADDR, CONTRACT_ABI, provider);

    const tokenURI = await piccololiContract.tokenURI(_tokenID);
    nftJSON = await fetchJSON(tokenURI);

    // console.log(tokenURI);

    document.getElementById('div-piccololi-name').innerHTML = 'Piccololi #' + _tokenID + ': ' + nftJSON.name;
    // document.getElementById('div-piccololi-sequence').innerHTML = 'Sequence: ' + nftJSON.sequence;
    
    document.getElementById('img-x').src = nftJSON.image;

    // if ( _index == 0  ) return nameOf(_sequence);
    // if ( _index == 1  ) return birthday(_sequence_prime);
    // if ( _index == 2  ) return birth_weekday(_sequence_prime);
    // if ( _index == 3  ) return zodiac_sign(_sequence_prime);
    // if ( _index == 4  ) return blood_type(_sequence_prime);
    // if ( _index == 5  ) return iq(_sequence_prime);
    // if ( _index == 6  ) return eq(_sequence_prime);
    // if ( _index == 7  ) return creativity(_sequence_prime);
    // if ( _index == 8  ) return charm(_sequence_prime);
    // if ( _index == 9  ) return personality(_sequence_prime);
    // if ( _index == 10 ) return hobby(_sequence_prime);
    // if ( _index == 11 ) return tempo(_sequence);
    // if ( _index == 12 ) return background(_sequence);
    // if ( _index == 13 ) return step_width(_sequence);
    // if ( _index == 14 ) return hairstyle(_sequence);
    // if ( _index == 15 ) return fringe_hairstyle(_sequence);
    // if ( _index == 16 ) return blush(_sequence);
    // if ( _index == 17 ) return sleeve(_sequence);

    const birthday = nftJSON.attributes[1].value.split(' ');

    const piccololiInfo = `
        <span class="piccololi-attributes">
            <span style="display: inline-block; width: 100px">Name</span>
            <span class="darker">${nftJSON.attributes[0].value}</span>
        </span>
        <span class="piccololi-attributes">
            <span style="display: inline-block; width: 100px">Birthday</span>
            <span class="darker" style="display: inline-block; width: 100px">${birthday[0]}</span>
            <span class="darker" style="display: inline-block; width: 100px">${birthday[1]}</span>
        </span>
        <span class="piccololi-attributes">
            <span style="display: inline-block; width: 100px">Born on a</span>
            <span class="darker">${nftJSON.attributes[2].value}</span>
        </span>
        <span class="piccololi-attributes">
            <span style="display: inline-block; width: 100px">Zodiac sign</span>
            <span class="darker">${nftJSON.attributes[3].value}</span>
        </span>
        <span class="piccololi-attributes">
            <span style="display: inline-block; width: 100px">Blood type</span>
            <span class="darker">${nftJSON.attributes[4].value}</span>
        </span>
        <span class="piccololi-attributes">
            <span style="display: inline-block; width: 100px">IQ</span>
            <span class="darker">${nftJSON.attributes[5].value}</span>
        </span>
        <span class="piccololi-attributes">
            <span style="display: inline-block; width: 100px">EQ</span>
            <span class="darker">${nftJSON.attributes[6].value}</span>
        </span>
        <span class="piccololi-attributes">
            <span style="display: inline-block; width: 100px">Creativity</span>
            <span class="darker">${nftJSON.attributes[7].value}</span>
        </span>
        <span class="piccololi-attributes">
            <span style="display: inline-block; width: 100px">Charm</span>
            <span class="darker">${nftJSON.attributes[8].value}</span>
        </span>
        <span class="piccololi-attributes">
            <span style="display: inline-block; width: 100px">Personality</span>
        <span class="darker">${nftJSON.attributes[9].value}</span>
        </span>
        <span class="piccololi-attributes">
            <span style="display: inline-block; width: 100px">Hobby</span>
            <span class="darker">${nftJSON.attributes[10].value}</span>
        </span>
        <span class="piccololi-attributes">
            <span style="display: inline-block; width: 100px">Tempo</span>
            <span class="darker">${nftJSON.attributes[11].value}</span>
        </span>
        <span class="piccololi-attributes">
            <span style="display: inline-block; width: 100px">Background</span>
            <span class="darker">${nftJSON.attributes[12].value}</span>
        </span>
        <span class="piccololi-attributes">
            <span style="display: inline-block; width: 100px">Step width</span>
            <span class="darker">${nftJSON.attributes[13].value}</span>
        </span>
        <span class="piccololi-attributes">
            <span style="display: inline-block; width: 100px">Hairstyle</span>
            <span class="darker">${nftJSON.attributes[14].value}</span>
        </span>
        <span class="piccololi-attributes">
            <span style="display: inline-block; width: 100px">Fringe style</span>
            <span class="darker">${nftJSON.attributes[15].value}</span>
        </span>
        <span class="piccololi-attributes">
            <span style="display: inline-block; width: 100px">Blushes</span>
            <span class="darker">${nftJSON.attributes[16].value}</span>
        </span>
        <span class="piccololi-attributes">
            <span style="display: inline-block; width: 100px">Sleeves</span>
            <span class="darker">${nftJSON.attributes[17].value}</span>
        </span>
        `;

    document.getElementById('div-piccololi-info').innerHTML = piccololiInfo;

    document.getElementById('div-piccololis').style.display = 'none';
    document.getElementById('div-new-piccololi').style.display = 'block';


    document.getElementById('leaves').style.opacity = 0;

    confettiInterval = setInterval(showConfetti, 700);

}


const confettiColorSets = [
    ['#ff0a54', '#ff9747', '#ffd447', '#52a64c', '#0092b3', '#7351b5' ], 
    ['#324d94', '#1fa399', '#c2ed98', '#61992b', '#dea71f', '#d1400f' ], 
    ['#2aa132', '#EB1E4B', '#ff6e00', '#5d5fe3', '#F5DC50', '#2d6b9b' ],
    ['#a3000b', '#ffbf00', '#1e7000', '#006391', '#000982', '#5d0082' ],
];

function showConfetti() {
    const jsConfetti = new JSConfetti();

    // jsConfetti.addConfetti({
    //     confettiColors: [
    //         '#ff0a54', '#ff9747', '#ffd447', '#52a64c', '#0092b3', '#7351b5'
    //     ],
    // });

    // if ( confettiCount == 4) {
    //     jsConfetti.addConfetti({
    //         confettiColors: [
    //             '#ff0a54', '#ff9747', '#ffd447', '#52a64c', '#0092b3', '#7351b5',
    //           ],
    //         emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
    //      })
    // } else {
        jsConfetti.addConfetti({
            confettiColors: confettiColorSets[confettiCount % 4],
        });
    // }

    confettiCount++;
    console.log(confettiCount);

    if ( confettiCount >= 5 ){
        clearInterval(confettiInterval);
        confettiCount = 0;
    }

}
