import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";
import type { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { Skeleton } from "./ui/skeleton";

const ProfessionalMap = () => {
    const [loadMap, setLoadMap] = useState(false);
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const lang = useSelector((state: RootState) => state.language.lang);
    const isRTL = lang === "ar";
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            },
            { threshold: 0.25 }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`border cursor-pointer relative overflow-hidden rounded-4xl ${visible ? "map-active" : ""}`}
        >
            {!loadMap ? (
                <div
                    onClick={() => setLoadMap(true)}
                >
                    <Skeleton className="w-full h-90 flex items-center justify-center" >
                        <MapPin className="text-primary" />
                        <p>{isRTL ? "اضغط لتحميل الخريطة" : "Click to load map"}</p>
                    </Skeleton>
                </div>
            ) : (
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7828.699346484779!2d31.362588911684952!3d30.558326132723383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sar!2seg!4v1778320913345!5m2!1sar!2seg"
                    className="w-full h-90 border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                />
            )}
        </div>
    );
};

export default ProfessionalMap;