"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const FLASHCARDS = [
  {
    type: "Pause",
    example: "[Pause] Let the silence do the talking.",
    quote: "The fierce urgency of now. [Pause] – Martin Luther King Jr."
  },
  {
    type: "Emphasize",
    example: "[Emphasize] Your voice has power.",
    quote: "We are the change that we seek. – Barack Obama"
  },
  {
    type: "Slow",
    example: "[Slow] Speak… one… word… at… a… time.",
    quote: "Stay hungry. Stay foolish. – Steve Jobs"
  },
  {
    type: "Gesture",
    example: "[Gesture] Open your arms to draw them in.",
    quote: "Education is the most powerful weapon... – Nelson Mandela"
  },
  {
    type: "Speed Up",
    example: "[Speed Up] Drive the energy forward.",
    quote: "Fired up? Ready to go! – Obama rally chant"
  },
  {
    type: "Rise",
    example: "[Rise] Let your tone lift the final phrase.",
    quote: "Still I rise. – Maya Angelou"
  }
];

export default function Page() {
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(60);
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const audioRef = useRef(null);

  const nextCard = () => {
    const next = Math.floor(Math.random() * FLASHCARDS.length);
    setIndex(next);
    setTimer(60);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          nextCard();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRecord = async () => {
    if (!recording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      const audioChunks = [];
      mediaRecorder.current.ondataavailable = event => {
        audioChunks.push(event.data);
      };
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioUrl;
      };
      mediaRecorder.current.start();
      setRecording(true);
    } else {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #0f0f0f, #1a1a1a)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: '28rem',
          background: '#1a1a1a',
          borderRadius: '1rem',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 0 1rem #000'
        }}
      >
        <h2 style={{ fontSize: '1.25rem', color: '#22d3ee', marginBottom: '1rem' }}>
          {FLASHCARDS[index].type}
        </h2>
        <p style={{ fontSize: '1.125rem', color: '#fff', fontStyle: 'italic', marginBottom: '1rem' }}>
          {FLASHCARDS[index].example}
        </p>
        <p style={{ fontSize: '0.875rem', color: '#a1a1aa' }}>
          {FLASHCARDS[index].quote}
        </p>
      </motion.div>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
        <button onClick={nextCard} style={{ background: '#06b6d4', color: '#fff', padding: '0.5rem 1.5rem', borderRadius: '0.75rem' }}>
          Next Cue
        </button>
        <button onClick={handleRecord} style={{ background: '#dc2626', color: '#fff', padding: '0.5rem 1.5rem', borderRadius: '0.75rem' }}>
          {recording ? "Stop Recording" : "🎤 Record Voice"}
        </button>
      </div>

      <audio ref={audioRef} controls style={{ marginTop: '1rem' }} />
      <p style={{ color: '#a1a1aa', marginTop: '0.5rem' }}>Auto shuffle in: {timer}s</p>
    </div>
  );
}
