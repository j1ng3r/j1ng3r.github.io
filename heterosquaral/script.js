let gennumbers=(()=>{
    let A=[[[]]],gen=n=>{
        if(A[n])return A[n];
        let last=gen(n-1),r=[];
        for(let i=0;i<n;i++)
            r=r.concat(last.map((v,j)=>v.map((w,k)=>w>=i?w+1:w).concat([i])));
        return A[n]=r;
    };
    return gen;
})();
function hasDuplicates(array) {
    //console.log(array);
    return (new Set(array)).size !== array.length;
}
let N=gennumbers(9);
console.log("genned");
let getSums=v=>[
    v[0]+v[1]+v[2],
    v[3]+v[4]+v[5],
    v[6]+v[7]+v[8],
    v[0]+v[3]+v[6],
    v[1]+v[4]+v[7],
    v[2]+v[5]+v[8],
    v[0]+v[4]+v[8],
    v[2]+v[4]+v[6]
];
let HS=N.filter(v=>{
    return v[0]<v[2]&&v[2]<v[6]&&v[0]<v[8]&&!hasDuplicates(getSums(v))
});
//N.filter(v=>/*v[0]<v[2]&&v[2]<v[6]&&v[2]<v[9]&&*/!hasDuplicates(getSums(v)));
console.log(HS);