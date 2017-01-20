Object.assign(player,{
    POS:new Point(0,30),
    maxPoses:7,
    posLength:5,
    VEL:6.3,
    DASHMULT:1.8,
    GDASHMULT:1.4,
    GRAV:0.8,
    TERMVEL:9,
    FFTERMVEL:20,
    FLOATSCALE:0.5,
    FF:5,
    JUMP:11,
    SCORE:{
        JUMP:1,
        DASH:-0.5,
        GDASH:0.15,
    },
    frames:{
        "dash":[14,17],
        "gdash":[7],
    }
});
BLOCKSTATS={
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
