state={
    name:"title",
    
    data:{
        pos:0
    }
};
menus:{
    "title":{
        options:{
            "Start a New Game"(){

            },
            "Load a Game"(){

            },
            "Credits":"goto: credits",
        }
    },
    "credits":{
        options:{
            "Marcus Luebke":"log: Marcus Luebke is still writing the game. How'd you get beta access?";
            },
            "Back":"goto: title"
        }
    }
};
function log(){

}
camera.setCanvas(document.createElement("canvas"));
camera.invertAxis("y");
camera.createSpritesFromFolder("UGRR/sprites/",[
    "titlescreen",
    "selector"
],".png");
function draw(){

}
function step(){
    if(state.type=="menu"){

    }
}
window.onload=function(){
    document.body.appendChild(camera.c);

};
