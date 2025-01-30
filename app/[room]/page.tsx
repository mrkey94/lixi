"use client";

import { AnimatedIcon } from "@/components/common/AnimatedIcon";
import { KEY_SETTING, ListIconTet, SEPARATE_SETTINGS } from "@/constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CopyIcon, QrCode, Share, VolumeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import AddBankAccount from "@/components/common/AddBankAccount";
import { Toaster } from "@/components/ui/toaster";
import { getItem } from "@/lib/localStorage.helper";
import { ScratchToReveal } from "@/components/ui/scratch-to-reveal";
import { formatCurrency } from "@/lib/price.helper";
import { Dropdown, FloatButton, QRCode } from "antd";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { decodeQR } from "@/lib/qr.helper";
import QRCodeStyling, { Options } from "qr-code-styling";
import { CoffeeOutlined } from '@ant-design/icons';
import Image from "next/image";

export default function PageRandom({
    params,
}: {
    params: Promise<{ room: string }>
}) {
    const [icons, setIcons] = useState<React.ReactElement[]>([]);
    const [iconsQr, setIconsQr] = useState<React.ReactElement[]>([]);
    const [visibleVolume, setVisibleVolume] = useState(true);
    const { toast } = useToast();
    const [imgQr, setImgQr] = useState<string>();
    const [money, setMoney] = useState<number>();
    const qrRef = useRef<HTMLDivElement>(null);
    const [isVisibleShareQr, setIsVisibleShareQr] = useState(false);
    const [isVisibleCoffee, setIsVisibleCoffee] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [options, setOptions] = useState<Options>({
        width: 300,
        height: 300,
        type: 'svg',
        data: 'hello',
        margin: 10,
        qrOptions: {
            typeNumber: 0,
            mode: 'Byte',
            errorCorrectionLevel: 'Q'
        },
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 20,
            crossOrigin: 'anonymous',
            saveAsBlob: true,
        },
        cornersSquareOptions: {
            type: 'extra-rounded',
            color: '#ff1900',
        },
        dotsOptions: {
            color: '#222222',
            type: "dots",
            gradient: { type: 'linear', colorStops: [{ offset: 0, color: '#fc3d03' }, { offset: 1, color: '#FFD700' }] },
        },
        cornersDotOptions: {
            type: 'dot',
            color: '#ff1900',
        },
        backgroundOptions: {
            color: 'white',
        },
    });
    const [qrCode, setQrCode] = useState<QRCodeStyling>();

    useEffect(() => {
        setQrCode(new QRCodeStyling(options));
    }, [options])

    useEffect(() => {
        if (!qrCode) return;
        qrCode?.update(options);
    }, [qrCode, options]);

    useEffect(() => {
        if (ref.current) {
            qrCode?.append(ref.current);
        }
    }, [qrCode, ref]);

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

    const handleFireWork = useCallback(() => {
        const duration = 7 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) =>
            Math.random() * (max - min) + min;

        const interval = window.setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);
    }, []);

    const handleOpenLixi = useCallback(async () => {
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
        const id = (await params).room;
        const response = await fetch(`/api/get-lixi`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, accountId: `${code}${SEPARATE_SETTINGS}${accountNumber}` }),
        });
        const data = await response.json();
        if (data.message) {
            toast({
                variant: "destructive",
                title: "Hmm",
                description: data.message,
            });
            return;
        }
        setMoney(data.money);
        handleFireWork();
        const qrCode = `https://qr.sepay.vn/img?bank=${code}&acc=${accountNumber}&template=qronly&amount=${data.money}&des=CHUC MUNG NAM MOI 2025`;
        const dataDecode = await decodeQR(qrCode);
        setImgQr(dataDecode);
        setOptions(options => ({
            ...options,
            data: dataDecode
        }));


    }, [handleFireWork, params, toast]);

    const handleCompleted = useCallback(() => {
        const newIcons = Array.from({ length: 5 }, (_, i) => {
            const RandomIcon =
                ListIconTet[Math.floor(Math.random() * ListIconTet.length)];
            const size = Math.floor(Math.random() * (56 - 38 + 1)) + 38;
            return (
                <AnimatedIcon key={i} constraints={qrRef.current?.getBoundingClientRect()}>
                    <RandomIcon width={size} height={size} />
                </AnimatedIcon>
            );
        });
        console.log();

        setIconsQr(newIcons);
    }, []);

    const handleShareQr = useCallback(() => {
        console.log(window.location.href);
        setIsVisibleShareQr(true);
    }, []);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(window.location.href);
        toast({
            title: "Copy",
            description: "Đã sao chép đường dẫn",
        });
    }, [toast]);

    return (
        <>
            <Toaster />
            <div className="absolute top-0 left-0 right-0 bottom-0">
                {icons}
            </div>

            <div className="absolute right-10 top-10 flex justify-center items-center gap-x-2">
                <AnimatePresence>
                    {visibleVolume && (
                        <motion.div
                            key={'volume'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
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
                <motion.div
                    key={'share'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <Dropdown menu={{
                        items: [{
                            key: 'copy',
                            label: 'Copy link',
                            icon: <CopyIcon size={16} />,
                            onClick: handleCopy
                        },
                        {
                            key: 'qr',
                            label: 'Chia sẻ QR',
                            icon: <QrCode size={16} />,
                            onClick: handleShareQr
                        }]
                    }} trigger={["click"]}>
                        <Share size={32}
                            color="white"
                            className="cursor-pointer" />
                    </Dropdown>

                </motion.div>

            </div>
            <AddBankAccount />
            <h1 className="text-4xl font-pacifico text-white z-[9] mb-6">
                Lì xì túi mù
            </h1>
            <AnimatePresence>
                {!imgQr && (<motion.div
                    key="button"
                    initial={{ height: 60, opacity: 0 }}
                    animate={{ height: 200, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                        "w-[300px] bg-[#FF3B3B] hover:bg-[#FF2424] transition-colors",
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

                    <button className="absolute font-pacifico bottom-4 w-full text-center text-[#FFD700] font-bold text-xl hover:text-[#FFF7CC] transition-colors" onClick={handleOpenLixi} >
                        {'>'}Nhận Lì Xì Ngay {'<'}
                    </button>
                </motion.div>)}
                {(imgQr && money) && (
                    <motion.div
                        ref={qrRef}
                        key={'qr'}
                        initial={{ height: 300, opacity: 0 }}
                        animate={{ height: 400, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className={cn(
                            "w-[300px] bg-white transition-colors rounded-sm",
                            "border-2 border-[#FFD700] shadow-lg cursor-pointer",
                            "relative overflow-hidden transform hover:scale-105 transition-transform",
                            "flex items-center justify-center"
                        )}
                    >
                        <ScratchToReveal height={400} width={300} onComplete={handleCompleted} gradientColors={['#F93827', '#FF9D23', '#F93827']} minScratchPercentage={90} className="flex flex-col items-center justify-center overflow-hidden">
                            {iconsQr}
                            <div ref={ref} />
                            <p className="text-2xl font-bold text-red-500 font-pacifico mt-2">{formatCurrency(money)}</p>
                        </ScratchToReveal>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="absolute left-0 right-0 bottom-[10px] ">
                <div className="w-full flex justify-center items-center">
                    <Link href="https://nguyenconggioi.me" target="_blank">
                        <p className="text-white text-center font-mono text-xs transition-transform transform hover:scale-105">
                            Designed and Made with <br />
                            Nguyen Cong Gioi 2025
                        </p>
                    </Link>
                </div>
            </div>
            <FloatButton icon={<CoffeeOutlined className="text-red-500" />} onClick={() => setIsVisibleCoffee(true)} />
            <Dialog open={isVisibleCoffee} onOpenChange={setIsVisibleCoffee}>
                <DialogContent className="w-fit rounded-md">
                    <DialogHeader>
                        <DialogTitle className="text-center">QR của tui</DialogTitle>
                        <DialogDescription className="text-center">
                            Lì xì chủ shop ly Coffee😁, nếu bạn thấy thú vị 👇
                        </DialogDescription>
                    </DialogHeader>
                    <div className="w-full flex justify-center items-center">
                        <Image src="/my-qr.jpg" width={200} height={300} alt="My Qr code" className="rounded-lg object-cover" />
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={isVisibleShareQr} onOpenChange={setIsVisibleShareQr}>
                <DialogContent className="w-fit rounded-md">
                    <DialogHeader>
                        <DialogTitle className="text-center">Qr Code</DialogTitle>
                        <DialogDescription className="text-center">
                            Dùng QR để chia sẻ cho bạn bè nhé 🧧
                        </DialogDescription>
                    </DialogHeader>
                    <div className="w-full flex justify-center items-center">
                        <QRCode value={window.location.href} />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
