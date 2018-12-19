const config={
    fps:60,
    player:{
        size:30,
        jump:13,
        xacc:1,
        gravity:0.3,
        xfric:0.8,
        yfric:0.95,
        Iacc:0.5,
        Ifric:0.9
    },
    block:{
        color:{
            "T":"#0bf",
            "D":"#f00",
            "E":"#f00",
            "W":"#0ff",
            "U":"#b90",
            "V":"#fb0",
            "B":"#00f",
            "S":"#f0f",
            "A":"#93e",
            "R":"#f",
            "F":"#f",
            "N":"#f"
        },
        transparency:{
            "N":1,
        },
        fake:"FE",
        solid:"NBASTR",
        period:450,
    },
    bottom: 0,
    side: 500,
    screenwidth: 600,
    screenheight: 400
};
let Game={
    level:1,
    blocks:[],
    buttons:[],
    players:[],
    state:{
        timeOffset:0,
        frame:0
    },
    ctx:{
        fillStyle:"#0",

    }
};
Game.Game=Game;
Game.forAll=(name,arr)=>Game[arr].map(v=>v[name]())||Game;
Game.stepAll=arr=>Game.forAll("step",arr);
Game.drawAll=arr=>Game.forAll("draw",arr);
Game.if=bool=>{
    if(bool){
        let x=new Proxy(_=>x,{get:(a,b)=>b=="Game"?Game:x,set:_=>x});
        return x;
    } else return Game;
};
Game.ifNot=bool=>Game.if(!bool);
Game.ifState=str=>Game.if(Game.state[str]);
Game.ifNotState=str=>Game.if(!Game.state[str]);
Game.ifKey=str=>Game.if(Game.key[str]);
Game.ifNotKey=str=>Game.if(!Game.key[str]);
Game.time=_=>Date.now()-Game.timeOffset;
Game.camera=Object.assign(obj=>Game.camera.pos=obj.pos,{pos:new Vector()});
Game.step=_=>Game
    .stepAll("buttons")
    .ifStateNot("paused")
        .stepAll("players")
        .stepAll("blocks")
        .forAll("updateValues","players")
        .state.frame+++1
    ||Game;
Game.draw=_=>Game
    .drawAll("buttons")
    .drawAll("blocks")
    .drawAll("players")
    .drawStage()
    .ifState("paused")
        .drawPauseMenu()
    .Game
    .drawBorder();
//new Game.Button("paused");
Game.camera(new Game.Player());
new Game.Block({
    top:0,
    right:Infinity,
    left:Infinity,
    bottom:Infinity,
    type:"normal"
});
new Game.Block({
    bottom:0,
    top:20,
    right:100,
    left:60
});