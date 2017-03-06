var max=5;
function Hand(a,b){
    if(a instanceof Hand){
        this.data=Object.assign(a.data);
    }
    this.data=[a,b];
}
Object.assign(Hand.prototype,{
    equals(hand){
        for(let i=0,d=this.getData(),h=hand.getData();i<d.length;i++)
            if(d[i]!=h[i])return false;
        return true;
    },
    getData(a){
        let d=[Math.max.apply(Math,this.data),Math.min.apply(Math,this.data)];
        return+a==a?d[a]:d;
    },
    getOptions(){
        if(!a)return[];
        let re=[];
        re.pos=[];
        if(typeof a[0]!="number"){
            for(let i=0;i<a.length;i++){
                re.push(getOptions(a[i]));
            }
        }
        p1=hand([a[0],a[1]]);
        p2=hand([a[2],a[3]]);
        for(let i=0;i<=(p1[0]+p1[1])/2;i++){
            let add=hand([p1[0]+p1[1]-i,i]);
            if(!equal(p1,add)&&!equal([0,0],add)){
                push(re.pos,re.pos,p2.concat(add));
                push(re,killlist,p2.concat(add));
            }
        }
        let test=(a,b)=>{
            let p=[p2[0],p2[1]];
            p[b]+=p1[a];
            p=hand(p).concat(p1);
            if(p1[a]&&p2[b]){
                push(re.pos,re.pos,p);
                push(re,killlist,p);
            }
        };
        test(0,0);
        test(1,0);
        test(0,1);
        test(1,1);
        if(!re.length&&a.length){
            push(deadlist,deadlist,Object.assign([],a));
        }
        for(let i=0;i<re.length;i++){
            for(let j=0;j<deadlist.length;j++){
                if(pequal(re[i],deadlist[j])){
                    re[0]=re[i]
                    re.splice(1);
                    j=1/0;
                    push(killlist,killlist,Object.assign([],a));
                }
            }
        }
        return re;
}
});
function equal(p1,p2){
    return p1[0]+p1[1]==p2[0]+p2[1]&&p2.includes(p1[0]);
}
function pequal(a1,a2){
    return equal(a1.slice(0,2),a2.slice(0,2))&&equal(a1.slice(2),a2.slice(2));
}
function hand(p){
    p[0]%=max;
    p[1]%=max;
    return[Math.max(p[0],p[1]),Math.min(p[0],p[1])];
}
var deadlist=[];
var killlist=[];
function see(a){
    if(typeof a[0]=="number"){
        return a.join("");
    }
    let re=[];
    for(let i=0;i<a.length;i++){
        let r=see(a[i]);
        if(typeof r=="string")re.push(r);
        else re=re.concat(r);
    }
    return re;
}
function push(a,b,v){
    for(let i=0;i<b.length;i++)
        if(pequal(b[i],v))return;
    if(a==b)return a.push(v);
    return push(a,a,v);
}
function getOptions(a){
    if(!a)return[];
    let re=[];
    re.pos=[];
    if(typeof a[0]!="number"){
        for(let i=0;i<a.length;i++){
            re.push(getOptions(a[i]));
        }
    }
    p1=hand([a[0],a[1]]);
    p2=hand([a[2],a[3]]);
    for(let i=0;i<=(p1[0]+p1[1])/2;i++){
        let add=hand([p1[0]+p1[1]-i,i]);
        if(!equal(p1,add)&&!equal([0,0],add)){
            push(re.pos,re.pos,p2.concat(add));
            push(re,killlist,p2.concat(add));
        }
    }
    let test=(a,b)=>{
        let p=[p2[0],p2[1]];
        p[b]+=p1[a];
        p=hand(p).concat(p1);
        if(p1[a]&&p2[b]){
            push(re.pos,re.pos,p);
            push(re,killlist,p);
        }
    };
    test(0,0);
    test(1,0);
    test(0,1);
    test(1,1);
    if(!re.length&&a.length){
        push(deadlist,deadlist,Object.assign([],a));
    }
    for(let i=0;i<re.length;i++){
        for(let j=0;j<deadlist.length;j++){
            if(pequal(re[i],deadlist[j])){
                re[0]=re[i]
                re.splice(1);
                j=1/0;
                push(killlist,killlist,Object.assign([],a));
            }
        }
    }
    return re;
}
