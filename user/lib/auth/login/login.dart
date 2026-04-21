import 'package:flutter/material.dart';
import 'package:user/api/api_config.dart';
import 'package:user/api/auth_api.dart';
import 'package:user/api/auth_storage.dart';
import 'package:user/auth/register/register.dart';
import 'package:user/pages/shell/home_page.dart';

/// Login screen: full-bleed navy hero + overlapping form sheet (same language as [AuthRegisterScreen]).
class AuthLoginScreen extends StatefulWidget {
  const AuthLoginScreen({super.key});

  @override
  State<AuthLoginScreen> createState() => _AuthLoginScreenState();
}

class _AuthLoginScreenState extends State<AuthLoginScreen> {
  static const Color _primaryNavy = Color(0xFF05053D);
  static const Color _pageBg = Color(0xFFF2F2F2);
  static const Color _mutedGray = Color(0xFF8E8E8E);
  static const Color _facebookBlue = Color(0xFF1877F2);

  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _isLoading = false;
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final topInset = MediaQuery.paddingOf(context).top;
    final screenH = MediaQuery.sizeOf(context).height;
    final screenW = MediaQuery.sizeOf(context).width;
    // Match register: shared hero scale, overlap, and corner radii for a consistent auth flow.
    final headerH = (screenH * 0.30 + topInset * 0.45).clamp(220.0, 292.0);
    final overlap = (headerH * 0.135).clamp(36.0, 54.0);
    final topRightR = (screenW * 0.28).clamp(72.0, 120.0);
    const topLeftR = 18.0;

