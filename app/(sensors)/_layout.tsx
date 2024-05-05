import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				headerShown: useClientOnlyValue(false, false),
				tabBarLabelStyle: {
					display: "none",
				},
				tabBarStyle: {
					display: "none",
				},

				tabBarIconStyle: {
					display: "none",
				},

				tabBarLabelPosition: "below-icon",
			}}
		>
			<Tabs.Screen
				name="camera"
				options={{
					title: "Main",
					unmountOnBlur: true,
				}}
			/>
			<Tabs.Screen
				name="soundrec"
				options={{
					title: "Main",
					unmountOnBlur: true,
				}}
			/>
			<Tabs.Screen
				name="sysSensors"
				options={{
					title: "Main",
					unmountOnBlur: true,
				}}
			/>
			<Tabs.Screen
				name="vibration"
				options={{
					title: "Main",
					unmountOnBlur: true,
				}}
			/>
			<Tabs.Screen
				name="saveData"
				options={{
					title: "Main",
					unmountOnBlur: true,
				}}
			/>
			<Tabs.Screen
				name="restApi"
				options={{
					title: "Main",
					unmountOnBlur: true,
				}}
			/>
			<Tabs.Screen
				name="augmented"
				options={{
					title: "Main",
					unmountOnBlur: true,
				}}
			/>
		</Tabs>
	);
}
