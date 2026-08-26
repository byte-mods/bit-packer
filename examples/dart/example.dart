import 'dart/player.dart';

void main() {
  final p = Player()
    ..username = "Hero"
    ..level = 10
    ..score = 5000
    ..inventory = ["Sword", "Shield", "Potion"];

  final g = GameState()
    ..id = 1
    ..isActive = true
    ..players = [p];

  // Encode
  final data = g.encode();
  print('Encoded size: ${data.length} bytes');

  // Decode
  final decoded = GameState.decode(data);
  print('Decoded Game ID: ${decoded.id}');
  if (decoded.players.isNotEmpty) {
    print('Decoded Player: ${decoded.players[0].username} (Level ${decoded.players[0].level})');
  }
}
