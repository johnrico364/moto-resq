import 'package:flutter/material.dart';
import 'package:technicians/pages/homepage/dashboard.dart';
import 'package:technicians/pages/transaction/transaction.dart';
import 'package:technicians/pages/chat/chats.dart';
import 'package:technicians/pages/profile/profile.dart';

class NavBar extends StatelessWidget {
  final int selectedIndex;
  final Function(int) onTap;

  const NavBar({
    super.key,
    required this.selectedIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: selectedIndex,
      onTap: (index) {
        onTap(index);
        _navigateToPage(context, index);
      },
      items: [
        BottomNavigationBarItem(
          icon: Icon(Icons.home, size: 24),
          label: 'Dashboard',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.receipt, size: 24),
          label: 'Transaction',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.chat_bubble, size: 24),
          label: 'Chats',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person, size: 24),
          label: 'Profile',
        ),
      ],
      type: BottomNavigationBarType.fixed,
      selectedItemColor: Color(0xFF2E9FFF),
      unselectedItemColor: Colors.grey[400],
      backgroundColor: Colors.white,
      elevation: 8,
    );
  }

  void _navigateToPage(BuildContext context, int index) {
    // Get the current route name
    final currentRoute = ModalRoute.of(context)?.settings.name ?? '';

    switch (index) {
      case 0:
        // Dashboard
        if (!currentRoute.contains('dashboard')) {
          Navigator.pushAndRemoveUntil(
            context,
            MaterialPageRoute(
              builder: (context) => const HomePage(),
              settings: const RouteSettings(name: '/dashboard'),
            ),
            (route) => false,
          );
        }
        break;
      case 1:
        // Transaction
        if (!currentRoute.contains('transaction')) {
          Navigator.pushAndRemoveUntil(
            context,
            MaterialPageRoute(
              builder: (context) => const TransactionPage(),
              settings: const RouteSettings(name: '/transaction'),
            ),
            (route) => false,
          );
        }
        break;
      case 2:
        // Chats
        if (!currentRoute.contains('chats')) {
          Navigator.pushAndRemoveUntil(
            context,
            MaterialPageRoute(
              builder: (context) => const ChatsPage(),
              settings: const RouteSettings(name: '/chats'),
            ),
            (route) => false,
          );
        }
        break;
      case 3:
        // Profile
        if (!currentRoute.contains('profile')) {
          Navigator.pushAndRemoveUntil(
            context,
            MaterialPageRoute(
              builder: (context) => const ProfilePage(),
              settings: const RouteSettings(name: '/profile'),
            ),
            (route) => false,
          );
        }
        break;
    }
  }
}
