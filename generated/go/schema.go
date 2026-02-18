package generated

import (
	"bytes"
	"encoding/binary"
	"compress/zlib"
	"fmt"
	"io"
	"errors"
)

const SchemaVersion = "1.2.2"

// --- Models ---

type Player struct {
	Name string
	Level int32
	Inventory []string
	
}


// --- Serialization ---
type Codec struct {}


// Encoder
func (c *Codec) EncodePlayer(v Player) ([]byte, error) {
	buf := new(bytes.Buffer)
	var err error
	
	// 1. Write Version
	if err = binary.Write(buf, binary.BigEndian, int32(len(SchemaVersion))); err != nil { return nil, err }
	buf.WriteString(SchemaVersion)

	// 2. Write Fields
	
	
	if err = binary.Write(buf, binary.BigEndian, int32(len(v.Name))); err != nil { return nil, err }; buf.WriteString(v.Name)
	
	
	
	if err = binary.Write(buf, binary.BigEndian, int32(v.Level)); err != nil { return nil, err }
	
	
	
	if err = binary.Write(buf, binary.BigEndian, int32(len(v.Inventory))); err != nil { return nil, err }
	for _, item := range v.Inventory {
		if err = binary.Write(buf, binary.BigEndian, int32(len(item))); err != nil { return nil, err }; buf.WriteString(item)
	}
	
	
	
	
	var b bytes.Buffer
	w := zlib.NewWriter(&b)
	if _, err := w.Write(buf.Bytes()); err != nil { return nil, err }
	w.Close()
	return b.Bytes(), nil
	
}

// Decoder
func (c *Codec) DecodePlayer(data []byte) (Player, error) {
	var v Player
	
	r, err := zlib.NewReader(bytes.NewReader(data))
	if err != nil { return v, err }
	defer r.Close()
	raw, _ := io.ReadAll(r)
	buf := bytes.NewReader(raw)
	
	
	// 1. Validate Version
	var vLen int32
	if err := binary.Read(buf, binary.BigEndian, &vLen); err != nil { return v, err }
	vBytes := make([]byte, vLen)
	if _, err := buf.Read(vBytes); err != nil { return v, err }
	if string(vBytes) != SchemaVersion {
		return v, fmt.Errorf("version mismatch: expected %s, got %s", SchemaVersion, string(vBytes))
	}

	// 2. Read Fields
	
	
	var NameLen int32; binary.Read(buf, binary.BigEndian, &NameLen); sb := make([]byte, NameLen); buf.Read(sb); v.Name = string(sb)
	
	
	
	binary.Read(buf, binary.BigEndian, &v.Level)
	
	
	
	var inventoryLen int32
	if err := binary.Read(buf, binary.BigEndian, &inventoryLen); err != nil { return v, err }
	v.Inventory = make([]string, inventoryLen)
	for i := 0; i < int(inventoryLen); i++ {
		var InventoryLen int32; binary.Read(buf, binary.BigEndian, &InventoryLen); sb := make([]byte, InventoryLen); buf.Read(sb); v.Inventory[i] = string(sb)
	}
	
	
	
	return v, nil
}

