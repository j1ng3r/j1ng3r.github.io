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
            "Your Name":"prompt",
            "Start the Game":start,
            "Back":"goto:title"
        }
    }
};
for(let i in menus){
    menus[i].keys=Object.keys(menus[i].options);
    menus[i].prompts=new Array(menus[i].keys.length).fill("");
}
