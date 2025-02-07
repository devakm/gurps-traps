/*##################################################################
          INSTRUCTIONS
This macro requires these modules : 
- Sequencer
- Tagger

Place down a Tile with only the base using the following filepath : 
"modules/jb2a_patreon/Library/Generic/Traps/Spike_Trap/Stills/SpikeTrapTopBaseHidden01_Regular_Brown_10x10ft_600x600_StillFrame.webp"
The full size of the trap is 600x600 pixels. Let's make it half its original size at 300x300.
Also, in the details of the tile at the bottom, we have to add the tag : "SpikeTrap" (without the quotation marks) in the field provided by the Tagger module.

Banked animations

await Sequencer.Preloader.preloadForClients([
  "jb2a.impact.ground_crack.still_frame.02",
  "jb2a.impact.ground_crack.02.orange",
  "jb2a.spike_trap.10x10ft.top.no_base.normal.01", 
  "jb2a.spike_trap.10x10ft.top.no_base.still_frame.deployed",
  "jb2a.liquid.splash.red",
  "jb2a.spike_trap.10x10ft.top.no_base.rearming.01",
])

   new Sequence()
      .effect()
        .file("jb2a.impact.ground_crack.02.orange")
        .atLocation(source)
        .size(trapSize)
        .fadeOut( 250,{ ease: "linear", delay: -6400 })
      .effect()
        .file("jb2a.spike_trap.10x10ft.top.no_base.normal.01")
        .atLocation(source)
        .size(trapSize)
        .fadeOut( 250,{ ease: "linear", delay: -2400 })
        .waitUntilFinished(-2700)
    .play();


####################################################################*/

// Let's pre-load the animations we'll need so that every client has the animations in cache and it doesn't mess the delays.

console.log(`------------------- Start SpikeTrap160x160px --------------------------`);
let sourceTag = scope.tag;
console.log(`sourceTag:${sourceTag}`);

await Sequencer.Preloader.preloadForClients([
  "jb2a.impact.ground_crack.02.orange",
  "jb2a.spike_trap.10x10ft.top.no_base.normal.01", 
])
const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
let sourcePosMarker = await Tagger.getByTag(sourceTag+"Location");
console.log(`sourcePosMarker: ${sourcePosMarker}`);
let sourcePosTile = await Tagger.getByTag(sourceTag);
console.log(`sourcePosTile: ${sourcePosTile}`);
const trapSize = { width: 300, height: 300 };// predefine size for all
await wait(100);
async function trapTrigger() {
	   new Sequence()
		  .effect()
			.file("jb2a.impact.ground_crack.02.orange")
			.atLocation(sourcePosTile[0])
			.size(trapSize)
			.fadeOut( 250,{ ease: "linear", delay: 4400 })
           .waitUntilFinished(-4400)
		  .effect()
			.file("jb2a.spike_trap.10x10ft.top.no_base.normal.01")
			.atLocation(sourcePosMarker[0])
			.size(trapSize)
			.fadeOut( 250,{ ease: "linear", delay: 2400 })
			.thenDo(() => {
				/// let sourceTag = 'BuxlanTorSpikeTrap01';
				let triggerTag = `Reveal${sourceTag}`;
				let tile= Tagger.getByTag(triggerTag);
				tile[0].trigger({});
			})			
			.waitUntilFinished(2400)
		.play();
	}
await trapTrigger();

console.log(`------------------- End SpikeTrap160x160px --------------------------`);