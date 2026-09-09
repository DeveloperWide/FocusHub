import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FocusHub</Text>
      <ActivityIndicator color="#208AEF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
    flex: 1,
    gap: 16,
    justifyContent: 'center',
  },
  title: {
    color: '#18212f',
    fontSize: 28,
    fontWeight: '700',
  },
});
