import 'package:flutter/material.dart';

class EarningsPage extends StatelessWidget {
  const EarningsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Earnings')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFEEF4FF),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Total Earnings', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                SizedBox(height: 8),
                Text(
                  'PHP 3,500.00',
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800),
                ),
                SizedBox(height: 6),
                Text('Updated from completed jobs', style: TextStyle(color: Colors.black54)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Recent Earnings',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 10),
          _earningTile('Battery Assistance', 'Apr 22, 2026', 'PHP 800.00'),
          _earningTile('Towing Service', 'Apr 18, 2026', 'PHP 1,200.00'),
          _earningTile('Flat Tire Support', 'Apr 14, 2026', 'PHP 1,500.00'),
        ],
      ),
    );
  }

  static Widget _earningTile(String title, String date, String amount) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE8EAEF)),
      ),
      child: Row(
        children: [
          const Icon(Icons.payments_outlined),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
                const SizedBox(height: 2),
                Text(date, style: const TextStyle(fontSize: 12, color: Colors.black54)),
              ],
            ),
          ),
          Text(amount, style: const TextStyle(fontWeight: FontWeight.w800)),
        ],
      ),
    );
  }
}
