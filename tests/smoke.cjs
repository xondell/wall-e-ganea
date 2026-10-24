/** Dependency-free smoke test of app state and the 3D renderer with a stub canvas.
 *  Not a substitute for browser screenshots, layout measurements, or real clicks. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const elements=new Map();const listeners=new Map();
const noop=()=>{};
function element(id){
  if(!elements.has(id))elements.set(id,{
    id,hidden:false,innerHTML:'',textContent:'',style:{},disabled:false,value:'',
    addEventListener(type,cb){listeners.set(`${id}:${type}`,cb);},
    focus:noop,setPointerCapture:noop,
    getBoundingClientRect(){return{id,width:1366,height:768,left:0,right:id==='copy-panel'?530:1366,top:0,bottom:768};}
  });
  return elements.get(id);
}
const ctx={};
for(const name of ['clearRect','fillRect','beginPath','arc','fill','stroke','moveTo','lineTo','closePath','fillText','save','restore','setTransform','setLineDash'])ctx[name]=noop;
ctx.createRadialGradient=()=>({addColorStop:noop});
element('world-canvas').getContext=()=>ctx;
const env={
  document:{getElementById:element,documentElement:{requestFullscreen:async()=>{}},fullscreenElement:null,addEventListener(type,fn){listeners.set(`document:${type}`,fn);}},
  window:{devicePixelRatio:1,innerWidth:1366,innerHeight:768,addEventListener(type,cb){listeners.set(`window:${type}`,cb);}},
  location:{hash:''},history:{replaceState(_a,_b,hash){env.location.hash=hash;}},
  requestAnimationFrame:noop,console,Math,Number,Set,Array,parseInt,
};
env.window.requestAnimationFrame=noop;
vm.createContext(env);
for(const file of ['world3d.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),env,{filename:file});
assert.equal(env.window.WallEPresentation.getSlideCount(),12);
assert.match(element('panel-content').innerHTML,/WALL-E/);
assert.ok(env.window.WallEWorld.getView().pitch>.9, 'default camera should look from above');
for(let i=0;i<12;i++){
  env.window.WallEPresentation.navigate(i);
  assert.equal(element('slide-count').textContent,`${String(i+1).padStart(2,'0')} / 12`);
  env.window.WallEWorld.render(i,env.window.WallEPresentation.getState(),true);
}
env.window.WallEPresentation.navigate(1);
assert.match(element('panel-content').innerHTML,/Борис Колесов/);
env.window.WallEPresentation.navigate(8);
assert.match(element('graphics').innerHTML,/60M/);
env.window.WallEPresentation.navigate(3);
assert.match(element('graphics').innerHTML,/cycle-item/);
const graphicsAction=listeners.get('document:click');
graphicsAction({target:{closest(sel){return sel==='[data-action]'?{dataset:{action:'cycle',value:'7'}}:null;}}});
assert.equal(env.window.WallEPresentation.getState().cycleStep,7);
assert.match(element('graphics').innerHTML,/Вставить именно в A:S/);
env.window.WallEPresentation.navigate(6);
graphicsAction({target:{closest(sel){return sel==='[data-action]'?{dataset:{action:'obstacle',value:'0'}}:null;}}});
assert.equal(env.window.WallEPresentation.getState().sandboxObstacle,true);
env.window.WallEWorld.render(6,env.window.WallEPresentation.getState(),false);
listeners.get('collapse:click')();
assert.equal(element('copy-panel').hidden,true);
assert.equal(element('restore').hidden,false);
listeners.get('restore:click')();
assert.equal(element('copy-panel').hidden,false);
console.log('PASS: 12 slides, elevated camera, personal slide, token estimate, route steps, scene render, parameter actions, panel collapse/restore.');
