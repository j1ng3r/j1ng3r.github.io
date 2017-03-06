function command(s,a){
    if(typeof s=="function"){
        s(a);
    } else if(typeof s=="string"){
        s=s.split(/\:/);
        command[s[0]](s.slice(1).join("").trim());
    } else return s;
}
Object.assign(command,{
    goto(s){
        log.clear();
        state.name=s;
        state.changePos(-state.pos);
    },
    prompt(){
        state.prompt=!state.prompt;
        state.now=Date.now();
        if(state.prompt)
            state.ppos=menu.prompts[state.pos].length;
    },
    log:log
});
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
        draw(0,height,"-".repeat(width));
        for(var i=0;i<log.console.length;i++)
            draw(0,i+height+2,log.console[i]);
    }
});
