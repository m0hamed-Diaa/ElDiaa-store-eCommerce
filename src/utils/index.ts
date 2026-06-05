export function formatTimeAgo(
    date: string | Date,
    lang: string = "en"
) {
    const now = new Date()
    const past = new Date(date)

    const diffInSeconds = Math.floor(
        (now.getTime() - past.getTime()) / 1000
    )

    const intervals = [
        { labelEn: "year", labelAr: "سنة", seconds: 31536000 },
        { labelEn: "month", labelAr: "شهر", seconds: 2592000 },
        { labelEn: "day", labelAr: "يوم", seconds: 86400 },
        { labelEn: "hour", labelAr: "ساعة", seconds: 3600 },
        { labelEn: "minute", labelAr: "دقيقة", seconds: 60 },
        { labelEn: "second", labelAr: "ثانية", seconds: 1 },
    ]

    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds)

        if (count >= 1) {
            if (lang === "ar") {
                return `منذ ${count} ${interval.labelAr}`
            }

            return `ago ${count} ${interval.labelEn}${count > 1 ? "s" : ""
                }`
        }
    }

    return lang === "ar" ? "الآن" : "just now"
}