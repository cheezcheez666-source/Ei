const BehaviorTrees = {};


function initBehaviorTree(characterId) {
BehaviorTrees[characterId] = {
idleTimer: 0,
mood: 'neutral',
actions: [idleAction, spontaneousAction, reactToEmotion, chaosInfusion]
};
}


function runBehaviorTree(characterId) {
const tree = BehaviorTrees[characterId];
for (const action of tree.actions) {
const result = action(characterId, tree);
if(result) return result;
}
return null;
}


// Idle Action
function idleAction(id, tree) {
tree.idleTimer++;
if(tree.idleTimer > 200) {
updateEmotion(id, 'long_idle');
tree.idleTimer = 0;
return `AI: *wanders around looking bored*`;
}
return null;
}


// Spontaneous Action
function spontaneousAction(id, tree) {
if(Math.random() < 0.02){
return `AI: *does something random for attention*`;
}
return null;
// Behavior loop is run in app.js via setInterval
