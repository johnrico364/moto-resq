import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class MapPickerResult {
  const MapPickerResult({
    required this.latitude,
    required this.longitude,
  });

  final double latitude;
  final double longitude;
}

class MapPickerPage extends StatefulWidget {
  const MapPickerPage({
    super.key,
    this.initialLatitude = 14.5995,
    this.initialLongitude = 120.9842,
  });

  final double initialLatitude;
  final double initialLongitude;

  @override
  State<MapPickerPage> createState() => _MapPickerPageState();
}

class _MapPickerPageState extends State<MapPickerPage> {
  late LatLng _picked;

  @override
  void initState() {
    super.initState();
    _picked = LatLng(widget.initialLatitude, widget.initialLongitude);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pick Location'),
      ),
      body: Stack(
        children: [
          FlutterMap(
            options: MapOptions(
              initialCenter: _picked,
              initialZoom: 14,
              onTap: (_, latLng) {
                setState(() => _picked = latLng);
              },
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.motoresq.user',
              ),
              MarkerLayer(
                markers: [
                  Marker(
                    point: _picked,
                    width: 48,
                    height: 48,
                    child: const Icon(
                      Icons.location_pin,
                      size: 42,
                      color: Colors.red,
                    ),
                  ),
                ],
              ),
            ],
          ),
          Positioned(
            left: 16,
            right: 16,
            bottom: 18,
            child: FilledButton(
              onPressed: () {
                Navigator.of(context).pop(
                  MapPickerResult(
                    latitude: _picked.latitude,
                    longitude: _picked.longitude,
                  ),
                );
              },
              child: const Text('Use This Location'),
            ),
          ),
        ],
      ),
    );
  }
}
