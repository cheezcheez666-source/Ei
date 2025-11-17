// AI Brain, context, memory, and integration
let db;
const request = indexedDB.open('GPTKingMemory', 1);
request.onupgradeneeded = function(event) {
db = event.target.result;
db.createObjectStore('characters', { keyPath: 'id' });
};
request.onsuccess = function(event) {
db = event.target.result;
};


const contextWindow = {};
function initCharacterContext(id, basePrompt) {
contextWindow[id] = { prompt: basePrompt, history: [] };
}
function addMessageToContext(id, message) {
if(contextWindow[id]){
contextWindow[id].history.push(message);
if(contextWindow[id].history.length>50) contextWindow[id].history.shift();
}
}


// Load transformer model
let model;
async function loadModel(){
model = await window.transformers.load('gpt2');
}


async function generateResponse(characterId, userInput){
const ctx = contextWindow[characterId];
const mood = EmotionalStates[characterId].mood;
const chaos = EmotionalStates[characterId].chaos;
const prompt = ctx.prompt + '\nCurrent Mood: '+mood+', Chaos Level: '+chaos+'\n'+ctx.history.join('\n')+'\nUser: '+userInput+'\nAI:';
const output = await model.generate(prompt, { max_length:100 });
const response = output[0].generated_text.split('\nAI: ')[1];
addMessageToContext(characterId, `User: ${userInput}`);
addMessageToContext(characterId, `AI: ${response}`);
return response;
}
