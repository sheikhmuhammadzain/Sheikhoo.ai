import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaImage, FaFile, FaMicrophone, FaStop } from 'react-icons/fa';

export function ChatInput({ onSendMessage, disabled }) {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((message.trim() || files.length > 0 || audioBlob) && !disabled) {
      const allFiles = [...files];
      if (audioBlob) {
        const audioFile = new File([audioBlob], "voice-message.webm", { type: "audio/webm" });
        allFiles.push(audioFile);
      }
      onSendMessage(message, allFiles);
      setMessage('');
      setFiles([]);
      setAudioBlob(null);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-t border-zinc-800/50 bg-black py-3 px-6"
    >
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 max-w-4xl mx-auto">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 text-xs text-white">
              {file.type.startsWith('image/') ? (
                <FaImage className="text-purple-400" />
              ) : (
                <FaFile className="text-blue-400" />
              )}
              <span className="truncate max-w-[100px]">{file.name}</span>
              <button 
                type="button" 
                onClick={() => removeFile(index)}
                className="ml-1 text-zinc-400 hover:text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      {audioBlob && (
        <div className="flex items-center gap-2 mb-2 max-w-4xl mx-auto">
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 text-xs text-white">
            <FaMicrophone className="text-green-400" />
            <span>Voice message</span>
            <button 
              type="button" 
              onClick={() => setAudioBlob(null)}
              className="ml-1 text-zinc-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <audio controls src={audioBlob ? URL.createObjectURL(audioBlob) : ''} className="h-6" />
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-md border border-zinc-800 bg-zinc-900">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message..."
              disabled={disabled}
              className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none disabled:opacity-50"
            />
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*,audio/*,video/*,.pdf,.txt,.doc,.docx"
              className="hidden"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              disabled={disabled || isRecording}
              className="p-1 text-zinc-400 hover:text-white disabled:opacity-50"
            >
              <FaImage size={16} />
            </button>
            
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={disabled}
              className={`p-1 ${isRecording ? 'text-red-500' : 'text-zinc-400 hover:text-white'} disabled:opacity-50`}
            >
              {isRecording ? <FaStop size={16} /> : <FaMicrophone size={16} />}
            </button>
          </div>
          
          <motion.button
            type="submit"
            disabled={disabled || (!message.trim() && files.length === 0 && !audioBlob)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-900 flex items-center gap-2"
          >
            {disabled ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                Send
                <FaPaperPlane size={14} />
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}