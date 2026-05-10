import 'package:flutter/material.dart';
import 'package:user/api/technician_api.dart';
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
        FutureBuilder<List<TechnicianSummary>>(
          future: TechnicianApi.getAll(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const SizedBox(
                height: 228,
                child: Center(child: CircularProgressIndicator()),
              );
            }
            if (snapshot.hasError) {
              return const SizedBox(
                height: 228,
                child: Center(child: Text('Failed to load technicians')),
              );
            }

            final data = snapshot.data ?? const <TechnicianSummary>[];
            if (data.isEmpty) {
              return const SizedBox(
                height: 228,
                child: Center(child: Text('No technicians found')),
              );
            }

            return SizedBox(
              height: 228,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                clipBehavior: Clip.none,
                itemCount: data.length,
                separatorBuilder: (_, index) => const SizedBox(width: 14),
                itemBuilder: (context, index) {
                  final tech = data[index];
                  return HomeTechnicianCard(
                    name: tech.name,
                    service: tech.expertise,
                    rating: tech.rating,
                    imageSeed: index + 1,
                  );
                },
              ),
            );
          },
        ),
      ],
    );
  }
}
