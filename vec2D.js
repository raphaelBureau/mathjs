//new and improved Vertex2D class
//this class focuses mainly on improving readability
//all static function names are a 3 letter word + suffix
//suffixes are R = ref, apply transformation on vector reference, the function returns the reference
//L, apply transformation to a list/array
//C, center transformation around point, if not specified all transformations are done around [0,0];
//you can combine suffixes in the following order R > L > C
//function names start with a capital and all suffixes are caps
//ex: V3D.AddRL(vecArray,vec3); : translate each vector in the array by reference by vec3
//functions that require scalars have the scalar term before the vector
//this is to improve readability
//ex: V3D.SclR(5,V3D.Sub(vec1,vec2)); 
//: scales by a factor of 5 the reference of the new vector created by translating vec1 by the inverse of vec2
//if you imbrick multiple functions you should use the R suffix to avoid unnecessary array declarations
//ex: V2D.SclR(deltaTime,V2D.AddR(V2D.Scl(deltaTime/2,this.acceleration),this.velocity))
//here, V2D.Scl returns a new vector array. AddR and SclR recycle the same array and saves 2 declarations
export class V2D {
    static Unv(vec) { //get unit vector/normalized vector
        let magnitude = V2D.Mag(vec);
        if(magnitude == 0) {
            return [0,0];//prevent DivideByZero
        }
        return [vec[0] / magnitude, vec[1] / magnitude];
    }
    static UnvR(vec) { //get unit vector/normalized vector
        let magnitude = V2D.Mag(vec);
        if(magnitude == 0) {
            return vec;//prevent DivideByZero
        }
        return V2D.SclR(1/magnitude,vec);
    }
    static UnvRL(vecList) { //get unit vector/normalized vector
        let len = vecList.length;
        for(let i =0; i<len;i++) {
        let magnitude = V2D.Mag(vecList[i]);
        if(magnitude == 0) {
            break;//prevent DivideByZero
        }
        V2D.SclR(1/magnitude,vecList[i]);
    }
        return vecList;
    }
    static UnvL(vecList) { //get unit vector/normalized vector
        let len = vecList.length;
        let result = new Array(len);
        for(let i =0; i<len;i++) {
        let magnitude = V2D.Mag(vecList[i]);
        if(magnitude == 0) {
            break;//prevent DivideByZero
        }
        result[i] = V2D.Scl(1/magnitude,vecList[i]);
    }
        return result;
    }
    static Mag(vec) { //magnitude
        return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    }
    static Msq(vec) { //squared magnitude
        return vec[0] * vec[0] + vec[1] * vec[1];
    }
    static SetMagnitudeRef(vec,target) {
        V2D.SclR(target/V2D.Mag(vec),vec);
    }
    static Set(target, vec) { //sets the magnitude
        let scale = target/V2D.Mag(vec);
        return V2D.Scl(scale,vec);
    }
    static SetR(target, vec) { //sets the magnitude
        let scale = target/V2D.Mag(vec);
        return V2D.SclR(scale,vec);
    }
    static SetRL(target, vecList) { //sets the magnitude
        let len = vec.length;
        for(let i =0; i< len; i++) {
        let scale = target/V2D.Mag(vec);
        V2D.SclR(scale,vecList[i]);
        }
        return vecList;
    }
    static SetL(target, vecList) { //sets the magnitude
        let len = vec.length;
        let result = new Array(len);
        for(let i =0; i< len; i++) {
        let scale = target/V2D.Mag(vec);
        result[i] = V2D.Scl(scale,vecList[i]);
        }
        return result;
    }
    static Max(target, vec) { //if vector magnitude is above the target set the magnitude to the target
        if(V2D.Msq(vec) > target*target) {
            return V2D.Set(target,vec);
        }
        return V2D.Cpy(vec);
    }
    static MaxR(target, vec) { //if vector magnitude is above the target set the magnitude to the target
        if(V2D.Msq(vec) > target*target) {
            return V2D.SetR(target,vec);
        }
        return vec;
    }
    static MaxRL(target, vecList) { //if vector magnitude is above the target set the magnitude to the target
        let len = vec.length;
        for(let i=0; i<len; i++) {
        if(V2D.Msq(vecList[i]) > target*target) {
            V2D.SetR(target,vecList[i]);
        }
        }
        return vecList;
    }
    static MaxL(target, vecList) { //if vector magnitude is above the target set the magnitude to the target
        let len = vec.length;
        let result = new Array(len);
        for(let i=0; i<len; i++) {
        if(V2D.Msq(vecList[i]) > target*target) {
            result[i] = V2D.Set(target,vecList[i]);
        }else{
            result[i] = V2D.Cpy(vecList[i]);
        }
        }
        return result;
    }
    static Smm(size,vec) { //Square Min Max of a vector
        let result = V2D.Cpy(vec);
        if(result[0] > size) {
            result[0] = size;
        }
        else{
        if(result[0] < -size) {
            result[0] = -size;
        }
        }
        if(result[1] > size) {
            result[1] = size;
        }
        else{
        if(result[1] < -size) {
            result[1] = -size;
        }
        }
        return result;
    }
    static SmmR(size,vec) { //Square Min Max of a vector
        if(vec[0] > size) {
            vec[0] = size;
        }
        else{
        if(vec[0] < -size) {
            vec[0] = -size;
        }
        }
        if(vec[1] > size) {
            vec[1] = size;
        }
        else{
        if(vec[1] < -size) {
            vec[1] = -size;
        }
        }
        return vec;
    }
    static SmmRL(size,vecList) {//Square Min Max of a vector
        let len = vecList.length;
        for(let i=0; i<len; i++) {
            V2D.SmmR(size,vecList[i]);
        }
        return vecList;
    }
    static SmmL(size,vecList) {//Square Min Max of a vector
        let len = vecList.length;
        let result = new Array(len);
        for(let i=0; i<len; i++) {
            result[i] = V2D.Smm(size,vecList[i]);
        }
        return result;
    }
    static Scl(factor, vec) { //scales vector by factor
        return [vec[0] * factor, vec[1] * factor];
    }
    static SclR(factor, vec) {  //scales vector by factor
        vec[0] *= factor;
        vec[1] *= factor;
        return vec;
    }
    static SclRL(factor, vecList) {  //scales vector by factor
        let len = vecList.length;
        for(let i=0; i<len; i++) {
        vecList[i][0] *= factor;
        vecList[i][1] *= factor;
        }
        return vecList;
    }
    static SclC(factor, center, vec) { //scales vector by factor around center
        return [(vec[0]-center[0]) * factor + center[0], (vec[1]-center[1]) * factor + center[1]];
    }
    static SclRC(factor, center, vec) {  //scales vector by factor around center
        vec[0] = (vec[0]-center[0]) * factor + center[0];
        vec[1] = (vec[1]-center[1]) * factor + center[1];
        return vec;
    }
    static SclRLC(factor, center, vecList) {  //scales vector by factor around center
        let len = vecList.length;
        for(let i =0; i<len;i++) {
            vecList[i][0] = (vecList[i][0]-center[0]) * factor + center[0];
            vecList[i][1] = (vecList[i][1]-center[1]) * factor + center[1];
        }
        return vecList;
    }
    static SclL(factor, vecList) {//scales vector by factor
        let len = vecList.length;
        let result = new Array(len);
        for(let i =0; i<len;i++) {
            result[i][0] = vecList[i][0] * factor;
            result[i][1] = vecList[i][1] * factor;
        }
        return result;
    }
    static SclLC(factor, center, vecList) {//scales vector by factor around center
        let len = vecList.length;
        let result = new Array(len);
        for(let i =0; i<len;i++) {
            result[i][0] = (vecList[i][0]-center[0]) * factor + center[0];
            result[i][1] = (vecList[i][1]-center[1]) * factor + center[1];
        }
        return result;
    }
    static Add(vec1,vec2) { //translates vector
        return [vec1[0]+vec2[0],vec1[1]+vec2[1]];
    }
    static AddR(vec1,vec2) { //translates vector
        vec1[0]+=vec2[0];
        vec1[1]+=vec2[1];
        return vec1;
    }
    static AddRL(vecList,vec2) { //translates vector
        let len = vecList.length;
        for(let i=0; i<len;i++) {
            vecList[i][0]+=vec2[0];
            vecList[i][1]+=vec2[1];
        }
        return vecList;
    }
    static AddL(vecList,vec2) { //translates vector
        let len = vecList.length;
        let result = new Array(len);
        for(let i=0; i<len;i++) {
            result[i] = [vecList[i][0] + vec2[0],vecList[i][1] + vec2[1]];
        }
        return result;
    }
    static Sub(vec1,vec2) { //translates vector by inverse of vec2
        return [vec1[0]-vec2[0],vec1[1]-vec2[1]];
    }
    static SubR(vec1,vec2) { //translates vector by inverse of vec2
        vec1[0]-=vec2[0];
        vec1[1]-=vec2[1];
        return vec1;
    }
    static SubR2(vec1, vec2) {//if you want to only modify the secnond value you can
        vec2[0]=vec1[0] - vec2[0];
        vec2[1]=vec1[1] - vec2[1];
        return vec2;
    }
    static SubRL(vecList,vec2) { //translates vector by inverse of vec2
        let len = vecList.length;
        for(let i=0; i<len;i++) {
            vecList[i][0]-=vec2[0];
            vecList[i][1]-=vec2[1];
        }
        return vecList;
    }
    static SubL(vecList,vec2) { //translates vector by inverse of vec2
        let len = vecList.length;
        let result = new Array(len);
        for(let i=0; i<len;i++) {
            result[i][0]=vecList[i][0] - vec2[0];
            result[i][1]=vecList[i][1] - vec2[1];
        }
        return result;
    }
    static Inv(vec) { //inverses vec, same as scaling by -1;
        return[-vec[0], -vec[1]];
    }
    static InvR(vec) { //inverses vec, same as scaling by -1;
        vec[0] = -vec[0];
        vec[1] = -vec[1];
        return vec;
    }
    static InvRL(vecList) {//inverses vec, same as scaling by -1;
        let len = vecList.length;
        for(let i =0; i<len;i++) {
            vecList[i][0] = -vecList[i][0];
            vecList[i][1] = -vecList[i][1];
        }
        return vecList;
    }
    static InvL(vecList) {//inverses vec, same as scaling by -1;
        let len = vecList.length;
        let result = new Array(len);
        for(let i =0; i<len;i++) {
            result[i][0] = -vecList[i][0];
            result[i][1] = -vecList[i][1];
        }
        return result;
    }
    static Rot(rad, vec) {//rotates by rad
        let mCos = Math.cos(rad);
        let mSin = Math.sin(rad);
        return [mCos * vec[0] - mSin * vec[1],
                mSin * vec[0] + mCos * vec[1]];
    }
    static RotC(rad, center, vec) {//rotates around center by rad
        let mCos = Math.cos(rad);
        let mSin = Math.sin(rad);
        let cx = vec[0] - center[0];
        let cy = vec[1] - center[1];
        return [mCos * cx - mSin * cy + center[0],
                mSin * cx + mCos * cy + center[1]];
    }
    static RotR(rad, vec) {//rotates by rad
        let mCos = Math.cos(rad);
        let mSin = Math.sin(rad);
        let cx = vec[0];
        let cy = vec[1];
        vec[0] = mCos * cx - mSin * cy;
        vec[1] = mSin * cx + mCos * cy;
        return vec;
    }
    static RotRL(rad, vecList) {//rotates by rad
        let mCos = Math.cos(rad);
        let mSin = Math.sin(rad);
        let len = vecList.length;
        let cx = 0;
        let cy = 0;
        for(let i=0; i<len;i++) {
        cx = vecList[i][0];
        cy = vecList[i][1];
        vecList[i][0] = mCos * cx - mSin * cy;
        vecList[i][1] = mSin * cx + mCos * cy;
        }
        return vecList;
    }
    static RotRC(rad, center, vec) {//rotates around center by rad
        let mCos = Math.cos(rad);
        let mSin = Math.sin(rad);
        let cx = vec[0] - center[0];
        let cy = vec[1] - center[1];
        vec[0] = mCos * cx - mSin * cy + center[0]
        vec[1] = mSin * cx + mCos * cy + center[1];
        return vec;
    }
    static RotRLC(rad,center, vecList) {//rotates around center by rad
        let mCos = Math.cos(rad);
        let mSin = Math.sin(rad);
        let len = vecList.length;
        let cx = 0;
        let cy = 0;
        for(let i=0; i<len;i++) {
        cx = vecList[i][0] - center[0];
        cy = vecList[i][1] - center[1];
        vecList[i][0] = mCos * cx - mSin * cy + center[0];
        vecList[i][1] = mSin * cx + mCos * cy + center[1];
        }
        return vecList;
    }
    static RotL(rad, vecList) {//rotates by rad
        let mCos = Math.cos(rad);
        let mSin = Math.sin(rad);
        let len = vecList.length;
        let result = new Array(len);
        for(let i=0; i<len;i++) {
        result[i][0] = mCos * vecList[i][0] - mSin * vecList[i][1];
        result[i][1] = mSin * vecList[i][0] + mCos * vecList[i][1];
        }
        return result;
    }
    static RotLC(rad,center, vecList) { //rotates around center by rad
        let mCos = Math.cos(rad);
        let mSin = Math.sin(rad);
        let len = vecList.length;
        let result = new Array(len);
        let cx = 0;
        let cy = 0;
        for(let i=0; i<len;i++) {
        cx = vecList[i][0] - center[0];
        cy = vecList[i][1] - center[1];
        result[i][0] = mCos * cx - mSin * cy + center[0];
        result[i][1] = mSin * cx + mCos * cy + center[1];
        }
        return result;
    }
    static Cpy(vec) { //copy vector
        return [vec[0], vec[1]];
    }
    static CpyL(vecList) {//create new list with a deep copy of all vectors
        let len = vecList.length;
        let result = new Array(len);
        for(let i=0; i<len; i++) {
        result[i] = [vecList[i][0], vecList[i][1]];
        }
        return result;
    }
    static Nrm(vec) { //returns normal vector
        return [vec[1],-vec[0]]
    }
    static NrmR(vec) { //returns normal vector
        let x = vec[0];
        let y = vec[1];
        vec[0] = y;
        vec[1] = -x;
        return vec;
    }
    static NrmRL(vecList) { //returns normal vector
        let len = vecList.length;
        for(let i =0; i<len; i++) {
        let x = vecList[i][0];
        let y = vecList[i][1];
        vecList[i][0] = y;
        vecList[i][1] = -x;
        }
        return vecList;
    }
    static NrmL(vecList) { //returns normal vector
        let len = vecList.length;
        let result = new Array(len);
        for(let i =0; i<len; i++) {
        result[i][0] = vecList[i][1];
        result[i][1] = -vecList[i][0];
        }
        return result;
    }
    static Nrm2(vec) {//returns normal vector opposite to Nrm(vec), same as Inv(Nrm(vec)) or Scl(-1,Nrm(vec))
        return [-vec[1],vec[0]]
    }
    static Nrm2R(vec) {//returns normal vector opposite to Nrm(vec), same as Inv(Nrm(vec)) or Scl(-1,Nrm(vec))
        let x = vec[0];
        let y = vec[1];
        vec[0] = -y;
        vec[1] = x;
        return vec;
    }
    static Nrm2RL(vecList) {//returns normal vector opposite to Nrm(vec), same as Inv(Nrm(vec)) or Scl(-1,Nrm(vec))
        let len = vecList.length;
        for(let i =0; i<len; i++) {
        let x = vecList[i][0];
        let y = vecList[i][1];
        vecList[i][0] = -y;
        vecList[i][1] = x;
        }
        return vecList;
    }
    static Nrm2L(vecList) {//returns normal vector opposite to Nrm(vec), same as Inv(Nrm(vec)) or Scl(-1,Nrm(vec))
        let len = vecList.length;
        let result = new Array(len);
        for(let i =0; i<len; i++) {
        result[i][0] = -vecList[i][1];
        result[i][1] = vecList[i][0];
        }
        return result;
    }
    static Crz(vec1,vec2) { //cross-Z returns only the z component of a cross product between vec1 and vec2, works with V3D vectors
        return vec1[0]*vec2[1]-vec1[1]*vec2[0];
    }
    static Dot(vec1,vec2) {
        return vec1[0]*vec2[0]+vec1[1]*vec2[1];
    }
    static Ang(vec) {//returns angle between vector and x axis
        //vec must be already normalized
        //a dot b = cos(tetha)
        let sign = vec[1] > 0 ? 1 : -1;
        return sign * (Math.acos(vec[0]));
    }
    static AngN(vec) {//returns angle between vector and x axis
        //a dot b = cos(tetha)
        vec = V2D.Unv(vec);
        let sign = vec[1] > 0 ? 1 : -1;
        return sign * (Math.acos(vec[0]));
    }
    static AngY(vec) {//returns angle between vector and y axis
        //vec must be already normalized
        //a dot b = cos(tetha)
        let sign = vec[0] > 0 ? 1 : -1;
        return sign * (Math.acos(vec[1]));
    }
    static AngYN(vec) {//returns angle between vector and y axis
        //a dot b = cos(tetha)
        vec = V2D.Unv(vec);
        let sign = vec[0] > 0 ? 1 : -1;
        return sign * (Math.acos(vec[1]));
    }
    static DistPointLine(point,line) {//line is already normalised/unitVector
        return V2D.Dot(V2D.Nrm(line),V2D.Sub(point,line));
        //line.magnitude = 1 so dot = len
    }
    static Prj(vec1,vec2) { //projects vec1 onto vec2
        let dot = V2D.Dot(vec1,vec2);
        return [vec2[0]*dot, vec2[1]*dot];
    }
    static PrjR(vec1,vec2) { //projects vec1 onto vec2
        let dot = V2D.Dot(vec1,vec2);
        vec1[0] = vec2[0]*dot;
        vec1[1] = vec2[1]*dot;
        return vec1;
    }
    static PrjRL(vecList,vec2) { //projects vec1 onto vec2
        let dot;
        let len = vecList.length;
        for(let i=0; i<len;i++) {
            dot = V2D.Dot(vecList[i],vec2);
            vecList[i][0] = vec2[0] * dot;
            vecList[i][1] = vec2[1] * dot;
        }
        return vecList;
    }
    static PrjL(vecList,vec2) { //projects vec1 onto vec2
        let dot;
        let len = vecList.length;
        let result = new Array(len);
        for(let i=0;i<len;i++) {
            dot = V2D.Dot(vecList[i],vec2);
            result[i] = [vec2[0]*dot, vec2[1]*dot]
        }
        return result;
    }
}