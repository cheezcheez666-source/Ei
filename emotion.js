const emotions = ['happy','sad','chaotic','sleepy','mischievous','neutral'];
const EmotionalStates = {};


function initEmotion(characterId){
EmotionalStates[characterId] = { mood:'neutral', energy:50, chaos:10 };
}


function updateEmotion(characterId, event){
const state = EmotionalStates[characterId];
switch(event){
case 'user_praised': state.mood='happy'; state.energy+=10; break;
case 'user_ignored': state.mood='mischievous'; state.chaos+=5; break;
case 'long_idle': state.mood='chaotic'; state.chaos+=15; break;
case 'sleep_cycle': state.mood='sleepy'; state.energy-=20; break;
}
state.energy = Math.max(0, Math.min(100, state.energy));
state.chaos = Math.max(0, Math.min(100, state.chaos));
}
