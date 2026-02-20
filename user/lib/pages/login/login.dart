import 'package:flutter/material.dart';

import '../signup/signup.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  static const _primaryBlue = Color(0xFF2196F3);
  static const _darkBg = Color(0xFF1A2B3D);
  static const _inputBg = Color(0xFF1E2D3F);

  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          color: _darkBg,
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF0F172A),
              Color(0xFF1A2B3D),
              Color(0xFF0F172A),
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              Align(
                alignment: Alignment.centerLeft,
                child: IconButton(
                  onPressed: () => Navigator.of(context).pop(),
                  icon: const Icon(Icons.arrow_back_ios_new),
                  color: Colors.white,
                ),
              ),
              Expanded(
                child: SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        const SizedBox(height: 16),
                  // Header
                  const Text(
                    'Welcome',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Please enter your details to login',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey.shade400,
                    ),
                  ),
                  const SizedBox(height: 40),
                  // Email field with icon
                  TextField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'Email address',
                      hintStyle: TextStyle(color: Colors.grey.shade500),
                      prefixIcon: Icon(
                        Icons.email_outlined,
                        color: Colors.grey.shade500,
                        size: 22,
                      ),
                      filled: true,
                      fillColor: _inputBg,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: _primaryBlue),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(color: Colors.grey.shade600),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: _primaryBlue, width: 2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Password field with icon
                  TextField(
                    controller: _passwordController,
                    obscureText: true,
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'Password',
                      hintStyle: TextStyle(color: Colors.grey.shade500),
                      prefixIcon: Icon(
                        Icons.lock_outline,
                        color: Colors.grey.shade500,
                        size: 22,
                      ),
                      filled: true,
                      fillColor: _inputBg,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: _primaryBlue),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(color: Colors.grey.shade600),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: _primaryBlue, width: 2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      TextButton(
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => const SignUpPage(),
                            ),
                          );
                        },
                        style: TextButton.styleFrom(
                          foregroundColor: _primaryBlue,
                          padding: const EdgeInsets.symmetric(horizontal: 0),
                        ),
                        child: const Text('Sign Up'),
                      ),
                      TextButton(
                        onPressed: () {
                          // TODO: Forgot password
                        },
                        style: TextButton.styleFrom(
                          foregroundColor: _primaryBlue,
                          padding: const EdgeInsets.symmetric(horizontal: 0),
                        ),
                        child: const Text('Forgot password?'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  // Login button
                  SizedBox(
                    height: 54,
                    child: ElevatedButton(
                      onPressed: () {
                        // TODO: Authenticate
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _primaryBlue,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        elevation: 0,
                      ),
                      child: const Text('Login'),
                    ),
                  ),
                  const SizedBox(height: 24),
                  // Or separator
                  Row(
                    children: [
                      Expanded(
                        child: Divider(color: Colors.grey.shade600),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Text(
                          'Or',
                          style: TextStyle(color: Colors.grey.shade500),
                        ),
                      ),
                      Expanded(
                        child: Divider(color: Colors.grey.shade600),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  // Login with Google
                  SizedBox(
                    height: 54,
                    child: OutlinedButton(
                      onPressed: () {
                        // TODO: Google sign in
                      },
                      style: OutlinedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: const Color(0xFF333333),
                        side: BorderSide(color: Colors.grey.shade400),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Image.network(
                            'https://www.google.com/favicon.ico',
                            width: 20,
                            height: 20,
                            errorBuilder: (_, __, ___) => const Icon(
                              Icons.g_mobiledata,
                              size: 24,
                              color: Color(0xFF4285F4),
                            ),
                          ),
                          const SizedBox(width: 12),
                          const Text('Login with Google'),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 40),
                ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
