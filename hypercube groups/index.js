let distance = (u,v)=>(u^v).toString(2).split("1").length-1;
let mindist=(a,u)=>Math.max(...a.map(v=>distance(u,v)));
let addNum=(a,i,m,d,r)=>{
	while(i<m)if(r.indexOf(i)==-1&&mindist(a,i)>=d)return i;
    return-1;
};
let HC=(n,g,d)=>{
    let groups=new Array(10).fill(0).map(v=>[]);
    groups[0]=[0,2**d-1];
    let i=0,u=0;
    while(groups[i].length<d)
};
let create=(l,m,d,r)=>{
    let a = [];
    let i = 0;
	while(a.length<l){
        let u = addNum(a,i,m,d,r);
        if(u==-1){
            if(a.length){
                i = a.pop();
            } else {
                return null;
            }
        } else {
            a.push(u);
            i=u;
        }
        i++;
    }
};
