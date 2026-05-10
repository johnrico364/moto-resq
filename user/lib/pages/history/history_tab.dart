import 'package:flutter/material.dart';
import 'package:user/pages/history/models/history_models.dart';
import 'package:user/pages/history/widgets/history_list_tile.dart';
import 'package:user/pages/shared/app_colors.dart';
import 'package:user/pages/shared/capsule_search_bar.dart';
import 'package:user/pages/shared/filter_square_button.dart';

class HistoryTab extends StatelessWidget {
  const HistoryTab({super.key});

  static const List<HistoryEntry> _entries = [
    HistoryEntry(
      name: 'Kent John C. Flores',
      timestamp: 'Yesterday | 10:30 PM',
      status: HistoryStatus.completed,
      seed: 1,
    ),
    HistoryEntry(
      name: 'Maria Santos',
      timestamp: 'Mon, 8 Apr | 2:15 PM',
      status: HistoryStatus.canceled,
      seed: 2,
    ),
    HistoryEntry(
      name: 'James Rivera',
      timestamp: 'Sun, 7 Apr | 9:00 AM',
      status: HistoryStatus.completed,
      seed: 3,
    ),
    HistoryEntry(
      name: 'Angela Cruz',
      timestamp: 'Sat, 6 Apr | 4:45 PM',
      status: HistoryStatus.completed,
      seed: 4,
    ),
    HistoryEntry(
      name: 'Francis Ampoon',
      timestamp: 'Fri, 5 Apr | 11:20 AM',
      status: HistoryStatus.canceled,
      seed: 5,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final w = MediaQuery.sizeOf(context).width;
    final h = MediaQuery.sizeOf(context).height;
    final curveR = (w * 0.085).clamp(26.0, 40.0);
    final top = MediaQuery.paddingOf(context).top;
    final bottomPad = MediaQuery.paddingOf(context).bottom + 8;
    final minHeaderH = (h * 0.30).clamp(248.0, 320.0);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        DecoratedBox(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                AppColors.navyHeaderTop,
                AppColors.navy,
                AppColors.navyDeep,
              ],
              stops: const [0.0, 0.45, 1.0],
            ),
            borderRadius: BorderRadius.vertical(bottom: Radius.circular(curveR)),
            boxShadow: [
              BoxShadow(
                color: AppColors.navy.withValues(alpha: 0.26),
                blurRadius: 22,
                offset: const Offset(0, 8),
              ),
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: 8,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: SizedBox(
            height: minHeaderH,
            width: double.infinity,
            child: Padding(
              padding: EdgeInsets.fromLTRB(20, top + 18, 20, 36),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Text(
                    'History',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 27,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                      letterSpacing: -0.45,
                      height: 1.15,
                      shadows: [
                        Shadow(
                          color: Colors.black.withValues(alpha: 0.25),
                          blurRadius: 10,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 26),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      const Expanded(child: CapsuleSearchBar(hintText: 'Search')),
                      const SizedBox(width: 12),
                      FilterSquareButton(onTap: () {
                        
                      }),
                    ],
                  ),
                  const Spacer(),
                ],
              ),
            ),
          ),
        ),
        Expanded(
          child: ColoredBox(
            color: Colors.white,
            child: ListView.separated(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: EdgeInsets.fromLTRB(16, 12, 16, bottomPad + 16),
              itemCount: _entries.length,
              separatorBuilder: (_, unused) => Divider(
                height: 1,
                thickness: 1,
                color: Colors.grey.shade200.withValues(alpha: 0.9),
              ),
              itemBuilder: (context, index) {
                return HistoryListTile(entry: _entries[index]);
              },
            ),
          ),
        ),
      ],
    );
  }
}
