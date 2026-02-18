<?php
class Player {
    const VERSION = "1.2.2";
}


class Player {
    public $name;
    public $level;
    public $inventory;
    

    public function encode() {
        $d = "";
        $v = Player::VERSION;
        $d .= pack("N", strlen($v)) . $v;

        
        
        $d .= pack('N', strlen($this->name)) . $this->name;
        
        
        
        $d .= pack('N', $this->level);
        
        
        
        $d .= pack("N", count($this->inventory));
        foreach($this->inventory as $item) {
            $d .= pack('N', strlen(item)) . item;
        }
        
        
        
        return gzcompress($d);
    }

    public static function decode($data) {
        $data = gzuncompress($data);
        $offset = 0;
        
        $vLen = unpack("N", substr($data, $offset, 4))[1]; $offset+=4;
        $vStr = substr($data, $offset, $vLen); $offset+=$vLen;
        
        if ($vStr !== Player::VERSION) {
            throw new Exception("Version Mismatch: Expected " . Player::VERSION . ", got " . $vStr);
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

