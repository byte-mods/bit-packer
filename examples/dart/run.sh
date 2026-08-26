#!/bin/bash
set -e
echo "Generating Dart code..."
go run ../../cmd/bitpacker --file game.buff --lang dart --out .
echo "Running example..."
dart run example.dart
