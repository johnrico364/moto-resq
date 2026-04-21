import 'package:flutter/material.dart';
import 'package:user/pages/home/widgets/home_vehicle_card.dart';
import 'package:user/pages/shared/app_colors.dart';

class CurvedHomeHeader extends StatelessWidget {
  const CurvedHomeHeader({
    super.key,
    required this.accentBlue,
  });

  final Color accentBlue;

  @override
  Widget build(BuildContext context) {
    final top = MediaQuery.paddingOf(context).top;
    final w = MediaQuery.sizeOf(context).width;
    final h = MediaQuery.sizeOf(context).height;
    // Shallower bottom curve reads cleaner than a very round “bubble”.
    final curveR = (w * 0.085).clamp(26.0, 40.0);
    final minBlueBlock = (h * 0.28).clamp(232.0, 300.0);

    return Container(
      width: double.infinity,
      constraints: BoxConstraints(minHeight: minBlueBlock),
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
            color: AppColors.navy.withValues(alpha: 0.22),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: EdgeInsets.fromLTRB(20, top + 18, 20, 36),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Expanded(
                  child: Text(
                    'Your vehicles',
                    style: TextStyle(
                      fontSize: 27,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                      letterSpacing: -0.5,
                      height: 1.15,
                      shadows: [
                        Shadow(
                          color: Color(0x22000000),
                          blurRadius: 12,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),
                  ),
                ),
                Material(
                  color: Colors.white.withValues(alpha: 0.14),
                  shape: const CircleBorder(),
                  clipBehavior: Clip.antiAlias,
                  child: InkWell(
                    onTap: () {
                    
                    },
                    child: const Padding(
                      padding: EdgeInsets.all(12),
                      child: Icon(Icons.search_rounded, color: Colors.white, size: 24),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 22),
            SizedBox(
              height: 148,
              child: ListView(
                scrollDirection: Axis.horizontal,
                clipBehavior: Clip.none,
                physics: const BouncingScrollPhysics(),
                children: [
                  HomeVehicleCard(
                    icon: Icons.directions_car_rounded,
                    plate: 'ABC123',
                    subtitle: 'Toyota, Vios',
                    accentColor: accentBlue,
                  ),
                  const SizedBox(width: 14),
                  const HomeVehicleCard(
                    icon: Icons.two_wheeler_rounded,
                    plate: 'DEF456',
                    subtitle: 'Yamaha, Mio',
                    accentColor: Color(0xFF3949AB),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
