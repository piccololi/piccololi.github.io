function checkBounds(_elementId, _lowerBoundInclusive, _upperBoundInclusive){
    if ( document.getElementById(_elementId).value == '' ){
        alert(`Please specify a value for '${_elementId}'.`);
    }

    if ( document.getElementById(_elementId).value > _upperBoundInclusive ){
        alert(`Input ${_elementId} value exceeds upper limit.`);
        document.getElementById(_elementId).value = _upperBoundInclusive;
    }

    if ( document.getElementById(_elementId).value < _lowerBoundInclusive ){
        alert(`Input ${_elementId} value exceeds lower limit.`);
        document.getElementById(_elementId).value = _lowerBoundInclusive;
    }
}


async function fetchJSON(api_uri) {
	let response = await fetch(api_uri);
	
	if (!response.ok) {
	    throw new Error(`HTTP error! status: ${response.status}`);
	}
	
	let myJSON = await response.json();
	
	return await myJSON;
}


async function getOwnedByEvents(_contract, _ownerAddress){

    const filterReceived = _contract.filters.Transfer(null, _ownerAddress, null);
    const eventsReceived = await _contract.queryFilter(filterReceived);
    const filterSent = _contract.filters.Transfer(_ownerAddress, null, null);
    const eventsSent = await _contract.queryFilter(filterSent);

    let ownedTokenIds_ = [];
    let ownedEvents_ = [];
    let ownedCandidates = {};

    for (let i = 0; i < eventsReceived.length; i++){
        const tokenId = eventsReceived[i].args[2];
        ownedCandidates[String(tokenId)] = {
            'blockNumber' : eventsReceived[i].blockNumber,
            'owned' : true,
        }
    }

    for (let i = 0; i < eventsSent.length; i++){
        const tokenId = eventsSent[i].args[2];
        const recipient = eventsSent[i].args[1];
        if ( eventsSent[i].blockNumber >= ownedCandidates[String(tokenId)]["blockNumber"]){
            if ( recipient.toLowerCase() != _ownerAddress.toLowerCase()){
                ownedCandidates[String(tokenId)]["owned"] = false;
            }
        }
    }

    for (let i = 0; i < eventsReceived.length; i++){
        const tokenId = eventsReceived[i].args[2];
        if (ownedCandidates[String(tokenId)]["owned"] === true){
            if (! ownedTokenIds_.includes(Number(tokenId))){
                ownedTokenIds_.push(Number(tokenId));
                ownedEvents_.push(eventsReceived[i]);
            }
        }
    }

    return [ownedTokenIds_, ownedEvents_];

}



function displaySwitch(_elementId, _displayStyle){
    document.getElementById(_elementId).style.display = 
		document.getElementById(_elementId).style.display == 'none' ? _displayStyle : 'none';
}


