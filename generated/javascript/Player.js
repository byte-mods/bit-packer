
const SCHEMA_VERSION = "1.2.2";


class Player {
    constructor() {
        this.name = '';
        this.level = 0;
        this.inventory = [];
        
    }
    
    static _wInt(buf, v) { buf.push((v>>24)&0xFF, (v>>16)&0xFF, (v>>8)&0xFF, v&0xFF); }
    static _wStr(buf, s) {
        const b = new TextEncoder().encode(s);
        this._wInt(buf, b.length);
        b.forEach(x => buf.push(x));
    }
    static _rInt(d, pos) { 
        const v = (d[pos]<<24) | (d[pos+1]<<16) | (d[pos+2]<<8) | d[pos+3];
        return { val: v, newPos: pos+4 };
    }
    static _rStr(d, pos) {
        const lenObj = this._rInt(d, pos);
        pos = lenObj.newPos;
        const s = new TextDecoder().decode(d.slice(pos, pos+lenObj.val));
        return { val: s, newPos: pos+lenObj.val };
    }

    encode() {
        const buf = [];
        Player._wStr(buf, SCHEMA_VERSION);

        
        
        {{.Name}}._wStr(buf, this.name);
        
        
        
        {{.Name}}._wInt(buf, this.level);
        
        
        
        inventory._wInt(buf, this.inventory.length);
        this.inventory.forEach(item => {
            {{.Name}}._wStr(buf, item);
        });
        
        
        return new Uint8Array(buf);
    }
    
    static decode(data) {
        let pos = 0;
        const vObj = this._rStr(data, pos);
        pos = vObj.newPos;
        
        if (vObj.val !== SCHEMA_VERSION) {
            throw new Error("Version Mismatch: Expected " + SCHEMA_VERSION + ", got " + vObj.val);
        }

        const obj = new Player();
        
        
        const obj.nameObj = this._rStr(data, pos); pos = obj.nameObj.newPos; const val = obj.nameObj.val;
        
        
        
        const obj.levelObj = this._rInt(data, pos); pos = obj.levelObj.newPos; const val = obj.levelObj.val;
        
        
        
        const inventoryLenObj = this._rInt(data, pos);
        pos = inventoryLenObj.newPos;
        obj.inventory = [];
        for(let i=0; i<inventoryLenObj.val; i++) {
            const valObj = this._rStr(data, pos); pos = valObj.newPos; const val = valObj.val;
            obj.inventory.push(val);
        }
        
        
        return obj;
    }
}

module.exports = { Player,  };
