var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
	preload(){
		game.load.image('sky', 'assets/sky.png');
		game.load.image('ground', 'assets/platform.png');
		game.load.image('star', 'assets/star.png');
		game.load.spritesheet('dude', 'assets/dude.png', 54, 48);
	},
	create(){
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.add.sprite(0, 0, 'sky');

		platforms = game.add.group();
		platforms.enableBody = true;
		var ground = platforms.create(0, game.world.height - 64, 'ground');

		//  Scale it to fit the width of the game (the original sprite is 400x32 in size)
		ground.scale.setTo(2, 2);
		ground.body.immovable = true;
		platforms.create(400, 400, 'ground').body.immovable = true;
		platforms.create(-150, 250, 'ground').body.immovable = true;

		player = game.add.sprite(32, game.world.height - 200, 'dude');

		//  We need to enable physics on the player
		game.physics.arcade.enable(player);
		player.body.bounce.y = 0;
		player.body.collideWorldBounds = false;

		//  Our two animations, walking left and right.
		player.animations.add('stand',[0],10,true);
		player.animations.add('fall',[0],10,true);
		player.animations.add("ffall",[0],10,true);
		player.animations.add('walk',[1],10,true);
		player.animations.add('jumpsquat',[3,3,3,3],10,true);
		player.animations.add('dodge',new Array(20).fill(4),10,true);

		//  Finally some stars to collect
		stars = game.add.group();
		stars.enableBody = true;

		for (var i = 0; i < 12; i++){
			var star = stars.create(i * 70, 0, 'star');
			star.body.gravity.y = 300;
			star.body.bounce.y = 0.4 + Math.random() * 0.2;
		}

		//  The score
		scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

		controls = game.input.keyboard.createCursorKeys();
		Object.assign(player,{
			setAnimation(a,b){
				player.animations.play(player.animation=a);
				if(!b)throw player.animerror;
			},
			animerror:{},
			isDoing(...a){
				return a.length==1?a[0]==player.animation:a.includes(player.animation);
			},
			grounded(){
				return player.isDoing("stand","walk","jumpsquat");
			},
			falling(){
				return player.isDoing("fall","ffall","sfall");
			},
			dodging(){
				return player.isDoing("grav","dodge");
			},
			canJump(){
				return(player.isDoing("stand","walk")||(player.isDoing("fall","ffall")&&player.jumps))&&pad.new("jump");
			},
			act(){
				if(player.grounded()){
					if(!player.body.touching.down){
						player.setAnimation("fall");
					} else {
						player.body.velocity.x*=0.97;
						player.jumps=5;
						if(player.canJump()){
							player.setAnimation("jumpsquat");
						}
					}
				} else {
					if(player.body.touching.down){
						player.setAnimation("stand");
					} else {
						if(player.canJump()){
							player.jumps--;
							player.body.velocity.y=-250;
							player.setAnimation("fall");
						}
						if(!player.dodging()){
							if(dir.x){
								player.body.velocity.x+=20*dir.x;
							}
							player.body.velocity.x*=0.97;
							player.body.velocity.y*=0.996;
						}
						if(player.falling()){
							if(pad.new("dodge")){
								player.body.velocity.x=200*dir.x;
								player.body.velocity.y=200*dir.y;
								player.body.gravity.y=0;
								if(dir.x||dir.y){
									player.setAnimation("dodge");
								} else player.setAnimation("gravity");
							}
						}
					}
				}
				if(player.isDoing("stand")){
					if(dir.x){
						player.setAnimation("walk");
					}
				} else if(player.isDoing("walk")){
					if(dir.x){
						player.body.velocity.x = 200*dir.x;
						player.setAnimation("walk");
					} else {
						player.body.velocity.x = 0;
						player.setAnimation("stand");
					}
				} else if(player.isDoing("jumpsquat")){
					if(player.animations.currentFrame.index==3){
						player.body.velocity.y=[-200,-300][pad("jump")];
						player.setAnimation("fall");
					}
				} else if(player.isDoing("fall")){
					player.body.gravity.y = 500;
					if(pad.new("down")){
						player.setAnimation("ffall");
					}
				} else if(player.isDoing("ffall")){
					player.body.gravity.y=1500;
				} else if(player.isDoing("dodge")){
					player.body.velocity.x*=0.95;
					player.body.velocity.y*=0.95;
					if(player.animations.currentFrame.index==20){
						player.setAnimation("sfall");
					}
				}
			}
		})
		player.setAnimation("fall",1);
	},
	update(){
		pad.step();
		player.onimation=player.animation;
		game.physics.arcade.collide(player, platforms);
		game.physics.arcade.collide(stars, platforms);

		game.physics.arcade.overlap(player, stars, function(player, star){
			star.kill();
			score += 10;
			scoreText.text = 'Score: ' + score;
		},null,this);

		dir={
			x:pad("right")-pad("left"),
			y:pad("down")-pad("up")
		};
		try{
			player.act();
		} catch(e){
			if(e==player.animerror){
                console.log(`Changed animation to ${player.animation}.`);
            } else throw e;
		}
	}
});

function pad(a){
	return pad.input[a];
}
Object.assign(pad,{
	input:{
		down:0,
		up:0,
		left:0,
		right:0,
		jump:0,
		dodge:0
	},
	last:{},
	controls:{
		down:83,
		up:87,
		left:65,
		right:68,
		jump:32,
		dodge:76
	},
	new(a){
		return+(pad.input[a]&&!pad.last[a]);
	},
	step(){
		for(var i in pad.input)
			[pad.last[i],pad.input[i]]=[pad.input[i],+game.input.keyboard.isDown(pad.controls[i])];
	}
});

var player;
var platforms;
var controls;

var stars;
var score = 0;
var scoreText;
var dir;
