export class Quaternion {
    //a quaternion is expressed as an array of length 4
    //where q = [i, j, k, w] or q = [x, y, z, w]
    static product(q1,q2) {
        return [
            q1[0]*q2[3] + q1[1]*q2[2] - q1[2]*q2[1] + q1[3]*q2[0],//x
            q1[1]*q2[3] + q1[2]*q2[0] + q1[3]*q2[1] - q1[0]*q2[2],//y
            q1[2]*q2[3] + q1[3]*q2[2] + q1[0]*q2[1] - q1[1]*q2[0],//z
            q1[3]*q2[3] - q1[0]*q2[0] - q1[1]*q2[1] - q1[2]*q2[2],//w
        ];
    }
    static Add(q1, q2) { //q1 + q2
        return [
            q1[0]+q2[0],
            q1[1]+q2[1],
            q1[2]+q2[2],
            q1[3]+q2[3],
        ];
    }
    static AddR(q1, q2) {//q1 + q2 - By Reference
        q1[0]+=q2[0];
        q1[1]+=q2[1];
        q1[2]+=q2[2];
        q1[3]+=q2[3];
        return q1;
    }
    static Sub(q1, q2) {//q1 - q2
        return [
            q1[0]-q2[0],
            q1[1]-q2[1],
            q1[2]-q2[2],
            q1[3]-q2[3],
        ];
    }
    static SubR(q1, q2) {//q1 - q2 - By Reference
        q1[0]-=q2[0];
        q1[1]-=q2[1];
        q1[2]-=q2[2];
        q1[3]-=q2[3];
        return q1;
    }
    static ScalarMult(s, q) {// s * q
        return [
            q1[0]*s,
            q1[1]*s,
            q1[2]*s,
            q1[3]*s,
        ];
    }
    static ScalarMultR(s, q) {// s * q - By Reference
        q1[0]*=s;
        q1[1]*=s;
        q1[2]*=s;
        q1[3]*=s;
        return q1;
    }
    static Clamp(value, min, max) {
        if(value < min) {
            return min;
        }
        if(value > max) {
            return max;
        }
        return value;
    }
    static ToEulerRad(q) {
        return [
            Math.asin(Quaternion.Clamp(2*(q[0]*q[2] - q[3]*q[1]), -1, 1)),
            Math.atan2(2*(q[0]*q[1] + q[2]*q[3]), 1 - 2*(q[1]*q[1] + q[2]*q[2])),
            Math.atan2(2*(q[0]*q[2] + q[1]*q[2], 1 - 2*(q[2]*q[2] + q[3]*q[3])))
        ]
    }
    static ToEulerDeg(q) {
        return [
            Math.asin(Quaternion.Clamp(2*(q[0]*q[2] - q[3]*q[1]), -1, 1))*180/Math.PI,
            Math.atan2(2*(q[0]*q[1] + q[2]*q[3]), 1 - 2*(q[1]*q[1] + q[2]*q[2]))*180/Math.PI,
            Math.atan2(2*(q[0]*q[2] + q[1]*q[2], 1 - 2*(q[2]*q[2] + q[3]*q[3])))*180/Math.PI
        ]
    }
    static FromEulerRad(rot) { //rot is 3d vector of values
        let cr1 = Math.cos(rot[0]/2);
        let cr2 = Math.sin(rot[0]/2);
        let cp1 = Math.cos(rot[1]/2);
        let cp2 = Math.sin(rot[1]/2);
        let cy1 = Math.cos(rot[2]/2);
        let cy2 = Math.sin(rot[2]/2);

        return [
            cr1*cp1*cy1 + cr2*cp2*cy2, //x
            cr2*cp1*cy1 - cr*cp2*cy2, //y
            cr1*cp2*cy + cr2*cp1*cy2, //z
            cr1*cp1*cy2 - cr2*cp2*cy1 //w
        ];
    }
    static FromEulerRad(rot) { //rot is 3d vector of values
        let cr1 = Math.cos(rot[0]/90/Math.PI);
        let cr2 = Math.sin(rot[0]/90/Math.PI);
        let cp1 = Math.cos(rot[1]/90/Math.PI);
        let cp2 = Math.sin(rot[1]/90/Math.PI);
        let cy1 = Math.cos(rot[2]/90/Math.PI);
        let cy2 = Math.sin(rot[2]/90/Math.PI);

        return [
            cr1*cp1*cy1 + cr2*cp2*cy2, //x
            cr2*cp1*cy1 - cr*cp2*cy2, //y
            cr1*cp2*cy + cr2*cp1*cy2, //z
            cr1*cp1*cy2 - cr2*cp2*cy1 //w
        ];
    }
}