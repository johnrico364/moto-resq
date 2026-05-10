import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:user/api/api_config.dart';

class TechnicianApiException implements Exception {
  TechnicianApiException(this.message, {this.statusCode});

  final String message;
  final int? statusCode;

  @override
  String toString() => message;
}

class TechnicianSummary {
  const TechnicianSummary({
    required this.id,
    required this.name,
    required this.expertise,
    required this.rating,
  });

  final String id;
  final String name;
  final String expertise;
  final String rating;
}

class TechnicianApi {
  TechnicianApi._();

  static Uri _uri(String path) => ApiConfig.httpUri(path);

  static Future<List<TechnicianSummary>> getAll() async {
    final response = await http
        .get(_uri('/api/technicians'))
        .timeout(const Duration(seconds: 30));

    final body = _decodeJson(response.body);
    if (response.statusCode != 200 || body['success'] != true) {
      throw TechnicianApiException(
        body['message']?.toString() ?? 'Failed to load technicians',
        statusCode: response.statusCode,
      );
    }

    final rawList = body['data'];
    if (rawList is! List) return const [];

    return rawList.map<TechnicianSummary>((item) {
      final map = item is Map ? Map<String, dynamic>.from(item) : <String, dynamic>{};
      final expertiseList = (map['expertise'] is List)
          ? (map['expertise'] as List).map((e) => e.toString()).toList()
          : const <String>[];
      final expertise = expertiseList.isEmpty ? 'General technician' : expertiseList.join(', ');
      final ratingNum = map['rating'];
      final rating = ratingNum is num ? ratingNum.toStringAsFixed(1) : '0.0';

      return TechnicianSummary(
        id: map['_id']?.toString() ?? '',
        name: map['name']?.toString() ?? 'Unknown Technician',
        expertise: expertise,
        rating: rating,
      );
    }).toList();
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
