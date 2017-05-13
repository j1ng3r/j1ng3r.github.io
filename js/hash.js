function Hash(s,I=Hash.in,O=Hash.out){
    return Hash.filtered(Hash.filter(s),I,O);
}
Object.assign(Hash,{
    characters:"!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ \n\tƩ÷ø¿¡¢£¤¥¦§«¬»±µÞßðñſƆƋƍƎƞƟƥƧƨ",
    in:16,
    out:32,
    filter(s,c,i,a){
        for(i=0,s+=a="",c=c||a;i<s.length;i++)a+=Hash.characters.includes(s[i])?s[i]:c;
        return a;
    },
    strict(s){
        var H=Hash,O=H.out,I=H.in,h="",p,v=0,j=0,i,_=(z=O)=>{for(p=(Math.sin(v)+1)/2;z>0;z--)p*=l.length-1,h+=l[~~p],p%=1;v=j=0;},c=String.fromCharCode(2),l=H.characters+c,
        e=_=>{throw new Error(`"${s}"[${s.indexOf(i)}] = ${i} is not a valid character. If you think it should be, contact Marcus.`);};
        s.includes(i=c)&&e();
        s+=c.repeat(O-s.length%O);
        for(i of s)p=l.indexOf(i),~p||e(),v=v*l.length+p,++j-I||_();
        return h;
    },
    filtered(s,I,O){
        var h="",p,v=0,j=0,i,_=(z=O)=>{for(p=(Math.sin(v)+1)/2;z>0;z--)p*=l.length-1,h+=l[~~p],p%=1;v=j=0;},c=String.fromCharCode(2),l=Hash.characters+c;
        s+=c.repeat(I-.5-(s.length+I-.5)%I);
        for(i of s)p=l.indexOf(i),v=v*l.length+p,++j-I||_();
        return h;
    },
    adapt(s){
        s=Hash.filter(s);
        return Hash.filtered(s,s.length,s.length*2);
    }
});
function nonUniqueHasher(s){
    return"hashed!";
}

function hasDuplicates(s,n){
    for(var i=0,list=[],v;i<s.length-n+1;i++){
        if(list.includes(v=s.slice(i,i+n)))return true;
        list.push(v);
    }
    return false;
}
function getInclusiveNumber(n){
    if(n!=(n=+n)||n<1||n%1)return 0;
    var list=["1"],i,j,l,L=n-2+Math.pow(2,n),min=Infinity;
    for(i=0;i<L;i++){
        console.log(i);
        l=list.length;
        for(j=0;j<l;j++){
            list[list.length]=list[j]+"1";
            list[j]+="0";
        }
        for(j=0;j<list.length;j++){
            if(hasDuplicates(list[j],n)){
                list.splice(j--,1);
            }
        }
    }
    for(i=0;i<list.length;i++)
        min=Math.min(min,parseInt(list[i],2));
    return min;
}
