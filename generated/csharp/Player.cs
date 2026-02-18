using System;
using System.IO;
using System.Text;
using System.IO.Compression;
using System.Collections.Generic;

namespace Generated {
    public class Player {
        public const string VERSION = "1.2.2";

        static void WriteInt(BinaryWriter w, int v) { 
            byte[] b = BitConverter.GetBytes(v); 
            if (BitConverter.IsLittleEndian) Array.Reverse(b); 
            w.Write(b); 
        }
        static int ReadInt(BinaryReader r) {
            byte[] b = r.ReadBytes(4);
            if (BitConverter.IsLittleEndian) Array.Reverse(b);
            return BitConverter.ToInt32(b, 0);
        }

        
        public class Player {
            public string name { get; set; }
            public int level { get; set; }
            public string[] inventory { get; set; }
            

            public byte[] Encode() {
                using (var ms = new MemoryStream()) {
                    using (var w = new BinaryWriter(ms)) {
                        WriteInt(w, VERSION.Length);
                        w.Write(Encoding.UTF8.GetBytes(VERSION));

                        
                        
                        WriteInt(w, this.name.Length); w.Write(Encoding.UTF8.GetBytes(this.name));
                        
                        
                        
                        WriteInt(w, this.level);
                        
                        
                        
                        WriteInt(w, this.inventory.Length);
                        foreach(var item in this.inventory) {
                            WriteInt(w, item.Length); w.Write(Encoding.UTF8.GetBytes(item));
                        }
                        
                        
                    }
                    byte[] res = ms.ToArray();
                    
                    using (var outMs = new MemoryStream()) {
                        using (var zip = new GZipStream(outMs, CompressionMode.Compress)) {
                            zip.Write(res, 0, res.Length);
                        }
                        return outMs.ToArray();
                    }
                    
                }
            }

            public static Player Decode(byte[] data) {
                
                using (var inMs = new MemoryStream(data))
                using (var zip = new GZipStream(inMs, CompressionMode.Decompress))
                using (var ms = new MemoryStream()) {
                    zip.CopyTo(ms);
                    ms.Position = 0;
                    return DecodeInternal(new BinaryReader(ms));
                }
                
            }
            
            private static Player DecodeInternal(BinaryReader r) {
                int vLen = ReadInt(r);
                string vStr = Encoding.UTF8.GetString(r.ReadBytes(vLen));
                if (vStr != VERSION) {
                    throw new Exception($"Version Mismatch: Expected {VERSION}, got {vStr}");
                }

                var obj = new Player();
                
                
                int len = ReadInt(r); obj.name = Encoding.UTF8.GetString(r.ReadBytes(len));
                
                
                
                obj.level = ReadInt(r);
                
                
                
                int inventoryLen = ReadInt(r);
                obj.inventory = new string[inventoryLen];
                for (int i=0; i<inventoryLen; i++) {
                    int len = ReadInt(r); obj.inventory[i] = Encoding.UTF8.GetString(r.ReadBytes(len));
                }
                
                
                return obj;
            }
        }
        
    }
}
