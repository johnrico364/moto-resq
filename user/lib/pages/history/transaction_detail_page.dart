import 'package:flutter/material.dart';
import 'package:user/pages/history/models/history_models.dart';
import 'package:user/pages/shared/app_colors.dart';

class TransactionDetailPage extends StatelessWidget {
  const TransactionDetailPage({super.key, required this.entry});

  final HistoryEntry entry;

  static const String _mechanicStreet = 'Westminster Abbey Street';
  static const String _customerStreet = 'Westminster Abbey Street';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF2F2F4),
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) => SingleChildScrollView(
            physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
            padding: const EdgeInsets.fromLTRB(10, 8, 10, 20),
            child: ConstrainedBox(
              constraints: BoxConstraints(minHeight: constraints.maxHeight - 28),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _DetailHeader(onBack: () => Navigator.maybePop(context)),
                  const SizedBox(height: 12),
                  _PeopleTimelineCard(
                    mechanicName: entry.name,
                    mechanicStreet: _mechanicStreet,
                    customerName: 'Charlene Barrientos F39429',
                    customerStreet: _customerStreet,
                    requestId: 'Request ID: F39429',
                  ),
                  const SizedBox(height: 14),
                  const Text(
                    'Request Description',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF131313),
                    ),
                  ),
                  const SizedBox(height: 10),
                  _DescriptionCard(
                    issueType: _issueTypeFor(entry),
                    vehicleType: _vehicleTypeFor(entry),
                    amount: '1,000.0 PHP',
                    remarks: _remarksFor(entry),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  static String _issueTypeFor(HistoryEntry entry) {
    return switch (entry.seed % 3) {
      0 => 'Battery issue',
      1 => 'Flat tire',
      _ => 'Engine problem',
    };
  }

  static String _vehicleTypeFor(HistoryEntry entry) {
    return switch (entry.seed % 3) {
      0 => 'SUV',
      1 => 'Toyota Vios',
      _ => 'Motorcycle',
    };
  }

  static String _remarksFor(HistoryEntry entry) {
    if (entry.status == HistoryStatus.canceled) {
      return 'Client canceled before technician arrival';
    }
    return switch (entry.seed % 3) {
      0 => 'Battery no longer charging',
      1 => 'Rear tire bust',
      _ => 'Engine failed to start',
    };
  }
}

class _DetailHeader extends StatelessWidget {
  const _DetailHeader({required this.onBack});

  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 54,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Align(
            alignment: Alignment.centerLeft,
            child: IconButton(
              onPressed: onBack,
              icon: const Icon(Icons.chevron_left_rounded),
              color: const Color(0xFF1A1A1A),
              splashRadius: 20,
            ),
          ),
          const Text(
            'Transaction Detail',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w800,
              color: Color(0xFF141414),
              letterSpacing: -0.4,
            ),
          ),
        ],
      ),
    );
  }
}

class _PeopleTimelineCard extends StatelessWidget {
  const _PeopleTimelineCard({
    required this.mechanicName,
    required this.mechanicStreet,
    required this.customerName,
    required this.customerStreet,
    required this.requestId,
  });

  final String mechanicName;
  final String mechanicStreet;
  final String customerName;
  final String customerStreet;
  final String requestId;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
      ),
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      child: Column(
        children: [
          _PersonLine(
            icon: Icons.shield_rounded,
            name: mechanicName,
            street: mechanicStreet,
          ),
          const Padding(
            padding: EdgeInsets.only(left: 11),
            child: SizedBox(
              height: 20,
              child: VerticalDivider(
                width: 2,
                thickness: 2,
                color: Color(0xFFD2D2D6),
              ),
            ),
          ),
          _PersonLine(
            icon: Icons.location_on_rounded,
            name: customerName,
            street: customerStreet,
          ),
          const SizedBox(height: 12),
          Container(
            height: 34,
            width: double.infinity,
            decoration: const BoxDecoration(
              color: Color(0xFFF1F1F4),
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(12),
                bottomRight: Radius.circular(12),
              ),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 10),
            child: Row(
              children: [
                Text(
                  requestId,
                  style: const TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF232323),
                  ),
                ),
                const Spacer(),
                const Icon(
                  Icons.chevron_right_rounded,
                  size: 18,
                  color: Color(0xFF232323),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _PersonLine extends StatelessWidget {
  const _PersonLine({
    required this.icon,
    required this.name,
    required this.street,
  });

  final IconData icon;
  final String name;
  final String street;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: const BoxDecoration(
            color: Color(0xFF1E1E23),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, size: 15, color: Colors.white),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                name,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF171717),
                ),
              ),
              const SizedBox(height: 2),
              Text(
                street,
                style: const TextStyle(
                  fontSize: 12.5,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF8D8D96),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _DescriptionCard extends StatelessWidget {
  const _DescriptionCard({
    required this.issueType,
    required this.vehicleType,
    required this.amount,
    required this.remarks,
  });

  final String issueType;
  final String vehicleType;
  final String amount;
  final String remarks;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
      ),
      padding: const EdgeInsets.fromLTRB(14, 14, 14, 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: _LabelValue(
                  label: 'Type of issue',
                  value: issueType,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _LabelValue(
                  label: 'Vehicle Type',
                  value: vehicleType,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _LabelValue(
                  label: 'Total amount',
                  value: amount,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _LabelValue(
                  label: 'Total amount',
                  value: amount,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            'Remarks',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: Color(0xFF8D8D96),
            ),
          ),
          const SizedBox(height: 2),
          Text(
            remarks,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: Color(0xFF171717),
            ),
          ),
          const SizedBox(height: 14),
          const Text(
            'Image',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: Color(0xFF171717),
            ),
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: AspectRatio(
              aspectRatio: 1.5,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      AppColors.accentBlue.withValues(alpha: 0.22),
                      AppColors.navy.withValues(alpha: 0.55),
                    ],
                  ),
                ),
                child: const Center(
                  child: Icon(
                    Icons.car_repair_rounded,
                    size: 52,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _LabelValue extends StatelessWidget {
  const _LabelValue({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: Color(0xFF8D8D96),
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: Color(0xFF171717),
            letterSpacing: -0.2,
          ),
        ),
      ],
    );
  }
}
