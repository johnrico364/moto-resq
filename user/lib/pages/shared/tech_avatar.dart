import 'package:flutter/material.dart';

class TechAvatar extends StatelessWidget {
  const TechAvatar({super.key, required this.seed});

  final int seed;

  @override
  Widget build(BuildContext context) {
    final colors = [
      const [Color(0xFF5C6BC0), Color(0xFF3949AB)],
      const [Color(0xFF00897B), Color(0xFF00695C)],
      const [Color(0xFFE65100), Color(0xFFBF360C)],
      const [Color(0xFF7B1FA2), Color(0xFF4A148C)],
    ];
    final pair = colors[(seed - 1) % colors.length];

    return Container(
      width: 56,
      height: 56,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: pair,
        ),
        boxShadow: [
          BoxShadow(
            color: pair[0].withValues(alpha: 0.35),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      alignment: Alignment.center,
      child: Icon(Icons.person_rounded, color: Colors.white.withValues(alpha: 0.95), size: 30),
    );
  }
}
