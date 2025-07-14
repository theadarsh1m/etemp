"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "./use-toast";

// Extend Window interface to include speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type SpeechRecognitionHook = {
  text: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  hasRecognitionSupport: boolean;
};

let recognition: any = null;
if (typeof window !== "undefined") {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
  }
}

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(() => {
    if (isListening || !recognition) return;
    setIsListening(true);
    try {
      recognition.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      toast({
        variant: "destructive",
        title: "Speech Recognition Error",
        description: "Could not start speech recognition. Please try again.",
      });
      setIsListening(false);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!isListening || !recognition) return;
    setIsListening(false);
    recognition.stop();
  }, [isListening]);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: any) => {
      setText(event.results[0][0].transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      let description = "An unknown error occurred with speech recognition.";

      if (event.error === "network") {
        description =
          "Network error. Please check your internet connection and try again.";
      } else if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        description =
          "Microphone access denied. Please enable microphone permissions in your browser settings.";
      } else if (event.error === "no-speech") {
        description = "No speech was detected. Please try again.";
      }

      toast({
        variant: "destructive",
        title: "Speech Recognition Failed",
        description: description,
      });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognition?.stop();
    };
  }, []);

  return {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport: !!recognition,
  };
};
