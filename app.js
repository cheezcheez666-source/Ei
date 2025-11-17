// ===============================
// GPT KING AI COMPANION — FULL APP.JS
// ===============================

// -------------------------------
// Memory & Context
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

// -------------------------------
// Load transformer model
let model;
async function loadModel(){
    model = await window.transformers.load('gpt2');
}

// -------------------------------
// Generate AI Response
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

// -------------------------------
// Emotional States
const EmotionalStates = {};
function initEmotion(characterId){
    EmotionalStates[characterId] = { mood:'neutral', energy:50, chaos:10 };
}

// -------------------------------
// Avatars & Canvas
const canvas=document.getElementById('petCanvas');
const ctx=canvas.getContext('2d');
const Avatars={};
function loadAvatar(id,imgSrc){
    const img=new Image();
    img.src=imgSrc;
    Avatars[id]={img,x:Math.random()*canvas.width,y:Math.random()*canvas.height,vx:0,vy:0};
}
function updateAvatar(id){
    const avatar=Avatars[id];
    if(!avatar) return;
    const mood=EmotionalStates[id].mood;
    let speed=1; if(mood==='chaotic') speed=3; if(mood==='sleepy') speed=0.5;
    avatar.vx += (Math.random()-0.5)*0.5*speed;
    avatar.vy += (Math.random()-0.5)*0.5*speed;
    avatar.vx=Math.max(-speed,Math.min(speed,avatar.vx));
    avatar.vy=Math.max(-speed,Math.min(speed,avatar.vy));
    avatar.x += avatar.vx; avatar.y += avatar.vy;
    if(avatar.x<0 || avatar.x>canvas.width-avatar.img.width) avatar.vx*=-1;
    if(avatar.y<0 || avatar.y>canvas.height-avatar.img.height) avatar.vy*=-1;
}
function drawAvatars(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const id in Avatars) ctx.drawImage(Avatars[id].img, Avatars[id].x, Avatars[id].y);
}
function petLoop(){
    for(const id in Avatars) updateAvatar(id);
    drawAvatars();
    requestAnimationFrame(petLoop);
}

// -------------------------------
// Chat & Controls
const messagesDiv=document.getElementById('messages');
const userInput=document.getElementById('userInput');
const sendBtn=document.getElementById('sendBtn');
sendBtn.addEventListener('click',async()=>{
    const text=userInput.value;if(!text) return; userInput.value='';
    messagesDiv.innerHTML += `<div class='userMsg'>You: ${text}</div>`;
    const response = await generateResponse('gremlin1',text);
    messagesDiv.innerHTML += `<div class='aiMsg'>${response}</div>`;
});
document.getElementById('changeBg').addEventListener('click',()=>{
    const colors=['#222','#114','#441','#442','#191919'];
    canvas.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
});
document.getElementById('singBtn').addEventListener('click',()=>{
    const singing=generateSinging('gremlin1');
    messagesDiv.innerHTML += `<div class='aiMsg'>${singing}</div>`;
});

// -------------------------------
// Character Initialization
function createCharacter(id,name,prompt,avatarSrc,sampleLyrics){
    initCharacterContext(id,prompt);
    initEmotion(id);
    loadAvatar(id,avatarSrc);
    initSinging(id,sampleLyrics); // from markov.js
}

// -------------------------------
// Launch App
async function launchApp(){
    await loadModel(); // load GPT model

    // Initialize characters
    createCharacter('gremlin1','Gremlin','Mischievous AI pet','avatars/avatar1.png','la la oh hey da na');
    createCharacter('gremlin2','Pixie','Playful AI companion','avatars/avatar2.png','na na oh la da');

    // Start animation & interaction loops
    petLoop();
}

// Call launchApp to start everything
launchApp();
const output = await model.generate(prompt, { max_length:100 });
const response = output[0].generated_text.split('\nAI: ')[1];
addMessageToContext(characterId, `User: ${userInput}`);
addMessageToContext(characterId, `AI: ${response}`);
return response;
}
