package generated;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.io.ByteArrayOutputStream;
import java.util.zip.*;

public class Player {
	public static final String VERSION = "1.2.2";

	
	public static class Player {
		public String name;
		public int level;
		public String[] inventory;
		
	}
	


	public static byte[] encode(Player obj) throws Exception {
		ByteBuffer buf = ByteBuffer.allocate(8192);
		
		byte[] vBytes = VERSION.getBytes(StandardCharsets.UTF_8);
		buf.putInt(vBytes.length);
		buf.put(vBytes);

		
		
		byte[] b = obj.name.getBytes(StandardCharsets.UTF_8); buf.putInt(b.length); buf.put(b);
		
		
		
		buf.putInt(obj.level);
		
		
		
		buf.putInt(obj.inventory.length);
		for(String item : obj.inventory) {
			byte[] b = item.getBytes(StandardCharsets.UTF_8); buf.putInt(b.length); buf.put(b);
		}
		
		

		byte[] raw = new byte[buf.position()];
		buf.flip();
		buf.get(raw);
		
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		DeflaterOutputStream dos = new DeflaterOutputStream(baos);
		dos.write(raw);
		dos.close();
		return baos.toByteArray();
		
	}

	public static Player decodePlayer(byte[] data) throws Exception {
		
		ByteArrayOutputStream buffer = new ByteArrayOutputStream();
		InflaterOutputStream ios = new InflaterOutputStream(buffer);
		ios.write(data);
		ios.close();
		ByteBuffer buf = ByteBuffer.wrap(buffer.toByteArray());
		

		int vLen = buf.getInt();
		byte[] vBytes = new byte[vLen];
		buf.get(vBytes);
		String vStr = new String(vBytes, StandardCharsets.UTF_8);
		
		if (!vStr.equals(VERSION)) {
			throw new Exception("Version Mismatch: Expected " + VERSION + ", got " + vStr);
		}
		
		Player obj = new Player();
		
		
		int len = buf.getInt(); byte[] b = new byte[len]; buf.get(b); obj.name = new String(b, StandardCharsets.UTF_8);
		
		
		
		obj.level = buf.getInt();
		
		
		
		int inventoryLen = buf.getInt();
		obj.inventory = new String[inventoryLen];
		for(int i=0; i<inventoryLen; i++) {
			int len = buf.getInt(); byte[] b = new byte[len]; buf.get(b); obj.inventory[i] = new String(b, StandardCharsets.UTF_8);
		}
		
		
		return obj;
	}

}
