import { useState, useEffect } from "react";
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    PhoneOff,
    Monitor,
} from "lucide-react";

export default function VideoCall() {
    const [callActive, setCallActive] = useState(false);
    const [videoOn, setVideoOn] = useState(true);
    const [audioOn, setAudioOn] = useState(true);
    const [time, setTime] = useState(0);

    // ⏱ Timer
    useEffect(() => {
        let interval: any;
        if (callActive) {
            interval = setInterval(() => setTime((t) => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [callActive]);

    const formatTime = () => {
        const min = String(Math.floor(time / 60)).padStart(2, "0");
        const sec = String(time % 60).padStart(2, "0");
        return `${min}:${sec}`;
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Video Calls</h2>
            <p className="text-gray-500 mb-4">
                Start secure video meetings with investors and entrepreneurs
            </p>

            {/* 🎥 Video Box */}
            <div className="relative bg-gray-800 rounded-xl h-[400px] flex items-center justify-center text-white">

                {/* Timer */}
                {callActive && (
                    <div className="absolute top-3 left-3 bg-black/60 px-3 py-1 rounded-full text-sm">
                        ⏺ {formatTime()}
                    </div>
                )}

                {/* Center Avatar */}
                <div className="w-20 h-20 rounded-full bg-blue-400 flex items-center justify-center text-xl font-bold">
                    AC
                </div>

                {/* Small self preview */}
                <div className="absolute bottom-4 right-4 w-28 h-20 bg-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-700">
                    You
                </div>
            </div>

            {/* 🎛 Controls */}
            <div className="flex justify-center gap-4 mt-6">

                {/* Mic */}
                <button
                    className={`p-3 rounded-full ${audioOn ? "bg-gray-200" : "bg-red-500 text-white"
                        }`}
                    onClick={() => setAudioOn(!audioOn)}
                >
                    {audioOn ? <Mic size={20} /> : <MicOff size={20} />}
                </button>

                {/* Video */}
                <button
                    className={`p-3 rounded-full ${videoOn ? "bg-gray-200" : "bg-red-500 text-white"
                        }`}
                    onClick={() => setVideoOn(!videoOn)}
                >
                    {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
                </button>

                {/* Screen Share */}
                <button className="p-3 rounded-full bg-gray-200">
                    <Monitor size={20} />
                </button>

                {/* Start / End */}
                {!callActive ? (
                    <button
                        className="p-4 rounded-full bg-green-600 text-white"
                        onClick={() => {
                            setCallActive(true);
                            setTime(0);
                        }}
                    >
                        Start
                    </button>
                ) : (
                    <button
                        className="p-4 rounded-full bg-red-600 text-white"
                        onClick={() => setCallActive(false)}
                    >
                        <PhoneOff size={20} />
                    </button>
                )}
            </div>
        </div>
    );
}