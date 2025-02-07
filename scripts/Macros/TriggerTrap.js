console.log(`---------- in TriggerTrap---------`);
function wait(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
}

let trapTag = scope.tag;
trapTag = `Triggered${trapTag}`;
await wait(2);
game.macros.getName('TriggerActiveTile').execute({tag: trapTag, victim: _token.id}); // TriggeredBXTAxeTrap01
console.log(`---------- End TriggerTrap: ${trapTag} ---------`);
