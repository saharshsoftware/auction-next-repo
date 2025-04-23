"use client";

import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

interface TextToSpeechProps {
  text: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text }) => {
  const [speaking, setSpeaking] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  );

  const speak = () => {
    if (!window.speechSynthesis) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }

    const newUtterance = new SpeechSynthesisUtterance(text);

    newUtterance.onstart = () => setSpeaking(true);
    newUtterance.onend = () => setSpeaking(false);
    newUtterance.onerror = () => setSpeaking(false);

    speechSynthesis.speak(newUtterance);
    setUtterance(newUtterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setSpeaking(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="ml-auto flex gap-2 items-center">
      {!speaking ? (
        <button
          onClick={speak}
          disabled={speaking}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <FontAwesomeIcon icon={faPlay} />
        </button>
      ) : (
        <button
          onClick={stop}
          disabled={!speaking}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <FontAwesomeIcon icon={faStop} />
        </button>
      )}
    </div>
  );
};

export default TextToSpeech;
