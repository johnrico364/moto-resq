import 'package:flutter/material.dart';
import 'package:user/pages/history/models/history_models.dart';
import 'package:user/pages/history/transaction_detail_page.dart';
import 'package:user/pages/history/widgets/history_status_chip.dart';
import 'package:user/pages/shared/app_colors.dart';
import 'package:user/pages/shared/tech_avatar.dart';

class HistoryListTile extends StatelessWidget {
  const HistoryListTile({super.key, required this.entry});

  final HistoryEntry entry;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      child: InkWell(
        onTap: () {
          Navigator.of(context).push<void>(
            MaterialPageRoute<void>(
              builder: (_) => TransactionDetailPage(entry: entry),
            ),
          );
        },
        splashColor: AppColors.accentBlue.withValues(alpha: 0.06),
        highlightColor: Colors.grey.shade50,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 4),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              TechAvatar(seed: entry.seed),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      entry.name,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF0A0A0A),
                        letterSpacing: -0.2,
                        height: 1.2,
                      ),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      entry.timestamp,
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.grey.shade600,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              HistoryStatusChip(status: entry.status),
            ],
          ),
        ),
      ),
    );
  }
}
