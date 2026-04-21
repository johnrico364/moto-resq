import 'package:flutter/material.dart';
import 'package:user/api/auth_storage.dart';
import 'package:user/auth/login/login.dart';
import 'package:user/pages/profile/widgets/profile_logout_card.dart';
import 'package:user/pages/profile/widgets/profile_menu_card.dart';
import 'package:user/pages/shared/app_colors.dart';

class ProfileTab extends StatelessWidget {
  const ProfileTab({super.key});

  @override
  Widget build(BuildContext context) {
    final h = MediaQuery.sizeOf(context).height;
    final w = MediaQuery.sizeOf(context).width;
    final top = MediaQuery.paddingOf(context).top;
    final bottomPad = MediaQuery.paddingOf(context).bottom + 24;
    final headerH = (h * 0.30).clamp(248.0, 320.0);
    final curveR = (w * 0.085).clamp(26.0, 40.0);
    const avatarR = 52.0;

    return ColoredBox(
      color: AppColors.pageGrey,
      child: SingleChildScrollView(
        padding: EdgeInsets.only(bottom: bottomPad),
        child: Column(
          children: [
            SizedBox(height: top),
            Stack(
              clipBehavior: Clip.none,
              alignment: Alignment.bottomCenter,
              children: [
                SizedBox(
                  height: headerH,
                  width: double.infinity,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          AppColors.navyHeaderTop,
                          AppColors.navy,
                          AppColors.navyDeep,
                        ],
                        stops: const [0.0, 0.5, 1.0],
                      ),
                      borderRadius: BorderRadius.vertical(
                        bottom: Radius.circular(curveR),
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.navy.withValues(alpha: 0.24),
                          blurRadius: 20,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                  ),
                ),
                Positioned(
                  bottom: -avatarR,
                  child: Container(
                    width: avatarR * 2,
                    height: avatarR * 2,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [Color(0xFF7986CB), Color(0xFF3949AB)],
                      ),
                      border: Border.all(color: Colors.white, width: 4),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.14),
                          blurRadius: 18,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    alignment: Alignment.center,
                    child: Icon(
                      Icons.person_rounded,
                      size: 56,
                      color: Colors.white.withValues(alpha: 0.95),
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: avatarR + 20),
            const Text(
              'Charlene Barrientos',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0A0A0A),
                letterSpacing: -0.45,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Joined March 2023',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey.shade600,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 28),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                children: [
                  ProfileMenuCard(
                    icon: Icons.person_outline_rounded,
                    label: 'Edit Profile',
                    onTap: () {
                  
                    },
                  ),
                  const SizedBox(height: 12),
                  ProfileMenuCard(
                    icon: Icons.directions_car_outlined,
                    label: 'Your vehicles',
                    onTap: () {
                      
                    },
                  ),
                  const SizedBox(height: 12),
                  ProfileMenuCard(
                    icon: Icons.support_agent_rounded,
                    label: 'Help & Support',
                    onTap: () {
                     
                    },
                  ),
                  const SizedBox(height: 12),
                  ProfileMenuCard(
                    icon: Icons.settings_outlined,
                    label: 'Setting',
                    onTap: () {
                      
                    },
                  ),
                  const SizedBox(height: 40),
                  Divider(height: 1, thickness: 1, color: Colors.grey.shade300),
                  const SizedBox(height: 24),
                  ProfileLogoutCard(
                    onTap: () async {
                      await AuthStorage.clearToken();
                      if (!context.mounted) return;
                      Navigator.of(context, rootNavigator: true).pushAndRemoveUntil(
                        MaterialPageRoute<void>(builder: (_) => const AuthLoginScreen()),
                        (route) => false,
                      );
                    },
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
