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
    this.floor=o.floor&&o.floor.length==1?o.floor:" ";
    this.ceil=o.ceil&&o.ceil.length==1?o.ceil:"";
    this.char=o.char&&o.char.length==1?o.char:" ";
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
            let d={x:this.x-player.x+(width+1)/2,y:this.y-player.y+(height+1)/2};
            if(d.x>=0&&width>d.x&&d.y>=0&&height>d.y){
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
    },
    setFloor(char){
        this.floor=char;
        char.ceil=this;
    },
    removeFloor(char){
        this.floor="";
        char.ceil="";
    },
    move(x,y){
        let char=map.getChar(this.x+x,this.y+y);
        if(char.scout(this)){
            if(typeof this.floor=="string"){
                map.setSimpleChar(this.x,this.y,this.floor);
            } else {
                this.removeFloor(this.floor);
            }
            char.collide(this);
            this.x+=x;
            this.y+=y;
            this.setFloor(char);
        }
    }
});
map=Object.assign([],{
    style:{
        ".":{
            color:["#4c4"],
            scout:1
        },
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
        })
    },
    AddSimpleChunk(o){
        for(let Y=0;Y<o.array.length;Y++){
            for(let X=0;X<o.array[Y].length;X++){
                if(o.array[Y][X]!=" "&&!this.CanPlace({x:X+o.x,y:Y+o.y}))return 0;
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
        return 1;
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
    getChar(x,y){
        return this.GetChar({x:x,y:y});
    },
    GetChar(o){
        for(let i=0;i<this.length;i++){
            if(this[i].x==o.x&&this[i].y==o.y&&!this[i].ceil){
                return this[i];
            }
        }
        console.info(`Fudging at ${o.x}, ${o.y}`)
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
        for(let i=0;i<this.length;i++)this[i].act();
    }
});
