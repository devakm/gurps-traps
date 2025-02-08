/* Usage: /:AxeTrap
 * This animates an axe attack; I use a statue token and a MATT chat command: /sel HiddenStatue before running this macro.
The result is a statue animating an axe attack; the statue token is hidden, so only the axe is visible.
*/
// OtF action setup:
// outcome animations:
let anim = '!/anim MeleeAttack02_BattleAxe01_02 *1.2 -0.2 +1 \\\\!/wait 700 \\\\!/anim GenericSlash01_01_Regular_Orange *1.2 -0.2 +1 \\\\!/wait 700 \\\\!/anim Impact_01_Regular_Yellow c *0.7 \\\\!/wait 600 \\\\!/anim LiquidSplashSide01_Regular_Red *0.3 +4 -0.9'; //  animation 
GURPS.executeOTF(anim);
