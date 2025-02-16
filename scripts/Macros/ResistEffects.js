/* Usage:  /:ResistEffect title="<title>" dice=<dice> adds=<adds> type=<type> rsize=<radius> attrib=<attribute> difmod=<difficulty>
	Title - name to display on dialog
	Dice - dice of damage
	Adds - modifier to each die of damage, zero if none
	Type - Damage type (usually tox)
	Size - Radius of effect in hexes
	Attribute - usually HT
	Difficulty Modifier

Lets you resist deadly toxins and other environmental hazards
   
Basic formula concept
	["Resist Deadly Poison HT-8"/if [HT-8] {You Resist!} {[5d tox]}]
   
Difficulty Examples:
	- Resist Weak Poison HT+2
	- Resist Basic Poison HT
	- Resist Strong Poison HT-4
	- Resist Very Strong Poison HT-6
	- Resist Deadly Poison HT-8
   
 Examples:
   -- 1d+9 tox 3-hex radius, Resist using HT-6, difficulty modifier
    	/:ResistEffect title=Poison dice=1 adds=9 type=tox rsize=3 attrib=HT difmod=-6
   -- 3d burn 1-hex radius, Resist using HT-2, difficulty modifier
   		/:ResistEffect title=Fire dice=3 adds=0 type=burn rsize=1 attrib=HT difmod=-2
*/

console.log(`---------- Start  ResistEffect ---------`);
let title = 'Poison';
let dice = '2d';
let adds = 3;
let type = 'tox';
let rsize = 1;
let attribute = 'Will';
let difMod = 0;

try {
	console.log(scope)
	title = scope.title ? scope.title : title;
	dice = scope.dice ? parseInt(scope.dice) : dice; 
	adds = scope.adds ? parseInt(scope.adds) : adds; 
	type = scope.type ? scope.type : type;
	rsize = scope.rsize ? parseInt(scope.rsize) : rsize;
	attribute = scope.attrib ? scope.attrib : attribName;
	difMod = scope.difmod ? parseInt(scope.difmod) : difMod;
  } catch (error) {
	console.error('Error accessing scope:', error);
  }

console.log(`title: ${title}; dice: ${dice}; adds: ${adds}; type: ${type}; attribute: ${attribute}; difMod: ${difMod}`);

// calculate damage formula OtF
let adjustedDifficultyTxt = '';
let addsTxt = '';
if (adds === 0) addsTxt = ''
else if (adds > 0) addsTxt = `+${adds}`;
else if (adds < 1) addsTxt = `${adds}`;
let dmgFormula = `[${dice}d${addsTxt} ${type}]`;
console.log(`dmgFormula: ${dmgFormula}`);

// Difficuly Description
let trapDifficulty = 'Basic';
if (Number(difMod) <= -8) { 
	trapDifficulty = `Deadly`;
} else if (Number(difMod) <= -6) { 
	trapDifficulty = `Vicious`;
} else if (Number(difMod) <= -4) { 
	trapDifficulty = `Vicious`;
} else if (Number(difMod) <= -2) { 
	trapDifficulty = `Strong`;
} else if (Number(difMod) === 0) { 
	trapDifficulty = `Basic`;
} else if (Number(difMod) > 0) { 
	trapDifficulty = `Weak`;
}
let reResistEffectOtF =`/:ResistEffect title="${title}" dice=${dice} adds=${adds} type=${type} rsize=${rsize} attrib=${attribute} difmod=${difMod}`;
console.log(`reResistEffectOtF: ${reResistEffectOtF}`);

function resisteffect(Resistance) {
	
	if (Number.isNaN(Resistance)) Resistance = 0;
	console.log(`Resistance: ${Resistance};`);
	
	let adjustedDifficulty = Number(difMod)+Number(Resistance)
	console.log(`adjustedDifficulty: ${adjustedDifficulty};`);
	if (adjustedDifficulty < -16) adjustedDifficulty = -16; // rule of 16
	else if (adjustedDifficulty > -1) adjustedDifficultyTxt = '+';
 
	// OtF action setup:
	let AttributeName = attribute; //  attribute name
	let AttributeCheck = `[${AttributeName}${adjustedDifficultyTxt}${adjustedDifficulty}]`; // alter the OtF type used for secondary check
	console.log(`AttributeCheck: ${AttributeCheck};`);

	let chatDescription = `<p><b>Resistance</b> calculation for <b>${title}</b></p>`;
	console.log(`<p>${title} causes ${dmgFormula}.<p> `);
	chatDescription += `<p><b>The ${title} trap difficulty level is ${trapDifficulty} ${title} ${attribute} ${difMod}</b></p>`;
	chatDescription += `<p>The final calculated formula is ${dmgFormula}.</p>`;
	chatDescription += `<p>The ${title} affects Radius ${rsize}.</p>`;
	chatDescription += `<p>Anyone in the impacted area must ["ResistEffect ${title} ${trapDifficulty}"${reResistEffectOtF}]</p>`;
	chatDescription += `<p>Resistance is ${Resistance}.</p>`;
	console.log(chatDescription);

	ChatMessage.create({
	  content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
	{ chatBubble: false });

	// Outcomes for critical success, critical failure, regular success, and regular failure
	// each of these settings can be tested individually as an OtF or chat command.
	// outcome animations: modules/jb2a_patreon/Library/Generic/Healing/HealingAbility_01_Blue_400x400.webm
	let sanim = '!/anim HealingAbility*Blue c *0.2 @self'; // success animation 
	let csanim = '!/anim HealingAbility*Blue c *0.4 @self'; // critical success animation 
	let fanim = '!/anim IconPoison*Dark_Green c *0.2 @self'; // failure animation 
	let cfanim = '!/anim IconPoison_01_Dark_Green c *0.5 @self'; // critical failure animation 

	// outcome formulas:
	let csformula =`You easily resist the ${title}! You feel great! Gain FP+2  \\\\/fp +2`; // critical success formula 
	let cfformula =`Your attempt to resist the ${title} fails disasterously. You suffer great harm. \\\\/r ${dmgFormula} \\\\/rolltable CritHit`; // critical failure formula 
	let sformula =`You resist the ${title}! No bad stuff happens.`; //success formula 
	let fformula =`You fail to resist the ${title}! Bad stuff happens. \\\\/r ${dmgFormula}`; // failure formula 
	
	let OtF = `/if ${AttributeCheck} s:{${sanim} \\\\${sformula}} cs:{${csanim} \\\\${csformula}} f:{${fanim} \\\\${fformula}} cf:{${cfanim} \\\\${cfformula}}`;
	console.log(OtF);
	GURPS.executeOTF(OtF);
}

new Dialog({
 title: title,
 content: `<div style='padding: 4px;'>
 <label for="Resistance">Enter Your Resistance to ${title}</label>
 <input id="Resistance" type="text" />
</div>
`,
 buttons: {
  confirm: {
   label: "Confirm",
   callback: async (html) => resisteffect(
      parseInt(html.find('#Resistance').val()))
  }
 }
}).render(true)

console.log(`---------- End  ResistEffect ---------`);