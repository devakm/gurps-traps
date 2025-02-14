/*  Usage: /:DetectTraps title="<title>" dice=<dice> adds=<adds> type=<type> armordiv=<divisor> rsize=<radius> attrib=<attribute> difmod=<difficulty> skill=<skill> detectwith=<detectWith> detectdif=<detectDif> tag=<trapTileTag>
   Title - name of the trap
   Dice - dice of damage
   Adds - modifier to each die of damage, zero if none
   Type - Damage type (cr, cut, burn, etc...)
   Divisor - Reduce armor DR by (x) 
   Radius - Radius in hexes
   Attribute - DX, ST, DX, IQ, Will, etc
   Difficulty Modifier - Trap difficulty
   Skill - Skill name Precheck to evade, i.e. Acrobatics
   Detect With - Skill or Attribute to detect the trap, i.e. Perception
   Detect Difficulty - Difficulty to detect trap; default to trap difficulty
   Trap Tile Tag - Tagger tag name for the tile to trigger, default to SpikeTrap01
  
   DetectTraps lets you auto-detect a trap;
   Required Macros: DetectTraps, EvadeTrap, ResistEffect
   Optional Macros: PoisonSpray, YellowMoldSpores, AlchemistFire, SpikeTrap100x100px, SpikeTrap160x160px
   Add your own special effects to this recipe book.

Example chat commands to use in MATT for various trap types (adjust to fit your own trap designs):
    /:DetectTraps title="AxeTrap" dice=5d adds=2 type=cut armordiv=5 attrib=DX difmod=-4 skill=Acrobatics detectwith=!PER! detectdif=-6 tag=DungeonCave01AxeTrap01
    /:DetectTraps title="Caltrops" dice=1 adds=0 type=thr armordiv=0 attrib=DX difmod=-2 skill=Acrobatics detectwith=!PER! detectdif=-2 tag=DungeonCave05Caltrops01
    /:DetectTraps title="AlchemistFire" dice=4 adds=4 type=burn armordiv=5 attrib=DX difmod=-6 skill=Acrobatics detectwith=!PER! detectdif=-8 tag=DungeonCave01rapStatue05
    /:DetectTraps title="YellowMold" dice=2 adds=3 type=tox armordiv=3 attrib=HT difmod=-6 skill=Jumping detectwith=!PER! detectdif=-6 tag=DungeonCave01rapStatue01
    /:DetectTraps title="Poison" dice=1 adds=9 type=tox armordiv=3 attrib=HT difmod=-3 skill=Jumping detectwith=!PER! detectdif=-8 tag=DungeonCave05TrapStatue03
	/:DetectTraps title="Spike Trap" dice=1 adds=9 type=imp rsize=3 attrib=DX difmod=-6 skill=Acrobatics detectwith=!PER! tag=SpikeTrap01
	/:DetectTraps title="Pitfall Trap" dice=3 adds=6 type=pi++ rsize=2 attrib=DX difmod=-4 skill=Jumping detectwith=!PER! tag=PitfallTrap01
	/:DetectTraps title="AlchemistFire" dice=4 adds=4 type=burn rsize=3 attrib=DX difmod=-5 skill=Jumping detectwith=!PER! detectdif=-8 tag=DungeonCave01rapStatue05

Evade example:
    /:EvadeTrap title="Spike Trap" dice=1 adds=9 type=imp rsize=3 attrib=DX difmod=-6 skill=Acrobatics detectwith=!PER! tag=SpikeTrap01
    /:EvadeTrap title="Pitfall Trap" dice=3 adds=3 type=pi++ rsize=2 attrib=DX difmod=-4 skill=Acrobatics detectwith=!PER! tag=PitfallTrap01
	/:EvadeTrap title="AlchemistFire" dice=4 adds=4 type=burn rsize=3 attrib=DX difmod=-5 skill=Jumping detectwith=!PER! detectdif=-8 tag=DungeonCave01rapStatue05

Difficulty Examples:
	- Evade Crude "Spike Trap" DX+2
	- Evade Basic "Spike Trap" DX
	- Evade Devious "Spike Trap" DX-4
	- Evade Vicious "Spike Trap" DX-6
    - Evade Deadly "Spike Trap" DX-8

OtF Example
	- ["Evade Deadly Spike Trap DX-8"/if [DX-8] {You Evade!} {[3d+3 (2) pi++]}

*/

