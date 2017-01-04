window.camera={
	x:0,
	y:0,
	r:0,
	c:null,
	ctx:null,
	center:{
		type:"Percent",
		x:0.5,
		y:0.5,
	},
	flipped:{
		x:0,
		y:0,
	},
	init(){
		this.setCanvas(document.createElement("canvas"));
		function a(){
		    camera.setCanvasDimensions(window.innerWidth,window.innerHeight);
		}
		a();
		window.addEventListener("resize",a);
		this.setCamera(0,0,0);
	},
	flipAxis(name){
		if(name.match(/[x1X]/))this.flipped.x=1-this.flipped.x;
		else this.flipped.y=1-this.flipped.y;
	},
	reset(){
		this.ctx.resetTransform();
		this.ctx.translate(this.flipped.x*this.c.width,this.flipped.y*this.c.height);
	},
	fill(a){this.ctx.fillStyle=a;},
	background(a){
		this.fill(a);
		this.drawRect(0,0,this.c.width,this.c.height);
	},
	_(v,n){return v-v*2*this.flipped[n];},
	translate(x,y){
		this.ctx.translate(this._(x,'x'),this._(y,"y"));
	},
	draw(){
		this.translate(-this.x,-this.y);
		this.ctx.rotate(this.r);
		this.draw_untranslated.apply(this,arguments);
		this.reset();
	},
	drawRect(x,y,w,h){
		this.translate(x,y);
		this.ctx.fillRect(0,0,this._(w,'x'),this._(h,'y'));
		this.reset();
	},
	draw_untranslated(name,x,y,r){
		this.translate(x,y);
		this.ctx.rotate(r||0);
		name=this.image(name);
		this.ctx.drawImage(name,-name.center.x,-name.center.y);
		this.reset();
	},
	createCanvas(){
		this.setCanvas(window.document.createElement("canvas"));
		window.addEventListener("load",function(){
			window.document.body.appendChild(this.c);
		});
	},
	setCanvas(c){
		this.c=c;
		this.ctx=c.getContext("2d");
	},
	setCanvasDimensions(w,h){
		this.c.width=w;
		this.c.height=h;
	},
	setContext(ctx){
		this.ctx=ctx;
		this.c=ctx.canvas;
	},
	setCamera(x,y,r){
		if(typeof r!="undefined")this.r=r;
		if(+x==x&&+y==y){
			this.x=x;
			this.y=y;
		}
	},
	setCenterXY(name,obj){
		if(typeof name=="object"){
			this.center={
				type:"XY",
				x:name.x,
				y:name.y,
			}
			for(var i in this.sprites)this.setCenterXY(i,name);
		} else this.getSprite(name).center={
			x:+obj.x||0,
			y:+obj.y||0
		};
	},
	setCenterPercent(name,obj){
		if(typeof name=="object"){
			this.center={
				type:"Percent",
				x:name.x,
				y:name.y
			};
			for(var i in this.sprites)this.setCenterPercent(i,name);
		} else {
			var a=this.getSprite(name);
			a.center={
				x:obj.x*a.width,
				y:obj.y*a.height
			};
		}
	},
	sprites:{},
	createSprite(name,url){
		return this.sprites[name]=this.image(url);
	},
	clearAllSprites(){this.sprites={};},
	getSprite(name){
		if(this.sprites.hasOwnProperty(name)){
			return this.sprites[name];
		} else {
			throw new Error(`Camera object does not recognize the name ${name}. Try creating it first with camera.createSprite`);
		}
	},
	image(name){
		if(typeof name=="object")return name;
		else {
			if(this.sprites.hasOwnProperty(name))return this.sprites[name];
			var a=Object.assign(new Image,{src:name});
			if(this.center.type=="XY")a.center={
				x:this.center.x,
				y:this.center.y
			}; else a.center={
				x:a.width*this.center.x,
				y:a.height*this.center.y
			};
			return a;
		}
	}
};
