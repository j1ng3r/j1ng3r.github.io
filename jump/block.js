function Block(t,x,y){
	this.type=t;
	this.pos=new Point(x,y).add(Block.stats[this.type].offset.scale(Block.size));
	this.index=Block.all.push(this)-1;
	this.size=new Point(Block.sizes[this.type]);
	this.func=(Block.stats[this.type].func||function(){}).bind(this);
}
Block=Object.assign(Block,{
	prototype:Object.assign(Block.prototype,{
		kill(){
			Block.all.splice(this.index,1);
		},
		checkLand(){
			var d=player.pos.sub(this.pos),ps=player.size/2;

		},
		step(){
			var ps=player.size/2,d=player.pos.sub(this.pos);
			if(Math.abs(d.x)<this.size.x+ps){
				if(Block.stats[this.type].canland&&d.y-ps>=this.size.y&&d.y+player.vel.y-ps<=this.size.y){
					player.pos.y=this.pos.y+this.size.y+ps;
					player.vel.y=0;
					player.land();
					return true;
				} else if(!Block.stats[this.type].nonfatal&&Math.abs(d.y)<this.size.y+ps){
					player.kill();
				} else this.func(d,ps);
			}
		},
		draw(){
			camera.draw(this.type,this.pos.x,this.pos.y);
		}
	}),
	kill(i){
		(typeof i=="object"?i:Block.all[i]).kill();
	},
	chunkey:{},
	stats:{
		"floor":{
			offset:new Point(),
			char:"#",
			canland:true,
		},
		"spike":{
			offset:new Point(),
			char:"!"
		},
		"spike_small":{
			offset:new Point(0,-1/4),
			char:'.'
		},
		"dot":{
			offset:new Point(0,-1/4),
			char:','
		},
		"platform":{
			offset:new Point(0,1/4),
			char:"=",
			canland:true,
			func(d,ps){
				if(ps+this.size.y<=-d.y&&d.y+ps+player.vel.y>=-this.size.y){
					player.vel.y=0;
					player.pos.y=this.pos.y-this.size.y-ps;
				}
			}
		},
		"stool":{
			offset:new Point(0,-1/4),
			char:"_",
			canland:true,
			func(d,ps){
				if(ps+this.size.y<=-d.y&&d.y+ps+player.vel.y>=-this.size.y){
					player.vel.y=0;
					player.pos.y=this.pos.y-this.size.y-ps;
				}
			}
		},
		"waveform":{
			offset:new Point(0,1/4),
			char:"o",
			canland:true,
			func(d,ps){
				if(d.y+ps<=-this.size.y&&d.y+ps+player.vel.y>=-this.size.y)
					player.pos.y=this.pos.y-this.size.y-ps-player.vel.y;
			}
		},
		"crashform":{
			offset:new Point(0,1/4),
			char:"T",
			canland:true,
		},
		"semisolid":{
			offset:new Point(0,1/4),
			char:'-',
			canland:true,
			nonfatal:true
		}
	},
	sizes:{}
});
Block.size=function(i,j,a){
	var max=0;
	for(i in Block.stats){
		Block.chunkey[Block.stats[i].char]=i;
		a=camera.createSprite(i,`jump/sprites/block_${i}.png`);
		max=Math.max(max,a.width,a.height);
		Block.sizes[i]=new Point(a).div(2);
	}
	return max;
}();
