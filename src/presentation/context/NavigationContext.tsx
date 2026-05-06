import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { Animated } from "react-native";

interface NavigationContextValue {
  isMenuOpen: boolean;
  slideAnim: Animated.Value;
  backdropAnim: Animated.Value;
  isMenuVisible: boolean;
  openMenu: () => void;
  closeMenu: () => void;
}

const NavigationContext = createContext<NavigationContextValue>({
  isMenuOpen: false,
  slideAnim: new Animated.Value(-300),
  backdropAnim: new Animated.Value(0),
  isMenuVisible: false,
  openMenu: () => {},
  closeMenu: () => {},
});

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const openMenu = useCallback(() => {
    setIsMenuVisible(true);
    setIsMenuOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, backdropAnim]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => setIsMenuVisible(false));
  }, [slideAnim, backdropAnim]);

  return (
    <NavigationContext.Provider
      value={{ isMenuOpen, slideAnim, backdropAnim, isMenuVisible, openMenu, closeMenu }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  return useContext(NavigationContext);
}
