export class Stats {
    static Avg(dataSet) {
        let avg = 0;
        for(let i=0; i<dataSet.length; i++) {
            avg += dataSet[i];
        }
        return avg / dataSet.length;
    }
    static Median(dataSet) {
        if(dataSet.length % 2 ==0) {
            return (dataSet[dataSet.length/2-1] + dataSet[dataSet.length/2])/2
        }
        return dataSet[Math.floor(dataSet.length/2)];
    }
    static Mode(dataSet, epsilon) {
        let sortedSet = new Array(dataSet.length);
        for(let i=0; i<dataSet.length; i++) {
            sortedSet[i] = dataSet[i];
        }
        sortedSet.sort((a,b) => a-b);
        let biggestSet = 0;
        let biggestCount = 1;
        let currentCount = 1;
        let currentSet = 0;
        let currentnumber = dataSet[0];
        for(let i =1; i<sortedSet.length; i++) {
            if(Math.abs(currentnumber - sortedSet[i]) <= epsilon) {
                currentCount++;
                if(currentCount > biggestCount) {
                    biggestCount = currentCount;
                    biggestSet = currentSet;
                }
            }
            else{
                currentnumber = sortedSet[i];
                currentCount = 1;
                currentSet = i;
            }
        }
        return [sortedSet[biggestSet], biggestCount];
    }
    static Variance(dataSet) {
        let avg = Stats.Avg(dataSet);
        let sum = 0;
        for(let i=0; i<dataSet.length; i++) {
            sum += (dataSet[i] - avg)*(dataSet[i] - avg);
        }
        return sum/(dataSet.length-1);
    }
    static StandardDeviation(dataSet) {
        return Math.sqrt(Stats.Variance(dataSet));
    }
    static Range(dataSet) {
        let min = dataSet[0];
        let max = dataSet[0];
        for(let i =1; i<dataSet.length; i++) {
            if(dataSet[i] < min) {
                min = dataSet[i];
            }
            if(dataSet[i] > max) {
                max = dataSet[i];
            }
        }
        return [min,max];
    }
    static Zrank(value,dataSet) {
        return (value - Stats.Avg(dataSet))/Stats.StandardDeviation(dataSet);
    }
    static Skewness(dataSet) {
        let avg = Stats.Avg(dataSet);
        let dev = Stats.StandardDeviation(dataSet);
        let n = dataSet.length;
        console.log(dev);

        let sum =0;
        for(let i =0; i<n; i++) {
            sum += Math.pow((dataSet[i] - avg)/dev,3);
        }
        return (n/((n-1)*(n-2)))*sum;
    }
    static Kurtosis(dataSet) {
        let avg = Stats.Avg(dataSet);
        let dev = Stats.StandardDeviation(dataSet);
        let n = dataSet.length;

        let sum=0;
        for(let i =0; i<n; i++) {
            sum += Math.pow((dataSet[i] - avg)/dev,4);
        }
        return (n*(n+1)/((n-1)*(n-2)*(n-3)))*sum - (3*((n-1)*(n-1)))/((n-2)*(n-3));
    }
}