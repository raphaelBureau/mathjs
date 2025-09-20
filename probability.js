export class Probability {
    static Factorial(n) { //n is an integer > 0
        if(n > 1) {
        return n*Probability.Factorial(n-1);
        }
        if(n == 0) {
            return 1;
        }
        return n;
    }
    static Permutation(n) {
        return Probability.Factorial(n);
    }
    static Combinaison(k, n) { //k different objects of n
        //order dosent count
        return (Probability.Factorial(n)/(Probability.Factorial(k)*Probability.Factorial(n-k)));
    }
    static Arrangement(k, n) { //k objects from n different objects
        //order counts
        return Probability.Factorial(n)/Probability.Factorial(n-k);
    }
}