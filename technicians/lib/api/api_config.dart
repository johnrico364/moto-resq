import 'dart:io' show Platform;

import 'package:flutter/foundation.dart';

class ApiConfig {
  ApiConfig._();

  static const int defaultPort = 4000;

  static Uri get _base {
    const fromEnv = String.fromEnvironment('API_BASE_URL');
    if (fromEnv.isNotEmpty) {
      return Uri.parse(fromEnv.trim().replaceAll(RegExp(r'/+$'), ''));
    }
    if (kIsWeb) {
      return Uri(scheme: 'http', host: '127.0.0.1', port: defaultPort);
    }
    if (Platform.isAndroid) {
      return Uri(scheme: 'http', host: '10.0.2.2', port: defaultPort);
    }
    return Uri(scheme: 'http', host: '127.0.0.1', port: defaultPort);
  }

  static Uri httpUri(String path) {
    final normalized = path.startsWith('/') ? path : '/$path';
    final port = _base.hasPort ? _base.port : defaultPort;
    return Uri.http('${_base.host}:$port', normalized);
  }
}
