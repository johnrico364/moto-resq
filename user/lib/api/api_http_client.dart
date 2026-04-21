import 'dart:io' show HttpClient;

import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import 'package:http/io_client.dart';

/// Shared HTTP/1.1 client for API calls (plain `http://`, not HTTPS).
class ApiHttpClient {
  ApiHttpClient._();

  static http.Client? _instance;

  static http.Client get instance {
    if (_instance != null) return _instance!;
    if (kIsWeb) {
      _instance = http.Client();
    } else {
      final io = HttpClient()
        ..connectionTimeout = const Duration(seconds: 15);
      _instance = IOClient(io);
    }
    return _instance!;
  }
}
