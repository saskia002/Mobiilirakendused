import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { SafeAreaView } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>["name"]; color: string }) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				// Disable the static render of the header on web
				// to prevent a hydration error in React Navigation v6.
				//headerStyle: {
				//	display: "none",
				//	marginBottom: 12,
				//},

				headerShown: useClientOnlyValue(false, true),
				tabBarLabelStyle: {
					fontSize: 20,
					fontWeight: "bold",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					lineHeight: 50,
					height: "100%",
				},
				tabBarStyle: {
					//height: 50,
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
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
					title: "Main",
					unmountOnBlur: true,
				}}
			/>
			<Tabs.Screen
				name="kodutööd"
				options={{
					title: "sensor",
					unmountOnBlur: true,
					//tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
				}}
			/>
		</Tabs>
	);
}
