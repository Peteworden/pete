import { useEffect, useRef, useState } from "react";
import { useAudioAnalyser } from "../hooks/useAudioAnalyser";

export function Oscilloscope() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { analyser, dataArray, updateData } = useAudioAnalyser();
    const [triggerLevel, setTriggerLevel] = useState(128); // トリガーレベル（0-255）
    const [triggerSlope, setTriggerSlope] = useState<'rising' | 'falling'>('rising');
    const [isPaused, setIsPaused] = useState(false);
    const pausedDataRef = useRef<Uint8Array | null>(null);
    const animationFrameRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!analyser || !canvasRef.current || !dataArray) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const draw = () => {
            if (!isPaused) {
                updateData();
                pausedDataRef.current = new Uint8Array(dataArray);
            }

            const currentData = isPaused ? pausedDataRef.current : dataArray;
            if (!currentData) return;
            
            // トリガー位置を探す
            let triggerIndex = 0;
            if (triggerSlope === 'rising') {
                for (let i = 1; i < currentData.length; i++) {
                    if (currentData[i-1] < triggerLevel && currentData[i] >= triggerLevel) {
                        triggerIndex = i;
                        break;
                    }
                }
            } else {
                for (let i = 1; i < currentData.length; i++) {
                    if (currentData[i-1] > triggerLevel && currentData[i] <= triggerLevel) {
                        triggerIndex = i;
                        break;
                    }
                }
            }

            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgb(0, 255, 0)";
            ctx.beginPath();

            const sliceWidth = canvas.width * 1.0 / currentData.length;
            let x = 0;

            // トリガー位置から描画を開始
            for (let i = triggerIndex; i < currentData.length; i++) {
                const v = currentData[i] / 128.0;
                const y = v * canvas.height / 2;
                if (i === triggerIndex) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                x += sliceWidth;
            }

            // トリガー位置の前に戻って描画を続ける
            for (let i = 0; i < triggerIndex; i++) {
                const v = currentData[i] / 128.0;
                const y = v * canvas.height / 2;
                ctx.lineTo(x, y);
                x += sliceWidth;
            }

            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();

            // トリガーレベルの線を描画
            ctx.strokeStyle = "rgb(255, 0, 0)";
            ctx.beginPath();
            const triggerY = (triggerLevel / 128.0) * canvas.height / 2;
            ctx.moveTo(0, triggerY);
            ctx.lineTo(canvas.width, triggerY);
            ctx.stroke();

            if (!isPaused) {
                animationFrameRef.current = requestAnimationFrame(draw);
            }
        };

        draw();

        // クリーンアップ
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [analyser, dataArray, updateData, triggerLevel, triggerSlope, isPaused]);

    return (
        <div className="flex flex-col items-center gap-4">
            <canvas ref={canvasRef} width={600} height={200} style={{ border: "1px solid #ccc" }} />
            <div className="flex gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">トリガーレベル</label>
                    <input
                        type="range"
                        min="0"
                        max="255"
                        value={triggerLevel}
                        onChange={(e) => setTriggerLevel(Number(e.target.value))}
                        className="w-48"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">トリガースロープ</label>
                    <select
                        value={triggerSlope}
                        onChange={(e) => setTriggerSlope(e.target.value as 'rising' | 'falling')}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="rising">立ち上がり</option>
                        <option value="falling">立ち下がり</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className={`px-4 py-2 rounded-md ${
                            isPaused 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : 'bg-red-500 hover:bg-red-600'
                        } text-white font-medium`}
                    >
                        {isPaused ? '再開' : '一時停止'}
                    </button>
                </div>
            </div>
        </div>
    );
}

