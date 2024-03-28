import { StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";

import { Vibration } from "react-native";
import { useEffect, useState } from "react";

export default function TabTwoScreen() {
	const [durationInput, setDurationInput] = useState("");

	const handleVibration = () => {
		if (!durationInput || isNaN(parseInt(durationInput)) || parseInt(durationInput) < 1) {
			return;
		}

		Vibration.vibrate(parseInt(durationInput) * 1000);
	};

	// on unmount
	useEffect(() => {
		return () => {
			Vibration.cancel();
		};
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Vibration test</Text>

			<TextInput
				autoFocus
				placeholderTextColor="gray"
				placeholder="Enter duration in seconds"
				style={styles.input}
				keyboardType="numeric"
				value={durationInput ? durationInput : ""}
				onChangeText={(e) => setDurationInput(e)}
			/>
			<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
			<View style={styles.buttonGroup}>
				<TouchableOpacity style={styles.button} onPress={handleVibration}>
					<Text style={styles.buttonText}>TEST</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	buttonGroup: {
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-end",
		width: "80%",
	},
	separator: {
		marginVertical: 6,
		//display: "flex",
		//width: "80%",
		//height: 1,
	},
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 16,
	},
	input: {
		width: "80%",
		borderColor: "white",
		borderRadius: 4,
		color: "white",
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
	},
	button: {
		fontWeight: "bold",
		textTransform: "uppercase",
		justifyContent: "center",
		alignItems: "center",
		display: "flex",
		backgroundColor: "#3498db",
		padding: 12,
		borderRadius: 4,
		height: 48,
		width: "auto",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
	},
});
