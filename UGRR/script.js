//The grid and gamepad
width=100;
height=20;
grid = new ROT.Display({
    width:width,
    height:50,
    fontSize:20,
    fontFamily:"monospace",
    bg:"#000"
});
buf={x:2,y:1};
function draw(a,b,c){
    return grid.drawText(+a+buf.x,+b+buf.y,c);
}
key="";
window.onkeydown=function(e){
    key=e.key;
};
font.onload=function(){
    grid.setOptions({fontFamily:"Ubuntu Mono"});
};
//State controls
state={
    name:"title",
    pos:0,
    time:Date.now(),
    changePos(v){
        this.pos+=v;
        this.time=Date.now();
    },
    prompt:false
};
state[Symbol.toPrimitive]=_=>"menu";

//Menus
menus={
    "title":{//jshint ignore:line
        title:"The Aboveground Railroad",
        options:{
            "Start a New Game":"goto: config",
            "Load a Game":"goto: load",
            "About":"goto: about",
            "Credits":"goto: credits",
        }
    },
    "about":{
        title:"About the Game",
        options:{
            "Inspiration":"log: This game was supposed to be based on the Oregon Trail, for US History.",
            "Controls":"log: Well, you got this far.\nW goes up, X goes down, A goes left, D goes right, QEZC moves diagonally.\nS, Space, and Enter are select. R to refresh the page.",
            "Back":"goto: title"
        }
    },
    "credits":{
        title:"Credits",
        options:{
            "Marcus Luebke":"log: Marcus Luebke is still writing the game. How'd you get beta access?",
            "Ondrej Zara":"log: The creator of ROT.js. His work provided the foundation for this text-based adventure.",
            "Back":"goto: title",
            "":"goto: secret"
        }
    },
    "secret":{
        title:"?",
        options:{
            "Option 1":"goto: secret2",
            "Back":"goto:title",
        }
    },
    "secret2":{
        title:"?",
        options:{
            "Option 1":"goto: secret3",
            "Back":"goto:title",
        }
    },
    "secret3":{
        title:"?",
        options:{
            "Option 1":"goto: secret4",
            "Back":"goto:title",
            "":"goto:S"
        }
    },
    "secret4":{
        title:"?",
        options:{
            "Option 1":"goto: secret",
            "Back":"goto:title",
        }
    },
    "S":{
        title:"You found it!",
        options:{
            "Back"(){
                location="https://en.wikipedia.org/wiki/Easter_egg_(media)";
            }
        }
    },
    "load":{
        title:"Load a Save",
        options:{
            "Save 1":"log: There is no data for Save 1.",
            "Save 2":"log: There is no data for Save 2.",
            "Save 3":"log: There is no data for Save 3.",
            "Save 4":"log: There is no data for Save 4.",
            "Back":"goto: title"
        }
    },
    "config":{
        title:"Start a New Game",
        options:{
            "%c{red}Name":"prompt",
        }
    }
};
for(let i in menus){
    menus[i].keys=Object.keys(menus[i].options);
    menus[i].prompts=new Array(menus[i].keys.length).fill("");
}

//Commands
function command(s){
    if(typeof s=="function"){
        s();
    } else {
        s=s.split(/\:/);
        command[s[0]](s.slice(1).join("").trim());
    }
}
Object.assign(command,{
    goto(s){
        log.clear();
        state.name=s;
        state.changePos(-state.pos);
    },
    prompt(){
        state.prompt=!state.prompt;
    },
    log:log
});

//The Log
function log(a){
    a=(a+"").split("\n").reverse();
    a.unshift("");
    for(var i=0;i<a.length;i++)
        log.console.unshift(a[i]);
}
Object.assign(log,{
    console:[],
    clear(){
        this.console=[];
    },
    draw(){
        draw(0,height,"-".repeat(width-buf.x*2));
        for(var i=0;i<log.console.length;i++)
            draw(0,i+height+2,log.console[i]);
    }
});