console.log(`---------- Start DetectTraps ---------`);

// optional parameters
// Sk:Default=4

// setup defaults
let title = 'Trap'; // default to Trap; for special types. include a key phrase like "YellowMold" or "Poison"
let dice = 1; // default to 1 die
let adds = 0; // damage bonus default to 0
let type = 'cr'; // default to crushing
let armorDivisor = 0; // default to 0
let radius = 1; // default to 1 hex
let attribName = 'DX'; // default to DX
let difMod = 0; // Trap difficulty
let skillName = 'Jumping'; // default to Jumping for evade
let detectWith = '!PER!'; // default to Perception
// detect difficulty defaults to trap difficulty if not specified separately !PER-${detectDif}!
let detectDif = difMod; // difficulty to detect trap; default to trap difficulty
let trapTag = 'SpikeTrap01'; // tag name for the tile to trigger, default to SpikeTrap01

try {
    console.log(scope)
    title = scope.title ? scope.title : title;
    dice = scope.dice ? parseInt(scope.dice) : dice; 
    adds = scope.adds ? parseInt(scope.adds) : adds; 
    type = scope.type ? scope.type : type;
    armorDivisor = scope.armordiv ? parseInt(scope.armordiv) : armorDivisor;
    radius = scope.rsize ? parseInt(scope.rsize) : radius;
	attribName = scope.attrib ? scope.attrib : attribName;
	difMod = scope.difmod ? parseInt(scope.difmod) : difMod;
	skillName = scope.skill ? scope.skill : skillName;
	detectWith = scope.detectwith ? scope.detectwith : detectWith;
	detectDif = scope.detectdif ? parseInt(scope.detectdif) : difMod;
	trapTag = scope.tag ? scope.tag : trapTag;
} catch (error) {
    console.error('Error accessing scope:', error);
}

// 
console.log(`---------- Traps detect difficulty detectDif: ${detectDif};`);

console.log(`title: ${title}; dice: ${dice}; adds: ${adds}; type: ${type}; difMod: ${difMod}; attribName: ${attribName}; detectDif: ${detectDif}; trapTag: ${trapTag}`);

// validate dice
let attackDmgDice,attackDmgAmount,attackDmgBonus;
let attackDamageOtF = dice;
let findDice = /\d+d/;
let lastActor = GURPS.LastActor;
if (dice.isNaN) {
	attackDmgDice = scope.dice? scope.dice.split('d')[0]: 1; //restore scope.dice and split it
	console.log(`NaN attackDmgDice: ${attackDmgDice};`);
} else if (findDice.test(attackDamageOtF)) {
	attackDmgDice = attackDamageOtF.split(' ')[0].split('d')[0];
	console.log(`attackDmgDice: ${attackDmgDice};`);
} else if (title.includes('Caltrops') == true) {
	// Caltrops gets basic damage from the last actor's thrust damage
	// no dice in the attackDamageOtF, so use the last actor's thrust damage under assumptions
	attackDamageOtF = lastActor.system.thrust;
	attackDmgAmount = attackDamageOtF.split(' ')[0];
	attackDmgDice = attackDamageOtF.split(' ')[0].split('d')[0];
	attackDmgBonus = attackDamageOtF.split(' ')[0].split('d')[1] != undefined ? attackDamageOtF.split(' ')[0].split('d')[1] : 0;
	console.log(`Caltrops damage is thrust (lastActor.system.thrust), so attackDmgAmount: ${attackDmgAmount}; attackDmgDice: ${attackDmgDice}; attackDmgBonus: ${attackDmgBonus};`);
	dice= `${attackDmgDice}d`;
	adds=adds+Number(attackDmgBonus);
	console.log(`---------- Recalculated dice from thrust + adds: ${dice}; adds: ${adds};`);
}

