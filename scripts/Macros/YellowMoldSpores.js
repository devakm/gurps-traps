/*
####################################################
   This macro needs the Sequencer module to work.
####################################################
*/

// Let's create a function with arguments. That means that we can call this function later and define each argument (here they're called dbThrow, dbFracture and dbExplosion);
// If you look at the end of the macro, we're using each arg to call a specific Database path. (i.e: await grenade('dbPath01', 'dbPath02', 'dbPath03'))
async function grenade(dbSmoke, dbMarker, dbGas){
    let source = _token; // this is the first selected token
    let targets = Array.from(game.user.targets); // This is an array that will contain all targeted tokens (we need at least one to know where to throw the potion or grenade)
        for(let target of targets){ // The for loop will iterate for each target, if more than one token is targeted. Otherwise it will run it only once
        new Sequence()
        .effect()
            .file(dbSmoke)
            .atLocation(target)
            .tint("#828a16")
            .scale(1.8)
            .scaleIn(0.1, 500, {ease: "easeOutExpo"})
            .duration(1550)
            .waitUntilFinished(-150)  
        .effect() 
            .file(dbMarker)
            .atLocation(target)
            .scale(0.7)
            .waitUntilFinished(-150)  
        .effect()
            .file(dbGas)
            .atLocation(target)
            .belowTokens()
            .scale(0.6)
            .scaleIn(0.1, 3700, {ease: "easeOutExpo"})
            .persist() 
			.name('YellowMoldSpores')			
        .play();
        
        let delay = Sequencer.Helpers.random_int_between(600, 1000) // neat little helper from Sequencer giving us a whole number between two values
        await Sequencer.Helpers.wait(delay) // another helper that allows us to delay the time between each loop (when we have more than one target)
        
        }
    }
await grenade('jb2a.smoke.plumes.01.dark_green.0','jb2a.toll_the_dead.green.skull_smoke','jb2a.fog_cloud.02.green02');

/*

jb2a.smoke.puff.side.green.4
jb2a.smoke.plumes.01.dark_green.0
jb2a.smoke.puff.side.dark_green.2
jb2a.toll_the_dead.green.skull_smoke
jb2a.fog_cloud.02.green02
jb2a.fog_cloud.02.green02
*/

//FogCloud_02_Regular_Green     jb2a.fog_cloud.02.green02
//Sequencer.EffectManager.endEffects({name: 'PoisonCloud'})
//jb2a.fireball.loop_debris.orange
// jb2a.fog_cloud.2.green  jb2a.fog_cloud.02.green02
//jb2a.breath_weapons.poison.cone.green

