import 'package:flutter/material.dart';
import 'package:user/api/vehicle_api.dart';

class VehiclesPage extends StatefulWidget {
  const VehiclesPage({super.key});

  @override
  State<VehiclesPage> createState() => _VehiclesPageState();
}

class _VehiclesPageState extends State<VehiclesPage> {
  late Future<List<VehicleItem>> _future;

  @override
  void initState() {
    super.initState();
    _future = VehicleApi.getMyVehicles();
  }

  Future<void> _reload() async {
    setState(() => _future = VehicleApi.getMyVehicles());
  }

  Future<void> _openAddDialog() async {
    final result = await showDialog<_NewVehicleData>(
      context: context,
      builder: (_) => const _AddVehicleDialog(),
    );
    if (result == null) return;
    try {
      await VehicleApi.addMyVehicle(
        type: result.type,
        brand: result.brand,
        model: result.model,
        plateNumber: result.plateNumber,
      );
      if (!mounted) return;
      await _reload();
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vehicle added')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Add vehicle failed: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Your Vehicles'),
      ),
      body: FutureBuilder<List<VehicleItem>>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text('Failed to load vehicles: ${snapshot.error}'),
              ),
            );
          }
          final list = snapshot.data ?? const <VehicleItem>[];
          if (list.isEmpty) {
            return const Center(child: Text('No vehicles yet. Tap + to add one.'));
          }
          return ListView.separated(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 90),
            itemCount: list.length,
            separatorBuilder: (_, index) => const SizedBox(height: 10),
            itemBuilder: (_, i) {
              final v = list[i];
              return Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE8EAEF)),
                ),
                child: Row(
                  children: [
                    Icon(
                      v.type == 'Car' ? Icons.directions_car_outlined : Icons.two_wheeler,
                      size: 26,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${v.brand} ${v.model}',
                            style: const TextStyle(fontWeight: FontWeight.w700),
                          ),
                          const SizedBox(height: 2),
                          Text(v.type, style: const TextStyle(fontSize: 12, color: Colors.black54)),
                        ],
                      ),
                    ),
                    Text(
                      v.plateNumber,
                      style: const TextStyle(fontWeight: FontWeight.w700),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      floatingActionButton: FloatingActionButton(
        onPressed: _openAddDialog,
        child: const Icon(Icons.add),
      ),
    );
  }
}

class _AddVehicleDialog extends StatefulWidget {
  const _AddVehicleDialog();

  @override
  State<_AddVehicleDialog> createState() => _AddVehicleDialogState();
}

class _AddVehicleDialogState extends State<_AddVehicleDialog> {
  final _formKey = GlobalKey<FormState>();
  String _type = 'Car';
  final _brand = TextEditingController(text: 'Nissan');
  final _model = TextEditingController(text: 'GTR');
  final _plate = TextEditingController(text: 'FSC-4239');

  @override
  void dispose() {
    _brand.dispose();
    _model.dispose();
    _plate.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Add Vehicle'),
      content: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<String>(
                initialValue: _type,
                items: const [
                  DropdownMenuItem(value: 'Car', child: Text('Car')),
                  DropdownMenuItem(value: 'Motorcycle', child: Text('Motorcycle')),
                ],
                onChanged: (value) {
                  if (value != null) setState(() => _type = value);
                },
                decoration: const InputDecoration(labelText: 'Type'),
              ),
              TextFormField(
                controller: _brand,
                decoration: const InputDecoration(labelText: 'Brand'),
                validator: (v) => (v == null || v.trim().isEmpty) ? 'Required' : null,
              ),
              TextFormField(
                controller: _model,
                decoration: const InputDecoration(labelText: 'Model'),
                validator: (v) => (v == null || v.trim().isEmpty) ? 'Required' : null,
              ),
              TextFormField(
                controller: _plate,
                decoration: const InputDecoration(labelText: 'Plate Number'),
                validator: (v) => (v == null || v.trim().isEmpty) ? 'Required' : null,
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: () {
            if (!_formKey.currentState!.validate()) return;
            Navigator.of(context).pop(
              _NewVehicleData(
                type: _type,
                brand: _brand.text,
                model: _model.text,
                plateNumber: _plate.text,
              ),
            );
          },
          child: const Text('Add'),
        ),
      ],
    );
  }
}

class _NewVehicleData {
  const _NewVehicleData({
    required this.type,
    required this.brand,
    required this.model,
    required this.plateNumber,
  });

  final String type;
  final String brand;
  final String model;
  final String plateNumber;
}
