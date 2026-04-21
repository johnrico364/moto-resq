import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:user/pages/shared/app_colors.dart';
import 'package:user/pages/technicians/widgets/technician_photo_background.dart';
import 'package:user/pages/technicians/widgets/technician_summary_card.dart';

/// Full-screen technician profile (navy header, hero photo, expertise, more technicians).
class TechnicianDetailPage extends StatelessWidget {
  const TechnicianDetailPage({
    super.key,
    required this.name,
    required this.expertise,
    required this.rating,
    required this.imageSeed,
    this.isOnline = true,
    this.distance,
    this.eta,
  });

  final String name;
  final String expertise;
  final String rating;
  final int imageSeed;
  final bool isOnline;

  /// When opened from nearby list (optional).
  final String? distance;
  final String? eta;

  /// Hero fills screen width; height is a fraction of viewport (clamped).
  static const double _heroHeightFraction = 0.42;
  static const double _heroHeightMin = 260.0;
  static const double _heroHeightMax = 440.0;
  static const double _heroBottomRadius = 24.0;

  /// Opens detail with a route that supports iOS edge-swipe back.
  static Future<void> open(
    BuildContext context, {
    required String name,
    required String expertise,
    required String rating,
    required int imageSeed,
    bool isOnline = true,
    String? distance,
    String? eta,
  }) {
    return Navigator.of(context).push<void>(
      _route(
        name: name,
        expertise: expertise,
        rating: rating,
        imageSeed: imageSeed,
        isOnline: isOnline,
        distance: distance,
        eta: eta,
      ),
    );
  }

  /// Replaces the current detail (e.g. from "More technicians") while keeping back history sensible.
  static Future<void> replaceWith(
    BuildContext context, {
    required String name,
    required String expertise,
    required String rating,
    required int imageSeed,
    bool isOnline = true,
    String? distance,
    String? eta,
  }) {
    return Navigator.of(context).pushReplacement<void, void>(
      _route(
        name: name,
        expertise: expertise,
        rating: rating,
        imageSeed: imageSeed,
        isOnline: isOnline,
        distance: distance,
        eta: eta,
      ),
    );
  }

  static Route<void> _route({
    required String name,
    required String expertise,
    required String rating,
    required int imageSeed,
    bool isOnline = true,
    String? distance,
    String? eta,
  }) {
    final page = TechnicianDetailPage(
      name: name,
      expertise: expertise,
      rating: rating,
      imageSeed: imageSeed,
      isOnline: isOnline,
      distance: distance,
      eta: eta,
    );
    if (!kIsWeb && defaultTargetPlatform == TargetPlatform.iOS) {
      return CupertinoPageRoute<void>(builder: (_) => page);
    }
    return MaterialPageRoute<void>(builder: (_) => page);
  }

  void _goBack(BuildContext context) {
    Navigator.maybePop(context);
  }

