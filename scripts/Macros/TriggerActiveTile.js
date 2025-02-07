
//game.macros.getName(str).execute();
//Tagger.getByTag("BXTSpikeTrap01")[0].trigger({tokens:lastTarget.document, method: 'trigger', options: { landing: "triggered"}})

//Tagger.getByTag("BXTSpikeTrap01")[0].trigger({});

// execute({xToken:"Bob"});

/* 
let xTokenId = args[0].length > 0 ? args[0][1] : args[0];
let tagName = args[0].length > 1 ? args[0][2] : "BXTSpikeTrap01";
*/
console.log('------------------- TriggerActiveTile ------------------------------ ');
let tagName = 'BXTSpikeTrap01';
let xTokenId = '2b9Ya8qaupJCEdiZ';
try {
    console.log(scope)
    xTokenId = scope.victim ? scope.victim : ' ';
    tagName = scope.tag ? scope.tag : tagName;
} catch (error) {
    console.error('Error accessing scope:', error);
}
console.log(`------ xTokenId: ${xTokenId}; tagName: ${tagName}`);
let xToken = canvas.tokens.get(xTokenId);
xToken.control({pan: true});
let xTiles = Tagger.getByTag(tagName);
xTiles.forEach(tile => {
    console.log(`------ tile: ${tile}`);
    tile.trigger({tokens:[xToken.document], method: 'trigger'});
    // Replace the tile ID with the ID of the tile to be triggered.
    // Requires a token to be selected when activated.
    //canvas.tiles.get("tile ID").document.trigger({tokens:[canvas.tokens.controlled[0].document], method: 'trigger'})
});

//Tagger.getByTag(tagName)[0].trigger({tokens:xToken.document, method: 'trigger'});