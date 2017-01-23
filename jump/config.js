Object.assign(player,{
    POS:new Point(0,30),
    maxPoses:7,
    posLength:5,
    VEL:x=>1.6*Math.pow(Math.log(x+4),0.58),
    DASHMULT:1.8,
    GDASHMULT:1.4,
    GRAV:0.8/6.3/6.3,
    TERMVEL:9/6.3,
    FFTERMVEL:20/6.3,
    FLOATSCALE:0.5,
    FF:0.7,
    JUMP:11/6.3,
    SCORE:{
        JUMP:1,
        DASH:-0.5/6.3,
        GDASH:0.15/6.3,
    },
    frames:{
        "dash":[14*6.3,17*6.3],
        "gdash":[7*6.3],
    }
});
Block.stats={
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
        canland:true
    },
    "semisolid":{
        offset:new Point(0,1/4),
        char:'-',
        canland:true,
        nonfatal:true
    },
    "pillar":{
        offset:new Point(1/4,0),
        char:"p",
        canland:true
    }
};
