import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import * as fs from "expo-file-system";
import { Button, Text, TextInput } from "react-native-paper";

type File = {
	data: string;
	uri: string;
};

const App = () => {
	const [fileText, setFileText] = useState("");
	const [files, setFiles] = useState<any>(null);
	const [fileView, setFfileView] = useState<boolean>(false);
	const [fileContent, setFileContent] = useState<File>({
		data: "",
		uri: "",
	});

	useEffect(() => {
		const doesExist = fs.getInfoAsync(fs.documentDirectory + "data").then((info) => info.exists);
		doesExist.then((exists) => {
			console.log("Directory exists", exists);
			if (!exists) {
				fs.makeDirectoryAsync(fs.documentDirectory + "data").then(() => {
					console.log("Directory created");
				});
			} else {
				//fs.deleteAsync(fs.documentDirectory + "data").then(() => {
				//	console.log("Directory deleted");
				//});
			}
		});
		getFiles();
	}, []);

	const saveFile = async () => {
		const path = `${fs.documentDirectory}/data/${fileText}.txt`;

		try {
			await fs.writeAsStringAsync(path, fileText, { encoding: fs.EncodingType.UTF8 });
			//Alert.alert("File saved", path, [{ text: "OK" }]);
		} catch (e) {
			console.log("error", e);
		}
		getFiles();
	};

	const getFiles = async () => {
		const path = fs.documentDirectory + "/data";
		setFiles(await fs.readDirectoryAsync(path));
	};

	const readFile = async (file: string) => {
		setFfileView(true);
		const path = `${fs.documentDirectory}/data/${file}`;
		setFileContent({
			data: await fs.readAsStringAsync(path),
			uri: path,
		});
		console.log("File read", fileContent);
	};

	const deleteFile = async () => {
		Alert.alert("Delete file", "Are you sure you want to delete this file?", [
			{
				text: "Cancel",
				onPress: () => console.log("Cancel Pressed"),
				style: "cancel",
			},
			{
				text: "OK",
				onPress: () => {
					const path = `${fileContent.uri}`;
					fs.deleteAsync(path).then(() => {
						console.log("File deleted");
					});
					setFfileView(false);
				},
			},
		]);

		getFiles();
	};

	return (
		<View style={styles.container}>
			{!fileView && (
				<ScrollView>
					<View
						style={{
							display: "flex",
							gap: 16,
							paddingHorizontal: 16,
							paddingBottom: 16,
						}}
					>
						<View>
							<Text style={styles.title}>Enter text for your file:</Text>
							<TextInput value={fileText} onChangeText={setFileText} style={styles.textArea} mode="outlined" multiline textAlignVertical="top" />
							<Button onPress={saveFile} mode="contained-tonal">
								Save file
							</Button>
						</View>
						<View>
							{files && (
								<View
									style={{
										flex: 1,
										gap: 12,
									}}
								>
									<Text>Files:</Text>
									{files
										.reverse()
										.filter((file: any) => file.includes(".txt"))
										.map((file: any) => (
											<Button mode="outlined" onPress={() => readFile(file)} key={file}>
												{file}
											</Button>
										))}
								</View>
							)}
						</View>
					</View>
				</ScrollView>
			)}

			{fileView && (
				<View
					style={{
						flex: 1,
						justifyContent: "space-between",
						padding: 16,
						gap: 16,
					}}
				>
					<View>
						<Text>{fileContent.data}</Text>
					</View>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<Button onPress={deleteFile} mode="outlined" style={{ width: "45%" }}>
							Delete
						</Button>
						<Button onPress={() => setFfileView(false)} mode="contained-tonal" style={{ width: "45%" }}>
							Back
						</Button>
					</View>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	textArea: {
		height: 200,
		marginBottom: 16,
		fontSize: 18,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginVertical: 16,
	},
	button: {
		display: "flex",
		backgroundColor: "lightblue",
		color: "#fff",
		padding: 10,
		borderRadius: 4,
		textAlign: "center",
	},
});

export default App;
