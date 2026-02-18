import struct
import zlib

VERSION = "1.2.2"


class Player:
    def __init__(self):
        self.name = ''
        self.level = 0
        self.inventory = []
        

    def encode(self):
        d = bytearray()
        
        v_bytes = VERSION.encode('utf-8')
        d.extend(struct.pack('>i', len(v_bytes)))
        d.extend(v_bytes)

        
        
        b = self.name.encode('utf-8'); d.extend(struct.pack('>i', len(b))); d.extend(b)
        
        
        
        d.extend(struct.pack('>i', self.level))
        
        
        
        d.extend(struct.pack('>i', len(self.inventory)))
        for item in self.inventory:
            b = item.encode('utf-8'); d.extend(struct.pack('>i', len(b))); d.extend(b)
        
        
        return zlib.compress(d)

    @staticmethod
    def decode(data):
        data = zlib.decompress(data)
        obj = Player()
        offset = 0
        
        v_len = struct.unpack_from('>i', data, offset)[0]
        offset += 4
        v_str = data[offset:offset+v_len].decode('utf-8')
        offset += v_len
        
        if v_str != VERSION:
            raise Exception(f"Version Mismatch: Expected {VERSION}, got {v_str}")

        
        
        slen = struct.unpack_from('>i', data, offset)[0]; offset+=4; val = data[offset:offset+slen].decode('utf-8'); offset+=slen
        obj.name = val
        
        
        
        val = struct.unpack_from('>i', data, offset)[0]; offset+=4
        obj.level = val
        
        
        
        arr_len = struct.unpack_from('>i', data, offset)[0]
        offset += 4
        obj.inventory = []
        for _ in range(arr_len):
            slen = struct.unpack_from('>i', data, offset)[0]; offset+=4; val = data[offset:offset+slen].decode('utf-8'); offset+=slen
            obj.inventory.append(val)
        
        
        return obj

