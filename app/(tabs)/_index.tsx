// import { Image, StyleSheet, Platform, ScrollView } from "react-native";

// import { Hellowave } from "@/components/Hellowave";
// import ParallaxScrollView from "@/components/ParallaxScrollView";
// import { ThemedText } from "@/components/ThemedText";
// import { ThemedView } from "@/components/ThemedView";
// import { SafeAreaView } from "react-native-safe-area-context";

// import React, { useState, useEffect } from "react";
// import { Button, Text, View } from "react-native";
// // import Voice from "react-native-voice";
// import axios from "axios";
// import * as Speech from "expo-speech";

// export default function HomeScreen() {
//   const [isListening, setIsListening] = useState(false);
//   const [transcription, setTranscription] = useState("");
//   const [response, setResponse] = useState("");

//   const OPENAI_API_KEY = "your-openai-api-key"; // Replace with your OpenAI API key

//   // useEffect(() => {
//   //   Voice.onSpeechResults = (event: { value: any[]; }) => {
//   //     setTranscription(event.value[0]);
//   //     handleOpenAI(event.value[0]); // Send transcription to OpenAI
//   //   };

//   //   Voice.onSpeechError = (event: { error: any; }) => {
//   //     console.error("Error:", event.error);
//   //   };

//   //   return () => {
//   //     Voice.destroy().then(Voice.removeAllListeners);
//   //   };
//   // }, []);

//   // const startListening = async () => {
//   //   try {
//   //     setIsListening(true);
//   //     await Voice.start("en-US");
//   //   } catch (error) {
//   //     console.error("Error starting Voice:", error);
//   //   }
//   // };

//   // const stopListening = async () => {
//   //   try {
//   //     setIsListening(false);
//   //     await Voice.stop();
//   //   } catch (error) {
//   //     console.error("Error stopping Voice:", error);
//   //   }
//   // };

//   const handleOpenAI = async (text: any) => {
//     try {
//       const res = await axios.post(
//         "https://api.openai.com/v1/chat/completions",
//         {
//           model: "gpt-4",
//           messages: [{ role: "user", content: text }],
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${OPENAI_API_KEY}`,
//           },
//         }
//       );

//       const aiResponse = res.data.choices[0].message.content;
//       setResponse(aiResponse);
//       Speech.speak(aiResponse, { language: "en-US" }); // Speak the response
//     } catch (error) {
//       console.error("Error with OpenAI API:", error);
//     }
//   };
//   return (
//     <SafeAreaView className="bg-primary pb-16 min-h-screen">
//       <ScrollView>
//         <View>
//           <Text>Transcription: {transcription}</Text>
//           <Text>Response: {response}</Text>
//           <Button
//             title={isListening ? "Stop Listening" : "Start Listening"}
//             // onPress={isListening ? stopListening : startListening}
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: "absolute",
//   },
// });
import React, { useState } from "react";
import { Button, View, StyleSheet, Text, Alert } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import axios from "@/components/axios";

export default function App() {
  const [recording, setRecording] = useState<any>(null);
  const [status, setStatus] = useState("");

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
        setStatus("Recording...");
      } else {
        Alert.alert("Permission to access the microphone is required!");
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setStatus("Stopped recording");
      await sendAudioToServer(uri);
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const sendAudioToServer = async (uri: any) => {
    try {
      // const fileInfo = await FileSystem.getInfoAsync(uri);
      // const file: any = {
      //   uri: fileInfo.uri,
      //   name: "audio.wav",
      //   type: "audio/wav",
      // };

      const uri = recording.getURI();
      const filetype = uri.split(".").pop();
      const filename = uri.split("/").pop();
      const file2: any = {
        uri,
        type: `audio/${filetype}`,
        name: "audio.m4a",
      };
      // const fd = new FormData();

      const formData = new FormData();
      formData.append("file", file2);
      // formData.append("file", file);

      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);

      if (response.status === 200) {
        Alert.alert("Audio uploaded successfully!");
      } else {
        Alert.alert("Failed to upload audio");
      }
    } catch (err) {
      console.error("Failed to upload audio", err);
      Alert.alert("Error uploading audio");
    }
  };

  return (
    <View style={styles.container}>
      <Text>{status}</Text>
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
