const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
});

if (params["p"] !== null){
	document.getElementById('input-token-id').value = params["p"];
    showToken();
}


function showToken(){
    const tokenID = Number(document.getElementById('input-token-id').value);

    showNewPiccololi(tokenID);
}


async function showNewPiccololi(_tokenID){

    document.getElementById('div-loading').innerHTML = 'Loading... ' + SPINNING_WHEEL_IMG;
    document.getElementById('div-loading').style.display = 'block';

    document.getElementById('div-new-piccololi').style.display = 'none';

    const provider = new ethers.providers.JsonRpcProvider(HTTPS_RPC);
    const piccololiContract = new ethers.Contract(CONTRACT_ADDR, CONTRACT_ABI, provider);

    const totalSupply = await piccololiContract.totalSupply();

    if (_tokenID > totalSupply){

        document.getElementById('invalid-token-id').style.display = 'block';
        document.getElementById('div-loading').style.display = 'none';

    } else {

        document.getElementById('invalid-token-id').style.display = 'none';

        const tokenURI = await piccololiContract.tokenURI(_tokenID);
        nftJSON = await fetchJSON(tokenURI);

        // console.log(tokenURI);

        // document.getElementById('div-piccololi-name').innerHTML = 'Piccololi #' + _tokenID + ': ' + nftJSON.name;
        // document.getElementById('div-piccololi-sequence').innerHTML = 'Sequence: ' + nftJSON.sequence;
        
        document.getElementById('img-x').src = nftJSON.image;

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

        document.getElementById('div-new-piccololi').style.display = 'block';

        document.getElementById('div-loading').style.display = 'none';
    }

}



let confettiCount = 0;

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