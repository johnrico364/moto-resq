import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  final List<_NavItem> _navItems = const [
    _NavItem(title: 'Home', icon: Icons.home_outlined),
    _NavItem(title: 'Technicians', icon: Icons.engineering_outlined),
    _NavItem(title: 'History', icon: Icons.history),
    _NavItem(title: 'Profile', icon: Icons.person_outline),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          // Dark header
          Container(
            width: double.infinity,
            padding: const EdgeInsets.fromLTRB(20, 48, 20, 20),
            decoration: const BoxDecoration(color: Color(0xFF1A2B3D)),
            child: Center(
              child: Text(
                _navItems[_selectedIndex].title.toUpperCase(),
                style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                letterSpacing: 1.2,
              ),
            ),
            ),
          ),
          // White content area with rounded top corners
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
              ),
              child: _buildPageContent(),
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: List.generate(
                _navItems.length,
                (index) => _NavBarItem(
                  item: _navItems[index],
                  isSelected: _selectedIndex == index,
                  onTap: () => setState(() => _selectedIndex = index),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPageContent() {
    switch (_selectedIndex) {
      case 0:
        return const _PlaceholderContent(title: 'Home');
      case 1:
        return const _PlaceholderContent(title: 'Technicians');
      case 2:
        return const _PlaceholderContent(title: 'History');
      case 3:
        return const _PlaceholderContent(title: 'Profile');
      default:
        return const _PlaceholderContent(title: '');
    }
  }
}

class _NavItem {
  const _NavItem({required this.title, required this.icon});

  final String title;
  final IconData icon;
}

class _NavBarItem extends StatelessWidget {
  const _NavBarItem({
    required this.item,
    required this.isSelected,
    required this.onTap,
  });

  final _NavItem item;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final color = isSelected ? const Color(0xFF2196F3) : Colors.black87;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(item.icon, size: 24, color: color),
            const SizedBox(height: 4),
            Text(
              item.title,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PlaceholderContent extends StatelessWidget {
  const _PlaceholderContent({required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        '$title content goes here',
        style: TextStyle(fontSize: 16, color: Colors.grey.shade600),
      ),
    );
  }
}
