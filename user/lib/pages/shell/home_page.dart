import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:user/pages/history/history_tab.dart';
import 'package:user/pages/home/home_tab.dart';
import 'package:user/pages/home/widgets/help_fab.dart';
import 'package:user/pages/profile/profile_tab.dart';
import 'package:user/pages/shared/app_colors.dart';
import 'package:user/pages/shell/app_bottom_nav_bar.dart';
import 'package:user/pages/shell/app_nav_item.dart';
import 'package:user/pages/technicians/technicians_tab.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  final List<GlobalKey<NavigatorState>> _tabNavigatorKeys = List.generate(
    4,
    (_) => GlobalKey<NavigatorState>(),
  );

  static const List<AppNavItem> _navItems = [
    AppNavItem(
      title: 'Home',
      icon: Icons.home_outlined,
      selectedIcon: Icons.home_rounded,
    ),
    AppNavItem(
      title: 'Technicians',
      icon: Icons.engineering_outlined,
      selectedIcon: Icons.engineering,
    ),
    AppNavItem(
      title: 'History',
      icon: Icons.receipt_long_outlined,
      selectedIcon: Icons.receipt_long,
    ),
    AppNavItem(
      title: 'Profile',
      icon: Icons.account_circle_outlined,
      selectedIcon: Icons.account_circle,
    ),
  ];

  Widget _tabNavigator(int index, Widget root) {
    return Navigator(
      key: _tabNavigatorKeys[index],
      onGenerateRoute: (settings) {
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => root,
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (didPop) return;
        final nav = _tabNavigatorKeys[_selectedIndex].currentState;
        if (nav != null && nav.canPop()) {
          nav.pop();
          return;
        }
        SystemNavigator.pop();
      },
      child: Scaffold(
        backgroundColor: AppColors.pageGrey,
        body: Stack(
          clipBehavior: Clip.none,
          children: [
            Positioned.fill(
              child: IndexedStack(
                index: _selectedIndex,
                children: [
                  _tabNavigator(0, const HomeTab()),
                  _tabNavigator(1, const TechniciansTab()),
                  _tabNavigator(2, const HistoryTab()),
                  _tabNavigator(3, const ProfileTab()),
                ],
              ),
            ),
            if (_selectedIndex == 0)
              Positioned(
                right: 20,
                bottom: MediaQuery.paddingOf(context).bottom + 72,
                child: const HelpFab(),
              ),
          ],
        ),
        bottomNavigationBar: AppBottomNavBar(
          items: _navItems,
          selectedIndex: _selectedIndex,
          onItemSelected: (index) => setState(() => _selectedIndex = index),
        ),
      ),
    );
  }
}
