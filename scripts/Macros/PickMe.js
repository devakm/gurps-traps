console.log(`----- Start PickMe ----`);
let macroName = 'SelectToken';
let triggerToken = _token.id;
let tokenName = _token.name;
console.log(`----- in PickMe, triggerToken: ${triggerToken}; tokenName: ${tokenName} ----`);
let tokenArg = { tokenPicked: triggerToken };
console.log(`----- run macroName: ${macroName}; on triggerToken: ${triggerToken}; `);
const macro = game.macros.getName(macroName);
if (game.users.current.isGM) {
    console.log(`----- in PickMe, user isGM ----`);
    await macro.execute(tokenArg);
} else {
    console.log(`----- in PickMe, user is Player so attempt to make GM select player token ----`);
    await macro.execute(tokenArg);
}
console.log(`----- End PickMe ----`);