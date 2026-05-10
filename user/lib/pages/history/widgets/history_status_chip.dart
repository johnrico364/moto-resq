import 'package:flutter/material.dart';
import 'package:user/pages/history/models/history_models.dart';

class HistoryStatusChip extends StatelessWidget {
  const HistoryStatusChip({super.key, required this.status});

  final HistoryStatus status;

  @override
  Widget build(BuildContext context) {
    final isCompleted = status == HistoryStatus.completed;
    final bg = isCompleted ? const Color(0xFFE8F5E9) : const Color(0xFFFFEBEE);
    final fg = isCompleted ? const Color(0xFF1B5E20) : const Color(0xFFB71C1C);
    final label = isCompleted ? 'Completed' : 'Canceled';

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w700,
          color: fg,
        ),
      ),
    );
  }
}
