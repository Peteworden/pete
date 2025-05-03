import { useEffect, useRef } from "react";
import { useAudioAnalyser } from "../hooks/useAudioAnalyser";

export function Spectrum() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { analyser } = useAudioAnalyser();

    useEffect(() => {
        if (!analyser || !canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            requestAnimationFrame(draw);
            
            // 周波数データを取得
            analyser.getByteFrequencyData(dataArray);
            
            // キャンバスをクリア
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // バーの描画
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;
            
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i];
                
                // 音量に応じて色を変化させる
                const red = Math.min(255, barHeight + 100);
                ctx.fillStyle = `rgb(${red}, 50, 50)`;
                
                // バーを描画
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;  // 間隔を1pxに調整
            }
        };
        
        draw();
        
    }, [analyser]);

    return <canvas ref={canvasRef} width={800} height={200} style={{ border: "1px solid #ccc" }} />;
}
