import 'package:flutter/material.dart';
import 'package:user/pages/home/widgets/home_technician_card.dart';
import 'package:user/pages/shared/app_colors.dart';

class TopTechniciansSection extends StatelessWidget {
  const TopTechniciansSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Expanded(
              child: Text(
                'Top Technicians',
                style: TextStyle(
                  fontSize: 19,
                  fontWeight: FontWeight.w800,
                  color: AppColors.navy,
                  letterSpacing: -0.35,
                  height: 1.2,
                ),
              ),
            ),
            TextButton(
              onPressed: () {
                
              },
              style: TextButton.styleFrom(
                foregroundColor: AppColors.accentBlue,
                backgroundColor: AppColors.accentBlue.withValues(alpha: 0.08),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                minimumSize: Size.zero,
                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
                textStyle: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                ),
              ),
              child: const Text('View All'),
            ),
          ],
        ),
        const SizedBox(height: 18),
        SizedBox(
          height: 228,
          child: ListView(
            scrollDirection: Axis.horizontal,
            clipBehavior: Clip.none,
            children: const [
              HomeTechnicianCard(
                name: 'Francis Ampoon',
                service: 'Towing',
                rating: '4.8',
                imageSeed: 1,
              ),
              SizedBox(width: 14),
              HomeTechnicianCard(
                name: 'Maria Santos',
                service: 'On-site repair',
                rating: '4.9',
                imageSeed: 2,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
