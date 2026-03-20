import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface StartingScreenProps {
  onComplete: () => void;
}

export default function StartingScreen({ onComplete }: StartingScreenProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-proceed after 4 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/starting-logo.jpeg')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.logoOverlay}>
            <View style={styles.pulseRing} />
          </View>
        </View>

        <Animated.View 
          style={[
            styles.textContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.title}>Event Forum Hub</Text>
          <Text style={styles.subtitle}>Your Campus Event Community</Text>
          <Text style={styles.tagline}>Connect • Discover • Participate</Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.featuresContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <View style={styles.feature}>
            <Ionicons name="calendar-outline" size={24} color="#fff" />
            <Text style={styles.featureText}>Discover Events</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="people-outline" size={24} color="#fff" />
            <Text style={styles.featureText}>Join Communities</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
            <Text style={styles.featureText}>Connect & Chat</Text>
          </View>
        </Animated.View>

        <TouchableOpacity 
          style={styles.skipButton}
          onPress={onComplete}
        >
          <Text style={styles.skipText}>Skip</Text>
          <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
      </Animated.View>

      {/* Background decoration */}
      <View style={styles.backgroundDecoration}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 2,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoOverlay: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  skipText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginRight: 8,
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  circle1: {
    width: 200,
    height: 200,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: -75,
    left: -75,
  },
  circle3: {
    width: 100,
    height: 100,
    top: height * 0.3,
    left: -50,
  },
});