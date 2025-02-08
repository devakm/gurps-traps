# gurps-traps
# Traps for GURPS Game Aid

![image](https://github.com/user-attachments/assets/40397bef-8e5f-4cd8-b4ec-737680cca0ee)

Traps for GGA is a collection of scripts to help with defining how traps behave and tile templates to make custom trap creation as easily repeatable as possible.

The scripts are triggered by hidden tiles created with Monk's Active Tile Triggers (MATT) and linked together using Tagger. The first template creates a detection zone that runs the DetectTraps macro on Enter. This works similar to the classic SpellDamage macro for GGA and is triggered by a MATT Chat Message containing GURPS-style trap details so that many different trap configurations can be handled. 

If DetectTraps is successful as they enter this zone, the player gets a warning and nothing else happens. 

If DetectTraps fails, then the trap is triggered. DetectTraps calls EvadeTrap or ResistEffect along with a Sequencer animation of the trap effect and the Tagger name of the next tile to trigger: the Activation Zone. This tile is activated manually because it shares a description of the trap effects, which you can easily tailor in the tile Trigger for the current scene. 

The format for DetectTraps is:
`Usage: /:DetectTraps title="<title>"" dice=<dice> adds=<adds> type=<type> armordiv=<divisor> rsize=<rsize> attrib=<attribute> difmod=<difficulty> skill=<skill> detectwith=<detectWith> detectdif=<detectDif> traptag=<trapTag>`
-   Title - name to display on dialog; usually the type of trap, such as "Spike Trap", "Caltrops", "Pitfall Trap", "Poison Gas", "YellowMold", "AlchemistFire", etc.
-   Dice - dice of damage per energy point; may be a fraction
-   Adds - modifier to each die of damage, zero if none
-   Type - Damage type (cr, cut, burn, etc...)
-   Divisor - Reduce DR by (x)
-   Radius - spread to Radius hexes
-   Attribute - DX, ST, DX, IQ, Will, etc for Evade or Resist
-   DifMod - Difficulty Modifier; corresponds to margin of success when the trap was created;
-   Skill - Skill name Precheck to evade, i.e. Acrobatics
-   DetectWith - defaults to PER; could be vision, hearing, etc.
-   Detect Difficulty - defaults to DifMod; use this if detection is harder or easier than evasion/resistance
-   Trap Tag - the Tagger tag base string for this trap tile set.

`/:DetectTraps title="AxeTrap" dice=5d adds=2 type=cut armordiv=5 attrib=DX difmod=-4 skill=Acrobatics detectwith=!PER! detectdif=-6 tag=AxeTrap02` 

The success and fail outcomes for DetectTraps will either warn the player about the trap or trigger it. If triggered, depending on the "title type" of the trap, the result would be to spawn either EvadeTrap or ResistEffect macros using nearly the same format as DetectTraps:

- `/:EvadeTrap title="${title}" dice=${dice} adds=${adds} type=${type} armordiv=${armorDivisor} attrib=${attribName} difmod=${difMod} skill=${skillName}`
- `/:ResistEffect title="${title}" dice=${dice} adds=${adds} type=${type} rsize=${radius} attrib=${attribName} difmod=${difMod}`

## Setup

For trap types and tile templates setup, see the [wiki](https://github.com/devakm/gurps-traps/wiki)

## Details

Requires:
- [GGA 17.17+](https://github.com/crnormand/gurps/tree/main)
- [Monk's Active Tile Triggrs](https://foundryvtt.com/packages/monks-active-tiles/)
- [JB2A](https://foundryvtt.com/packages/JB2A_DnD5e)
- [Sequencer](https://foundryvtt.com/packages/sequencer)
- [Tagger](https://foundryvtt.com/packages/tagger)

Join us on Discord: [GURPS Foundry-VTT Discord](https://discord.gg/6xJBcYWyED)

Check out my [GURPS Night Vision module](https://github.com/devakm/gurps-night-vision).

#### Legal

As an addon module for GURPS Game Aid (GGA), this small script collection is my own creation intended for use with the [GURPS](http://www.sjgames.com/gurps) system from [Steve Jackson Games](ttp://www.sjgames.com). This module is not official and is not endorsed by Steve Jackson Games.

[GURPS](http://www.sjgames.com/gurps) is a trademark of Steve Jackson Games, and its rules and art are copyrighted by Steve Jackson Games. All rights are reserved by Steve Jackson Games. This addon to GGA is released for free distribution, and not for resale, under the permissions granted in the [Steve Jackson Games Online Policy](http://www.sjgames.com/general/online_policy.html)


