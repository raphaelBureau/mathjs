//new and improved Vertex3D class
//this class focuses mainly on improving readability
//all static function names are a 3 letter word + (Axis if required) + suffix
//suffixes are R = ref, apply transformation on vector reference, the function returns the reference
//L, apply transformation to a list/array
//C, center transformation around point, if not specified all transformations are done around [0,0];
//Axis is one the the 3 basis vectors X, Y, Z
//you can combine suffixes in the following order R > L > C
//function names start with a capital and all suffixes are caps
//ex: V3D.AddRL(vecArray,vec2); : translate each vector in the array by reference by vec2
//functions that require scalars have the scalar term before the vector
//this is to improve readability
//ex: V3D.SclR(5,V3D.Sub(vec1,vec2)); 
//: scales by a factor of 5 the reference of the new vector created by translating vec1 by the inverse of vec2
//if you imbrick multiple functions you should use the R suffix to avoid unecessary array declarations
//ex: V3D.SclR(deltaTime,V3D.AddR(V3D.Scl(deltaTime/2,this.acceleration),this.velocity))
//here, V3D.Scl returns a new vector array. AddR and SclR recycle the same array and saves 2 array declarations
export class V3D {
    static Unv(vec) { //get unit vector/normalized vector
        let magnitude = V3D.Mag(vec);
        if(magnitude == 0) {
            return [0,0,0];//prevent DivideByZero
        }
        return [vec[0] / magnitude, vec[1] / magnitude, vec[2] / magnitude];
    }
    static UnvR(vec) { //get unit vector/normalized vector
        let magnitude = V3D.Mag(vec);
        if(magnitude == 0) {
            return vec;//prevent DivideByZero
        }
        return V3D.SclR(1/magnitude,vec);
    }
    static UnvRL(vecList) { //get unit vector/normalized vector
        let len = vecList.length;
        for(let i =0; i<len;i++) {
        let magnitude = V3D.Mag(vecList[i]);
        if(magnitude == 0) {
            break;//prevent DivideByZero
        }
        V3D.SclR(1/magnitude,vecList[i]);
    }
        return vecList;
    }
    static UnvL(vecList) { //get unit vector/normalized vector
        let len = vecList.length;
        let result = new Array(len);
        for(let i =0; i<len;i++) {
        let magnitude = V3D.Mag(vecList[i]);
        if(magnitude == 0) {
            break;//prevent DivideByZero
        }
        result[i] = V3D.Scl(1/magnitude,vecList[i]);
    }
        return result;
    }
    static Mag(vec) { //magnitude
        return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
    }
    static Msq(vec) { //squared magnitude
        return vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2];
    }
    static SetMagnitudeRef(vec,target) {
        V3D.SclR(target/V3D.Mag(vec),vec);
    }
    static Set(target, vec) { //sets the magnitude
        let scale = target/V3D.Mag(vec);
        return V3D.Scl(scale,vec);
    }
    static SetR(target, vec) { //sets the magnitude
        let scale = target/V3D.Mag(vec);
        return V3D.SclR(scale,vec);
    }
    static SetRL(target, vecList) { //sets the magnitude
        let len = vec.length;
        for(let i =0; i< len; i++) {
        let scale = target/V3D.Mag(vec);
        V3D.SclR(scale,vecList[i]);
        }
        return vecList;
    }
    static SetL(target, vecList) { //sets the magnitude
        let len = vec.length;
        let result = new Array(len);
        for(let i =0; i< len; i++) {
        let scale = target/V3D.Mag(vec);
        result[i] = V3D.Scl(scale,vecList[i]);
        }
        return result;
    }
    static Max(target, vec) { //if vector magnitude is above the target set the magnitude to the target
        if(V3D.Msq(vec) > target*target) {
            return V3D.Set(target,vec);
        }
        return V3D.Cpy(vec);
    }
    static MaxR(target, vec) { //if vector magnitude is above the target set the magnitude to the target
        if(V3D.Msq(vec) > target*target) {
            return V3D.SetR(target,vec);
        }
        return vec;
    }
    static MaxRL(target, vecList) { //if vector magnitude is above the target set the magnitude to the target
        let len = vec.length;
        for(let i=0; i<len; i++) {
        if(V3D.Msq(vecList[i]) > target*target) {
            V3D.SetR(target,vecList[i]);
        }
        }
        return vecList;
    }
    static MaxL(target, vecList) { //if vector magnitude is above the target set the magnitude to the target
        let len = vec.length;
        let result = new Array(len);
        for(let i=0; i<len; i++) {
        if(V3D.Msq(vecList[i]) > target*target) {
            result[i] = V3D.Set(target,vecList[i]);
        }else{
            result[i] = V3D.Cpy(vecList[i]);
        }
        }
        return result;
    }
    static Scl(factor, vec) { //scales vector by factor
        return [vec[0] * factor, vec[1] * factor, vec[2] * factor];
    }
    static SclR(factor, vec) {  //scales vector by factor
        vec[0] *= factor;
        vec[1] *= factor;
        vec[2] *= factor;
        return vec;
    }
    static SclRL(factor, vecList) {  //scales vector by factor
        let len = vecList.length;
        for(let i=0; i<len; i++) {
        vecList[i][0] *= factor;
        vecList[i][1] *= factor;
        vecList[i][2] *= factor;
        }
        return vecList;
    }
    static SclC(factor, center, vec) { //scales vector by factor around center
        return [(vec[0]-center[0]) * factor + center[0], (vec[1]-center[1]) * factor + center[1], (vec[2]-center[2]) * factor + center[2]];
    }
    static SclRC(factor, center, vec) {  //scales vector by factor around center
        vec[0] = (vec[0]-center[0]) * factor + center[0];
        vec[1] = (vec[1]-center[1]) * factor + center[1];
        vec[2] = (vec[2]-center[2]) * factor + center[2];
        return vec;
    }
    static SclRLC(factor, center, vecList) {  //scales vector by factor around center
        let len = vecList.length;
        for(let i =0; i<len;i++) {
            vecList[i][0] = (vecList[i][0]-center[0]) * factor + center[0];
            vecList[i][1] = (vecList[i][1]-center[1]) * factor + center[1];
            vecList[i][2] = (vecList[i][2]-center[2]) * factor + center[2];
        }
        return vecList;
    }
    static SclL(factor, vecList) {//scales vector by factor
        let len = vecList.length;
        let result = new Array(len);
        for(let i =0; i<len;i++) {
            result[i][0] = vecList[i][0] * factor;
            result[i][1] = vecList[i][1] * factor;
            result[i][2] = vecList[i][2] * factor;
        }
        return result;
    }
    static SclLC(factor, center, vecList) {//scales vector by factor around center
        let len = vecList.length;
        let result = new Array(len);
        for(let i =0; i<len;i++) {
            result[i][0] = (vecList[i][0]-center[0]) * factor + center[0];
            result[i][1] = (vecList[i][1]-center[1]) * factor + center[1];
            result[i][2] = (vecList[i][2]-center[2]) * factor + center[2];
        }
        return result;
    }
    static Add(vec1,vec2) { //translates vector
        return [vec1[0]+vec2[0],vec1[1]+vec2[1],vec1[2]+vec2[2]];
    }
    static AddR(vec1,vec2) { //translates vector
        vec1[0]+=vec2[0];
        vec1[1]+=vec2[1];
        vec1[2]+=vec2[2];
        return vec1;
    }
    static AddRL(vecList,vec2) { //translates vector
        let len = vecList.length;
        for(let i=0; i<len;i++) {
            vecList[i][0]+=vec2[0];
            vecList[i][1]+=vec2[1];
            vecList[i][2]+=vec2[2];
        }
        return vecList;
    }
    static AddL(vecList,vec2) { //translates vector
        let len = vecList.length;
        let result = new Array(len);
        for(let i=0; i<len;i++) {
            result[i] = [vecList[i][0] + vec2[0],vecList[i][1] + vec2[1], vecList[i][2] + vec2[2]];
        }
        return result;
    }
    static Sub(vec1,vec2) { //translates vector by inverse of vec2
        return [vec1[0]-vec2[0],vec1[1]-vec2[1],vec1[2]-vec2[2]];
    }
    static SubR(vec1,vec2) { //translates vector by inverse of vec2
        vec1[0]-=vec2[0];
        vec1[1]-=vec2[1];
        vec1[2]-=vec2[2];
        return vec1;
    }
    static SubR2(vec1, vec2) {//if you want to only modify the secnond value you can
        vec2[0]=vec1[0] - vec2[0];
        vec2[1]=vec1[1] - vec2[1];
        vec2[2]=vec1[2] - vec2[2];
        return vec2;
    }
    static SubRL(vecList,vec2) { //translates vector by inverse of vec2
        let len = vecList.length;
        for(let i=0; i<len;i++) {
            vecList[i][0]-=vec2[0];
            vecList[i][1]-=vec2[1];
            vecList[i][2]-=vec2[2];
        }
        return vecList;
    }
    static SubL(vecList,vec2) { //translates vector by inverse of vec2
        let len = vecList.length;
        let result = new Array(len);
        for(let i=0; i<len;i++) {
            result[i][0]=vecList[i][0] - vec2[0];
            result[i][1]=vecList[i][1] - vec2[1];
            result[i][1]=vecList[i][2] - vec2[2];
        }
        return result;
    }
    static Inv(vec) { //inverses vec, same as scaling by -1;
        return[-vec[0], -vec[1], -vec[2]];
    }
    static InvR(vec) { //inverses vec, same as scaling by -1;
        vec[0] = -vec[0];
        vec[1] = -vec[1];
        vec[2] = -vec[2];
        return vec;
    }
    static InvRL(vecList) {//inverses vec, same as scaling by -1;
        let len = vecList.length;
        for(let i =0; i<len;i++) {
            vecList[i][0] = -vecList[i][0];
            vecList[i][1] = -vecList[i][1];
            vecList[i][2] = -vecList[i][2];
        }
        return vecList;
    }
    static InvL(vecList) {//inverses vec, same as scaling by -1;
        let len = vecList.length;
        let result = new Array(len);
        for(let i =0; i<len;i++) {
            result[i][0] = -vecList[i][0];
            result[i][1] = -vecList[i][1];
            result[i][2] = -vecList[i][2];
        }
        return result;
    }
    static Cpy(vec1) {
        return[vec1[0], vec1[1], vec1[2]];
    }
    static CpyL(vecList) {
        let len = vecList.length;
        let result = new Array(len);
        for(let i =0; i<len; i++) {
            result[i] = [vecList[i][0], vecList[i][1], vecList[i][2]];
        }
        return result;
    }
    static Dot(vec1, vec2) {
        return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
    }
    static Crp(vec1, vec2) {//cross product of vec1 x vec2, if you only want the z component use V2D.Crz(vec1,vec2)
        return [vec1[1] * vec2[2] - vec1[2] * vec2[1],
                vec1[2] * vec2[0] - vec1[0] * vec2[2],
                vec1[0] * vec2[1] - vec1[1] * vec2[0]];
    }
    static Ang(vec1,vec2) {//returns the angle between two vectors
        //both vectors should already be normalised
        return Math.acos(V3D.Dot(vec1,vec2));
    }
    static AngN(vec1,vec2) {//returns the angle between two vectors
        return Math.acos(V3D.Dot(V3D.Unv(vec1),V3D.Unv(vec2)));
    }
    static AngX(vec1) {//returns the angle between the vector and x
        //vec1 should already be normalised
        return Math.acos(vec1[0]);
    }
    static AngXN(vec1) {//returns the angle between the vector and x
        return Math.acos(V3D.Unv(vec1)[0]);
    }
    static AngY(vec1) {//returns the angle between the vector and y
        //vec1 should already be normalised
        return Math.acos(vec1[1]);
    }
    static AngYN(vec1) {//returns the angle between the vector and x
        return Math.acos(V3D.Unv(vec1)[1]);
    }
    static AngZ(vec1) {//returns the angle between the vector and z
        //vec1 should already be normalised
        return Math.acos(vec1[2]);
    }
    static AngZN(vec1) {//returns the angle between the vector and x
        return Math.acos(V3D.Unv(vec1)[2]);
    }
    static Prj(vec1,vec2) { //projects vec1 onto vec2
        let dot = V3D.Dot(vec1,vec2);
        return [vec2[0]*dot, vec2[1]*dot, vec1[2]*dot];
    }
    static PrjR(vec1,vec2) { //projects vec1 onto vec2
        let dot = V3D.Dot(vec1,vec2);
        vec1[0] = vec2[0]*dot;
        vec1[1] = vec2[1]*dot;
        vec1[2] = vec2[2]*dot;
        return vec1;
    }
    static PrjRL(vecList,vec2) { //projects vec1 onto vec2
        let dot;
        let len = vecList.length;
        for(let i=0; i<len;i++) {
            dot = V3D.Dot(vecList[i],vec2);
            vecList[i][0] = vec2[0] * dot;
            vecList[i][1] = vec2[1] * dot;
            vecList[i][1] = vec2[2] * dot;
        }
        return vecList;
    }
    static PrjL(vecList,vec2) { //projects vec1 onto vec2
        let dot;
        let len = vecList.length;
        let result = new Array(len);
        for(let i=0;i<len;i++) {
            dot = V3D.Dot(vecList[i],vec2);
            result[i] = [vec2[0]*dot, vec2[1]*dot, vec2[2]*dot]
        }
        return result;
    }
    static RotX(rad, vec) { //rotate vectour around x axis
        let result = [vec[0], 0, 0];
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        result[1] = vec[1] * cos - vec[2] * sin;
        result[2] = vec[1] * sin + vec[2] * cos;

        return result;
    }
    static RotXR(rad, vec) { //rotate vectour around x axis
        let y = vec[1];
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        vec[1] = y * cos - vec[2] * sin;
        vec[2] = y * sin + vec[2] * cos;

        return vec;
    }
    static RotXRL(rad, vecList) { //rotate vectour around x axis
        let len = vecList.length;
        let y;
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        for(let i =0; i< len; i++) {
            y = vecList[i][1];
            vecList[i][1] = y * cos - vecList[i][2] * sin;
            vecList[i][2] = y * sin + vecList[i][2] * cos;
        }

        return vecList;
    }
    static RotXL(rad, vecList) { //rotate vectour around x axis
        let len = vecList.length;
        let result = new Array(len);
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        for(let i =0; i< len; i++) {
            result[i] = [vecList[i][0],
                         vecList[i][1] * cos - vecList[i][2] * sin,
                         vecList[i][1] * sin + vecList[i][2] * cos];
        }
        return result;
    }
    static RotXC(rad, center, vec) { //rotate vectour around x axis
        let result = [vec[0], 0, 0];
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        let cy = (vec[1] - center[1]);
        let cz = (vec[2] - center[2]);
        result[1] = cy * cos - cz * sin + center[1];
        result[2] = cy * sin + cz * cos + center[2];

        return result;
    }
    static RotXRC(rad, center, vec) { //rotate vectour around x axis
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        let cy = (vec[1] - center[1]);
        let cz = (vec[2] - center[2]);
        vec[1] = cy * cos - cz * sin + center[1];
        vec[2] = cy * sin + cz * cos + center[2];

        return vec;
    }
    static RotXRLC(rad, center, vecList) { //rotate vectour around x axis
        let len = vecList.length;
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        let cy;
        let cz;
        for(let i =0; i< len; i++) {
            cy = (vecList[i][1] - center[1]);
            cz = (vecList[i][2] - center[2]);
            vecList[i][1] = cy * cos - cz * sin + center[1];
            vecList[i][2] = cy * sin + cz * cos + center[2];
        }

        return vecList;
    }
    static RotXLC(rad, center, vecList) { //rotate vectour around x axis
        let len = vecList.length;
        let result = new Array(len);
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        let cy;
        let cz;
        for(let i =0; i< len; i++) {
            cy = (vecList[i][1] - center[1]);
            cz = (vecList[i][2] - center[2]);
            result[i] = [vecList[i][0],
                         cy * cos - cz * sin + center[1],
                         cy * sin + cz * cos + center[2]];
        }
        return result;
    }
    static RotY(rad, vec) { //rotate vectour around y axis
        let result = [0, vec[1], 0];
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        result[2] = vec[2] * cos - vec[0] * sin;
        result[0] = vec[2] * sin + vec[0] * cos;

        return result;
    }
    static RotYR(rad, vec) { //rotate vectour around y axis
        let z = vec[2];
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        vec[2] = z * cos - vec[0] * sin;
        vec[0] = z * sin + vec[0] * cos;

        return vec;
    }
    static RotYRL(rad, vecList) { //rotate vectour around y axis
        let len = vecList.length;
        let z;
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        for(let i =0; i< len; i++) {
            z = vecList[i][2];
            vecList[i][2] = z * cos - vecList[i][0] * sin;
            vecList[i][0] = z * sin + vecList[i][0] * cos;
        }

        return vecList;
    }
    static RotXL(rad, vecList) { //rotate vectour around y axis
        let len = vecList.length;
        let result = new Array(len);
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        for(let i =0; i< len; i++) {
            result[i] = [vecList[i][2] * sin + vecList[i][0] * cos,
                         vecList[i][1],
                         vecList[i][2] * cos - vecList[i][0] * sin];
        }
        return result;
    }
    static RotYC(rad, center, vec) { //rotate vectour around y axis
        let result = [0, vec[1], 0];
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        let cx = (vec[0] - center[0]);
        let cz = (vec[2] - center[2]);
        result[2] = cz * cos - cx * sin + center[2];
        result[0] = cz * sin + cx * cos + center[0];

        return result;
    }
    static RotYRC(rad, center, vec) { //rotate vectour around y axis
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        let cx = (vec[0] - center[0]);
        let cz = (vec[2] - center[2]);
        vec[2] = cz * cos - cx * sin + center[2];
        vec[0] = cz * sin + cx * cos + center[0];

        return vec;
    }
    static RotYRLC(rad, center, vecList) { //rotate vectour around y axis
        let len = vecList.length;
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        let cx;
        let cz;
        for(let i =0; i< len; i++) {
            cx = (vecList[i][0] - center[0]);
            cz = (vecList[i][2] - center[2]);
            vecList[i][2] = cz * cos - cx * sin + center[2];
            vecList[i][0] = cz * sin + cx * cos + center[0];
        }

        return vecList;
    }
    static RotYLC(rad, center, vecList) { //rotate vectour around y axis
        let len = vecList.length;
        let result = new Array(len);
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        let cx;
        let cz;
        for(let i =0; i< len; i++) {
            cx = (vecList[i][0] - center[0]);
            cz = (vecList[i][2] - center[2]);
            result[i] = [cz * sin + cx * cos + center[0],
                         vecList[i][1],
                         cz * cos - cx * sin + center[2]];
        }
        return result;
    }
    static RotZ(rad, vec) { //rotate vectour around y axis
        let result = [0, 0, vec[2]];
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        result[0] = vec[0] * cos - vec[1] * sin;
        result[1] = vec[0] * sin + vec[1] * cos;

        return result;
    }
    static RotZR(rad, vec) { //rotate vectour around y axis
        let x = vec[0];
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        vec[0] = x * cos - vec[1] * sin;
        vec[1] = x * sin + vec[1] * cos;

        return vec;
    }
    static RotZRL(rad, vecList) { //rotate vectour around y axis
        let len = vecList.length;
        let x;
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        for(let i =0; i< len; i++) {
            x = vecList[i][0];
            vecList[i][0] = x * cos - vecList[i][1] * sin;
            vecList[i][1] = x * sin + vecList[i][1] * cos;
        }

        return vecList;
    }
    static RotZL(rad, vecList) { //rotate vectour around y axis
        let len = vecList.length;
        let result = new Array(len);
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        for(let i =0; i< len; i++) {
            result[i] = [vecList[i][0] * cos - vecList[i][1] * sin,
                         vecList[i][0] * sin + vecList[i][1] * cos,
                         vecList[i][2]];
        }
        return result;
    }
    static RotZC(rad, center, vec) { //rotate vectour around y axis
        let result = [0, 0, vec[2]];
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        let cx = (vec[0] - center[0]);
        let cy = (vec[1] - center[1]);
        result[0] = cx * cos - cy * sin + center[0];
        result[1] = cx * sin + cy * cos + center[1];

        return result;
    }
    static RotZRC(rad, center, vec) { //rotate vectour around y axis
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        let cx = (vec[0] - center[0]);
        let cy = (vec[1] - center[1]);
        vec[0] = cx * cos - cy * sin + center[0];
        vec[1] = cx * sin + cy * cos + center[1];

        return vec;
    }
    static RotZRLC(rad, center, vecList) { //rotate vectour around y axis
        let len = vecList.length;
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        let cx;
        let cy;
        for(let i =0; i< len; i++) {
            cx = (vecList[i][0] - center[0]);
            cy = (vecList[i][1] - center[1]);
            vecList[i][0] = cx * cos - cy * sin + center[0];
            vecList[i][1] = cx * sin + cy * cos + center[1];
        }

        return vecList;
    }
    static RotZLC(rad, center, vecList) { //rotate vectour around y axis
        let len = vecList.length;
        let result = new Array(len);
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        let cx;
        let cy;
        for(let i =0; i< len; i++) {
            cx = (vecList[i][0] - center[0]);
            cy = (vecList[i][1] - center[1]);
            result[i] = [cx * cos - cy * sin + center[0],
                         cx * sin + cy * cos + center[1],
                         vecList[i][2]];
        }
        return result;
    }
}