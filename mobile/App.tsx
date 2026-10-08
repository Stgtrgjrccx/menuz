import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  BackHandler,
  Platform,
  SafeAreaView,
  RefreshControl,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import * as Haptics from 'expo-haptics';
import { Camera } from 'expo-camera';

// Default Menuz app endpoint:
// Points to the live Menuz deployment on GitHub Pages
const DEFAULT_URL = 'https://stgtrgjrccx.github.io/menuz';

export default function App() {
  const [currentUrl, setCurrentUrl] = useState(DEFAULT_URL);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef<WebView>(null);

  // Request camera permissions for dining table QR scanning
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status === 'granted') {
          // Camera permission available for QR scanning
        }
      } catch (e) {}
    })();
  }, []);

  // Android hardware back button integration
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [canGoBack]);

  const handleReload = () => {
    setHasError(false);
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    webViewRef.current?.reload();
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      <StatusBar style="light" />

      {hasError ? (
        <ScrollView
          contentContainerStyle={styles.errorContainer}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleReload} tintColor="#F59E0B" />
          }
        >
          <View style={styles.errorCard}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>M</Text>
            </View>
            <Text style={styles.errorTitle}>Menuz OS Offline</Text>
            <Text style={styles.errorMessage}>
              Unable to reach the Menuz server at:{'\n'}
              <Text style={styles.urlText}>{currentUrl}</Text>
            </Text>
            <Text style={styles.errorHint}>
              Ensure your computer and mobile phone are on the same Wi-Fi network, and that Vite is running.
            </Text>

            <TouchableOpacity style={styles.retryButton} onPress={handleReload} activeOpacity={0.85}>
              <Text style={styles.retryButtonText}>Reconnect to Menuz</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.webviewWrapper}>
          <WebView
            ref={webViewRef}
            source={{ uri: currentUrl }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            geolocationEnabled={true}
            mixedContentMode="always"
            allowsBackForwardNavigationGestures={true}
            onNavigationStateChange={(navState) => {
              setCanGoBack(navState.canGoBack);
            }}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              if (nativeEvent.statusCode >= 500) {
                setHasError(true);
              }
            }}
            injectedJavaScript={`
              // Mobile Native Container Bridge
              window.IS_NATIVE_EXPO_APP = true;
              window.NATIVE_PLATFORM = '${Platform.OS}';
              true;
            `}
          />

          {isLoading && (
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingCard}>
                <ActivityIndicator size="large" color="#F59E0B" />
                <Text style={styles.loadingText}>Loading Menuz...</Text>
              </View>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  webviewWrapper: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  webview: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  loadingOverlay: {
    ...(StyleSheet.absoluteFill as object),
    backgroundColor: '#090D16',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loadingCard: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#0F1523',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
  },
  errorContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#0F1523',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  brandBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brandBadgeText: {
    color: '#090D16',
    fontSize: 24,
    fontWeight: '900',
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  urlText: {
    color: '#F59E0B',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    fontWeight: '600',
  },
  errorHint: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 20,
  },
  retryButton: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: '#F59E0B',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonText: {
    color: '#090D16',
    fontSize: 14,
    fontWeight: '800',
  },
});
