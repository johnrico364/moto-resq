import 'package:flutter/material.dart';
import 'package:user/pages/shared/app_colors.dart';
import 'package:user/pages/shared/capsule_search_bar.dart';
import 'package:user/pages/shared/filter_square_button.dart';
import 'package:user/pages/technicians/models/nearby_technician.dart';
import 'package:user/pages/technicians/widgets/nearby_technician_tile.dart';

class TechniciansTab extends StatelessWidget {
  const TechniciansTab({super.key});

  static const List<NearbyTechnician> _sampleTechs = [
    NearbyTechnician(
      name: 'Kent John C. Flores',
      distance: '57 km',
      eta: '~5 min away',
      seed: 1,
      service: 'Towing & recovery',
      rating: '4.8',
    ),
    NearbyTechnician(
      name: 'Maria Santos',
      distance: '12 km',
      eta: '~8 min away',
      seed: 2,
      service: 'On-site repair',
      rating: '4.9',
    ),
    NearbyTechnician(
      name: 'James Rivera',
      distance: '34 km',
      eta: '~12 min away',
      seed: 3,
      service: 'Battery & electrical',
      rating: '4.7',
    ),
    NearbyTechnician(
      name: 'Angela Cruz',
      distance: '6 km',
      eta: '~3 min away',
      seed: 4,
      service: 'Roadside assist',
      rating: '5.0',
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
              padding: EdgeInsets.fromLTRB(20, top + 18, 20, 40),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Text(
                    'Technicians',
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
                  const SizedBox(height: 28),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      const Expanded(
                        child: CapsuleSearchBar(hintText: 'Search technicians'),
                      ),
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
            color: const Color(0xFFFAFBFD),
            child: ListView.separated(
              padding: EdgeInsets.fromLTRB(20, 20, 20, bottomPad + 16),
              itemCount: 1 + _sampleTechs.length,
              separatorBuilder: (_, index) {
                if (index == 0) {
                  return const SizedBox(height: 12);
                }
                return Divider(height: 1, thickness: 1, color: Colors.grey.shade200.withValues(alpha: 0.85));
              },
              itemBuilder: (context, index) {
                if (index == 0) {
                  return Row(
                    children: [
                      Container(
                        width: 4,
                        height: 22,
                        decoration: BoxDecoration(
                          color: AppColors.accentBlue,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'Nearby technicians',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: Colors.grey.shade900,
                          letterSpacing: -0.3,
                        ),
                      ),
                    ],
                  );
                }
                return NearbyTechnicianTile(data: _sampleTechs[index - 1]);
              },
            ),
          ),
        ),
      ],
    );
  }
}
