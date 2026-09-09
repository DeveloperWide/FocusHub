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

export default function SignupScreen() {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signup({
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      });
    } catch (signupError) {
      setError(getAuthErrorMessage(signupError));
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
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Set up a simple place to protect your attention.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput onChangeText={setName} placeholder="Your name" placeholderTextColor="#8993a4" style={styles.input} value={name} />
          <Text style={styles.label}>Username</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={setUsername}
            placeholder="your_username"
            placeholderTextColor="#8993a4"
            style={styles.input}
            value={username}
          />
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
            autoComplete="new-password"
            onChangeText={setPassword}
            placeholder="Create a password"
            placeholderTextColor="#8993a4"
            secureTextEntry
            style={styles.input}
            value={password}
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <Pressable disabled={isSubmitting} onPress={submit} style={styles.primaryButton}>
            {isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.primaryText}>Create account</Text>}
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link href="/(auth)/login" style={styles.link}>
            Sign in
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#f7f8fa', flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { marginBottom: 28 },
  eyebrow: { color: '#208AEF', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#18212f', fontSize: 32, fontWeight: '800', marginTop: 10 },
  subtitle: { color: '#657083', fontSize: 16, lineHeight: 23, marginTop: 10 },
  form: { gap: 9 },
  label: { color: '#344054', fontSize: 14, fontWeight: '700', marginTop: 6 },
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
  footer: { alignItems: 'center', flexDirection: 'row', gap: 5, justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#657083', fontSize: 14 },
  link: { color: '#1769b0', fontSize: 14, fontWeight: '700' },
});
