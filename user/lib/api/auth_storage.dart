import 'package:shared_preferences/shared_preferences.dart';

/// Persists the JWT returned by `POST /api/users/auth/signin`.
class AuthStorage {
  AuthStorage._();

  static const _tokenKey = 'auth_token';

  static Future<void> saveToken(String token) async {
    final p = await SharedPreferences.getInstance();
    await p.setString(_tokenKey, token);
  }

  static Future<String?> readToken() async {
    final p = await SharedPreferences.getInstance();
    return p.getString(_tokenKey);
  }

  static Future<void> clearToken() async {
    final p = await SharedPreferences.getInstance();
    await p.remove(_tokenKey);
  }
}
