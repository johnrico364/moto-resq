import 'package:flutter/material.dart';
import 'package:user/pages/home/widgets/curved_home_header.dart';
import 'package:user/pages/home/widgets/top_technicians_section.dart';
import 'package:user/pages/shared/app_colors.dart';

class HomeTab extends StatelessWidget {
  const HomeTab({super.key});

  @override
  Widget build(BuildContext context) {
    final bottomPad = MediaQuery.paddingOf(context).bottom + 88;

    return ColoredBox(
      color: AppColors.pageGrey,
      child: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: CurvedHomeHeader(accentBlue: AppColors.accentBlue),
          ),
          SliverPadding(
            padding: EdgeInsets.fromLTRB(20, 20, 20, bottomPad),
            sliver: const SliverToBoxAdapter(
              child: TopTechniciansSection(),
            ),
          ),
        ],
      ),
    );
  }
}
