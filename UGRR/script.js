//The grid and gamepad
String.Length=s=>(s+"").replace(/%[a-z]\{[^}]*}/gi,"").length;
var audio=Object.assign(new Audio(),{
    src:"UGRR/full_song.ogg",
    autoplay:true,
    onended(){this.play();}
});
box=40;
width=149;
height=35;
blink=800;
buf={x:2,y:1};
grid = new ROT.Display({
    width:width+buf.x*2,
    height:60,
    fontSize:18,
    fontFamily:"monospace",
    bg:"#000"
});
key=[];
window.onkeydown=function(e){
    key.push(e.key);
    console.log("Key press:",e.key);
};
font.onload=function(){
    //grid.setOptions({fontFamily:"Ubuntu Mono"});
};
function Prompt(prompt,answers){
    state.prompt={
        prompt:prompt,
        answers:answers,
        keys:Object.keys(answers),
        pos:0
    };
}
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
Box={
    lines:[],
    draw(){
        let bc=player.color;
        let bb=[].a;
        sq(width-box+1,1,"+",bc,bb);
        sq(width-2,1,"+",bc,bb);
        sq(width-box+1,height-2,"+",bc,bb);
        sq(width-2,height-2,"+",bc,bb);
        for(let y=2;y<height-2;y++){
            sq(width-box+1,y,"|",bc,bb);
            sq(width-2,y,"|",bc,bb);
        }
        for(let x=2;x<box-2;x++){
            sq(width-box+x,1,"-",bc,bb);
            sq(width-box+x,height-2,"-",bc,bb);
        }
        for(let i=0;i<this.lines.length;i++){
            text(width-box+2,i+2,this.lines[i]);
        }
    }
};
//60 fps
function getColor(p,min,max){
    return ROT.Color.toHex(ROT.Color.interpolate(ROT.Color.fromString(min),ROT.Color.fromString(max),p));
}
function getBar(n,min,max){
    let p=player[n.toLowerCase()]/player[n.toUpperCase()],c=getColor(p,min,max);
    return n+`:%b{${c}}%c{${c}}`+".".repeat(Math.round((box-5-n.length)*p));
}
function step(){
    //Init
    grid.clear();
    dir={
        x:key.includes("ArrowRight")-key.includes("ArrowLeft"),
        y:key.includes("ArrowDown")-key.includes("ArrowUp"),
        z:key.includes("c")-key.includes("z"),
        s:key.includes(" ")||key.includes("x")||key.includes("Enter")
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
            if(key.length){
                state.now=Date.now();
                for(let i=0;i<key.length;i++){
                    let k=key[i];
                    if(k.length==1){
                        menu.prompts[state.pos]=menu.prompts[state.pos].slice(0,state.ppos)+k+menu.prompts[state.pos].slice(state.ppos++);
                    } else if(k=="Backspace"&&state.ppos){
                        menu.prompts[state.pos]=menu.prompts[state.pos].slice(0,state.ppos-1)+menu.prompts[state.pos].slice(state.ppos--);
                    } else if(k=="ArrowLeft"&&state.ppos){
                        state.ppos--;
                    } else if(k=="ArrowRight"&&state.ppos<menu.prompts[state.pos].length){
                        state.ppos++;
                    }
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
        if((dir.s&&!state.prompt)||key.includes("Enter")){
            command(cmd);
        }

        //drawing
        draw(0,0,menu.title);
        for(let i=0;i<menu.keys.length;i++){
            draw(2,i+1,menu.keys[i]);
        }
    } else if(state=="game"){
        Box.lines=[
            ("Name: "+player.name).split("").slice(0,box-4),
            getBar("Health","#ff0000","#00ff00"),
            getBar("Energy","#000000","#ffff00"),
            getBar("Hunger","#00ff00","#ff0000"),
            "Money: "+player.money
        ];
        map.act();
        map.draw();
        Box.draw();
    }

    //End
    log.draw();
    key=[];
}
function start(){
    if(menu.prompts[0]){
        player.name=menu.prompts[0];
        state[Symbol.toPrimitive]=_=>"game";
        state.prompt=null;
        map.addSimpleChunk(-9,-4,[
            "######### #########",
            "#.................#",
            "#.................#",
            "#.................#",
            "#........ ........#",
            "#.................#",
            "#.................#",
            "###################"
        ]);
        map.AddPerson({
            x:0,
            y:-4,
            color:"#d07010",
            scout(){
                if(!state.prompt){
                    command('log: Press Space, Enter, or X (the "Select" Keys) to interact.');
                }
            },
            name:"The Tutorial Guy",
            interact(player){
                let T=this;
                let cont=_=>Prompt("Great! The year is 18XX. You are a\nslave in the Deep South, and you\nlive in horrible conditions.\n\nDaily whippings and brutal torture\nare common. Combined with grueling\nwork for no pay, this isn't a great\nsituation to be in.",{
                    "Leave to go North"(){Prompt("Good choice! Now, I've heard that\nthere's a %c{green}conductor%c{} from the Under-\nground Railroad coming at noon. It's\n6:00AM now, and as soon as you end\nthis conversation time will resume\nas normal.",{
                        "Sounds Good"(){
                            T.dialog("Best of luck!");
                            map.kill(0,-4);
                            player.time=true;
                            map.addSimpleChunk(-29,-13,[
                                "+------------------------+=======+------------------------+.............................................",
                                "|.........................................................|.............................................",
                                "|.........................................................|.............................................",
                                "|.........................................................|.............................................",
                                "|......... ...............................................|.............................................",
                                "|.................................. ......................|.............................................",
                                "|.........................................................|.............................................",
                                "|.........................................................|.............................................",
                                "|.........................................................|.............................................",
                                "|...................                   ...................|.............................................",
                                "|...................                   ...................|.............................................",
                                "|...................                   ...................|.............................................",
                                "|...................                   ...................|.............................................",
                                "|...................                   ...................|.............................................",
                                "|...................                   ...................|.............................................",
                                "|...................                   ...................|.............................................",
                                "|...................                   ...................|.............................................",
                                "|.........................................................|.............................................",
                                "|.... ....................................................|.............................................",
                                "|......................................... ...............|.............................................",
                                "|.........................................................|.............................................",
                                "|.........................................................|.............................................",
                                "|.........................................................|.............................................",
                                "|.........................................................|.............................................",
                                "|........... .............................................|.............................................",
                                "|........................................................ |.............................................",
                                "+---------------------------------------------------------+............................................."
                            ]);
                            map.AddPerson({
                                x:13,
                                y:6,
                                interact(){
                                    log("He doesn't want to talk.");
                                },
                                color:"#840"
                            });
                            map.AddPerson({
                                x:-19,
                                y:-9,
                                name:"John",
                                color:"#c72"
                            });
                            map.AddPerson({
                                x:6,
                                y:-8,
                                name:"Alex",
                                color:"#630"
                            });
                            map.AddPerson({
                                x:-17,
                                y:11,
                                name:"Mortimer Apos-Trophy",
                                color:"#fff",
                                interact(player){
                                    this.hasTalked=true;
                                    this.dialog("Wa'ter yuo doin walk'in aroun, n'hoht  workin!? Irl beet ye sely! Yoo blubbberign' id'yit! Git ba'k ta dwerk!");
                                }
                            });
                            map.AddPerson({
                                x:-24,
                                y:5,
                                name:"Frederick",
                                color:"#840",
                                interact(player){
                                    if(map.getPerson("Mortimer Apos-Trophy").hasTalked){
                                        if(this.hasTalked){
                                            this.dialog(`You went and actually talked to him like a normal human being!\n...\nI'm just surprised you're not dead.`);
                                        } else {
                                            this.dialog(`I see you've met Mortimer. As you've probably noticed, he's not too bright, but the funny thing is he thinks WE'RE the unintelligent ones!`);
                                        }
                                    } else if(this.hasTalked){
                                        this.dialog(`I'd be careful of Mortimer, the "Master" around here.\nTo be honest, though, he's not really the master of anything.`);
                                    } else {
                                        this.hasTalked=true;
                                        this.dialog(`Watch out for Mortimer (or Mor, as he likes to be called).\nHe may not seem threatening, but he would beat you to death if you annoyed him in any way.`);
                                    }
                                }
                            });
                            map.AddPerson({
                                x:28,
                                y:12,
                                name:"Link",
                                color:"#555",
                                interact(player){
                                    this.dialog("It's dangerous to go alone. Take this!");
                                    player.money+=50;
                                    this.kill();
                                }
                            });
                        }
                    });},
                    "Stay in the South"(){
                        log("%c{red}You choose to stay in the South. Your family is sold away when you are 33.\n%c{red}In the next four years of your life, you never feel another happy moment. Then,\n%c{red}at 37, you die under the whip after asking to be treated in a more humane manner.");
                        map.kill(0,-4);
                        map.addSimpleChar(0,-4,"#");
                    }
                });
                Prompt("This is an example prompt.\nSelect to choose an option.",{
                    "OK"(){Prompt("Use the arrow keys and\nthe Z and C keys to move.",{
                        "That sounds great":cont,
                        "That sounds awful"(){Prompt("Are you sure?",{
                            "Never mind, that sounds great":cont
                        });}
                    });}
                });
            }
        });
        command("log: Let the game begin!\nUse Arrow Keys to move, and Space, Enter, or X to select.");
    } else command("log: Please enter a name.");
}
paused=false;
time=360*30;
function stepTime(){
    setTime(time+1);
}
function setTime(a){
    time=a;
    seconds=((time*2)%60+"").lpad("0",2);
    minutes=(Math.floor(time/30)%60+"").lpad("0",2);
    hours=(Math.floor(time/30/60)%24+"").lpad("0",2);
    day=1+Math.floor(time/30/60/24);
}
setTime(time);
window.onload=function(){
    player=map.addBlock({
        x:0,
        y:0,
        char:"@",
        color:"#88f",
        act(){
            if(state.prompt){
                if(dir.y+dir.z){
                    state.prompt.pos=Math.mod(state.prompt.pos+dir.y+dir.z,state.prompt.keys.length);
                }
                Box.lines.push("");
                [].push.apply(Box.lines,state.prompt.prompt.split("\n"));
                for(let i in state.prompt.answers){
                    Box.lines.push([state.prompt.keys.indexOf(i)==state.prompt.pos?`>${player.color}#000`:" "," "].concat(i.split("")));
                }
                if(dir.s){
                    state.prompt.answers[state.prompt.keys[state.prompt.pos]](state.prompt=null);
                }
            }
            if(dir.x||dir.y){
                this.move(dir.x,dir.y);
            }
            if(key.includes(" ")||key.includes("Enter")){
                for(let x=-1;x<2;x++){
                    for(let y=-1;y<2;y++){
                        map.getChar(this.x+x,this.y+y).interact(this);
                    }
                }
            }
            if(this.time)stepTime();
            Time=`Day ${day}, ${hours}:${minutes}:${seconds}`;
            Box.lines.unshift(Time);
        },
        scout:0
    });
    player.money=0;
    player.HEALTH=20;
    player.ENERGY=20;
    player.HUNGER=20;
    player.health=player.HEALTH;
    player.energy=player.ENERGY;
    player.hunger=0;
    command("log: Arrow Keys to Move, Space, X or Enter to Select\nFullscreen is recommended.");
    document.body.appendChild(grid.getContainer());
    setInterval(step,19);
};
