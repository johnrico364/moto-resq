import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:user/pages/home/help/help.dart';
import 'package:user/pages/shared/app_colors.dart';

class HelpFab extends StatelessWidget {
  const HelpFab({super.key});

  @override
  Widget build(BuildContext context) {
    return Material(
      elevation: 12,
      shadowColor: Colors.black.withValues(alpha: 0.18),
      color: Colors.white,
      shape: const CircleBorder(),
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: () {
          Navigator.of(context).push<void>(
            MaterialPageRoute<void>(builder: (_) => const RequestHelpPage()),
          );
        },
        child: Ink(
          width: 76,
          height: 76,
          decoration: const BoxDecoration(shape: BoxShape.circle, color: Colors.white),
          child: Stack(
            alignment: Alignment.center,
            children: [
              CustomPaint(
                size: const Size(76, 76),
                painter: HelpRingPainter(color: AppColors.navy),
              ),
              Text(
                'HELP',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w900,
                  color: AppColors.navy,
                  letterSpacing: 0.5,
                ),
              ),
              Positioned(
                right: 6,
                bottom: 8,
                child: Icon(Icons.phone_in_talk_rounded, color: AppColors.navy, size: 22),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class HelpRingPainter extends CustomPainter {
  HelpRingPainter({required this.color});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final c = Offset(size.width / 2, size.height / 2);
    final r = size.width * 0.38;
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3
      ..strokeCap = StrokeCap.round;

    const start = 0.35 * math.pi;
    const sweep = 1.45 * math.pi;
    canvas.drawArc(Rect.fromCircle(center: c, radius: r), start, sweep, false, paint);
  }

  @override
  bool shouldRepaint(covariant HelpRingPainter oldDelegate) => oldDelegate.color != color;
}