    return Scaffold(
      backgroundColor: _primaryNavy,
      body: Stack(
        fit: StackFit.expand,
        children: [
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: headerH,
            child: Padding(
              padding: EdgeInsets.fromLTRB(16, topInset + 8, 16, 12),
              child: Center(
                child: Image.asset(
                  'assets/images/auth_logo.png',
                  fit: BoxFit.contain,
                ),
              ),
            ),
          ),
          Positioned(
            top: headerH - overlap,
            left: 0,
            right: 0,
            bottom: 0,
            child: ClipRRect(
              clipBehavior: Clip.antiAlias,
              borderRadius: BorderRadius.only(
                topLeft: const Radius.circular(topLeftR),
                topRight: Radius.circular(topRightR),
              ),
              child: ColoredBox(
                color: _pageBg,
                child: SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(24, 24, 24, 28),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Welcome',
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w800,
                          color: _primaryNavy,
                          height: 1.1,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Hello there, login to continue',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w400,
                          color: _mutedGray,
                        ),
                      ),
                      const SizedBox(height: 28),
                      const Text(
                        'Email Address',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: _primaryNavy,
                        ),
                      ),
                      const SizedBox(height: 8),
                      _pillField(
                        controller: _emailController,
                        hintText: 'Enter your email',
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: 18),
                      const Text(
                        'Password',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: _primaryNavy,
                        ),
                      ),
                      const SizedBox(height: 8),
                      _pillField(
                        controller: _passwordController,
                        hintText: 'Enter your password',
                        obscureText: _obscurePassword,
                        suffixIcon: IconButton(
                          onPressed: () =>
                              setState(() => _obscurePassword = !_obscurePassword),
                          tooltip:
                              _obscurePassword ? 'Show password' : 'Hide password',
                          icon: Icon(
                            _obscurePassword
                                ? Icons.visibility_outlined
                                : Icons.visibility_off_outlined,
                            color: _mutedGray,
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),
                      Align(
                        alignment: Alignment.centerRight,
                        child: TextButton(
                          onPressed: () {
                            
                          },
                          style: TextButton.styleFrom(
                            foregroundColor: _primaryNavy,
                            padding: EdgeInsets.zero,
                            minimumSize: Size.zero,
                            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            textStyle: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          child: const Text('Forgot password?'),
                        ),
                      ),
                      const SizedBox(height: 8),
                      DecoratedBox(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(999),
                          boxShadow: [
                            BoxShadow(
                              color: _primaryNavy.withValues(alpha: 0.32),
                              blurRadius: 18,
                              offset: const Offset(0, 10),
                            ),
                          ],
                        ),
                        child: SizedBox(
                          width: double.infinity,
                          height: 52,
                          child: FilledButton(
                            onPressed: _isLoading ? null : _onLogin,
                            style: FilledButton.styleFrom(
                              backgroundColor: _primaryNavy,
                              foregroundColor: Colors.white,
                              elevation: 0,
                              shadowColor: Colors.transparent,
                              shape: const StadiumBorder(),
                              textStyle: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            child: _isLoading
                                ? const SizedBox(
                                    height: 22,
                                    width: 22,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2.2,
                                      color: Colors.white,
                                    ),
                                  )
                                : const Text('Login'),
                          ),
                        ),
                      ),
                      const SizedBox(height: 22),
                      Row(
                        children: [
                          Expanded(child: Divider(height: 1, color: Colors.grey.shade300)),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            child: Text(
                              'or sign with',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey.shade500,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                          Expanded(child: Divider(height: 1, color: Colors.grey.shade300)),
                        ],
                      ),
                      const SizedBox(height: 20),
                      Row(
                        children: [
                          Expanded(
                            child: _SocialPillButton(
                              backgroundColor: Colors.white,
                              foregroundColor: _mutedGray,
                              label: 'Google',
                              leading: const _GoogleMark(size: 20),
                              onPressed: () {
                              
                              },
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _SocialPillButton(
                              backgroundColor: _facebookBlue,
                              foregroundColor: Colors.white,
                              label: 'Facebook',
                              leading: const Icon(Icons.facebook, size: 22, color: Colors.white),
                              onPressed: () {
                               
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 28),
                      Center(
                        child: Text.rich(
                          TextSpan(
                            style: const TextStyle(fontSize: 14, color: _mutedGray),
                            children: [
                              const TextSpan(text: "Don't have an Account? "),
                              WidgetSpan(
                                alignment: PlaceholderAlignment.baseline,
                                baseline: TextBaseline.alphabetic,
                                child: GestureDetector(
                                  onTap: () {
                                    Navigator.of(context).push(
                                      MaterialPageRoute<void>(
                                        builder: (context) => const AuthRegisterScreen(),
                                      ),
                                    );
                                  },
                                  child: const Text(
                                    'Sign up',
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w800,
                                      color: _primaryNavy,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _onLogin() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text;

    if (email.isEmpty || password.isEmpty) {
      _toast('Please enter email and password');
      return;
    }

    setState(() => _isLoading = true);
    try {
      final token = await AuthApi.signin(email: email, password: password);
      await AuthStorage.saveToken(token);
      if (!mounted) return;
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute<void>(builder: (_) => const HomePage()),
        (route) => false,
      );
    } on AuthApiException catch (e) {
      _toast(e.message);
    } catch (e, st) {
      debugPrint('Login network error: $e\n$st');
      _toast(
        'Cannot reach ${ApiConfig.baseUrl}. On a real phone use your PC LAN IP, e.g.:\n'
        'flutter run --dart-define=API_DEV_HOST=192.168.x.x',
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _toast(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  Widget _pillField({
    required TextEditingController controller,
    required String hintText,
    TextInputType? keyboardType,
    bool obscureText = false,
    Widget? suffixIcon,
  }) {
    return Material(
      color: Colors.white,
      elevation: 2,
      shadowColor: Colors.black26,
      borderRadius: BorderRadius.circular(999),
      child: TextField(
        controller: controller,
        keyboardType: keyboardType,
        obscureText: obscureText,
        style: const TextStyle(
          fontSize: 15,
          color: _primaryNavy,
          fontWeight: FontWeight.w500,
        ),
        decoration: InputDecoration(
          hintText: hintText,
          hintStyle: TextStyle(color: Colors.grey.shade400, fontWeight: FontWeight.w400),
          isDense: true,
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          suffixIcon: suffixIcon,
          suffixIconConstraints: const BoxConstraints(
            minWidth: 44,
            minHeight: 44,
          ),
        ),
      ),
    );
  }
}

class _SocialPillButton extends StatelessWidget {
  const _SocialPillButton({
    required this.backgroundColor,
    required this.foregroundColor,
    required this.label,
    required this.leading,
    required this.onPressed,
  });

  final Color backgroundColor;
  final Color foregroundColor;
  final String label;
  final Widget leading;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: backgroundColor,
      elevation: backgroundColor == Colors.white ? 1.5 : 0,
      shadowColor: Colors.black26,
      borderRadius: BorderRadius.circular(999),
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(999),
        child: SizedBox(
          height: 48,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              leading,
              const SizedBox(width: 8),
              Text(
                label,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: foregroundColor,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Compact multi-color “G” mark without extra packages.
class _GoogleMark extends StatelessWidget {
  const _GoogleMark({required this.size});

  final double size;

  @override
  Widget build(BuildContext context) {
    final s = size;
    return SizedBox(
      width: s,
      height: s,
      child: CustomPaint(painter: _GoogleMarkPainter()),
    );
  }
}

class _GoogleMarkPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final stroke = w * 0.14;
    final rect = Rect.fromLTWH(stroke * 0.5, stroke * 0.5, w - stroke, h - stroke);

    final blue = const Color(0xFF4285F4);
    final green = const Color(0xFF34A853);
    final yellow = const Color(0xFFFBBC05);
    final red = const Color(0xFFEA4335);

    Paint strokePaint(Color c) => Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke
      ..strokeCap = StrokeCap.round
      ..color = c;

    canvas.drawArc(rect, -0.15 * 3.14159, 1.85 * 3.14159, false, strokePaint(red));
    canvas.drawArc(rect, 1.0 * 3.14159, 0.95 * 3.14159, false, strokePaint(yellow));
    canvas.drawArc(rect, 1.75 * 3.14159, 0.55 * 3.14159, false, strokePaint(green));
    canvas.drawArc(rect, -0.35 * 3.14159, -1.15 * 3.14159, false, strokePaint(blue));

    final bar = Paint()
      ..color = blue
      ..strokeWidth = stroke
      ..strokeCap = StrokeCap.round;
    canvas.drawLine(Offset(w * 0.58, h * 0.48), Offset(w * 0.88, h * 0.48), bar);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

