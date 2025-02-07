/* Usage: EvadeTrap
   Lets you evade falling into or being skewered by a trap
   Defauls are DX and Jumping
   Basic formula concept
   ["Evade Deadly "Spike Trap" DX-8"/r [DX-8] {"You Evade!"} {[2d tox]}]
   
	Difficulty Examples:
	Evade Crude "Spike Trap" DX+2
	["Evade Basic "Spike Trap" DX
	["Evade Devious "Spike Trap" DX-4
	["Evade Vicious "Spike Trap" DX-6
	["Evade Deadly "Spike Trap" DX-8"/DX-8 You Evade! /else [3d+3 (2) pi++]]
   
 Usage: EvadeTrap <title> <dice> <adds> <type> <rsize> <attribute> <difficulty> <skill> <divisor>
   Title - name to display on dialog
   Dice - dice of damage per energy point; may be a fraction
   Adds - modifier to each die of damage, zero if none
   Type - Damage type (cr, cut, burn, etc...)
   Divisor - Reduce DR by (x)
   Attribute - DX, ST, DX, IQ, Will, etc
   Difficulty Modifier
   Skill - Skill name Precheck to evade, i.e. Acrobatics
  
 Examples:
   -- 1d+9 imp 3-hex radius, Evade using DX-6, difficulty modifier
   /:EvadeTrap "Spike Trap" 1d 9 imp 3 DX -6 Acrobatics

   /:EvadeTrap "Pitfall Trap" 3d 6 pi++ 2 DX -6 Jumping

   -- 3d (2) pi++ damage, Evade using DX-2, difficulty modifier
   /:EvadeTrap "Pitfall Trap" 3d 3 pi++ 2 DX -2 Acrobatics
   
  Sample animations:
  modules/jb2a_patreon/Library/Generic/Healing/HealingAbility_01_Blue_400x400.webm
  modules/jb2a_patreon/Library/Generic/UI/IconDrop_01_Regular_Red_200x200.webm
  modules/jb2a_patreon/Library/1st_Level/Bless/Bless_01_Regular_Blue_Intro_200x200.webm

*/

console.log(`---------- in DetectTraps ---------`);

let title = 'Trap'; // default to Trap
let dice = 1; // default to 1 die
let adds = 0; // damage bonus default to 0
let type = 'cr'; // default to crushing
let armorDivisor = 0; // default to 0
let radius = 1; // default to 1 hex
let attribName = 'DX'; // default to DX
let difMod = 0; // Trap difficulty
let skillName = 'Jumping'; // default to Jumping
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
  trapTag = scope.traptag ? scope.traptag : trapTag;
} catch (error) {
  console.error('Error accessing scope:', error);
}

console.log(`------- In EvadeTraps for trap title: ${title}; dice: ${dice}; adds: ${adds}; type: ${type}; attribName:${attribName}; difMod: ${difMod}; detectDif: ${detectDif}`);

 // calculate damage formula OtF
let addsTxt = '';
if (adds === 0) addsTxt = ''
else if (adds > 0) addsTxt = `+${adds}`;
else if (adds < 1) addsTxt = `${adds}`;
let formula = `[${dice}d${addsTxt} (${armorDivisor}) ${type}]`;
console.log(`formula: ${formula}`);
// Difficuly Description
let trapDifficulty = 'Basic'; // default
if (Number(difMod) <= -8) { 
	trapDifficulty = `Deadly`;
} else if (Number(difMod) <= -6) { 
	trapDifficulty = `Vicious`;
} else if (Number(difMod) <= -4) { 
	trapDifficulty = `Devious`;
} else if (Number(difMod) <= -2) { 
	trapDifficulty = `Strong`;
} else if (Number(difMod) === 0) { 
	trapDifficulty = `Basic`;
} else if (Number(difMod) > 0) { 
	trapDifficulty = `Weak`;
}

