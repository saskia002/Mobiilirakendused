import React from "react";
import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useTheme } from "react-native-paper";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
//function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>["name"]; color: string }) {
//	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
//}

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const theme = useTheme();

	// console.log("theme", theme.colors.secondary);

	// console.log("colorScheme", Colors[colorScheme ?? "light"].tint);

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: theme.colors.primary,

				headerShown: true,
				tabBarLabelStyle: {
					fontSize: 20,
					fontWeight: "bold",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					lineHeight: 50,
					height: "100%",
					backgroundColor: theme.colors.elevation.level1,
				},
				tabBarStyle: {
					//height: 50,
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: theme.colors.elevation.level1,
				},

				tabBarIconStyle: {
					display: "none",
					height: 0,
				},

				tabBarLabelPosition: "below-icon",
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Map",
					unmountOnBlur: true,
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="Homework"
				options={{
					title: "Homework",
					unmountOnBlur: true,
					headerShown: false,
				}}
			/>
		</Tabs>
	);
}
