import 'package:flutter/material.dart';
import 'package:user/pages/shared/app_colors.dart';
import 'package:user/pages/shared/tech_avatar.dart';
import 'package:user/pages/technicians/models/nearby_technician.dart';
import 'package:user/pages/technicians/technician_detail_page.dart';

class NearbyTechnicianTile extends StatelessWidget {
  const NearbyTechnicianTile({super.key, required this.data});

  final NearbyTechnician data;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        onTap: () {
          TechnicianDetailPage.open(
            context,
            name: data.name,
            expertise: data.service ?? 'Towing',
            rating: data.rating ?? '4.8',
            imageSeed: data.seed,
            distance: data.distance,
            eta: data.eta,
          );
        },
        borderRadius: BorderRadius.circular(16),
        splashColor: AppColors.accentBlue.withValues(alpha: 0.08),
        highlightColor: Colors.grey.shade100,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              TechAvatar(seed: data.seed),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      data.name,
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
                      'Technician',
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.grey.shade600,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    data.distance,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0A0A0A),
                      letterSpacing: -0.2,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    data.eta,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey.shade600,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
