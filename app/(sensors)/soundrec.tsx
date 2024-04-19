import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Button, Text, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";

export default function App() {
	// Refs for the audio
	const AudioRecorder = useRef(new Audio.Recording());
	const AudioPlayer = useRef(new Audio.Sound());

	// States for UI
	const [RecordedURI, SetRecordedURI] = useState<string>("");
	const [AudioPermission, SetAudioPermission] = useState<boolean>(false);
	const [IsRecording, SetIsRecording] = useState<boolean>(false);
	const [IsPLaying, SetIsPLaying] = useState<boolean>(false);

	useEffect(() => {
		GetPermission();
	}, []);

	const GetPermission = async () => {
		const getAudioPerm = await Audio.requestPermissionsAsync();
		SetAudioPermission(getAudioPerm.granted);
	};

	const StartRecording = async () => {
		try {
			if (AudioPermission === true) {
				try {
					// Prepare the Audio Recorder
					await AudioRecorder.current.prepareToRecordAsync(Audio.RecordingOptionsPresets.HighQuality);

					// Start recording
					await AudioRecorder.current.startAsync();
					SetIsRecording(true);
				} catch (error) {
					console.log(error);
				}
			} else {
				// If user has not given the permission to record, then ask for permission
				GetPermission();
			}
		} catch (error) {}
	};

	const StopRecording = async () => {
		try {
			await AudioRecorder.current.stopAndUnloadAsync();

			const result = AudioRecorder.current.getURI();
			if (result) SetRecordedURI(result);

			// Reset the Audio Recorder
			AudioRecorder.current = new Audio.Recording();
			SetIsRecording(false);
		} catch (error) {}
	};

	// Function to play the recorded audio
	const PlayRecordedAudio = async () => {
		try {
			// Load the Recorded URI
			await AudioPlayer.current.loadAsync({ uri: RecordedURI }, {}, true);

			// Get Player Status
			const playerStatus = await AudioPlayer.current.getStatusAsync();

			// Play if song is loaded successfully
			if (playerStatus.isLoaded) {
				if (playerStatus.isPlaying === false) {
					AudioPlayer.current.playAsync();
					SetIsPLaying(true);
				}
			}
		} catch (error) {}
	};

	const StopPlaying = async () => {
		try {
			const playerStatus = await AudioPlayer.current.getStatusAsync();
			if (playerStatus.isLoaded === true) await AudioPlayer.current.unloadAsync();
			SetIsPLaying(false);
		} catch (error) {}
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.button} onPress={IsRecording ? StopRecording : StartRecording}>
				<Text style={styles.buttonText}>{IsRecording ? "Stop Recording" : "Start Recording"}</Text>
			</TouchableOpacity>

			{RecordedURI && (
				<TouchableOpacity style={styles.button} onPress={IsPLaying ? StopPlaying : PlayRecordedAudio}>
					<Text style={styles.buttonText}>{IsPLaying ? "Stop Sound" : "Play Sound"}</Text>
				</TouchableOpacity>
			)}

			<Text>{RecordedURI}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "#ecf0f1",
		padding: 8,
		gap: 18,
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
		width: "100%",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
	},
});
