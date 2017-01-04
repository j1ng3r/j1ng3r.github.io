window.Unit=function(){
    var Unit={
        conversion:{
            "E":18,
            "P":15,
            "T":12,
            "G":9,
            "M":6,
            "k":3,
            "d":-1,
            "c":-2,
            "m":-3,
            "u":-6,
            "n":-9,
        },
        units:{
            "m":"#basic",
            "L":"m^3/1000",
        },
        parse(str){
            str=str.trim()
                .replace(/\s/g," ")
                .replace(/\/ *| *\//g,"/")
                .replace(/\* *| *\*/g,"*")
                .replace(/\^ *| *\^/g,"^")
                .replace(/[^^ \w/(*)]|^[*]|[/*]$/g,"")
            ;
            var ret={
                number:1,
                units:{}
            },div=1,last="";
            function pow(p){
                if(str.match(/^\^/)){
                    p=str.match(/\^\d+/);
                    if(!p)throw new TypeError("All exponents must be numerical.");
                    str=str.replace(/\^\d+/,"");
                    return p[0].slice(1)*div;
                }
                return div;
            }
            if(str.match(/^\d+/)){
                last=str.match(/^\d+/)[0];
                str=str.replace(/^\d+/,"");
                ret.number*=Math.pow(last,pow()*div);
            } else if(str.match(/^[a-z]\w*/)){
                last=str.match(/^[a-z]\w*/)[0];
                str=str.replace(/^[a-z]\w*/,"");
                ret.units[last]+=pow()*div;
            } else if(str.match(/^\//)){
                last="";
                div=-1;
            } else if(str.match(/^\*/)){
                last="";
                div=1
            }


            for(var ret={},i=0;i<str.length;i++){

            }
        },
        inverse(o){
            var a={},i;
            for(i in o.units)
                a[i]=-o.units[i];
            return{
                number:1/o.number,
                units:a
            };
        }
    };
    return Unit;
}();
