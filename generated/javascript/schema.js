
const SCHEMA_VERSION = "1.2.2";


class Player {
    constructor() {
        this.name = '';
        this.level = 0;
        this.inventory = [];
        
    }
}


class Codec {
    constructor() { this.buf = []; this.pos = 0; }
    
    // --- Writer ---
    _wInt(v) { this.buf.push((v>>24)&0xFF, (v>>16)&0xFF, (v>>8)&0xFF, v&0xFF); }
    _wStr(s) {
        const b = new TextEncoder().encode(s);
        this._wInt(b.length);
        b.forEach(x => this.buf.push(x));
    }
    
    // --- Reader ---
    _rInt(d) { 
        const v = (d[this.pos]<<24) | (d[this.pos+1]<<16) | (d[this.pos+2]<<8) | d[this.pos+3];
        this.pos += 4; return v;
    }
    _rStr(d) {
        const len = this._rInt(d);
        const s = new TextDecoder().decode(d.slice(this.pos, this.pos+len));
        this.pos += len; return s;
    }


    encodePlayer(obj) {
        this.buf = [];
        // 1. Write Version
        this._wStr(SCHEMA_VERSION);

        // 2. Write Fields
        
        
        this._wStr(obj.name);
        
        
        
        this._wInt(obj.level);
        
        
        
        this._wInt(obj.inventory.length);
        obj.inventory.forEach(item => {
            this._wStr(item);
        });
        
        
        return new Uint8Array(this.buf);
    }
    
    decodePlayer(data) {
        this.pos = 0;
        // 1. Check Version
        const vStr = this._rStr(data);
        if (vStr !== SCHEMA_VERSION) {
            throw new Error("Version Mismatch: Expected " + SCHEMA_VERSION + ", got " + vStr);
        }

        const obj = new Player();
        
        
        const obj.name = this._rStr(data);
        
        
        
        const obj.level = this._rInt(data);
        
        
        
        const inventoryLen = this._rInt(data);
        obj.inventory = [];
        for(let i=0; i<inventoryLen; i++) {
            const val = this._rStr(data);
            obj.inventory.push(val);
        }
        
        
        return obj;
    }

}
module.exports = { Codec, Player,  };
