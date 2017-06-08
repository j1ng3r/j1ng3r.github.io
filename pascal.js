function get(a,i){return a[i]||0;}
function Pascal(a){
    if(a.join("")==0)return 1;
    for(let i=0;i<a.length;i++){
        if(get(a,i)<0||get(a,i+1)>get(a,i)){
            return 0;
        }
    }
    a=Object.assign([],a);
    for(var sum=0,i=0;i<a.length;i++){
        a[i]--;
        sum+=Pascal(a);
    }
    return sum;
}
power=a=>a.map((v,i)=>v-get(a,i+1));
