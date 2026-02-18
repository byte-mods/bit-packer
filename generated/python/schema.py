import struct
import zlib

VERSION = "1.2.2"

# --- Models ---

class Player:
    def __init__(self):
        self.name = ''
        self.level = 0
        self.inventory = []
        


class Codec:

    @staticmethod
    def encode_Player(obj):
        d = bytearray()
        
        # 1. Write Version
        v_bytes = VERSION.encode('utf-8')
        d.extend(struct.pack('>i', len(v_bytes)))
        d.extend(v_bytes)

        # 2. Write Fields
        
        
        b = obj.name.encode('utf-8'); d.extend(struct.pack('>i', len(b))); d.extend(b)
        
        
        
        d.extend(struct.pack('>i', obj.level))
        
        
        
        d.extend(struct.pack('>i', len(obj.inventory)))
        for item in obj.inventory:
            b = item.encode('utf-8'); d.extend(struct.pack('>i', len(b))); d.extend(b)
        
        
        return zlib.compress(d)

    @staticmethod
    def decode_Player(data):
        data = zlib.decompress(data)
        obj = Player()
        offset = 0
        
        # 1. Check Version
        v_len = struct.unpack_from('>i', data, offset)[0]
        offset += 4
        v_str = data[offset:offset+v_len].decode('utf-8')
        offset += v_len
        
        if v_str != VERSION:
            raise Exception(f"Version Mismatch: Expected {VERSION}, got {v_str}")

        # 2. Read Fields
        
        
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

