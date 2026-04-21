import 'dart:io' show Platform;

import 'package:flutter/foundation.dart';

/// Backend base URL (no trailing slash), always `http://` for local API.
///
/// **Physical phone:** the PC that runs the server is not `10.0.2.2` or `127.0.0.1`.
/// Run:
/// `flutter run --dart-define=API_DEV_HOST=192.168.x.x`
/// or set full URL:
/// `flutter run --dart-define=API_BASE_URL=http://192.168.x.x:4000`
///
/// Optional: `--dart-define=API_PORT=4000` (default 4000).
///
/// **Emulator:** Android uses `10.0.2.2`, iOS simulator uses `127.0.0.1`.
class ApiConfig {
  ApiConfig._();

  static const int defaultPort = 4000;

  static String get baseUrl => _resolvedBase.origin;

  /// Use for [Uri.http] (scheme is fixed to `http`).
  static String get _authority {
    final u = _resolvedBase;
    final host = u.host;
    final port = u.hasPort ? u.port : defaultPort;
    if (port == 80) return host;
    return '$host:$port';
  }

  /// Explicit cleartext HTTP URL for API paths (avoids accidental `https`).
  static Uri httpUri(String path) {
    final normalized = path.startsWith('/') ? path : '/$path';
    return Uri.http(_authority, normalized);
  }

  static Uri get _resolvedBase {
    const fromEnv = String.fromEnvironment('API_BASE_URL');
    if (fromEnv.isNotEmpty) {
      final trimmed = fromEnv.trim().replaceAll(RegExp(r'/+$'), '');
      return Uri.parse(trimmed);
    }

    const devHost = String.fromEnvironment('API_DEV_HOST');
    const devPortStr = String.fromEnvironment('API_PORT', defaultValue: '4000');
    if (devHost.isNotEmpty) {
      final port = int.tryParse(devPortStr) ?? defaultPort;
      return Uri(scheme: 'http', host: devHost, port: port);
    }

    if (kIsWeb) {
      return Uri(scheme: 'http', host: '127.0.0.1', port: defaultPort);
    }
    if (Platform.isAndroid) {
      return Uri(scheme: 'http', host: '10.0.2.2', port: defaultPort);
    }
    return Uri(scheme: 'http', host: '127.0.0.1', port: defaultPort);
  }
}
