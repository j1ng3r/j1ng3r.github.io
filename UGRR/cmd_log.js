function draw(a,b,c){
    if(Array.isArray(c)){
        for(let i=0;i<c.length;i++){
            let C=c[i].split("#");
            sq(+a+i,b,C[0]||c[i][0],C[1]&&"#"+C[1],C[2]&&"#"+C[2]);
        }
    } else return draw(a,b,c.split(""));
}
function sq(x,y,s,c,b){
    return grid.draw(+x+buf.x,+y+buf.y,s,c,b);
}
function text(x,y,s){
    if(Array.isArray(s)){
        return draw(x,y,s);
    }
    grid.drawText(+x+buf.x,+y+buf.y,s);
}
function command(s,a){
    if(typeof s=="function"){
        return s(a);
    } else if(typeof s=="string"){
        s=s.split(/\:/);
        return command[s[0]](s.slice(1).join("").trim());
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
function dialog(a,n){
    log(`%c{}${a}\n  - %c{#afa}${n}`)
}
Object.assign(log,{
    console:[],
    clear(){
        this.console=[];
    },
    draw(){
        draw(0,height,"-".repeat(width));
        for(var i=0;i<log.console.length;i++)
            text(0,i+height+2,log.console[i]);
    }
});