let reEvadeOtF =`/:EvadeTrap title="${title}" dice=${dice} adds=${adds} type=${type} armordiv=${armorDivisor} attrib=${attribName} difmod=${difMod} skill=${skillName}`;
console.log(`reEvadeOtF: ${reEvadeOtF}`);

// adjust Difficulty
let adjustedDifficulty = Number(difMod);
let defaultDifficulty = Number(difMod)-6;
let acroDodgeDifficulty = Number(difMod)+2;
let dodgeDifficulty = Number(difMod)-2;
if (adjustedDifficulty < -16) adjustedDifficulty = -16; // rule of 16
if (defaultDifficulty < -16) defaultDifficulty = -16; // rule of 16
console.log(`defaultDifficulty: ${defaultDifficulty}; adjustedDifficulty: ${adjustedDifficulty};`);
// Jumping default
let extraSkillOtF = '';
let defaultSkill = 'Jumping';
if (skillName != defaultSkill) {
	extraSkillOtF = ` | S:${defaultSkill} ${adjustedDifficulty}`;
}
// OtF action setup:
let DefaultCheck = `[S:${skillName} ${adjustedDifficulty} | ${attribName} ${defaultDifficulty}${extraSkillOtF}]`; // alter the OtF type used for secondary check
console.log(`DefaultCheck: ${DefaultCheck};`);

let chatDescription = `<p><b>Evade</b> calculation for <b>${title}</b></p>`;
console.log(`<p>${title} causes ${formula}.<p> `);
chatDescription += `<p>The ${title} effect does ${formula}`;
chatDescription += `<p><b>The trap difficulty level is ${trapDifficulty} ${title} ${DefaultCheck}</b></p>`;
chatDescription += `<p>The final calculated formula is ${formula}.</p>`;
chatDescription += `<p>Anyone in the impacted area must ["Evade ${title} ${trapDifficulty}"${reEvadeOtF}]</p>`;
console.log(chatDescription);

ChatMessage.create({
  content: chatDescription, speaker: ChatMessage.getSpeaker(_token.actor)}, 
{ chatBubble: false });

// Outcomes for critical success, critical failure, regular success, and regular failure
// each of these settings can be tested individually as an OtF or chat command.
// outcome animations: 
let sanim = '!/anim Bless*Regular_Blue c *0.2 @self'; // success animation 
let csanim = '!/anim Bless*Regular_Blue c *0.4 @self'; // critical success animation 
let fanim = '!/anim IconDrop*Regular_Red c *0.2 @self'; // failure animation 
let cfanim = '!/anim IconDrop*Regular_Red c *0.5 @self'; // critical failure animation 

// outcome formulas:
let csformula =`You easily evade the ${title}! You feel great! Gain FP+2  \\\\/fp +2`; // critical success formula 
let cfformula =`Your attempt to evade the ${title} fails disasterously. You suffer great harm. \\\\/r ${formula} \\\\/rolltable CritHit`; // critical failure formula 
let sformula =`You evade the ${title}! No bad stuff happens.`; //success formula 
let fformula =`You fail to evade the ${title}! Bad stuff happens. \\\\/r ${formula} \\\\You can make a last-ditch attempt to ["Dodge and Drop ${adjustedDifficulty}"Dodge ${adjustedDifficulty}] (WARNING: the Dodge and Drop Maneuver leaves you prone!) or ["Acrobatic Dodge ${adjustedDifficulty}!"/if [S:Acrobatics ${adjustedDifficulty}] [Dodge ${acroDodgeDifficulty}] /else [Dodge ${dodgeDifficulty}]]. If you succeed at either, take half damage from an area attack or no damage from a regular attack.`; // failure formula 
console.log(`csformula: ${csformula}; cfformula: ${cfformula}; sformula: ${sformula}; fformula: ${fformula};`);
let etOtF = `/if ${DefaultCheck} cs:{${csanim} \\\\${csformula}} s:{${sanim} \\\\${sformula}} f:{${fanim} \\\\${fformula}} cf:{${cfanim} \\\\${cfformula}}`;
console.log(etOtF);
await GURPS.executeOTF(etOtF);


