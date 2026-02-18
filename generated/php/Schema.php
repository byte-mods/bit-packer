<?php
// --- Models ---

class Player {
    public $name;
    public $level;
    public $inventory;
    
}


class Codec {
    const VERSION = "1.2.2";


    public static function encodePlayer($obj) {
        $d = "";
        // 1. Write Version
        $d .= pack("N", strlen(self::VERSION)) . self::VERSION;

        // 2. Write Fields
        
        
        $d .= pack('N', strlen($obj->name)) . $obj->name;
        
        
        
        $d .= pack('N', $obj->level);
        
        
        
        $d .= pack("N", count($obj->inventory));
        foreach($obj->inventory as $item) {
            $d .= pack('N', strlen(item)) . item;
        }
        
        
        return gzcompress($d);
    }

    public static function decodePlayer($data) {
        $data = gzuncompress($data);
        $offset = 0;
        
        // 1. Check Version
        $vLen = unpack("N", substr($data, $offset, 4))[1]; $offset+=4;
        $vStr = substr($data, $offset, $vLen); $offset+=$vLen;
        if ($vStr !== self::VERSION) {
            throw new Exception("Version Mismatch: Expected " . self::VERSION . ", got " . $vStr);
        }

        $obj = new Player();
        
        
        $len = unpack('N', substr($data, $offset, 4))[1]; $offset+=4; $obj->name = substr($data, $offset, $len); $offset+=$len;
        
        
        
        $obj->level = unpack('N', substr($data, $offset, 4))[1]; $offset+=4;
        
        
        
        $count = unpack("N", substr($data, $offset, 4))[1]; $offset+=4;
        $obj->inventory = [];
        for($i=0; $i<$count; $i++) {
            $len = unpack('N', substr($data, $offset, 4))[1]; $offset+=4; val = substr($data, $offset, $len); $offset+=$len;
            $obj->inventory[] = $val;
        }
        
        
        return $obj;
    }

}
