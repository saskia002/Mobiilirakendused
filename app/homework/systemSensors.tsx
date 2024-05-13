import React, { useState, useEffect } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { Barometer, Gyroscope, LightSensor, Magnetometer } from "expo-sensors";
import { Divider, Text } from "react-native-paper";

export default function App() {
	const [{ illuminance }, setData] = useState({ illuminance: 0 });
	const [{ pressure, relativeAltitude }, setData2] = useState<any>({ pressure: 0, relativeAltitude: 0 });

	const [{ x, y, z }, setData3] = useState({
		x: 0,
		y: 0,
		z: 0,
	});

	const [data4, setData4] = useState({
		x: 0,
		y: 0,
		z: 0,
	});

	useEffect(() => {
		LightSensor.addListener(setData);
		Barometer.addListener(setData2);
		Magnetometer.addListener(setData3);
		Gyroscope.addListener(setData4);

		Magnetometer.setUpdateInterval(1000);
		Gyroscope.setUpdateInterval(1000);

		// Clean up
		return () => {
			LightSensor.removeAllListeners();
			Barometer.removeAllListeners();
		};
	}, []);

	return (
		<View style={styles.container}>
			<View>
				<Text>Light Sensor:</Text>
				<Text>Illuminance: {Platform.OS === "android" ? `${illuminance} lx` : `Only available on Android`}</Text>
				<Divider bold />
				<Text>Pressure: {pressure} hPa</Text>
				<Text>Relative Altitude: {Platform.OS === "ios" ? `${relativeAltitude} m` : `Only available on iOS`}</Text>
				<Divider bold />
				<Text>Magnetometer:</Text>
				<Text>x: {x}</Text>
				<Text>y: {y}</Text>
				<Text>z: {z}</Text>
				<Divider bold />
				<Text>Gyroscope:</Text>
				<Text>x: {data4.x}</Text>
				<Text>y: {data4.y}</Text>
				<Text>z: {data4.z}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});
