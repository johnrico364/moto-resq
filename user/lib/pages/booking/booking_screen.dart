import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:user/map/map.dart';
import 'package:user/api/api_config.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

class BookingScreen extends StatefulWidget {
  const BookingScreen({super.key});

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  final _problemController = TextEditingController();
  final _notesController = TextEditingController();

  double? _lat;
  double? _lng;
  String _socketStatus = 'Disconnected';
  final List<String> _events = <String>[];
  WebSocketChannel? _channel;

  @override
  void dispose() {
    _problemController.dispose();
    _notesController.dispose();
    _channel?.sink.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Book a Technician')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: _problemController,
              decoration: const InputDecoration(
                labelText: 'Problem Type',
                hintText: 'e.g. Flat Tire, Battery',
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _notesController,
              maxLines: 3,
              decoration: const InputDecoration(
                labelText: 'Notes',
                hintText: 'Tell technician what happened',
              ),
            ),
            const SizedBox(height: 16),
            OutlinedButton.icon(
              onPressed: _pickLocation,
              icon: const Icon(Icons.map_outlined),
              label: Text(
                _lat == null
                    ? 'Pick Location on Map'
                    : 'Location: ${_lat!.toStringAsFixed(5)}, ${_lng!.toStringAsFixed(5)}',
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('WebSocket: $_socketStatus'),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      children: [
                        FilledButton(
                          onPressed: _connectSocket,
                          child: const Text('Connect'),
                        ),
                        OutlinedButton(
                          onPressed: _sendLocationUpdate,
                          child: const Text('Send Location'),
                        ),
                        OutlinedButton(
                          onPressed: _disconnectSocket,
                          child: const Text('Disconnect'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    if (_events.isNotEmpty)
                      SizedBox(
                        height: 140,
                        child: ListView.builder(
                          itemCount: _events.length,
                          itemBuilder: (_, i) => Text(
                            _events[_events.length - 1 - i],
                            style: const TextStyle(fontSize: 12),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _pickLocation() async {
    final result = await Navigator.of(context).push<MapPickerResult>(
      MaterialPageRoute(builder: (_) => const MapPickerPage()),
    );
    if (result == null) return;
    setState(() {
      _lat = result.latitude;
      _lng = result.longitude;
    });
  }

  void _connectSocket() {
    if (_channel != null) return;
    final base = ApiConfig.httpUri('/');
    final wsScheme = base.scheme == 'https' ? 'wss' : 'ws';
    final wsUri = Uri(
      scheme: wsScheme,
      host: base.host,
      port: base.port,
      path: '/ws/booking',
    );

    try {
      final channel = WebSocketChannel.connect(wsUri);
      setState(() {
        _channel = channel;
        _socketStatus = 'Connected';
      });

      channel.stream.listen(
        (event) {
          setState(() => _events.add('recv: $event'));
        },
        onError: (error) {
          setState(() {
            _events.add('error: $error');
            _socketStatus = 'Error';
          });
        },
        onDone: () {
          setState(() {
            _socketStatus = 'Disconnected';
            _channel = null;
          });
        },
      );
    } catch (e) {
      setState(() {
        _socketStatus = 'Error';
        _events.add('connect error: $e');
      });
    }
  }

  void _sendLocationUpdate() {
    if (_channel == null) {
      _events.add('not connected');
      setState(() {});
      return;
    }
    if (_lat == null || _lng == null) {
      _events.add('pick location first');
      setState(() {});
      return;
    }

    final payload = jsonEncode({
      'type': 'location_update',
      'problem_type': _problemController.text.trim(),
      'notes': _notesController.text.trim(),
      'location': {'lat': _lat, 'lng': _lng},
      'sent_at': DateTime.now().toIso8601String(),
    });

    _channel!.sink.add(payload);
    setState(() => _events.add('sent: $payload'));
  }

  void _disconnectSocket() {
    _channel?.sink.close();
    setState(() {
      _channel = null;
      _socketStatus = 'Disconnected';
    });
  }
}
