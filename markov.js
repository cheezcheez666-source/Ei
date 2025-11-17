class MarkovChain {
constructor(){
this.chain = {};
}
addText(text){
const words = text.split(/\s+/);
for(let i=0;i<words.length-1;i++){
const word=words[i];
const next=words[i+1];
if(!this.chain[word]) this.chain[word]=[];
this.chain[word].push(next);
}
}
generate(seed, maxWords=20){
let word=seed||Object.keys(this.chain)[Math.floor(Math.random()*Object.keys(this.chain).length)];
const result=[word];
for(let i=0;i<maxWords;i++){
const nextWords=this.chain[word];
if(!nextWords||nextWords.length===0) break;
word=nextWords[Math.floor(Math.random()*nextWords.length)];
result.push(word);
}
return result.join(' ');
}
}


const singingChains = {};
function initSinging(characterId,sampleLyrics){
const chain=new MarkovChain();
chain.addText(sampleLyrics);
singingChains[characterId]=chain;
}


function generateSinging(characterId){
const chain=singingChains[characterId];
if(!chain) return 'AI sings silently...';
const seedWords=['la','oh','hey','da','na'];
const seed=seedWords[Math.floor(Math.random()*seedWords.length)];
return chain.generate(seed,15);
}


function duetSinging(characterA, characterB){
const partA=generateSinging(characterA);
const partB=generateSinging(characterB);
return `${partA}\n${partB}`;
}
