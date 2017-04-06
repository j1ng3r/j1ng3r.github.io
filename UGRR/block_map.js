function Block(o){
    if(o instanceof Block)return o;
    let O=_=>!(_ in o);
    if(O("x")||O("y")||O("char")){
        console.error(o);
        throw new Error("Missing x, y, and char properties of argument 0.");
    }
    this.x=+o.x;
    this.y=+o.y;
    if(this.x!=this.x||this.y!=this.y){throw new TypeError("x or y is NaN");}
    this.name=o.name||"Anonymous";
    this.char=o.char&&o.char.length==1?o.char:" ";
    this.floor=o.floor&&o.floor.length==1?o.floor:this.char==" "?" ":".";
    this.ceil=o.ceil&&o.ceil.length==1?o.ceil:"";
    this[Symbol.toPrimitive]=_=>this.char;
    this.color=(o.color||"#fff")+"";
    this.background=(o.background||"#000")+"";
    O=(_=>{
        if(typeof o[_]=="function"){
            this["on"+_]=o[_].bind(this);
        } else this["on"+_]=o[_];
        this[_]=($=>this.do(_,$)).bind(this);
    }).bind(this);
    O("scout");
    O("collide");
    O("act");
    O("kill");
    O("interact");
}
function bind(f,t){
    if(typeof f=="function")return f.bind(t);
    return f;
}
Object.assign(Block.prototype,{
    do(_,$){
        let res=command(bind(this["on"+_],this),$);
        command(bind(this["_"+_],this),$);
        return res;
    },
    draw(){
        if(!this.ceil){
            let d={x:this.x-player.x+(width-box+1)/2,y:this.y-player.y+(height+1)/2};
            if(d.x>=0&&width-box+1>d.x&&d.y>=0&&height>d.y){
                sq(d.x,d.y,this.char,this.color,this.background);
            }
        }
    },
    _kill(a){
        console.info("Killing:",this);
        map.splice(this.index,1);
        for(let i=0;i<map.length;i++){
            map[i].index=i;
        }
        if(this.char!=" ")this.generateFloor();
    },
    setFloor(char){
        this.floor=char;
        char.ceil=this;
    },
    generateFloor(x,y){
        map.setSimpleChar((x-this.x||0)+this.x,(y-this.y||0)+this.y,this.floor);
    },
    removeFloor(char){
        this.floor="";
        char.ceil="";
    },
    move(x,y){
        let char=map.getChar(this.x+x,this.y+y);
        let p={x:this.x,y:this.y};
        if(char.scout(this)){
            char.collide(this);
            this.x+=x;
            this.y+=y;
            if(typeof this.floor=="string"){
                this.generateFloor(p.x,p.y);
            } else {
                this.removeFloor(this.floor);
            }
            this.setFloor(char);
        }
    },
    dialog(a){
        dialog(a,this.name);
    },
    test(c){
        this.background=c||"#f00";
    }
});
map=Object.assign([],{
    style:{
        ".":{
            color:["#6a2","#4c4","#d62","#b83"],
            scout:1
        },
    },
    test(x,y,c){
        this.getChar(x,y).test(c);
    },
    getStyle(c,k){
        if(k===undefined){
            let o={};
            for(let k in this.style[c])
                o[k]=this.getStyle(c,k);
            return o;
        }
        let r=this.style[c];
        if(r){
            r=r[k];
            if(Array.isArray(r))return r.random();
            return r;
        } else return;
    },
    addSimpleChunk(x,y,a){
        return this.AddSimpleChunk({
            x:x,
            y:y,
            array:a
        });
    },
    AddSimpleChunk(o){
        for(let Y=0;Y<o.array.length;Y++){
            for(let X=0;X<o.array[Y].length;X++){
                if(o.array[Y][X]!=" "&&!this.CanPlace({x:X+o.x,y:Y+o.y})){
                    console.warn(`AddSimpleChunk failed at (${X+o.x},${Y+o.y}), placing ${o.array[Y][X]}`);
                    return false;
                }
            }
        }
        for(let Y=0;Y<o.array.length;Y++){
            for(let X=0;X<o.array[Y].length;X++){
                this.AddSimpleChar({
                    x:X+o.x,
                    y:Y+o.y,
                    char:o.array[Y][X]
                });
            }
        }
        return true;
    },
    kill(x,y){
        return this.Kill({x:x,y:y});
    },
    Kill(o){
        return this.getChar(o.x,o.y).kill();
    },
    canPlace(x,y){
        return this.CanPlace({x:x,y:y});
    },
    CanPlace(o){
        return this.getChar(o.x,o.y)==" ";
    },
    setSimpleChar(x,y,s){
        return this.SetSimpleChar({x:x,y:y,char:s});
    },
    SetSimpleChar(o){
        return this.SetChar(Object.assign({},o,map.getStyle(o.char)));
    },
    addSimpleChar(x,y,s){
        return this.AddSimpleChar({x:x,y:y,char:s});
    },
    AddSimpleChar(o){
        return this.AddChar(Object.assign({},o,map.getStyle(o.char)));
    },
    addChar(x,y,s,c,b){
        return this.AddChar({
            x:x,
            y:y,
            char:s,
            color:c,
            background:b
        });
    },
    AddChar(o){
        if(this.CanPlace(o))
            return!!this.SetChar(o);
        return 0;
    },
    setChar(x,y,s,c,b){
        return this.SetChar({
            x:x,
            y:y,
            char:s,
            color:c,
            background:b
        });
    },
    SetChar(o){
        this.Kill(o);
        return this.addBlock(o);
    },
    addBlock(b){
        b=new Block(b);
        b.index=this.length;
        this.push(b);
        return b;
    },
    addPerson(x,y,o){
        return this.AddPerson(Object.assign({},o,{x:x,y:y}));
    },
    AddPerson(o){
        let _=o.interact||function(){this.dialog(`Hi! I'm ${this.name}!`);};
        let x=this.AddChar(Object.assign({
            char:"@"
        },o,{interact(p){if(!state.prompt)_.apply(this,[p]);}}));
    },
    getPerson(name){
        for(let i=1;i<this.length;i++){
            if(this[i].name==name){
                return this[i];
            }
        }
    },
    getChar(x,y){
        return this.GetChar({x:x,y:y});
    },
    charExists(x,y){
        return this.CharExists({x:x,y:y});
    },
    CharExists(o){
        for(let i=0;i<this.length;i++){
            if(this[i].x==o.x&&this[i].y==o.y&&!this[i].ceil){
                return true;
            }
        }
        return false;
    },
    GetChar(o){
        for(let i=0;i<this.length;i++){
            if(this[i].x==o.x&&this[i].y==o.y&&!this[i].ceil){
                return this[i];
            }
        }
        console.info(`Fudging at ${o.x}, ${o.y}`);
        return this.addBlock({
            x:o.x,
            y:o.y,
            char:" "
        });
    },
    draw(){
        for(let i=0;i<this.length;i++)this[i].draw();
    },
    act(){
        if(!paused)for(let i=0;i<this.length;i++)this[i].act();
    }
});
