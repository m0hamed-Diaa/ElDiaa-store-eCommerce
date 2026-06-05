export function setDirection(lang: string) {
    const html = document.documentElement;

    html.setAttribute("lang", lang)

    if (lang === "ar") {
        html.setAttribute("dir", "rtl")
    } else {
        html.setAttribute("dir", "ltr")
    }
}