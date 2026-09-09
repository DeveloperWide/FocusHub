import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/providers/auth/auth-context';

export default function DashboardPlaceholder() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.eyebrow}>FOCUSHUB</Text>
        <Text style={styles.title}>Authenticated</Text>
        <Text style={styles.subtitle}>
          Welcome, {user?.name || user?.username}. Your dashboard is coming soon.
        </Text>
      </View>
      <Pressable onPress={() => void logout()} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f8fa',
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 48,
    paddingTop: 72,
  },
  eyebrow: { color: '#208AEF', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#18212f', fontSize: 34, fontWeight: '800', marginTop: 10 },
  subtitle: { color: '#657083', fontSize: 16, lineHeight: 24, marginTop: 12 },
  logoutButton: {
    alignItems: 'center',
    borderColor: '#c8ced8',
    borderRadius: 10,
    borderWidth: 1,
    minHeight: 48,
    justifyContent: 'center',
  },
  logoutText: { color: '#344054', fontSize: 16, fontWeight: '700' },
});