// detect
let detectWarningTxt = `You detect a trap!`;
let detectWarningCritTxt = `You detect a trap with such precision that you gain +3 to disarm it! Use [+3 to disarm]`;
let rslTraps = 'PER-5'; // default detect traps
let trapsMod = -5;
let adjustedTrapsMod = -5;
let trapsObj;
let hasTraps = await GURPS.findSkillSpell(_token.actor, 'Traps', true)  != undefined ? true : false;
if (hasTraps == true) {
	trapsObj = GURPS.findSkillSpell(_token.actor, 'Traps', true);
	rslTraps = trapsObj.relativelevel;
	console.log(`rslTraps: ${rslTraps};`);
	if (rslTraps.includes('-') == true) {
		trapsMod = -Number(rslTraps.split('-')[1]);
		console.log(`trapsMod from rslTraps: ${trapsMod};`);
	} else if (rslTraps.includes('+') == true) {
		trapsMod = Number(rslTraps.split('+')[1]); // split(/[+-]/)[1]
		console.log(`trapsMod from rslTraps: ${trapsMod};`);
	} 
}
adjustedTrapsMod = Number(trapsMod)+Number(detectDif);
if (Number.isNaN(adjustedTrapsMod)) adjustedTrapsMod = detectDif;
console.log(`adjustedTrapsMod: ${adjustedTrapsMod};`);
let critFailDifMod = Number(difMod)-5;
console.log(`critFailDifMod: ${critFailDifMod};`);
let modTxt = '';
if (adjustedTrapsMod > -1) modTxt = '+';
let evadeTrapsOtF = '';
let evadeTrapsCfOtF = '';
let resistTrapsOtF = '';
let resistTrapsCfOtF = '';
let failTrapsOtF = '';
let critFailTrapsOtF = '';
let detectTrapsOtF = ``; //${detectWith}${adjustedTrapsMod}
if (game.users.current.isGM) {
	detectTrapsOtF = `[PER${modTxt}${adjustedTrapsMod} | Sk:Default=4]`; // ${detectWith}${adjustedTrapsMod} - always default ra 4
} else {
	detectTrapsOtF = `[!PER${modTxt}${adjustedTrapsMod}! | !Sk:Default=4]`; // ${detectWith}${adjustedTrapsMod}
}
let dtOtF = '';

// /:EvadeTrap title="AxeTrap" dice=5d adds=2 type=cut armordiv=5 attrib=DX difmod=-4 skill=Acrobatics detectwith=!PER! detectdif=-6 
evadeTrapsOtF =`/:EvadeTrap title="${title}" dice=${dice} adds=${adds} type=${type} armordiv=${armorDivisor} attrib=${attribName} difmod=${difMod} skill=${skillName}`;
evadeTrapsCfOtF =`/:EvadeTrap title="${title}" dice=${dice} adds=${adds} type=${type} armordiv=${armorDivisor} attrib=${attribName} difmod=${critFailDifMod} skill=${skillName}`;
resistTrapsOtF = `/:ResistEffect title="${title}" dice=${dice} adds=${adds} type=${type} rsize=${radius} attrib=${attribName} difmod=${difMod}`;
resistTrapsCfOtF = `/:ResistEffect title="${title}" dice=${dice} adds=${adds} type=${type} rsize=${radius} attrib=${attribName} difmod=${critFailDifMod}`;

