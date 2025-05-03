import { useEffect, useRef, useState } from "react";

export function useAudioAnalyser() {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);

    useEffect(() => {
        const initAudio = async () => {
            try {
                const userStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
                const audioCtx = new AudioContext();
                const source = audioCtx.createMediaStreamSource(userStream);
                const analyser = audioCtx.createAnalyser();
                analyser.fftSize = 2048;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                source.connect(analyser)
                analyserRef.current = analyser;
                dataArrayRef.current = dataArray;
                setStream(userStream);
            } catch (error) {
                console.error("Error initializing audio:", error);
            }
        };

        initAudio();

        return () => {
            stream?.getTracks().forEach((track) => track.stop());
        };
    }, []);

    // データを更新する関数
    const updateData = () => {
        if (analyserRef.current && dataArrayRef.current) {
            analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
        }
    };

    return { 
        analyser: analyserRef.current, 
        dataArray: dataArrayRef.current,
        updateData 
    };
}
