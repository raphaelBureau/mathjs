export class Polynomial {
    //a polynomial is stored as an array []
    //ex: ax^4+bx^3+cx^2+dx+e is stored as [a,b,c,d,e]
    //the degree is just poly.length-1;

    //epsilon is always 1e-6 by default
    static Evaluate(x, poly) {
        let sum =poly[poly.length-1] + poly[poly.length-2]*x;
        for(let i =2; i<poly.length; i++) {
            sum+= Math.pow(x, i) * poly[poly.length-i-1];
        }
        return sum;
    }
    static Derivative(poly) {
        //reduces poly size by one since we loose the constant
        let result = new Array(poly.length-1);
        for(let i =0; i<result.length; i++) {
            result[result.length-1-i] = poly[poly.length-i-2] * (i+1);
        }
        return result;
    }
    static Primitive(poly, constant = 0) {
        //dont forget your +C
        let result = new Array(poly.length+1);
        for(let i =0; i<poly.length; i++) {
            result[i] = poly[i]/(result.length-i-1);
        }
        result[result.length-1] = constant;
        return result;
    }
    static Integral(a,b,poly) {
        let primitive = Polynomial.Primitive(poly);
        return Polynomial.Evaluate(b,primitive) - Polynomial.Evaluate(a,primitive);
    }
    static ToString(poly) {
        let result = "" + poly[poly.length-1] + ((poly[poly.length-2] > 0) ? "+" : "-") + poly[poly.length-2] + "x";
        for(let i =2; i<poly.length; i++) {
            if(poly[poly.length-1-i] != 0) {
            result += ((poly[poly.length-1-i] > 0) ? "+" : "-") + poly[poly.length-1-i] + "x^" + i;
            }
        }
        return result;
    }
    static Quadratic(a,b,c) {
        let val = Math.sqrt(b*b-4*a*c);
        return [(-b-val)/(2*a),(-b+val)/(2*a)];
    }
    static Cubic(a,b,c,d) {
        let t1 = (-(b*b*b)/27/a/a/a)+(b*c/6/a/a)-(d/2/a);
        let t2 = (c/3/a)-(b*b/9/a/a);
        return Math.cbrt(t1 + Math.sqrt(Math.pow(t1,2) + Math.pow(t2,3))) +
               Math.cbrt(t1 - Math.sqrt(Math.pow(t1,2) + Math.pow(t2,3))) - b/3/a;
    }
    static Quartic(a,b,c,d,e) {
        let t1 = 2*c*c*c-9*b*c*d+27*b*b*e+27*a*d*d-72*a*c*e;
        let t2 = c*c-3*b*d+12*a*e;

        let b1 = Math.cbrt((t1+Math.sqrt(Math.pow(t1,2)-4*Math.pow(t2,3)))/2);
        let b2 = t2/b1;

        let e1 = Math.sqrt((3*b*b-8*a*c)/12/a/a + (b1 + b2)/3/a)/2;
        let e2 = (8*a*c-3*b*b)/4/a/a + ((b*b*b-4*a*b*c+8*a*a*d)/8/a/a/a)/e1;

        return [
            -b/4/a + e1 + Math.sqrt(-4*Math.pow(e1,2)-e2)/2,
            -b/4/a + e1 - Math.sqrt(-4*Math.pow(e1,2)-e2)/2,
            -b/4/a - e1 + Math.sqrt(-4*Math.pow(e1,2)-e2)/2,
            -b/4/a - e1 - Math.sqrt(-4*Math.pow(e1,2)-e2)/2,
        ]
    }
    static CauchyBound(poly) {
        let biggestBound = Math.pow(Math.abs(poly[poly.length-1]/poly[0]),1/(poly.length-1));
        let current = 0;
        for(let i =1; i<poly.length-1; i++) {
            current = Math.abs(Math.pow(poly[poly.length-1-i]/poly[0],1/(poly.length-1-i)));
            if(current > biggestBound) {
                biggestBound = current;
            }
        }
        return biggestBound;
    }
    static DescartesRule(poly) { //usefull to get the maximum possible positive real roots there is exactly V - 2a roots where V is the result of Descartes and a is a positive integer
        //it is the same for negative roots W - 2b
        let sign = Math.sign(poly[0]);
        let Vcount = 0;
        for(let i =1; i<poly.length; i++) {
            if(poly[i] != 0 && Math.sign(poly[i]) != sign) {
                sign = Math.sign(poly[i]);
                Vcount++;
            }
        }
        
        sign = Math.sign(poly[0]) * ((poly.length-1) % 2 * -2 + 1);
        let Wcount = 0;
        for(let i =1; i<poly.length; i++) {
            if(poly[i] != 0 && Math.sign(poly[i]) != sign) {
                sign = Math.sign(poly[i]);
                Wcount++;
            }
        }
        return [Wcount, Vcount];
    }
    static BisectionRoot(poly) {
        let roots = [];
        let bound = Polynomial.CauchyBound(poly);
        let rootCount = Polynomial.DescartesRule(poly);
        let absoluteLeftBound = -bound;
        let absoluteRightBound = bound;
        //simple binary search to find approximate root and then apply newton raphson
        let leftBound = absoluteLeftBound;
        let rightBound = 0;
        let currentBound = 0;
        let derivative = Polynomial.Derivative(poly);
        for(let attemps =0; attemps<rootCount[0]; attemps++) {
            currentBound = Polynomial.Bisect(absoluteLeftBound,rightBound,poly,derivative);
            roots.push(currentBound);
            rightBound = currentBound;
        }
        for(let attemps =0; attemps<rootCount[1]; attemps++) {
            currentBound = Polynomial.Bisect(leftBound,absoluteRightBound,poly,derivative);
            roots.push(currentBound);
            leftBound = currentBound;
        }
        return roots;
    }
    static Bisect(leftBound,rightBound,poly,derivative) {
        let currentValue = 0;
        let currentBound = 0;
        let leftVal = Polynomial.Evaluate(leftBound,poly);
        for(let i =0; i<10; i++) { //bisection-left
            currentBound = leftBound/2 + rightBound/2;
            currentValue = Polynomial.Evaluate(currentBound, poly);
            if(Math.sign(currentValue) == Math.sign(leftVal)) {
                leftBound = currentBound;
            }
            else{
                rightBound = currentBound;
            }
        }
        for(let i =0; i<100; i++) { //newton-raphson
            currentBound -= Polynomial.Evaluate(currentBound,poly)/Polynomial.Evaluate(currentBound,derivative)
        }
        return currentBound;
    }
}