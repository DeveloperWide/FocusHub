import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { getAuthErrorMessage, useAuth } from '@/providers/auth/auth-context';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
    } catch (loginError) {
      setError(getAuthErrorMessage(loginError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.eyebrow}>FOCUSHUB</Text>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue your focus practice.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#8993a4"
            style={styles.input}
            value={email}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="password"
            onChangeText={setPassword}
            placeholder="Your password"
            placeholderTextColor="#8993a4"
            secureTextEntry
            style={styles.input}
            value={password}
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <Pressable disabled={isSubmitting} onPress={submit} style={styles.primaryButton}>
            {isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.primaryText}>Sign in</Text>}
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New to FocusHub?</Text>
          <Link href="/(auth)/signup" style={styles.link}>
            Create an account
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#f7f8fa', flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { marginBottom: 36 },
  eyebrow: { color: '#208AEF', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#18212f', fontSize: 34, fontWeight: '800', marginTop: 10 },
  subtitle: { color: '#657083', fontSize: 16, lineHeight: 23, marginTop: 10 },
  form: { gap: 10 },
  label: { color: '#344054', fontSize: 14, fontWeight: '700', marginTop: 8 },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#d9dee7',
    borderRadius: 10,
    borderWidth: 1,
    color: '#18212f',
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  error: { color: '#b42318', fontSize: 14, lineHeight: 20, marginTop: 4 },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#208AEF',
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 14,
    minHeight: 50,
  },
  primaryText: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  footer: { alignItems: 'center', flexDirection: 'row', gap: 5, justifyContent: 'center', marginTop: 28 },
  footerText: { color: '#657083', fontSize: 14 },
  link: { color: '#1769b0', fontSize: 14, fontWeight: '700' },
});
