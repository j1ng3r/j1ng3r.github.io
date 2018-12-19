Game.Block=(_=>{
    class Block{
        constructor(obj){
            this.obj=obj;
            this.top=obj.top;
            this.bottom=obj.bottom;
            this.left=obj.left;
            this.right=obj.right;
            this.type=obj.type;
            this.size=obj.size;
            this.move={
                vel:new Vector(obj.move.vel),
                sin:new Vector(obj.move.sin)
            };
            this.color=config.block.color[this.type];
            this.brightness=1;
            this.transparency=config.block.transparency[this.type]||0;
            this.index=Game.blocks.push(this)-1;
        }
        step(){
            this.basepos=this.basepos.add(this.move.vel);
            this.pos=this.basepos.add(this.move.sin.scale(Math.sin(Math.TAU*Game.state.frame/config.block.period)));
            Game.players.map(player=>{
                let collision=false;
                if(((player.nextTop>this.bottom)||(player.nextBottom<this.top))&&((player.nextLeft>this.right)||(player.nextRight<this.left)){
                    collision=true;
                }
                if(config.block.solid[this.type]){
                    if(collision){
                        
                    }
                    if(this.top)
                }
            });
        }
    }
    return Block;
})();