import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:user/api/api_config.dart';
import 'package:user/api/auth_storage.dart';

class VehicleItem {
  const VehicleItem({
    required this.id,
    required this.type,
    required this.brand,
    required this.model,
    required this.plateNumber,
  });

  final String id;
  final String type;
  final String brand;
  final String model;
  final String plateNumber;
}

class VehicleApiException implements Exception {
  VehicleApiException(this.message, {this.statusCode});

  final String message;
  final int? statusCode;

  @override
  String toString() => message;
}

class VehicleApi {
  VehicleApi._();

  static Uri _uri(String path) => ApiConfig.httpUri(path);

  static Future<List<VehicleItem>> getMyVehicles() async {
    final userId = await _requireUserId();
    final res = await http.get(_uri('/api/users/$userId/vehicles')).timeout(const Duration(seconds: 30));
    final body = _decodeJson(res.body);
    if (res.statusCode != 200 || body['success'] != true) {
      throw VehicleApiException(
        body['message']?.toString() ?? 'Failed to load vehicles',
        statusCode: res.statusCode,
      );
    }
    final data = body['data'];
    if (data is! List) return const [];
    return data.map((e) {
      final map = e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{};
      return VehicleItem(
        id: map['_id']?.toString() ?? '',
        type: map['type']?.toString() ?? 'Unknown',
        brand: map['brand']?.toString() ?? '',
        model: map['model']?.toString() ?? '',
        plateNumber: map['plate_number']?.toString() ?? '',
      );
    }).toList();
  }

  static Future<void> addMyVehicle({
    required String type,
    required String brand,
    required String model,
    required String plateNumber,
  }) async {
    final userId = await _requireUserId();
    final res = await http
        .post(
          _uri('/api/users/$userId/vehicles'),
          headers: {'Content-Type': 'application/json; charset=utf-8'},
          body: jsonEncode({
            'type': type,
            'brand': brand.trim(),
            'model': model.trim(),
            'plate_number': plateNumber.trim(),
          }),
        )
        .timeout(const Duration(seconds: 30));
    final body = _decodeJson(res.body);
    if (res.statusCode != 201 || body['success'] != true) {
      throw VehicleApiException(
        body['message']?.toString() ?? 'Failed to add vehicle',
        statusCode: res.statusCode,
      );
    }
  }

  static Future<String> _requireUserId() async {
    final token = await AuthStorage.readToken();
    if (token == null || token.isEmpty) {
      throw VehicleApiException('No auth token. Please login again.');
    }
    final parts = token.split('.');
    if (parts.length < 2) {
      throw VehicleApiException('Invalid auth token.');
    }
    final normalized = base64Url.normalize(parts[1]);
    final payload = jsonDecode(utf8.decode(base64Url.decode(normalized)));
    final map = payload is Map ? Map<String, dynamic>.from(payload) : <String, dynamic>{};
    final userId = map['userId']?.toString();
    if (userId == null || userId.isEmpty) {
      throw VehicleApiException('Cannot resolve user id from token.');
    }
    return userId;
  }

  static Map<String, dynamic> _decodeJson(String raw) {
    if (raw.isEmpty) return {};
    try {
      final decoded = jsonDecode(raw);
      if (decoded is Map<String, dynamic>) return decoded;
      if (decoded is Map) return Map<String, dynamic>.from(decoded);
    } catch (_) {}
    return {};
  }
}
