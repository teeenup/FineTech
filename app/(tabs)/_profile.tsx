import React, { useState } from "react";
import { Alert, Button, Text, View } from "react-native";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import axios from "@/components/axios";
import * as FileSystem from "expo-file-system";

const VoiceAssistant = () => {
  const [transcription, setTranscription] = useState("");
  const [response, setResponse] = useState("");
  const [uri, setUri] = useState("");
  const [sound, setSound] = useState<any>();
  const [audioFileUri, setAudioFileUri] = useState("");

  const startRecording = async () => {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) return;

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
    );
    await recording.startAsync();
    return recording;
  };

  const stopRecording = async (recording: any) => {
    await recording.stopAndUnloadAsync();
    const fileUri = `${
      FileSystem.documentDirectory
    }audio/recording-${Date.now()}.wav`;
    // console.log(fileUri);
    // let va = recording.getURI();
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data =
          typeof reader.result === "string" ? reader.result.split(",")[1] : "";

        // Step 3: Save the file
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        console.log("File saved to:", fileUri);
      };
      reader.readAsDataURL(recording.getURI());
    } catch (error) {
      console.error("Failed to save audio file", error);
    }

    setUri(recording.getURI());
    return recording.getURI();
  };

  const transcribeAudio = async (audioUri: any) => {
    const formData = new FormData();
    const response = await fetch(uri);
    const blob = await response.blob();
    // const file = new File([blob], "audio.wav", { type: "audio/wav" });
    //   uri: audioUri,
    //   type: "audio/mpeg",
    //   name: "audio.mp3",
    //   filename: "audio.mp3",
    // } as any;
    console.log(blob, "189");
    formData.append("file", blob, "audio.wav");
    // console.log(file, "170");

    // try {
    //   const response = await axios.get("/");
    //   console.log(response, "174");
    // } catch (error) {
    //   console.error(error);
    //   return "Sorry, I couldn't  your request.";
    // }

    try {
      const response = await axios.post("/upload-audio/", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
      });
      console.log(response.data, "186");

      return response.data;
    } catch (error) {
      console.error("OpenAI API error:", error);
      return "Sorry, I couldn't process your request.";
    }
  };

  const playAudio = async () => {
    if (!uri) {
      Alert.alert("No audio recorded!");
      return;
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );
    console.log(sound);
    setSound(sound);
  };

  const fetchGPTResponse = async (text: any) => {
    // try {
    //   const response = await axios.post(
    //     "https://api.openai.com/v1/chat/completions",
    //     FormData,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${OPENAI_API_KEY}`,
    //       },
    //     }
    //   );
    //   return response.data.choices[0].message.content;
    // } catch (error) {
    // console.error("OpenAI API error:");
    return "Sorry, I couldn't process your request.";
    // }
  };

  const handleVoiceAssistant = async () => {
    console.log("first");
    const recording = await startRecording();
    console.log("first");
    setTimeout(async () => {
      console.log("first");
      const audioUri = await stopRecording(recording);
      console.log("first");
      const transcription = await transcribeAudio(audioUri);
      console.log("first");
      setTranscription(transcription);

      console.log("first");
      const aiResponse = await fetchGPTResponse(transcription);
      setResponse(aiResponse);
      // Speech.speak(aiResponse);
    }, 5000); // Record for 5 seconds
  };

  return (
    <View>
      <Button title="Start Voice Assistant" onPress={handleVoiceAssistant} />
      <Text className="text-white">Transcription: {transcription}</Text>
      <Text className="text-white">Response: {response}</Text>
      {uri ? (
        <>
          <Button title="Play Audio" onPress={playAudio} />
        </>
      ) : null}
    </View>
  );
};

export default VoiceAssistant;