// Add recipes for special trap effects here
if (title.includes('Poison') == true) {
	///:ResistEffect Poison 1d 9 tox 3 HT -6]        /:DetectTraps Poison 1d 9 tox 3 HT -6 Jumping !PER! -8 DungeonCave01rapStatue01
	failTrapsOtF = `/:PoisonSpray tag=${trapTag} \\\\${resistTrapsOtF}`;
	critFailTrapsOtF = `/:PoisonSpray tag=${trapTag} \\\\${resistTrapsCfOtF}`;
	console.log(`Poison: ResistEffect;`);
	console.log(`resistTrapsOtF: ${resistTrapsOtF}`);
	console.log(`failTrapsOtF: ${failTrapsOtF}`);
	console.log(`critFailTrapsOtF: ${critFailTrapsOtF}`);
} else if (title.includes('YellowMold') == true) {
	failTrapsOtF = `/:YellowMoldSpores tag=${trapTag} \\\\${evadeTrapsOtF}`;
	critFailTrapsOtF = `/:YellowMoldSpores tag=${trapTag} \\\\${evadeTrapsCfOtF}`;
	console.log(`YellowMold: ResistEffect;`);
	console.log(`evadeTrapsOtF: ${evadeTrapsOtF}`);
	console.log(`failTrapsOtF: ${failTrapsOtF}`);
	console.log(`critFailTrapsOtF: ${critFailTrapsOtF}`);
} else if (title.includes('AlchemistFire') == true) {
	///:ResistEffect AlchemistFire 1d 9 tox 3 HT -6]        /:DetectTraps "AlchemistFire" 4d 4 burn 5 DX -6 Acrobatics -8 DungeonCave01rapStatue05
	failTrapsOtF = `/:AlchemistFire tag=${trapTag} \\\\${evadeTrapsOtF}`;
	critFailTrapsOtF = `/:AlchemistFire tag=${trapTag} \\\\${evadeTrapsCfOtF}`;
	console.log(`AlchemistFire: EvadeTrap;`); // switch to ResistEffect by using resistTrapsOtF instead of evadeTrapsCfOtF
	console.log(`resistTrapsOtF: ${resistTrapsOtF}`);
	console.log(`failTrapsOtF: ${failTrapsOtF}`);
	console.log(`critFailTrapsOtF: ${critFailTrapsOtF}`);
} else if (title.includes('Caltrops') == true) {
	failTrapsOtF = `!/anim Caltrops01_01_Regular_Grey c *0.3 @self \\\\${evadeTrapsOtF}`;
	critFailTrapsOtF = `!/anim Caltrops01_01_Regular_Grey c *0.3 @self \\\\${evadeTrapsCfOtF}`;
	console.log(`Physical EvadeTrap: ${title};`);
	console.log(`failTrapsOtF: ${failTrapsOtF}`);
	console.log(`critFailTrapsOtF: ${critFailTrapsOtF}`);
} else if (title.includes('AxeTrap') == true) {
    // /:EvadeTrap title="AxeTrap" dice=5d adds=2 type=cut armordiv=5 attrib=DX difmod=-4 skill=Acrobatics detectwith=!PER! detectdif=-6 
    failTrapsOtF = `${evadeTrapsOtF} \\\\/:TriggerTrap tag=${trapTag}`;
	critFailTrapsOtF = `${evadeTrapsCfOtF} \\\\/:TriggerTrap tag=${trapTag}`
	console.log(`Physical EvadeTrap: ${title};`);
	console.log(`failTrapsOtF: ${failTrapsOtF}`);
	console.log(`critFailTrapsOtF: ${critFailTrapsOtF}`);
	//game.macros.getName('TriggerActiveTile').execute({tag: trapTag, victim: _token.id}); // TriggeredDungeonCave01AxeTrap01
} else {
    console.log(`Physical EvadeTrap: ${title}; trapTag: ${trapTag}`); 
	if (trapTag == 'DungeonCave01SpikeTrap03') {
		failTrapsOtF = `/:SpikeTrap100x100px tag=${trapTag} \\\\${evadeTrapsOtF}`;
		critFailTrapsOtF = `/:SpikeTrap100x100px tag=${trapTag} \\\\${evadeTrapsCfOtF}`;
	} else if (trapTag == 'DungeonCave01SpikeTrap02') {
		failTrapsOtF = `/:SpikeTrap160x160px tag=${trapTag} \\\\${evadeTrapsOtF}`;
		critFailTrapsOtF = `/:SpikeTrap160x160px tag=${trapTag} \\\\${evadeTrapsCfOtF}`;
	} else if (trapTag == 'DungeonCave01SpikeTrap01') {
		failTrapsOtF = `/:SpikeTrap160x160px tag=${trapTag} \\\\${evadeTrapsOtF}`;
		critFailTrapsOtF = `/:SpikeTrap160x160px tag=${trapTag} \\\\${evadeTrapsCfOtF}`;
	}
	console.log(`Physical EvadeTrap;`);
	console.log(`failTrapsOtF: ${failTrapsOtF}`);
	console.log(`critFailTrapsOtF: ${critFailTrapsOtF}`);
}
console.log(`failTrapsOtF: ${failTrapsOtF}`);


dtOtF = `/if ${detectTrapsOtF} s:{${detectWarningTxt}} cs:{${detectWarningCritTxt}} f:{${failTrapsOtF}} cf:{${critFailTrapsOtF}}`;
console.log(dtOtF);
await GURPS.executeOTF(dtOtF);

console.log(`---------- End DetectTraps ---------`);