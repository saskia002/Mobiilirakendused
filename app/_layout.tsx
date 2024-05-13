import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaView, Platform } from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import { PaperProvider } from "react-native-paper";

import AsyncStorage from "@react-native-async-storage/async-storage";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	//if (Platform.OS === "ios") {
	//	return (
	//		<SafeAreaView style={{ flex: 1 }}>
	//			<RootLayoutNav />
	//		</SafeAreaView>
	//	);
	//}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();

	const storeData = async (value: string) => {
		console.log("setting data:" + value);
		try {
			await AsyncStorage.setItem("colorScheme", value);
		} catch (e) {
			console.log(e);
		}
	};

	const getData = async () => {
		console.log("getting data");
		try {
			const value = await AsyncStorage.getItem("colorScheme");
			if (value !== null) {
				console.log(value);
			}
		} catch (e) {
			console.log(e);
		}
	};

	//useEffect(() => {
	//	storeData("dark");
	//	getData();
	//}, []);

	return (
		<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
			<PaperProvider>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				</Stack>
			</PaperProvider>
		</ThemeProvider>
	);
}
