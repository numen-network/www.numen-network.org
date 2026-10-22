/**
 * Optional in-place machine translation.
 * English remains the canonical, SEO-indexed source language.
 * Configure VITE_TRANSLATE_ENDPOINT for a production translation proxy.
 * The public fallback is best-effort and rate limited.
 */
export const languages = [
  ['en','English'],['zh-CN','简体中文'],['hi','हिन्दी'],['es','Español'],
  ['fr','Français'],['ar','العربية'],['bn','বাংলা'],['pt','Português'],
  ['ru','Русский'],['ur','اردو'],['id','Bahasa Indonesia'],['de','Deutsch'],
  ['ja','日本語'],['sw','Kiswahili'],['mr','मराठी'],['te','తెలుగు'],
  ['tr','Türkçe'],['ta','தமிழ்'],['vi','Tiếng Việt'],['ko','한국어']
];
const cache = new Map();
let activeRequest = 0;
export function getSavedLanguage(){
  try {const value=localStorage.getItem('numen-language');return languages.some(([code])=>code===value)?value:'en';}
  catch{return 'en';}
}
export function saveLanguage(code){
  try{localStorage.setItem('numen-language',code)}catch{}
}
function decodeEntities(value){
  const element=document.createElement('textarea');element.innerHTML=value;return element.value;
}
async function translateText(text,language){
  const key=language+'|'+text;
  if(cache.has(key))return cache.get(key);
  const endpoint=globalThis.NUMEN_TRANSLATE_ENDPOINT;
  let translated;
  if(endpoint){
    // Your endpoint must accept {text,source,target} and return {translatedText}.
    const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,source:'en',target:language})});
    if(!response.ok)throw new Error('Translation endpoint unavailable');
    translated=(await response.json()).translatedText;
  }else{
    const url='https://api.mymemory.translated.net/get?q='+encodeURIComponent(text)+'&langpair=en|'+encodeURIComponent(language);
    const response=await fetch(url);
    if(!response.ok)throw new Error('Translation service unavailable');
    const data=await response.json();
    if(data.responseStatus!==200||!data.responseData?.translatedText)throw new Error('Translation quota reached');
    translated=decodeEntities(data.responseData.translatedText);
    if(/MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(translated))throw new Error('Translation quota reached');
  }
  if(!translated)throw new Error('Empty translation');
  cache.set(key,translated);
  return translated;
}
export async function translatePage(root,language){
  const request=++activeRequest;
  const status=document.querySelector('#translation-status');
  if(language==='en')return;
  if(status)status.textContent='Translating…';
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{
    acceptNode(node){
      const text=node.textContent.trim();
      if(text.length<2||!/[A-Za-z]/.test(text))return NodeFilter.FILTER_REJECT;
      if(node.parentElement?.closest('script,style,code,pre,svg,canvas,select,option,[data-no-translate],.sr-only'))return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  // Group repeated strings; cap requests and translate visible UI before deeper content.
  const groups=new Map();
  for(const node of nodes){
    const text=node.textContent.trim();
    if(text.length>450)continue;
    if(!groups.has(text))groups.set(text,[]);
    groups.get(text).push(node);
  }
  const entries=[...groups.entries()];
  let done=0,failed=0,next=0;
  async function worker(){
    while(next<entries.length&&request===activeRequest){
      const [text,targets]=entries[next++];
      try{
        const result=await translateText(text,language);
        if(request!==activeRequest)return;
        for(const node of targets){if(node.isConnected)node.textContent=node.textContent.replace(text,result)}
        done++;
      }catch{failed++}
      if(status&&request===activeRequest)status.textContent=`Translating… ${done}/${entries.length}`;
    }
  }
  await Promise.all(Array.from({length:3},worker));
  if(status&&request===activeRequest)status.textContent=failed?`Translated ${done} sections; ${failed} could not be translated. Try again later.`:'Translation complete';
}
