export class NumTheory {
    static Euclid(a,b) {
        if(b == 0) {
            return a;
        }
        let mod = a % b;
        return NumTheory.Euclid(b, mod);
    }
    static Bezout(a,b) {
        let coeff = [1,1];
        let params= [];
        do {
            let mod = a % b;
            params.push([a,(a-mod)/b,mod]);
            a = b;
            b= mod;
        }while(b!=0);
        for(let i = params.length-2; i >= 0;) {
            
        }
        console.log(params);
    }
}