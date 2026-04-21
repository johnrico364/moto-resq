import 'package:flutter/material.dart';

/// Gradient + gloss used for technician hero and card photos.
class TechnicianPhotoBackground extends StatelessWidget {
  const TechnicianPhotoBackground({
    super.key,
    required this.imageSeed,
    this.iconSize = 58,
  });

  final int imageSeed;
  final double iconSize;

  static List<Color> gradientColors(int imageSeed) {
    return imageSeed == 1
        ? const [Color(0xFF9FA8DA), Color(0xFF3949AB), Color(0xFF283593)]
        : const [Color(0xFF4DB6AC), Color(0xFF00897B), Color(0xFF004D40)];
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        DecoratedBox(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: gradientColors(imageSeed),
              stops: const [0.0, 0.55, 1.0],
            ),
          ),
        ),
        DecoratedBox(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Colors.white.withValues(alpha: 0.15),
                Colors.transparent,
              ],
            ),
          ),
        ),
        Center(
          child: Icon(
            Icons.person_rounded,
            size: iconSize,
            color: Colors.white.withValues(alpha: 0.92),
          ),
        ),
      ],
    );
  }
}
