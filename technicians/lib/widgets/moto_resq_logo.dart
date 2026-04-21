import 'package:flutter/material.dart';
import 'dart:math' as math;

class MotoResQlogo extends StatelessWidget {
  final double size;
  final bool showSubtitle;

  const MotoResQlogo({
    super.key,
    this.size = 80,
    this.showSubtitle = true,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Logo Icon with gear design
        Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(
              color: Colors.white,
              width: 2,
            ),
          ),
          child: Stack(
            alignment: Alignment.center,
            children: [
              // Gear/cog background
              CustomPaint(
                size: Size(size, size),
                painter: GearPainter(),
              ),
              // Wrench icon in center
              Icon(
                Icons.build_rounded,
                color: Colors.white,
                size: size * 0.5,
              ),
            ],
          ),
        ),
        SizedBox(height: 12),
        // Text
        Text(
          'MotoResQ',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: Colors.white,
            letterSpacing: 0.5,
          ),
        ),
        if (showSubtitle) ...[
          SizedBox(height: 4),
          Text(
            'Vehicle Repair Anytime',
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey[400],
              letterSpacing: 0.3,
            ),
          ),
        ],
      ],
    );
  }
}

// Custom painter for gear design
class GearPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 8;

    // Draw outer circle
    canvas.drawCircle(center, radius, paint);

    // Draw teeth/gear points
    final toothCount = 12;
    for (int i = 0; i < toothCount; i++) {
      final angle = (i * 2 * 3.14159) / toothCount;
      final x1 = center.dx + (radius - 4) * math.cos(angle);
      final y1 = center.dy + (radius - 4) * math.sin(angle);
      final x2 = center.dx + (radius + 4) * math.cos(angle);
      final y2 = center.dy + (radius + 4) * math.sin(angle);

      canvas.drawLine(Offset(x1, y1), Offset(x2, y2), paint);
    }

    // Draw inner circle
    canvas.drawCircle(center, radius * 0.6, paint);
  }

  @override
  bool shouldRepaint(GearPainter oldDelegate) => false;

  double cos(double angle) => math.cos(angle);
  double sin(double angle) => math.sin(angle);
}

class Math {
  static double cos(double x) => math.cos(x);
  static double sin(double x) => math.sin(x);
}
