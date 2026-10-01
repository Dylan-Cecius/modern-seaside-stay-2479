/**
 * Atelier Chrome — procedural WebGL barber pole.
 * Original implementation; no library, external model, HDRI or remote dependency.
 * Meshes are surfaces of revolution, lit with a procedural studio environment.
 */
(() => {
  'use strict';
  const vertexSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aUV;
    uniform mat4 uModel;
    uniform mat4 uProjection;
    varying vec3 vNormal;
    varying vec3 vWorld;
    varying vec2 vUV;
    void main() {
      vec4 world = uModel * vec4(aPosition, 1.0);
      vWorld = world.xyz;
      vNormal = mat3(uModel) * aNormal;
      vUV = aUV;
      world.z -= 8.8;
      gl_Position = uProjection * world;
    }
  `;
  const fragmentSource = `
    precision highp float;
    varying vec3 vNormal;
    varying vec3 vWorld;
    varying vec2 vUV;
    uniform float uTime;
    uniform float uMaterial;
    const float PI = 3.141592653589793;
    float gauss(float x, float s) { return exp(-x*x*s); }
    vec3 studio(vec3 r) {
      // Bright cyclorama, dark photographic flags, and tall rectangular softboxes.
      vec3 sky = mix(vec3(.12,.18,.23), vec3(.69,.80,.88), smoothstep(-.15,.3,r.y));
      sky *= 1.0 - .93 * gauss(r.x-.03,110.0) * smoothstep(-.4,.35,r.z);
      sky *= 1.0 - .85 * gauss(r.x-.68,50.0);
      float left = gauss(r.x+.60,145.0) * (.5+.5*smoothstep(-.9,.1,r.z));
      float white = gauss(r.x+.25,220.0) * smoothstep(-.25,.2,r.z);
      float edge = gauss(r.x-.92,230.0);
      sky += vec3(1.5,1.58,1.58)*left;
      sky += vec3(2.2,2.25,2.23)*white;
      sky += vec3(.75,1.02,1.42)*edge;
      sky += vec3(.7,.74,.73)*pow(max(dot(r,normalize(vec3(-.4,.95,.3))),0.0),14.0);
      sky += vec3(.4,.7,1.0)*pow(max(dot(r,normalize(vec3(.9,-.3,-.2))),0.0),7.0);
      return sky;
    }
    void main() {
      vec3 n = normalize(vNormal);
      vec3 view = normalize(vec3(0.,0.,8.8)-vWorld);
      vec3 r = reflect(-view,n);
      float nv = max(dot(n,view),0.0);
      float fresnel = pow(1.0-nv,4.0);
      vec3 light = normalize(vec3(-3.,4.,6.));
      float ndl = max(dot(n,light),0.0);
      vec3 reflection = studio(r);
      vec3 color;
      float alpha = 1.0;
      if (uMaterial < .5) {
        color = reflection * vec3(.84,.91,.98);
        color += vec3(.055,.065,.068) * ndl;
        color *= .88 + .12*nv;
      } else if (uMaterial < 1.5) {
        float spiral = fract(vUV.x*2.0 + vUV.y*2.55 - uTime*.023);
        float blue = smoothstep(.025,.042,spiral) * (1.0-smoothstep(.49,.507,spiral));
        vec3 base = mix(vec3(.92,.95,.91),vec3(.08,.32,.76),blue);
        color = base * (.58 + .42*ndl);
        color += reflection * (.035 + .13*fresnel);
        color += vec3(.17,.2,.21) * pow(max(dot(n,normalize(light+view)),0.),80.);
      } else if (uMaterial < 2.5) {
        // Transparent outer glass shell, emphasizing edges and reflected softboxes.
        float strip = gauss(r.x+.26,340.0)*smoothstep(-.2,.5,r.z);
        color = vec3(.72,.87,1.)*.3 + reflection*.7;
        alpha = min(.38, .017 + fresnel*.20 + strip*.14);
      } else if (uMaterial < 3.5) {
        color = vec3(.012,.037,.065)*(.5+ndl*.5) + reflection*.07;
      } else {
        float grooves = smoothstep(.22,.3,fract(vUV.x*120.));
        color = reflection * mix(.23,.77,grooves) * vec3(.81,.91,1.);
      }
      // Filmic shoulder retains bright metal details without clipped solid white.
      if (uMaterial < .5 || uMaterial > 1.5) color = color / (vec3(.64) + color);
      else color = min(color,vec3(1.));
      color = pow(max(color,vec3(0.)),vec3(.454545));
      gl_FragColor = vec4(color,alpha);
    }
  `;
  const identity = () => new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
  function multiply(a,b) {
    const o = new Float32Array(16);
    for (let c=0;c<4;c++) for(let r=0;r<4;r++) {
      o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];
    }
    return o;
  }
  function rotateX(a) { const m=identity(), c=Math.cos(a),s=Math.sin(a);m[5]=c;m[6]=s;m[9]=-s;m[10]=c;return m; }
  function rotateY(a) { const m=identity(), c=Math.cos(a),s=Math.sin(a);m[0]=c;m[2]=-s;m[8]=s;m[10]=c;return m; }
  function rotateZ(a) { const m=identity(), c=Math.cos(a),s=Math.sin(a);m[0]=c;m[1]=s;m[4]=-s;m[5]=c;return m; }
  function perspective(aspect) { const f=1/Math.tan(30.5*Math.PI/360),n=.1,far=40;return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+n)/(n-far),-1,0,0,2*far*n/(n-far),0]); }
  /** profile: [radius, height], in increasing height order. */
  function lathe(profile,segments=112) {
    const data=[],indices=[],cols=segments+1;
    for(let j=0;j<profile.length;j++) {
      const before=profile[Math.max(0,j-1)], after=profile[Math.min(profile.length-1,j+1)];
      const dr=after[0]-before[0],dy=after[1]-before[1],len=Math.hypot(dr,dy)||1;
      for(let i=0;i<=segments;i++) {
        const th=i/segments*Math.PI*2,cs=Math.cos(th),sn=Math.sin(th);
        data.push(profile[j][0]*cs,profile[j][1],profile[j][0]*sn,dy/len*cs,-dr/len,dy/len*sn,i/segments,j/(profile.length-1));
        if(j<profile.length-1 && i<segments) { const a=j*cols+i,b=a+cols;indices.push(a,b,a+1,a+1,b,b+1); }
      }
    }
    return {vertices:new Float32Array(data),indices:new Uint16Array(indices)};
  }
  function band(radius,center,height,bevel=.015) {
    return [[radius-bevel,center-height/2],[radius,center-height/2+bevel],[radius,center+height/2-bevel],[radius-bevel,center+height/2]];
  }
  const capTop = [
    [.55,1.495],[.624,1.495],[.646,1.512],[.655,1.534],[.655,1.588],
    [.646,1.605],[.617,1.618],[.617,1.667],[.641,1.681],[.656,1.711],
    [.657,1.744],[.647,1.794],[.625,1.855],[.588,1.924],[.538,1.994],
    [.476,2.060],[.401,2.121],[.316,2.172],[.219,2.211],[.112,2.235],[.001,2.243]
  ];
  const capBottom = capTop.map(([r,y])=>[r,-y]).reverse();
  const centerBody = Array.from({length:33},(_,i)=>[.536,-1.55+3.1*i/32]);
  const glassBody = Array.from({length:17},(_,i)=>[.558,-1.525+3.05*i/16]);
  const geometries = [
    [centerBody,1],[capTop,0],[capBottom,0],
    [band(.651,1.565,.039,.005),4],[band(.651,-1.565,.039,.005),4],
    [band(.626,1.645,.023,.003),3],[band(.626,-1.645,.023,.003),3],
    [band(.573,1.485,.027,.005),0],[band(.573,-1.485,.027,.005),0],
    [glassBody,2]
  ];
  class AtelierScene {
    constructor(canvas,container) {
      this.canvas=canvas;this.container=container;this.motion=true;this.visible=true;
      this.time=0;this.last=0;this.frame=0;this.drawCount=0;this.lost=false;this.failed=false;
      this.pointer={x:0,y:0};this.target={x:0,y:0};this.boundFrame=this.tick.bind(this);
      this.debug={renderer:'pending',triangles:0,draws:0};
      this.onVisibility=()=>this.schedule();
      this.onPointer=(e)=> { if(!this.motion||e.pointerType==='touch')return;const b=this.container.getBoundingClientRect();this.target.x=Math.max(-1,Math.min(1,(e.clientX-b.left)/b.width*2-1));this.target.y=Math.max(-1,Math.min(1,(e.clientY-b.top)/b.height*2-1)); };
      this.onLeave=()=>{this.target.x=0;this.target.y=0;};
      this.onLost=(event)=>{event.preventDefault();this.lost=true;cancelAnimationFrame(this.frame);this.frame=0;container.classList.remove('scene-ready');this.debug.renderer='context-lost';};
      this.onRestored=()=>{this.lost=false;try{this.setup();this.render();this.schedule();}catch(e){this.fallback(e);}};
      canvas.addEventListener('webglcontextlost',this.onLost);
      canvas.addEventListener('webglcontextrestored',this.onRestored);
      try {
        this.gl=canvas.getContext('webgl',{alpha:true,antialias:true,depth:true,premultipliedAlpha:false,powerPreference:'low-power'});
        if(!this.gl)throw new Error('WebGL unavailable');
        this.setup();
        this.resizeObserver=new ResizeObserver(()=>{this.resize();this.render();});this.resizeObserver.observe(container);
        this.intersectionObserver=new IntersectionObserver((entries)=>{this.visible=entries[0].isIntersecting;this.schedule();},{threshold:0.01});this.intersectionObserver.observe(container);
        document.addEventListener('visibilitychange',this.onVisibility);
        container.closest('.hero').addEventListener('pointermove',this.onPointer,{passive:true});
        container.closest('.hero').addEventListener('pointerleave',this.onLeave,{passive:true});
        this.resize();this.render();this.schedule();
      } catch(error) { this.fallback(error); }
    }
    fallback(error) {
      this.failed=true;this.debug.renderer='fallback';this.debug.reason=String(error.message||error);
      this.container.classList.remove('scene-ready');this.container.dataset.renderer='fallback';
      cancelAnimationFrame(this.frame);this.frame=0;
      // Fallback is intentionally silent: the decorative scene must never break content.
    }
    setup() {
      const gl=this.gl;
      const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const msg=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw new Error(msg);}return shader;};
      const vs=compile(gl.VERTEX_SHADER,vertexSource),fs=compile(gl.FRAGMENT_SHADER,fragmentSource);
      const p=gl.createProgram();gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);gl.deleteShader(vs);gl.deleteShader(fs);
      if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));
      this.program=p;this.attribs={position:gl.getAttribLocation(p,'aPosition'),normal:gl.getAttribLocation(p,'aNormal'),uv:gl.getAttribLocation(p,'aUV')};
      this.uniforms={model:gl.getUniformLocation(p,'uModel'),projection:gl.getUniformLocation(p,'uProjection'),time:gl.getUniformLocation(p,'uTime'),material:gl.getUniformLocation(p,'uMaterial')};
      this.meshes=geometries.map(([profile,material])=>{const geo=lathe(profile),vbo=gl.createBuffer(),ibo=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vbo);gl.bufferData(gl.ARRAY_BUFFER,geo.vertices,gl.STATIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibo);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,geo.indices,gl.STATIC_DRAW);return{vbo,ibo,count:geo.indices.length,material};});
      this.debug.triangles=this.meshes.reduce((sum,m)=>sum+m.count/3,0);this.debug.renderer='webgl';this.container.dataset.renderer='webgl';
      gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);gl.clearColor(0,0,0,0);
    }
    resize() {
      if(this.failed||this.lost)return;
      const b=this.container.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,1.5);
      const w=Math.max(1,Math.round(b.width*dpr)),h=Math.max(1,Math.round(b.height*dpr));
      if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;}
      this.projection=perspective(w/h);
    }
    setMotion(value) { this.motion=Boolean(value);if(!value){this.target.x=0;this.target.y=0;}this.schedule(); }
    schedule() {
      cancelAnimationFrame(this.frame);this.frame=0;this.last=0;
      if(this.failed||this.lost)return;
      if(this.motion&&this.visible&&!document.hidden){this.frame=requestAnimationFrame(this.boundFrame);}
      else if(this.visible&&!document.hidden)this.render();
    }
    tick(now) {
      this.frame=0;if(this.failed||this.lost||!this.motion||!this.visible||document.hidden)return;
      if(!this.last){this.last=now;}const dt=Math.min((now-this.last)/1000,.05);this.last=now;this.time+=dt;
      const smoothing=1-Math.exp(-3.5*dt);this.pointer.x+=(this.target.x-this.pointer.x)*smoothing;this.pointer.y+=(this.target.y-this.pointer.y)*smoothing;
      // Cap to about 40 frames per second; no invisible/offscreen rendering.
      if(!this.lastDraw||now-this.lastDraw>=24){this.render();this.lastDraw=now;}
      this.frame=requestAnimationFrame(this.boundFrame);
    }
    render() {
      if(this.failed||this.lost||!this.gl||!this.program)return;
      if(!this.projection)this.resize();
      const gl=this.gl,t=this.time;
      let model=multiply(rotateZ(-.36+Math.sin(t*.42)*.025+this.pointer.x*.028),multiply(rotateX(-.09+this.pointer.y*.065),rotateY(.17+Math.sin(t*.31)*.12+this.pointer.x*.16)));
      model[13]=Math.sin(t*.9)*.07;model[12]=.055;
      gl.viewport(0,0,this.canvas.width,this.canvas.height);gl.depthMask(true);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.program);
      gl.uniformMatrix4fv(this.uniforms.model,false,model);gl.uniformMatrix4fv(this.uniforms.projection,false,this.projection);gl.uniform1f(this.uniforms.time,t);
      for(const mesh of this.meshes) {
        if(mesh.material===2){gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);}else{gl.disable(gl.BLEND);gl.depthMask(true);}
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vbo);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mesh.ibo);
        gl.enableVertexAttribArray(this.attribs.position);gl.vertexAttribPointer(this.attribs.position,3,gl.FLOAT,false,32,0);
        gl.enableVertexAttribArray(this.attribs.normal);gl.vertexAttribPointer(this.attribs.normal,3,gl.FLOAT,false,32,12);
        gl.enableVertexAttribArray(this.attribs.uv);gl.vertexAttribPointer(this.attribs.uv,2,gl.FLOAT,false,32,24);
        gl.uniform1f(this.uniforms.material,mesh.material);gl.drawElements(gl.TRIANGLES,mesh.count,gl.UNSIGNED_SHORT,0);
      }
      gl.depthMask(true);gl.disable(gl.BLEND);this.debug.draws=++this.drawCount;this.container.classList.add('scene-ready');
    }
    destroy() {
      cancelAnimationFrame(this.frame);this.frame=0;
      this.resizeObserver?.disconnect();this.intersectionObserver?.disconnect();
      document.removeEventListener('visibilitychange',this.onVisibility);
      this.container.closest('.hero')?.removeEventListener('pointermove',this.onPointer);
      this.container.closest('.hero')?.removeEventListener('pointerleave',this.onLeave);
      this.canvas.removeEventListener('webglcontextlost',this.onLost);this.canvas.removeEventListener('webglcontextrestored',this.onRestored);
      if(this.gl&&!this.lost){for(const m of this.meshes||[]){this.gl.deleteBuffer(m.vbo);this.gl.deleteBuffer(m.ibo);}if(this.program)this.gl.deleteProgram(this.program);}this.failed=true;
    }
  }
  window.AtelierScene=AtelierScene;
})();

