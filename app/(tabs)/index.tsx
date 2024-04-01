import { Platform, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import Device from "expo-device";

export default function TabOneScreen() {
	const [location, setLocation] = useState<any>(null);
	const [errorMsg, setErrorMsg] = useState<any>(null);

	useEffect(() => {
		(async () => {
			if (Platform.OS === "android" && !Device.isDevice) {
				setErrorMsg("Oops, this will not work on Snack in an Android Emulator. Try it on your device!");
				return;
			}
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				setErrorMsg("Permission to access location was denied");
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setLocation(location.coords);
		})();
	}, []);

	let text = "Waiting..";
	if (errorMsg) {
		text = errorMsg;
	} else if (location) {
		text = JSON.stringify(location);
	}
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Main</Text>
			<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
			<Text>GPS coords:</Text>
			<Text style={styles.gps}>{text}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		maxWidth: 600,
	},
	gps: {
		width: "80%",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});
