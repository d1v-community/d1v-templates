import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

const _defaultApiBaseUrl = 'http://localhost:5173';

String get _apiBaseUrl {
  const value = String.fromEnvironment('API_BASE_URL', defaultValue: _defaultApiBaseUrl);
  return value.endsWith('/') ? value.substring(0, value.length - 1) : value;
}

class SessionState {
  const SessionState({
    this.token,
    this.email,
    this.displayName,
    this.devCode,
    this.loading = false,
    this.error,
  });

  final String? token;
  final String? email;
  final String? displayName;
  final String? devCode;
  final bool loading;
  final String? error;

  bool get authenticated => token != null && token!.isNotEmpty;

  SessionState copyWith({
    String? token,
    String? email,
    String? displayName,
    String? devCode,
    bool? loading,
    String? error,
    bool clearError = false,
  }) {
    return SessionState(
      token: token ?? this.token,
      email: email ?? this.email,
      displayName: displayName ?? this.displayName,
      devCode: devCode ?? this.devCode,
      loading: loading ?? this.loading,
      error: clearError ? null : error ?? this.error,
    );
  }
}

final sessionProvider = NotifierProvider<SessionController, SessionState>(SessionController.new);

class SessionController extends Notifier<SessionState> {
  static const _tokenKey = 'auth.token';

  @override
  SessionState build() {
    Future.microtask(_restore);
    return const SessionState();
  }

  Future<void> _restore() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_tokenKey);
    if (token == null || token.isEmpty) return;
    await refresh(tokenOverride: token);
  }

  Future<void> sendCode(String email) async {
    state = state.copyWith(loading: true, clearError: true, email: email);
    try {
      final response = await http.post(
        Uri.parse('$_apiBaseUrl/api/auth/send-code'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email}),
      );
      final json = jsonDecode(response.body) as Map<String, dynamic>;
      if (response.statusCode >= 400 || json['success'] != true) {
        throw Exception((json['error'] ?? 'Failed to send code').toString());
      }
      state = state.copyWith(loading: false, devCode: json['code']?.toString(), clearError: true);
    } catch (error) {
      state = state.copyWith(loading: false, error: error.toString());
    }
  }

  Future<void> verify(String email, String code) async {
    state = state.copyWith(loading: true, clearError: true);
    try {
      final response = await http.post(
        Uri.parse('$_apiBaseUrl/api/auth/verify-login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'code': code}),
      );
      final json = jsonDecode(response.body) as Map<String, dynamic>;
      if (response.statusCode >= 400 || json['success'] != true || json['token'] is! String) {
        throw Exception((json['error'] ?? 'Failed to login').toString());
      }
      final token = json['token'] as String;
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_tokenKey, token);
      await refresh(tokenOverride: token);
    } catch (error) {
      state = state.copyWith(loading: false, error: error.toString());
    }
  }

  Future<void> refresh({String? tokenOverride}) async {
    final prefs = await SharedPreferences.getInstance();
    final token = tokenOverride ?? prefs.getString(_tokenKey);
    if (token == null || token.isEmpty) {
      state = const SessionState();
      return;
    }

    state = state.copyWith(loading: true, clearError: true, token: token);
    try {
      final response = await http.get(
        Uri.parse('$_apiBaseUrl/api/auth/me'),
        headers: {'Authorization': 'Bearer $token'},
      );
      final json = jsonDecode(response.body) as Map<String, dynamic>;
      if (response.statusCode >= 400 || json['authenticated'] != true) {
        await signOut();
        return;
      }
      final user = json['user'] as Map<String, dynamic>;
      state = state.copyWith(
        loading: false,
        token: token,
        email: user['email']?.toString(),
        displayName: user['displayName']?.toString(),
        clearError: true,
      );
    } catch (error) {
      state = state.copyWith(loading: false, error: error.toString());
    }
  }

  Future<void> signOut() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    state = const SessionState();
  }
}

