let Stats={
    getMean:A=>A.reduce((a,v)=>a+v,0)/A.length,
    getStandardDeviation:A=>Math.sqrt(Stats.getVariance(A)),
    getVariance:A=>A.reduce((a,v)=>a+(v-Stats.getMean(A))**2,0)/(A.length-1),
    getTwoSigma:A=>[Stats.getMean(A)-2*Stats.getStandardDeviation(A),Stats.getMean(A)+2*Stats.getStandardDeviation(A)]
};