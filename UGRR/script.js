//The grid and gamepad
String.Length=s=>(s+"").replace(/%[a-z]\{[^}]*}/gi,"").length;
var audio=Object.assign(new Audio,{
    src:"UGRR/full_song.ogg",
    autoplay:true,
    onended(){this.play();}
});
width=69;
height=29;
blink=800;
buf={x:2,y:1};
grid = new ROT.Display({
    width:width+buf.x*2,
    height:60,
    fontSize:18,
    fontFamily:"monospace",
    bg:"#000"
});
function draw(a,b,c){
    if(Array.isArray(c)){
        for(let i=0;i<c.length;i++){
            sq(+a+i,b,c[i]);
        }
        return;
    } else return draw(a,b,c.split(""));
}
function sq(x,y,s,c,b){
    return grid.draw(+x+buf.x,+y+buf.y,s,c,b);
}
key="";
window.onkeydown=function(e){
    key=e.key;
    console.log("Key press:",key);
};
font.onload=function(){
    grid.setOptions({fontFamily:"Ubuntu Mono"});
};
//State controls
state={
    name:"title",
    pos:0,
    now:Date.now(),
    changePos(v){
        this.pos+=v;
        this.now=Date.now();
    },
    prompt:false
};
state[Symbol.toPrimitive]=_=>"menu";
function start(){
    if(menu.prompts[0]){
        state[Symbol.toPrimitive]=_=>"game";
        map.addSimpleChunk(-9,-4,[
            "###################",
            "#.................#",
            "#.................#",
            "#.................#",
            "#........ ........#",
            "#.................#",
            "#.................#",
            "###################"
        ]);
        command("log: Let the game begin!\nUse Arrow Keys to move, and Space or Enter to select.")
    } else command("log: Please enter a name.");
}
//60 fps
function step(){
    //Init
    grid.clear();
    dir={
        x:(key=="ArrowRight")-(key=="ArrowLeft"),
        y:(key=="ArrowDown")-(key=="ArrowUp")
    };

    //The Code
    if(state=="menu"){
        menu=menus[state.name];
        option=menu.keys[state.pos]+"";
        cmd=menu.options[option];
        if(dir.y){
            state.pos=Math.mod(state.pos+dir.y,menu.keys.length);
            state.prompt=false;
        }
        if(!state.prompt){
            sq(0,state.pos+1,">",player.color);
        }
        if(state.prompt){
            if(key){
                state.now=Date.now();
                if(key.length==1){
                    menu.prompts[state.pos]=menu.prompts[state.pos].slice(0,state.ppos)+key+menu.prompts[state.pos].slice(state.ppos++);
                } else if(key=="Backspace"&&state.ppos){
                    menu.prompts[state.pos]=menu.prompts[state.pos].slice(0,state.ppos-1)+menu.prompts[state.pos].slice(state.ppos--);
                } else if(key=="ArrowLeft"&&state.ppos){
                    state.ppos--;
                } else if(key=="ArrowRight"&&state.ppos<menu.prompts[state.pos].length){
                    state.ppos++;
                }
            }
        }
        for(let i=0;i<menu.prompts.length;i++){
            if(state.pos==i&&state.prompt){
                let txt=": "+menu.prompts[i]+" ";
                draw(String.Length(menu.keys[i])+2,i+1,txt);
                if((Date.now()-state.now)%(2*blink)<blink)sq(4+String.Length(menu.keys[i])+state.ppos,i+1,txt[state.ppos+2],0,player.color);
            } else if(menu.prompts[i].length){
                draw(String.Length(menu.keys[i])+2,i+1,": "+menu.prompts[i]);
            }
        }
        if((key==" "&&!state.prompt)||key=="Enter"){
            command(cmd);
        }

        //drawing
        draw(0,0,menu.title);
        for(let i=0;i<menu.keys.length;i++){
            draw(2,i+1,menu.keys[i]);
        }
    } else if(state=="game"){
        map.act();
        map.draw();
    }

    //End
    log.draw();
    key="";
}
window.onload=function(){
    player=map.addBlock({
        x:0,
        y:0,
        char:"@",
        color:"#88f",
        floor:".",
        act(){
            if(dir.x||dir.y){
                this.move(dir.x,dir.y);
            }
        },
        scout:0
    });
    command("log: Arrow Keys to Move, Space or Enter to Select");
    document.body.appendChild(grid.getContainer());
    setInterval(step,60);
};
