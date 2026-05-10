import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:technicians/api/api_config.dart';

class ServiceRequestItem {
  const ServiceRequestItem({
    required this.id,
    required this.problemType,
    required this.status,
    required this.userId,
    required this.vehicleId,
    required this.lat,
    required this.lng,
  });

  final String id;
  final String problemType;
  final String status;
  final String userId;
  final String vehicleId;
  final double lat;
  final double lng;
}

class ServiceRequestApi {
  ServiceRequestApi._();

  static Uri _uri(String path) => ApiConfig.httpUri(path);

  static Future<List<ServiceRequestItem>> getPendingRequests() async {
    final response = await http.get(_uri('/api/service-request')).timeout(const Duration(seconds: 30));
    final body = _decodeJson(response.body);
    if (response.statusCode != 200 || body['success'] != true) return const [];
    final raw = body['data'];
    if (raw is! List) return const [];

    return raw
        .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
        .where((e) => (e['status']?.toString() ?? 'Pending') == 'Pending')
        .map((e) {
      final location = e['location'] is Map ? Map<String, dynamic>.from(e['location']) : <String, dynamic>{};
      return ServiceRequestItem(
        id: e['_id']?.toString() ?? '',
        problemType: e['problem_type']?.toString() ?? 'Unknown',
        status: e['status']?.toString() ?? 'Pending',
        userId: e['user_id']?.toString() ?? '',
        vehicleId: e['vehicle_id']?.toString() ?? '',
        lat: (location['lat'] is num) ? (location['lat'] as num).toDouble() : 0,
        lng: (location['lng'] is num) ? (location['lng'] as num).toDouble() : 0,
      );
    }).toList();
  }

  static Future<bool> acceptRequest({
    required String requestId,
    required String technicianId,
  }) async {
    final req = http.MultipartRequest('PATCH', _uri('/api/service-request/$requestId'));
    req.fields['data'] = jsonEncode({
      'technician_id': technicianId,
      'status': 'Accepted',
    });
    final stream = await req.send().timeout(const Duration(seconds: 30));
    final response = await http.Response.fromStream(stream);
    final body = _decodeJson(response.body);
    return response.statusCode == 200 && body['success'] == true;
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
