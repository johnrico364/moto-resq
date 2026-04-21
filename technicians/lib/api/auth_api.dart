import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:technicians/api/api_config.dart';

class AuthApiException implements Exception {
  AuthApiException(this.message, {this.statusCode});

  final String message;
  final int? statusCode;

  @override
  String toString() => message;
}

class AuthApi {
  AuthApi._();

  static Uri _uri(String path) => ApiConfig.httpUri(path);

  static Future<void> registerTechnician({
    required String fullName,
    required String contact,
    required String email,
    required String password,
  }) async {
    final normalizedContact = contact.trim();

    final response = await http
        .post(
          _uri('/api/technicians/auth/signup'),
          headers: {'Content-Type': 'application/json; charset=utf-8'},
          body: jsonEncode({
            'name': fullName.trim(),
            'phone': normalizedContact,
            'email': email.trim(),
            'password': password,
          }),
        )
        .timeout(const Duration(seconds: 30));

    final body = _decodeJson(response.body);
    if (response.statusCode == 201 && body['success'] == true) {
      return;
    }

    throw AuthApiException(
      body['message']?.toString() ?? 'Registration failed (${response.statusCode})',
      statusCode: response.statusCode,
    );
  }

  static Future<String> signin({
    required String identifier,
    required String password,
  }) async {
    final response = await http
        .post(
          _uri('/api/technicians/auth/signin'),
          headers: {'Content-Type': 'application/json; charset=utf-8'},
          body: jsonEncode({
            'identifier': identifier.trim().toLowerCase(),
            'password': password,
          }),
        )
        .timeout(const Duration(seconds: 30));

    final body = _decodeJson(response.body);
    if (response.statusCode == 200 && body['success'] == true) {
      final token = body['token']?.toString();
      if (token == null || token.isEmpty) {
        throw AuthApiException('No token in response', statusCode: response.statusCode);
      }
      return token;
    }

    throw AuthApiException(
      body['message']?.toString() ?? 'Sign in failed (${response.statusCode})',
      statusCode: response.statusCode,
    );
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
