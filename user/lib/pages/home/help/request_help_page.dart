import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'package:latlong2/latlong.dart';
import 'package:user/api/api_config.dart';
import 'package:user/api/auth_storage.dart';
import 'package:user/pages/shared/app_colors.dart';

class RequestHelpPage extends StatefulWidget {
  const RequestHelpPage({super.key});

  @override
  State<RequestHelpPage> createState() => _RequestHelpPageState();
}

class _RequestHelpPageState extends State<RequestHelpPage> {
  static const List<String> _problemTypes = <String>[
    'Flat Tire',
    'Battery',
    'Engine',
    'Electrical',
    'Towing',
    'Brakes',
    'Other',
  ];

  String _problemType = 'Battery';
  bool _loadingLocation = true;
  bool _submitting = false;
  String? _error;
  LatLng? _currentLatLng;
  String? _userId;
  String? _vehicleId;

  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    await Future.wait(<Future<void>>[
      _resolveUserAndVehicle(),
      _resolveCurrentLocation(),
    ]);
  }

  Future<void> _resolveUserAndVehicle() async {
    try {
      final token = await AuthStorage.readToken();
      if (token == null || token.isEmpty) {
        throw Exception('No auth token. Please login again.');
      }

      final userId = _extractUserIdFromJwt(token);
      if (userId == null || userId.isEmpty) {
        throw Exception('Unable to identify user from token.');
      }

      final response = await http
          .get(ApiConfig.httpUri('/api/users/$userId/vehicles'))
          .timeout(const Duration(seconds: 20));
      final body = _decodeJson(response.body);
      if (response.statusCode != 200 || body['success'] != true) {
        throw Exception(
          body['message']?.toString() ?? 'Failed to load vehicles',
        );
      }

      final list = body['data'];
      if (list is! List || list.isEmpty) {
        throw Exception('No vehicle found. Please add a vehicle first.');
      }

      final first = list.first;
      final map = first is Map
          ? Map<String, dynamic>.from(first)
          : <String, dynamic>{};
      final vehicleId = map['_id']?.toString();
      if (vehicleId == null || vehicleId.isEmpty) {
        throw Exception('Vehicle id missing in response.');
      }

      if (!mounted) return;
      setState(() {
        _userId = userId;
        _vehicleId = vehicleId;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _error = e.toString());
    }
  }

  Future<void> _resolveCurrentLocation() async {
    try {
      final enabled = await Geolocator.isLocationServiceEnabled();
      if (!enabled) {
        throw Exception('Location service is turned off.');
      }

      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) {
        throw Exception('Location permission is not granted.');
      }

      final pos = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
        ),
      );

      if (!mounted) return;
      setState(() {
        _currentLatLng = LatLng(pos.latitude, pos.longitude);
        _loadingLocation = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _loadingLocation = false;
        _error = (_error == null) ? e.toString() : '$_error\n$e';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final bottom = MediaQuery.paddingOf(context).bottom;
    final canSubmit =
        !_submitting &&
        !_loadingLocation &&
        _currentLatLng != null &&
        _userId != null &&
        _vehicleId != null;

    return Scaffold(
      appBar: AppBar(title: const Text('Request Help')),
      body: ListView(
        padding: EdgeInsets.fromLTRB(16, 12, 16, bottom + 16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Type of issue',
                    style: TextStyle(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<String>(
                    initialValue: _problemType,
                    items: _problemTypes
                        .map(
                          (p) => DropdownMenuItem<String>(
                            value: p,
                            child: Text(p),
                          ),
                        )
                        .toList(),
                    onChanged: (v) {
                      if (v != null) setState(() => _problemType = v);
                    },
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'user_id: ${_userId ?? 'loading...'}\nvehicle_id: ${_vehicleId ?? 'loading...'}',
                    style: TextStyle(fontSize: 12, color: Colors.grey.shade700),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            clipBehavior: Clip.antiAlias,
            child: SizedBox(
              height: 260,
              child: _loadingLocation
                  ? const Center(child: CircularProgressIndicator())
                  : _currentLatLng == null
                  ? Center(
                      child: Text(_error ?? 'Unable to get current location.'),
                    )
                  : FlutterMap(
                      options: MapOptions(
                        initialCenter: _currentLatLng!,
                        initialZoom: 15,
                        interactionOptions: const InteractionOptions(
                          flags:
                              InteractiveFlag.drag | InteractiveFlag.pinchZoom,
                        ),
                      ),
                      children: [
                        TileLayer(
                          urlTemplate:
                              'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                          userAgentPackageName: 'com.motoresq.user',
                        ),
                        MarkerLayer(
                          markers: [
                            Marker(
                              point: _currentLatLng!,
                              width: 50,
                              height: 50,
                              child: const Icon(
                                Icons.location_pin,
                                size: 44,
                                color: Colors.red,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
            ),
          ),
          if (_error != null) ...[
            const SizedBox(height: 10),
            Text(_error!, style: const TextStyle(color: Colors.red)),
          ],
          const SizedBox(height: 16),
          SizedBox(
            height: 52,
            child: FilledButton(
              onPressed: canSubmit ? _submitRequest : null,
              style: FilledButton.styleFrom(backgroundColor: AppColors.navy),
              child: _submitting
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.2,
                        color: Colors.white,
                      ),
                    )
                  : const Text('Help'),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _submitRequest() async {
    final latLng = _currentLatLng;
    final userId = _userId;
    final vehicleId = _vehicleId;
    if (latLng == null || userId == null || vehicleId == null) return;

    setState(() => _submitting = true);
    try {
      final payload = <String, dynamic>{
        'user_id': userId,
        'vehicle_id': vehicleId,
        'problem_type': _problemType,
        'location': <String, num>{
          'lat': latLng.latitude,
          'lng': latLng.longitude,
        },
      };

      final req = http.MultipartRequest(
        'POST',
        ApiConfig.httpUri('/api/service-request'),
      );
      req.fields['data'] = jsonEncode(payload);
      final stream = await req.send().timeout(const Duration(seconds: 30));
      final res = await http.Response.fromStream(stream);
      final body = _decodeJson(res.body);
      if (res.statusCode != 201 || body['success'] != true) {
        throw Exception(
          body['message']?.toString() ?? 'Failed to create request',
        );
      }

      final created = body['data'] is Map
          ? Map<String, dynamic>.from(body['data'] as Map)
          : <String, dynamic>{};
      final requestId = created['_id']?.toString();
      if (requestId == null || requestId.isEmpty) {
        throw Exception('Request id not returned by server.');
      }

      if (!mounted) return;
      Navigator.of(context).push<void>(
        MaterialPageRoute<void>(
          builder: (_) => _WaitingForTechnicianPage(requestId: requestId),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Request failed: $e')));
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  static String? _extractUserIdFromJwt(String token) {
    try {
      final parts = token.split('.');
      if (parts.length < 2) return null;
      final normalized = base64Url.normalize(parts[1]);
      final payload = jsonDecode(utf8.decode(base64Url.decode(normalized)));
      if (payload is Map<String, dynamic>) return payload['userId']?.toString();
      if (payload is Map) return payload['userId']?.toString();
      return null;
    } catch (_) {
      return null;
    }
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

class _WaitingForTechnicianPage extends StatefulWidget {
  const _WaitingForTechnicianPage({required this.requestId});

  final String requestId;

  @override
  State<_WaitingForTechnicianPage> createState() =>
      _WaitingForTechnicianPageState();
}

class _WaitingForTechnicianPageState extends State<_WaitingForTechnicianPage> {
  Timer? _timer;
  String _status = 'Pending';
  String? _technicianId;

  @override
  void initState() {
    super.initState();
    _poll();
    _timer = Timer.periodic(const Duration(seconds: 5), (_) => _poll());
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _poll() async {
    try {
      final res = await http
          .get(ApiConfig.httpUri('/api/service-request/${widget.requestId}'))
          .timeout(const Duration(seconds: 15));
      final body = _RequestHelpPageState._decodeJson(res.body);
      if (res.statusCode != 200 || body['success'] != true) return;

      final data = body['data'] is Map
          ? Map<String, dynamic>.from(body['data'] as Map)
          : <String, dynamic>{};
      final status = data['status']?.toString() ?? 'Pending';
      final technicianId = data['technician_id']?.toString();

      if (!mounted) return;
      setState(() {
        _status = status;
        _technicianId = technicianId;
      });

      if (technicianId != null &&
          technicianId.isNotEmpty &&
          status == 'Accepted') {
        _timer?.cancel();
        if (!mounted) return;
        showDialog<void>(
          context: context,
          barrierDismissible: false,
          builder: (_) => AlertDialog(
            title: const Text('Technician Accepted'),
            content: Text('technician_id: $technicianId'),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  Navigator.of(context).pop();
                },
                child: const Text('OK'),
              ),
            ],
          ),
        );
      }
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Finding Technician')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircularProgressIndicator(),
              const SizedBox(height: 16),
              const Text(
                'Waiting for a technician to accept...',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 10),
              Text('status: $_status'),
              if (_technicianId != null) Text('technician_id: $_technicianId'),
            ],
          ),
        ),
      ),
    );
  }
}
