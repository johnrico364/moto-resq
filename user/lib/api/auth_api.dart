import 'dart:convert';

import 'package:http/http.dart' as http;

import 'package:user/api/api_config.dart';
import 'package:user/api/api_http_client.dart';

/// Maps to [server/modules/user/user.route.js] auth routes.
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

  /// `POST /api/users/auth/signup` — multipart: `data` (JSON string), `image_type`, optional `image` file.
  static Future<void> signup({
    required String name,
    required String email,
    required String password,
    required String phone,
  }) async {
    // ignore: avoid_print
    print('[AuthApi.signup] payload types: '
        'name=${name.runtimeType}, email=${email.runtimeType}, '
        'password=${password.runtimeType}, phone=${phone.runtimeType}');

    final request = http.MultipartRequest('POST', _uri('/api/users/auth/signup'));
    request.fields['data'] = jsonEncode({
      'name': name.trim(),
      'email': email.trim().toLowerCase(),
      'password': password,
      'phone': phone.trim(),
    });
    request.fields['image_type'] = 'user';

    final streamed =
        await ApiHttpClient.instance.send(request).timeout(const Duration(seconds: 30));
    final response = await http.Response.fromStream(streamed);

    final body = _decodeJson(response.body);
    if (response.statusCode == 201 && body['success'] == true) {
      return;
    }
    // Keep noisy logs for debugging backend validation issues.
    // ignore: avoid_print
    print('[AuthApi.signup] status=${response.statusCode} body=${response.body}');
    final msg = body['message']?.toString() ?? 'Sign up failed (${response.statusCode})';
    throw AuthApiException(msg, statusCode: response.statusCode);
  }

  /// `POST /api/users/auth/signin` — JSON body.
  static Future<String> signin({
    required String email,
    required String password,
  }) async {
    final response = await ApiHttpClient.instance
        .post(
          _uri('/api/users/auth/signin'),
          headers: {'Content-Type': 'application/json; charset=utf-8'},
          body: jsonEncode({
            'email': email.trim().toLowerCase(),
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
    // ignore: avoid_print
    print('[AuthApi.signin] status=${response.statusCode} body=${response.body}');
    final msg = body['message']?.toString() ?? 'Login failed (${response.statusCode})';
    throw AuthApiException(msg, statusCode: response.statusCode);
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
