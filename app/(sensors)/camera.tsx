import { Camera, CameraType, FlashMode } from "expo-camera";
import { useState } from "react";
import { Button, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
let camera: Camera;

export default function App() {
	if (Platform.OS === "web") {
		return (
			<View>
				<Text>Camera is not supported on web</Text>
			</View>
		);
	} else {
		const [type, setType] = useState(CameraType.back);
		const [permission, requestPermission] = Camera.useCameraPermissions();

		const [previewVisible, setPreviewVisible] = useState(false);
		const [capturedImage, setCapturedImage] = useState<any>(null);

		if (!permission) {
			// Camera permissions are still loading
			return <View />;
		}

		if (!permission.granted) {
			// Camera permissions are not granted yet
			return (
				<View style={styles.container}>
					<Text style={{ textAlign: "center" }}>We need your permission to show the camera</Text>
					<Button onPress={requestPermission} title="grant permission" />
				</View>
			);
		}

		function toggleCameraType() {
			setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
		}

		async function takePic() {
			if (!camera) return;
			const photo = await camera.takePictureAsync();

			console.log(photo);
			setPreviewVisible(true);
			setCapturedImage(photo);
		}

		const CameraPreview = ({ photo }: any) => {
			console.log("sdsfds", photo);
			return (
				<View
					style={{
						backgroundColor: "transparent",
						flex: 1,
						width: "100%",
						height: "100%",
					}}
				>
					<ImageBackground
						source={{ uri: photo && photo.uri }}
						style={{
							flex: 1,
							transform: [{ scaleX: -1 }],
						}}
					/>
				</View>
			);
		};

		return (
			<View style={styles.container}>
				{previewVisible && capturedImage ? (
					<CameraPreview photo={capturedImage} />
				) : (
					<View
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",

							height: "100%",
							width: "100%",
						}}
					>
						<Camera
							type={type}
							flashMode={FlashMode.auto}
							style={styles.camera}
							ref={(r: Camera) => {
								camera = r;
							}}
						>
							<View
								style={{
									height: "100%",
									width: "100%",
									paddingBottom: 20,
									justifyContent: "flex-end",
									alignItems: "center",
								}}
							>
								<TouchableOpacity
									onPress={takePic}
									style={{
										width: 70,
										height: 70,
										bottom: 0,
										borderRadius: 50,
										backgroundColor: "#fff",
									}}
								/>
							</View>
						</Camera>
						<View>
							<TouchableOpacity style={styles.button} onPress={toggleCameraType}>
								<Text style={styles.text}>Flip Camera</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	camera: {
		//flex: 1,
		display: "flex",
		width: "100%",
		height: "75%",
	},
	buttonContainer: {
		flexDirection: "row",
		backgroundColor: "transparent",
	},
	button: {
		marginTop: 20,
	},
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
});
