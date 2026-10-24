/* Lightweight, dependency-free projected 3D CONCEPT illustrator.
   This is NOT Gazebo, CAD, a simulation, or evidence of physical feasibility. */
(function () {
  'use strict';
  const canvas = document.getElementById('world-canvas');
  const ctx = canvas.getContext('2d', { alpha: true });
  // Elevated three-quarter view: the audience sees the TOP of the robot and hives.
  let yaw = -0.65, pitch = 1.08, zoom = 1;
  let drag = null, lastWidth = 0, lastHeight = 0, movingX = 0;
  const shades = {
    metal:'#6d8d87', body:'#b6cac1', track:'#263d3c', trackRim:'#4f6a64',
    hive:'#bd9e70', hiveLight:'#e4c492', lid:'#526863', gold:'#f4b94c',
    frame:'#e9c783', glass:'#4c8e84', station:'#62847e', ground:'#193630'
  };
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function rgba(hex,a){const h=hex.replace('#','');return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${a})`;}
  function tint(hex,mult){const h=hex.replace('#','');const n=[0,2,4].map(i=>clamp(Math.round(parseInt(h.slice(i,i+2),16)*mult),0,255));return `rgb(${n.join(',')})`;}

  let view, faces, lineSegments, labels;
  function project(p){
    const dx=p[0]-view.tx,dy=p[1]-view.ty,dz=p[2]-view.tz;
    const a=dx*Math.cos(yaw)-dy*Math.sin(yaw);
    const b=dx*Math.sin(yaw)+dy*Math.cos(yaw);
    // Depth grows AWAY from the viewer. Higher Z is closer to an elevated camera,
    // so subtract it; otherwise bottom faces cover the lid and chassis tops.
    return {x:view.cx+a*view.scale,y:view.cy+(b*Math.sin(pitch)-dz*Math.cos(pitch))*view.scale,depth:b*Math.cos(pitch)-dz*Math.sin(pitch)};
  }
  function addFace(points,color,alpha=1,stroke=null){
    const ps=points.map(project);
    faces.push({ps,color,alpha,stroke,depth:ps.reduce((s,p)=>s+p.depth,0)/ps.length});
  }
  function box(x,y,z,sx,sy,sz,color,alpha=1){
    const x0=x-sx/2,x1=x+sx/2,y0=y-sy/2,y1=y+sy/2,z0=z,z1=z+sz;
    const p=[ [x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],
              [x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1] ];
    const f=[[0,1,2,3,.47],[0,1,5,4,.75],[1,2,6,5,.89],[2,3,7,6,.62],[3,0,4,7,.93],[4,5,6,7,1.18]];
    for(const [a,b,c,d,shade] of f) addFace([p[a],p[b],p[c],p[d]],tint(color,shade),alpha,alpha===1?'rgba(226,255,233,.10)':null);
  }
  function line(a,b,color='#8ac7a8',width=1.3,alpha=.6,dashed=[]){lineSegments.push({a:project(a),b:project(b),color,width,alpha,dashed});}
  function label(p,txt,color='#e6f1e5',size=12){labels.push({p:project(p),txt,color,size});}
  function groundGrid(range=12){
    for(let k=-range;k<=range;k++){
      line([k,-range,-.005],[k,range,-.005],'#41776a',.65,k%2===0?.26:.10);
      line([-range,k,-.005],[range,k,-.005],'#41776a',.65,k%2===0?.26:.10);
    }
  }
  function cylinder(cx,cy,z,r,height,color,n=12){
    for(let i=0;i<n;i++){
      const a=i*2*Math.PI/n,b=(i+1)*2*Math.PI/n;
      addFace([[cx+r*Math.cos(a),cy+r*Math.sin(a),z],[cx+r*Math.cos(b),cy+r*Math.sin(b),z],[cx+r*Math.cos(b),cy+r*Math.sin(b),z+height],[cx+r*Math.cos(a),cy+r*Math.sin(a),z+height]],tint(color,.74+Math.cos(a)*.17));
    }
    const top=[];for(let i=0;i<n;i++){const a=i*2*Math.PI/n;top.push([cx+r*Math.cos(a),cy+r*Math.sin(a),z+height]);}
    addFace(top,tint(color,1.15));
  }
  function frame(x,y,z,accent=false){
    const wood=accent?shades.gold:shades.frame;
    box(x,y-.08,z,.94,.10,.075,wood);
    box(x,y+.08,z,.94,.10,.075,wood);
    box(x-.45,y,z,.08,.19,.90,wood);
    box(x+.45,y,z,.08,.19,.90,wood);
    box(x,y,z+.13,.83,.045,.63,'#ca8f3e',.78);
    for(let i=-3;i<=3;i++) line([x+i*.11,y-.117,z+.16],[x+i*.11,y-.117,z+.7],'#f9d67f',.6,.3);
  }
  function hive(x,y,z,opened=false,selected=false,omitCenter=false){
    const col=selected?shades.hiveLight:shades.hive;
    box(x,y,z,1.87,1.35,1.0,col);
    box(x,y,z+.99,1.93,1.42,.17,'#815f36');
    box(x,y,z+1.16,1.85,1.33,.24,shades.hiveLight);
    if(opened){
      box(x+.14,y-.85,z+1.95,2.05,1.46,.15,shades.lid);
      line([x-.9,y-.7,z+1.4],[x-.9,y-.7,z+1.95],'#dfcda0',2,.7);
      line([x+.9,y-.7,z+1.4],[x+.9,y-.7,z+1.95],'#dfcda0',2,.7);
      for(let i=-2;i<=2;i++)if(!(omitCenter&&i===0))frame(x+i*.3,y,z+1.5,selected&&i===0);
    } else {box(x,y,z+1.38,2.10,1.52,.20,shades.lid);}
    for(let i=0;i<3;i++) line([x-.95,y+.7,z+.25+i*.26],[x+.95,y+.7,z+.25+i*.26],'#896c44',1,.67);
    for(let i=-1;i<=1;i++)box(x+i*.55,y,z-.16,.18,1.45,.18,'#465950');
    label([x,y,z+2.25],'УЛЕЙ A','#e6d2a7',12);
  }
  function station(x,y,z,hasFrame=true){
    for(let i=-1;i<=1;i++)box(x+i*.8,y,z,.13,1.8,1.12,'#344d48');
    box(x,y,z+.97,2.7,1.85,.22,shades.station);
    box(x,y-.14,z+1.18,1.37,.95,.13,'#31564f');
    box(x+.95,y-.5,z+1.26,.4,.33,.27,shades.gold);
    box(x,y+.79,z+.1,2.6,.17,.77,'#415d58');
    if(hasFrame) frame(x,y,z+1.40,true);
    label([x,y,z+2.25],'СТАНЦИЯ B','#b6f4d5',12);
  }
  function robot(x,y,z,opts={}){
    const loaded=!!opts.loaded,expanded=!!opts.expanded,part=opts.part??-1;
    const hi=i=>part===i?shades.gold:null;
    for(const s of [-1,1]){
      box(x+s*.87,y,z+.10,.45,2.35,.43,hi(0)||shades.track);
      box(x+s*.87,y,z+.55,.43,2.31,.17,'#4d6e67');
      for(let i=-5;i<=5;i++)box(x+s*1.105,y+i*.198,z+.1,.047,.116,.47,'#1a302f');
    }
    box(x,y,z+.36,1.35,2.13,.55,hi(0)||'#608278');
    box(x,y-.32,z+.91,1.2,1.45,.34,'#244945');
    box(x,y-.83,z+1.16,1.0,.84,.20,hi(2)||'#395e58');
    box(x,y-.84,z+1.37,1.03,.78,.075,hi(2)||'#80ada1');
    box(x,y+.4,z+.87,1.05,.86,.14,'#284640');
    box(x-.43,y+.55,z+1.05,.22,.26,1.25,hi(1)||'#c69c49');
    box(x-.43,y+.67,z+2.19,.31,.30,.25,'#3c5f57');
    const armY=expanded?1.46:.89;
    box(x-.19,y+armY,z+2.22,.94,.18,.18,hi(1)||shades.gold);
    box(x+.29,y+armY,z+1.7,.20,.22,.59,'#a1baaa');
    box(x+.29,y+armY,z+1.62,.57,.17,.075,hi(1)||shades.gold);
    cylinder(x+.28,y-.14,z+1.04,.28,.24,hi(3)||'#69ad99');
    box(x+.28,y-.14,z+1.30,.09,.09,.25,'#aaccc1');
    cylinder(x+.28,y-.14,z+1.54,.33,.11,hi(3)||'#62a58e');
    if(loaded)frame(x,y-.84,z+1.45,true);
    if(opts.label!==false)label([x,y,z+2.8],'WALL-E ROBOT',part>=0?'#ffc868':'#eaf8ec',13);
  }
  function pathPoints(points){
    for(let i=0;i<points.length-1;i++){
      const a=points[i],b=points[i+1];line([a[0],a[1],.028],[b[0],b[1],.028],shades.gold,3,.74,[8,9]);
    }
  }
  function cloudHives(){for(let i=0;i<5;i++){const x=2+(i%3)*2.4,y=2+Math.floor(i/3)*2.15;hive(x,y,0,false,i===0);}}
  function renderShapes(){
    faces.sort((a,b)=>b.depth-a.depth);
    ctx.save();ctx.lineJoin='round';
    for(const f of faces){ctx.globalAlpha=f.alpha;ctx.beginPath();ctx.moveTo(f.ps[0].x,f.ps[0].y);for(let i=1;i<f.ps.length;i++)ctx.lineTo(f.ps[i].x,f.ps[i].y);ctx.closePath();ctx.fillStyle=f.color;ctx.fill();if(f.stroke){ctx.strokeStyle=f.stroke;ctx.lineWidth=.65;ctx.stroke();}}
    for(const l of lineSegments){ctx.globalAlpha=l.alpha;ctx.beginPath();ctx.setLineDash(l.dashed);ctx.moveTo(l.a.x,l.a.y);ctx.lineTo(l.b.x,l.b.y);ctx.strokeStyle=l.color;ctx.lineWidth=l.width;ctx.stroke();}ctx.setLineDash([]);
    for(const l of labels){ctx.globalAlpha=.96;ctx.textAlign='center';ctx.font=`800 ${l.size}px Inter, sans-serif`;ctx.fillStyle=l.color;ctx.shadowColor='#001515';ctx.shadowBlur=8;ctx.fillText(l.txt,l.p.x,l.p.y);ctx.shadowBlur=0;}
    ctx.restore();
  }
  function renderBackground(w,h){
    ctx.clearRect(0,0,w,h);
    const grad=ctx.createRadialGradient(w*.80,h*.51,0,w*.8,h*.51,Math.max(w,h)*.72);
    grad.addColorStop(0,'rgba(51,120,91,.14)');grad.addColorStop(1,'rgba(4,18,19,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
    ctx.fillStyle='rgba(201,233,204,.13)';
    for(let i=0;i<58;i++){const x=(i*1019.31)%w,y=(i*587.22)%h;ctx.beginPath();ctx.arc(x,y,(i%4===0?1.5:.65),0,Math.PI*2);ctx.fill();}
  }
  function render(active,state,panelOpen){
    const rect=canvas.getBoundingClientRect(),w=Math.round(rect.width),h=Math.round(rect.height);
    if(w<1||h<1)return;
    const pixelRatio=Math.min(window.devicePixelRatio||1,2);
    if(w!==lastWidth||h!==lastHeight||canvas.width!==Math.round(w*pixelRatio)){
      canvas.width=Math.round(w*pixelRatio);canvas.height=Math.round(h*pixelRatio);lastWidth=w;lastHeight=h;
    }
    ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);
    renderBackground(w,h);
    faces=[];lineSegments=[];labels=[];
    const usablePanel=document.getElementById('copy-panel'),pr=usablePanel.getBoundingClientRect();
    let anchorX=panelOpen&&w>720?Math.max(w*.68,(pr.right+w)/2):w*.52;
    let anchorY=panelOpen&&w<=720?h*.77:h*.54;
    const isWorld=[0,3,4,5,6].includes(active);
    if(!isWorld){
      view={cx:w*.74,cy:h*.51,tx:0,ty:0,tz:0,scale:Math.min(w,h)*.09};
      groundGrid(10);renderShapes();return;
    }
    const closeup=active===5;
    const tx=active===3?2.8:closeup?0:active===6?2.7:2.2;
    view={cx:anchorX,cy:anchorY,tx,ty:.5,tz:.7,scale:Math.min(w,h)*(closeup?.17:.113)*zoom*(w<720?.75:1)};
    groundGrid(12);
    if(active===5){robot(0,0,0,{loaded:true,expanded:true,part:state.partIndex});}
    else if(active===6){
      const rise=(state.sandboxSlope||0)*.025;
      addFace([[2.0,-1.7,.025],[5.5,-1.7,rise],[5.5,1.4,rise],[2,1.4,.025]],'#2e6251',.75);
      line([2,-1.7,.03],[5.5,-1.7,rise],'#8ce0ac',2.5,.9);
      if(state.sandboxObstacle)box(4.5,-1.25,0,.72,.65,.82,'#a97952');
      hive(1.1,0,0,!!state.sandboxOpened,true);station(6,0,0,false);
      robot(3.3,0,0,{loaded:state.sandboxLoad>10,expanded:state.sandboxOpened});
      pathPoints([[1.1,-1.5],[3.3,-1.5],[6,-1.5]]);
    } else if(active===3){
      const positions=[-.6,.9,1.15,3.5,5.8,5.8,3.3,.93];
      const target=positions[state.cycleStep||0];movingX+=(target-movingX)*.12;
      const step=state.cycleStep||0;
      hive(1.25,0,0,[1,2,7].includes(step),true,[2,7].includes(step));
      station(6.1,0,0,step===4);
      robot(movingX,-1.9,0,{loaded:[3,5,6].includes(step),expanded:[2,7].includes(step)});
      pathPoints([[1.25,-1.9],[6.1,-1.9]]);
      if(step===2)frame(1.25,-.25,2.02,true);
      if(step===7)frame(1.25,0,1.5,true);
    } else if(active===4){
      hive(1.0,1.4,0,false);station(6.9,-.2,0,true);
      robot(3.9,-1.3,0,{loaded:true,part:state.moduleIndex===0?0:state.moduleIndex===1?3:-1});
      pathPoints([[1,-1.3],[3.9,-1.3],[6.9,-1.3]]);
    } else {
      hive(.9,1.2,0,false,true);station(6.9,.25,0,false);robot(3.3,-1.1,0,{loaded:true,expanded:true});
      hive(1.1,4,0,false);hive(4.2,3.8,0,false);pathPoints([[.9,-1.0],[3.3,-1],[6.9,-1]]);
    }
    renderShapes();
  }
  canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,yaw,pitch};canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing';});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;yaw=drag.yaw+(e.clientX-drag.x)*.006;pitch=clamp(drag.pitch+(e.clientY-drag.y)*.004,.35,1.42);});
  function release(){drag=null;canvas.style.cursor='grab';}
  canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
  canvas.addEventListener('wheel',e=>{if(e.target!==canvas)return;e.preventDefault();zoom=clamp(zoom*(e.deltaY<0?1.12:.89),.62,1.9);},{passive:false});
  canvas.style.cursor='grab';
  window.WallEWorld={render,resetView:()=>{yaw=-.65;pitch=1.08;zoom=1;},getView:()=>({yaw,pitch,zoom})};
})();
