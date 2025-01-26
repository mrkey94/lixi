"use client";

import { AnimatedIcon } from "@/components/common/AnimatedIcon";
import { KEY_SETTING, ListIconTet, SEPARATE_SETTINGS } from "@/constants";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VolumeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import AddBankAccount from "@/components/common/AddBankAccount";
import { Toaster } from "@/components/ui/toaster";
import { getItem } from "@/lib/localStorage.helper";

export const runtime = 'edge';

export default function PageRandom({
    params,
}: {
    params: Promise<{ random: string }>
}) {
    const [icons, setIcons] = useState<React.ReactElement[]>([]);
    const [visibleVolume, setVisibleVolume] = useState(true);
    const { toast } = useToast();
    const [amoutRange, setAmountRange] = useState<number[]>([]);

    useEffect(() => {
        (async () => {
            const hash = (await params).random;
            fetch(`/api/room?id=${hash}`).then((res) => res.json()).then((data) => {
                if (data.from && data.to) {
                    setAmountRange([+(data?.from ?? 10000), +(data?.to ?? 20000)]);
                }
            });
        })();
    }, [params]);

    useEffect(() => {
        const newIcons = Array.from({ length: 25 }, (_, i) => {
            const RandomIcon =
                ListIconTet[Math.floor(Math.random() * ListIconTet.length)];
            const size = Math.floor(Math.random() * (56 - 38 + 1)) + 38;
            return (
                <AnimatedIcon key={i}>
                    <RandomIcon width={size} height={size} />
                </AnimatedIcon>
            );
        });

        setIcons(newIcons);
    }, []);

    useEffect(() => {
        const audio = new Audio("/thu-y.mp3");
        audio.muted = true;
        audio.loop = true;

        const handleUserInteraction = () => {
            audio.play();
            setVisibleVolume(false);
            window.removeEventListener("click", handleUserInteraction);
        };

        window.addEventListener("click", handleUserInteraction);
        return () => {
            audio.pause();
            window.removeEventListener("click", handleUserInteraction);
        };
    }, []);

    const handleOpenLixi = useCallback(() => {
        const setting = getItem<string>(KEY_SETTING);
        if (!setting) {
            toast({
                variant: "destructive",
                title: "Lưu ý",
                description: "Bạn chưa thiết lập tài khoản nhận lì xì 😁",
            });
            return;
        }
        const [code, accountNumber] = setting.split(SEPARATE_SETTINGS);
        if (!code || !accountNumber) {
            toast({
                variant: "destructive",
                title: "Lưu ý",
                description: "Bạn chưa thiết lập tài khoản nhận lì xì 😁",
            });
            return;
        }
    }, [toast]);

    return (
        <>
            <Toaster />
            <div className="absolute top-0 left-0 right-0 bottom-0 ">
                {icons}
            </div>
            <AnimatePresence>
                {visibleVolume && (
                    <motion.div
                        className="absolute right-10 top-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <VolumeOff
                            size={32}
                            color="white"
                            className="cursor-pointer"
                            onClick={() => setVisibleVolume(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <AddBankAccount />
            <h1 className="text-4xl font-pacifico text-white z-[9] mb-6">
                Lì xì túi mù
            </h1>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.85 }}
                className={cn(
                    "w-[300px] h-[180px] bg-[#FF3B3B] hover:bg-[#FF2424] transition-colors",
                    "border-2 border-[#FFD700] shadow-lg cursor-pointer",
                    "relative overflow-hidden transform hover:scale-105 transition-transform",
                    "flex items-center justify-center"
                )}
            >
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#FFD700]" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#FFD700]" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#FFD700]" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#FFD700]" />

                <div className="w-16 h-16 rounded-full border-2 border-[#FFD700] flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-[#FFD700] bg-[#FF3B3B]" />
                </div>

                {/* Button text */}
                <button className="absolute font-pacifico bottom-4 w-full text-center text-[#FFD700] font-bold text-xl hover:text-[#FFF7CC] transition-colors" onClick={handleOpenLixi} >
                    Nhận Lì Xì Ngay
                </button>
            </motion.div>
        </>
    );
}
