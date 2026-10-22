'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'provider-support.json')));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json')));
function rates(name,input){const m=catalog.models.find(m=>m.names.includes(name));return m?.tiers.find(t=>t.maxInput===0||input<=t.maxInput);}
test('data-only extension exposes no tools or credentials',()=>{let touched=false;require('../index.js').apply(new Proxy({},{get(){touched=true;throw Error('unexpected host access');}}));assert.equal(touched,false);assert.deepEqual(manifest.providerSupport,{protocol:1,catalog:'provider-support.json'});assert.equal(manifest.license,'MIT');assert.equal(manifest.settingsSchema,undefined);});
test('catalog names unique, rates valid and tiers strictly ordered',()=>{const names=new Set();assert.equal(catalog.protocol,1);assert.equal(catalog.currency,'CNY');for(const m of catalog.models){for(const n of m.names){assert(!names.has(n));names.add(n);}let prior=0;m.tiers.forEach((t,i)=>{assert(t.maxInput===0?i===m.tiers.length-1:t.maxInput>prior);prior=t.maxInput;for(const k of ['priceIn','priceOut'])assert(Number.isFinite(t[k])&&t[k]>=0);if(t.priceOutThinking!==undefined)assert(t.priceOutThinking>=t.priceOut);assert.equal(t.priceInCacheHit,undefined);});}assert(names.size>=20);});
test('regional isolation and fixed read-only billing protocol',()=>{assert.deepEqual(catalog.providers,[{host:'dashscope.aliyuncs.com',paths:['','/compatible-mode/v1','/api/v1']}]);assert.deepEqual(catalog.balance,{endpoint:'https://business.aliyuncs.com/',auth:'aliyun-rpc',totalPath:'Data.AvailableAmount',format:'aliyun-account-balance'});assert(catalog.sources.every(u=>new URL(u).protocol==='https:'));});
test('whole-request tier boundaries and reasoning prices',()=>{assert.equal(rates('qwen-plus',128000).priceOut,2);assert.equal(rates('qwen-plus',128001).priceOut,20);assert.equal(rates('qwen-plus',256001).priceOutThinking,64);assert.equal(rates('qwen3.7-flash',32000).priceIn,.2);assert.equal(rates('qwen3.7-flash',32001).priceIn,.6);assert.equal(rates('qwen3.8-flash',1000001),undefined);assert.equal(rates('qwen-unknown',1),undefined);assert.equal(rates('qwen-plus-custom',1),undefined);});