  @override
  Widget build(BuildContext context) {
    final top = MediaQuery.paddingOf(context).top;
    final bottom = MediaQuery.paddingOf(context).bottom;
    final w = MediaQuery.sizeOf(context).width;
    final screenH = MediaQuery.sizeOf(context).height;
    final heroBodyH = (screenH * _heroHeightFraction).clamp(_heroHeightMin, _heroHeightMax);
    final heroTotalH = top + heroBodyH;
    final heroIconSize = (w * 0.26).clamp(76.0, 112.0);

    final more = <({String n, String s, String r, int seed})>[
      (n: 'Francis Ampoon', s: 'Towing', r: '4.8', seed: 1),
      (n: 'Maria Santos', s: 'On-site repair', r: '4.9', seed: 2),
    ];

    return Scaffold(
      backgroundColor: AppColors.pageGrey,
      body: Stack(
        clipBehavior: Clip.none,
        children: [
          SingleChildScrollView(
            physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    bottom: Radius.circular(_heroBottomRadius),
                  ),
                  child: SizedBox(
                    width: double.infinity,
                    height: heroTotalH,
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        TechnicianPhotoBackground(
                          imageSeed: imageSeed,
                          iconSize: heroIconSize,
                        ),
                        Positioned(
                          top: 0,
                          left: 0,
                          right: 0,
                          height: top + 52,
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [
                                  Colors.black.withValues(alpha: 0.35),
                                  Colors.transparent,
                                ],
                              ),
                            ),
                          ),
                        ),
                        Positioned(
                          left: 0,
                          right: 0,
                          bottom: 0,
                          height: 72,
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [
                                  Colors.transparent,
                                  Colors.black.withValues(alpha: 0.12),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Transform.translate(
                  offset: const Offset(0, -14),
                  child: Container(
                    width: double.infinity,
                    margin: EdgeInsets.zero,
                    padding: const EdgeInsets.fromLTRB(22, 26, 22, 26),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(22),
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.07),
                          blurRadius: 24,
                          offset: const Offset(0, -6),
                        ),
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.04),
                          blurRadius: 16,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Text(
                              name,
                              style: const TextStyle(
                                fontSize: 26,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF0A0A0A),
                                letterSpacing: -0.5,
                                height: 1.12,
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          if (isOnline)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: const Color(0xFFE8F5E9),
                                borderRadius: BorderRadius.circular(999),
                                border: Border.all(
                                  color: const Color(0xFFC8E6C9),
                                ),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    width: 7,
                                    height: 7,
                                    decoration: const BoxDecoration(
                                      color: Color(0xFF2E7D32),
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  Text(
                                    'Online',
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                      color: Colors.green.shade900,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFF8E1),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFFFE082).withValues(alpha: 0.6)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.star_rounded, color: Color(0xFFFFA000), size: 22),
                            const SizedBox(width: 6),
                            Text(
                              rating,
                              style: const TextStyle(
                                fontSize: 17,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF0A0A0A),
                              ),
                            ),
                            Text(
                              ' rating',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: Colors.grey.shade700,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 28),
                      Row(
                        children: [
                          Container(
                            width: 4,
                            height: 20,
                            decoration: BoxDecoration(
                              color: AppColors.accentBlue,
                              borderRadius: BorderRadius.circular(2),
                            ),
                          ),
                          const SizedBox(width: 10),
                          const Text(
                            'Expertise',
                            style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF0A0A0A),
                              letterSpacing: -0.2,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              AppColors.accentBlue.withValues(alpha: 0.08),
                              const Color(0xFFF0F4FA),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: AppColors.line),
                        ),
                        child: Text(
                          expertise,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF0A0A0A),
                          ),
                        ),
                      ),
                      if (distance != null || eta != null) ...[
                        const SizedBox(height: 24),
                        Row(
                          children: [
                            Container(
                              width: 4,
                              height: 20,
                              decoration: BoxDecoration(
                                color: AppColors.accentBlue,
                                borderRadius: BorderRadius.circular(2),
                              ),
                            ),
                            const SizedBox(width: 10),
                            const Text(
                              'Location & arrival',
                              style: TextStyle(
                                fontSize: 17,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF0A0A0A),
                                letterSpacing: -0.2,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            if (distance != null)
                              Expanded(
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF7F9FC),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(color: AppColors.line),
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(
                                        Icons.pin_drop_outlined,
                                        size: 22,
                                        color: AppColors.accentBlue,
                                      ),
                                      const SizedBox(width: 10),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              'Distance',
                                              style: TextStyle(
                                                fontSize: 12,
                                                fontWeight: FontWeight.w600,
                                                color: Colors.grey.shade600,
                                              ),
                                            ),
                                            const SizedBox(height: 2),
                                            Text(
                                              distance!,
                                              style: const TextStyle(
                                                fontSize: 15,
                                                fontWeight: FontWeight.w800,
                                                color: Color(0xFF0A0A0A),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            if (distance != null && eta != null) const SizedBox(width: 12),
                            if (eta != null)
                              Expanded(
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF7F9FC),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(color: AppColors.line),
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(
                                        Icons.schedule_rounded,
                                        size: 22,
                                        color: AppColors.accentBlue,
                                      ),
                                      const SizedBox(width: 10),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              'ETA',
                                              style: TextStyle(
                                                fontSize: 12,
                                                fontWeight: FontWeight.w600,
                                                color: Colors.grey.shade600,
                                              ),
                                            ),
                                            const SizedBox(height: 2),
                                            Text(
                                              eta!,
                                              style: const TextStyle(
                                                fontSize: 15,
                                                fontWeight: FontWeight.w800,
                                                color: Color(0xFF0A0A0A),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 28, 20, 12),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      'More technicians',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: AppColors.navy,
                        letterSpacing: -0.35,
                      ),
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                     
                    },
                    style: TextButton.styleFrom(
                      foregroundColor: AppColors.accentBlue,
                      backgroundColor: AppColors.accentBlue.withValues(alpha: 0.1),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(999),
                      ),
                      textStyle: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    child: const Text('View All'),
                  ),
                ],
              ),
            ),
            SizedBox(
              height: 204,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                primary: false,
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 12),
                itemCount: more.length,
                separatorBuilder: (_, unused) => const SizedBox(width: 14),
                itemBuilder: (context, i) {
                  final t = more[i];
                  return TechnicianSummaryCard(
                    name: t.n,
                    service: t.s,
                    rating: t.r,
                    imageSeed: t.seed,
                    onTap: () {
                      TechnicianDetailPage.replaceWith(
                        context,
                        name: t.n,
                        expertise: t.s,
                        rating: t.r,
                        imageSeed: t.seed,
                      );
                    },
                  );
                },
              ),
            ),
            SizedBox(height: bottom + 28),
          ],
        ),
      ),
      SafeArea(
        bottom: false,
        child: Align(
          alignment: Alignment.topLeft,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(12, 8, 12, 0),
            child: Material(
              color: Colors.white.withValues(alpha: 0.22),
              elevation: 6,
              shadowColor: Colors.black38,
              borderRadius: BorderRadius.circular(999),
              clipBehavior: Clip.antiAlias,
              child: InkWell(
                onTap: () => _goBack(context),
                borderRadius: BorderRadius.circular(999),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.arrow_back_rounded,
                        color: Colors.white,
                        size: 22,
                      ),
                      const SizedBox(width: 6),
                     
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ],
  ),
    );
  }
}