//60 fps
function step(){
    //Init
    grid.clear();
    menu=menus[state.name];
    option=menu.keys[state.pos]+"";
    cmd=menu.options[option];
    dir={
        x:(key=="ArrowRight")-(key=="ArrowLeft"),
        y:(key=="ArrowDown")-(key=="ArrowUp")
    };

    //The Code
    if(state=="menu"){
        if(dir.y){
            state.pos=Math.mod(state.pos+dir.y,menu.keys.length);
            state.prompt=false;
        }
        if(!state.prompt){
            draw(0,state.pos+1,"%c{#88f}>");
        }
        for(let i=0;i<menu.prompts.length;i++){
            if(state.pos==i&&state.prompt){
                draw((menu.keys[i]+"").length+2,i+1,": "+menu.prompts[i]);
            } else if(menu.prompts[i].length){
                draw((menu.keys[i]+"").length+2,i+1,": "+menu.prompts[i]);
            }
        }
        if((key==" "&&!state.prompt)||key=="Enter"){
            command(cmd);
        }
        draw(0,0,menu.title);
        for(let i=0;i<menu.keys.length;i++){
            draw(2,i+1,menu.keys[i]);
        }
    }

    //End
    log.draw();
    key="";
}
window.onload=function(){
    document.body.appendChild(grid.getContainer());
    setInterval(step,60);
};
/*
state={
    name:"title",
    data:{
        pos:0,
        time:Date.now()
    },
    changePos(v){
        this.data.pos+=v;
        this.data.time=Date.now();
    }
};
menus={
    "title":{//jshint ignore:line
        title:"The Aboveground Railroad",
        options:{
            "Start a New Game":"goto: config",
            "Load a Game":"goto: load",
            "About":"goto: about",
            "Credits":"goto: credits",
        }
    },
    "about":{
        title:"About the Game",
        options:{
            "Inspiration":"log: This game was supposed to be based on the Oregon Trail, for US History.",
            "Controls":"log: Well, you got this far.\nW goes up, X goes down, A goes left, D goes right, QEZC moves diagonally.\nS, Space, and Enter are select. R to refresh the page.",
            "Back":"goto: title"
        }
    },
    "credits":{
        title:"Credits",
        options:{
            "Marcus Luebke":"log: Marcus Luebke is still writing the game. How'd you get beta access?",
            "Back":"goto: title",
            "":"goto: secret"
        }
    },
    "secret":{
        title:"?",
        options:{
            "Option 1":"goto: secret2",
            "Back":"goto:title",
        }
    },
    "secret2":{
        title:"?",
        options:{
            "Option 1":"goto: secret3",
            "Back":"goto:title",
        }
    },
    "secret3":{
        title:"?",
        options:{
            "Option 1":"goto: secret4",
            "Back":"goto:title",
            "":"goto:S"
        }
    },
    "secret4":{
        title:"?",
        options:{
            "Option 1":"goto: secret",
            "Back":"goto:title",
        }
    },
    "S":{
        title:"You found it!",
        options:{
            "Back"(){
                location="https://en.wikipedia.org/wiki/Easter_egg_(media)";
            }
        }
    },
    "load":{
        title:"Load a Save",
        options:{
            "Save 1":"log: There is no data for Save 1.",
            "Save 2":"log: There is no data for Save 2.",
            "Save 3":"log: There is no data for Save 3.",
            "Save 4":"log: There is no data for Save 4.",
            "Back":"goto: title"
        }
    },
    "config":{
        title:"Start a New Game",
        options:{
            "Name":"prompt",
        }
    }
};
function command(s){
    if(typeof s=="function"){
        s();
    } else {
        s=s.split(/\:/);
        command[s[0]](s.slice(1).join("").trim());
    }
}
Object.assign(command,{
    goto(s){
        log.console=[];
        state.name=s;
        state.changePos(-state.data.pos);
    },
    log:log
});
function log(a,c){
    a=a.split("\n").reverse();
    a.unshift("");
    for(var i in a)
        log.console.unshift({
            c:c||"#fff",
            s:a[i]||""
        });
}
log.console=[];

map=[];
function draw(){
    for(var i=0;i<map.length&&i<map.height;i++){

    }
}
function step(){
    menu=menus[state.name];
    menopos=Object.keys(menu.options);
    option=menopos[state.data.pos];

    if(pad.getNewInput("Up")){
        state.changePos(-1);
    }
    if(pad.getNewInput("Down")){
        state.changePos(1);
    }
    if(pad.getNewInput("Go")){
        command(menu.options[option]);
    }
    if(pad.getNewInput("restart")&&confirm("Are you sure you want to leave the page?")){
        history.go();
    }
    state.data.pos=Math.mod(state.data.pos,menopos.length);


    map=new Array(50).fill("");
    col=new Array(map.length).fill("#fff");
    map[0]=menu.title;
    var I=0;
    for(var i in menu.options){
        I++;
        map[I]="  "+i;
    }
    map[state.data.pos+1]=">"+map[state.data.pos+1].slice(1);

    map[10]=" ".repeat(18)+"***";
    for(var i in log.console){
        col[+i+11]=log.console[i].c;
        map[+i+11]=log.console[i].s;
    }
    pad.endStep();
}
*/
