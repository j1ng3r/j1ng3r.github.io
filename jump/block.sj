Cblock($type,x,y){
    $+={
        pos=P(x,y)+P(block.stats[$type].offset).scale(block.size);
        index=(block.all++$)-1;
        size=point(block.sizes[$type]);
        func=(block.stats[$type].func||F{}).$($);
    }
}{
    kill.{Dblock.all[$index};
    step.{
        var ps=player.size/2,d=player.pos-$pos;
        Mabs(d.x)<$size.x+ps?
            block.stats[$type].canland&d.y-ps>=$size.y&(d+player.vel-size).y<=ps?
                player.pos.y=this.pos.y+this.size.y+ps;
                player.vel.y=0;
                player.land.;
                =1;
            ~!block.stats[$type].nonfatal&Mabs(d.y)<$size.y+ps?
                player.kill.;
            ~this.func(d,ps);
        ;
    };
    draw.{
        camera.draw($type,$pos.x,$pos.y);
    }
}{
    kill(i){
        (iTO?i~block.all[i]).kill.;
    };
    chunkey={};
    all=[];
    stats={
        "fl=oor"={
            char="#";
            canland=1
        };
        "spike"={
            char="!"
        };
    };
};

Cfraction(){asfoijsdf};
fraction();
!$?=fraction(n,d)~=1;
Parser.prototype+={
    token(type,value){

    },
    nextChar(){

    },
};