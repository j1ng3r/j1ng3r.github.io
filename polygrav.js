function D(A){
	let p=[];
	for(let i=0;i<A.length;i++){
		let a,K,v,r;
		[a,K,v,r]=A[i];
		if(r!=0)p.push([-a*r,K,v+1,r+1]);
		if(v!=0)p.push([a*v,K+1,v-1,r+2]);
    }
	return p.sort((a,b)=>a[1]-b[1]).reduce((a,v,i)=>{
		let l=a.length-1;
		l+1&&v[1]==a[l][1]?a[l][0]+=v[0]:a.push(v);
		return a;
    },[]);
}
function getN(A,n){
	for(let i=0;i<n;i++)A=D(A);
	return A;
}
p=x=>x==1?"":"^"+x;
e=(b,p)=>p?b+p(p):"";
string=A=>A.reduce((a,v)=>a+(v[0]==1?"":(v[0]>0:a&&"+","-")+Math.abs(v[0]))+e("k",v[1])+e("v",v[2])+e("r",-v[3]),"");
function calc(k,v,r,A){
	if(typeof A=="number")A=getN(A);
	return A.reduce(((a,w)=>a+w[0]*k**w[1]*v**w[2]*r**-w[3]),0);
}
Math.factorial=n=>{
	let f=1;
	for(let i=1;i<n;i++){
		f*=i;
    }
	return f;
};
function ps(n){
	let str="r+vx+k\\left(";
	A=[1,-1,1,0];
	for(let i=2;i<=n;i++){
		A=D(A);
		str+=`\\frac{${string(A)}}{${n}!}x^${n}+`;
	}
	return str.slice(0,-1)+"\\right)";
}
function poly(x,k,v,r,n){
	let sum=0,A=[[1,0,0-1]];
	for(let i=0;i<=n;i++){
		sum+=A.reduce(((a,w)=>a+w[0]*k**w[1]*v**w[2]*r**-w[3]),0)*x**n/Math.factorial(n);
		A=D(A);
    }
	return sum;
}
term=n=>string(getN([[1,-1,0,-1]],n));