import 'package:flutter/material.dart';
import 'package:technicians/auth/login/signin.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Moto ResQ Technicians',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF1E5BA8)),
        useMaterial3: true,
      ),
      // Initialize app on Login first before any landing screen.
      home: const SigninPage(),
    );
  }
}
