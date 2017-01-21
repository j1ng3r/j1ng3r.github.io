for(var i in Block.stats){
	Block.chunkey[Block.stats[i].char]=i;
	camera.createSprite(i,`jump/sprites/block_${i}.png`);
}
+function(s){
    player.size=s;
    camera.createSprite("dead",`jump/sprites/dead${s}.png`);
    camera.createSprite("player",`jump/sprites/player${s}.png`);
    for(var i of "1234567890-hi")
        camera.createSprite(i,`jump/sprites/number_${i}.png`);
}(40);
camera.createSprite("Start","jump/sprites/start.png");
