function Block(t,x,y){
	this.type=t;
	this.pos=new Point(x,y).add(Block.stats[this.type].offset.scale(Block.size));
	this.index=Block.all.push(this)-1;
	this.size=new Point(Block.sizes[this.type]);
	this.func=(Block.stats[this.type].func||(_=>8)).bind(this);
}
Object.assign(Block.prototype,{
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
})
Object.assign(Block,{
	kill(i){
		(typeof i=="object"?i:Block.all[i]).kill();
	},
	chunkey:{},
	all:[],
	sizes:{}
});