final routerProvider = Provider<GoRouter>((ref) {
  final notifier = ValueNotifier(ref.watch(sessionProvider).authenticated);
  ref.listen(sessionProvider, (_, next) {
    notifier.value = next.authenticated;
  });

  return GoRouter(
    initialLocation: '/login',
    refreshListenable: notifier,
    redirect: (_, state) {
      final authenticated = ref.read(sessionProvider).authenticated;
      if (!authenticated && state.uri.path != '/login') return '/login';
      if (authenticated && state.uri.path == '/login') return '/home';
      return null;
    },
    routes: [
      GoRoute(path: '/login', builder: (_, state) => const LoginPage()),
      GoRoute(path: '/home', builder: (_, state) => const HomePage()),
    ],
  );
});

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: TemplateApp()));
}

class TemplateApp extends ConsumerWidget {
  const TemplateApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      title: 'D1V Flutter Auth Client',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF020617),
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFFFB923C), brightness: Brightness.dark),
      ),
      routerConfig: router,
    );
  }
}

class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  final _emailController = TextEditingController();
  final _codeController = TextEditingController();
  bool _codeStep = false;

  @override
  void dispose() {
    _emailController.dispose();
    _codeController.dispose();
    super.dispose();
  }

  bool _isEmail(String value) => RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(value.trim());

  @override
  Widget build(BuildContext context) {
    final session = ref.watch(sessionProvider);
    return Scaffold(
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 460),
          child: Card(
            margin: const EdgeInsets.all(24),
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Flutter Client', style: Theme.of(context).textTheme.labelLarge),
                  const SizedBox(height: 8),
                  Text('Email auth', style: Theme.of(context).textTheme.headlineMedium),
                  const SizedBox(height: 8),
                  Text('This Flutter client uses the same Remix backend as the web and Taro clients.'),
                  const SizedBox(height: 24),
                  TextField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    enabled: !_codeStep && !session.loading,
                    decoration: const InputDecoration(labelText: 'Email'),
                  ),
                  const SizedBox(height: 16),
                  if (_codeStep)
                    TextField(
                      controller: _codeController,
                      keyboardType: TextInputType.number,
                      maxLength: 6,
                      enabled: !session.loading,
                      decoration: const InputDecoration(labelText: 'Code'),
                    ),
                  if (session.devCode != null && session.devCode!.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Text('Dev code: ${session.devCode!}'),
                    ),
                  if (session.error != null)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Text(session.error!, style: const TextStyle(color: Colors.redAccent)),
                    ),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: session.loading
                          ? null
                          : () async {
                              if (!_codeStep) {
                                final email = _emailController.text.trim();
                                if (!_isEmail(email)) return;
                                await ref.read(sessionProvider.notifier).sendCode(email);
                                if (mounted) setState(() => _codeStep = true);
                                return;
                              }
                              await ref.read(sessionProvider.notifier).verify(
                                    _emailController.text.trim(),
                                    _codeController.text.trim(),
                                  );
                            },
                      child: Text(session.loading ? 'Working…' : (_codeStep ? 'Sign in' : 'Send code')),
                    ),
                  ),
                  if (_codeStep)
                    Padding(
                      padding: const EdgeInsets.only(top: 12),
                      child: SizedBox(
                        width: double.infinity,
                        child: OutlinedButton(
                          onPressed: session.loading
                              ? null
                              : () {
                                  setState(() {
                                    _codeStep = false;
                                    _codeController.clear();
                                  });
                                },
                          child: const Text('Edit email'),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final session = ref.watch(sessionProvider);
    return Scaffold(
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 460),
          child: Card(
            margin: const EdgeInsets.all(24),
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Authenticated', style: Theme.of(context).textTheme.labelLarge),
                  const SizedBox(height: 8),
                  Text(
                    session.displayName ?? session.email ?? 'Signed in',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 8),
                  const Text('The Flutter client successfully reused the same email-code auth backend.'),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      onPressed: () async {
                        await ref.read(sessionProvider.notifier).signOut();
                      },
                      child: const Text('Sign out locally'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
