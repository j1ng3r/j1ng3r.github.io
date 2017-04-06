function Hash(s){
    var H=Hash,O=H.out,I=H.in,h="",p,v=0,j=0,i,_=(_=O)=>{for(p=(Math.sin(v)+1)/2;_>0;_--)p*=l.length-1,h+=l[~~p],p%=1;v=j=0;},c=String.fromCharCode(2),l=H.characters+c,
    e=_=>{throw new Error(`"${s}"[${s.indexOf(i)}] = ${i} is not a valid character. If you think it should be, contact Marcus.`);};
    s.includes(i=c)&&e();
    s+=c.repeat(O-s.length%O);
    for(i of s){p=l.indexOf(i);p<0&&e();v=v*l.length+p;++j-I||_();}
    return h;
}
Hash.characters="!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ \n\tƩ÷ø¿¡¢£¤¥¦§«¬»±µÞßðñſƆƋƍƎƞƟƥƧƨ";
Hash.in=6;
Hash.out=8;
Hash.filter=function(s,c,i,a){
    for(i=0,s+=a="",c=c||a;i<s.length;i++)a+=Hash.characters.includes(s[i])?s[i]:c;
    return a;
};
Hash.lazy=s=>Hash(Hash.filter(s));
