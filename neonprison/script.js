const config={
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
    bottom: 0,
    side: 500,
    screenwidth: 600,
    screenheight: 400,
    songURL: 
};
let Game={
    level:1,
    
    blocks:[],
    buttons:[],
    player:{
        pos:new Vector(0,0),
        vel:new Vector(0,0),
        deaths:0
    },
    state:{
        paused:0,
        startTime:0,

    },
    step(){
        if(Game.state.paused){
            if(Game.buttons.pause.clicked){

            }
        }
    }
};