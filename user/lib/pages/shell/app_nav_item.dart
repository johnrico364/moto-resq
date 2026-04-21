import 'package:flutter/material.dart';

/// Bottom navigation descriptor (outline vs selected icon).
class AppNavItem {
  const AppNavItem({
    required this.title,
    required this.icon,
    this.selectedIcon,
  });

  final String title;
  final IconData icon;
  final IconData? selectedIcon;
}
