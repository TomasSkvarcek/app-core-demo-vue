import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import langResources from "@/src/config/translation/langResources.js";

i18n
    .use(Backend)
    .init({
        debug: false,
        fallbackLng: import.meta.env.VITE_LOCALE,
        interpolation: {
            escapeValue: false,
        },
        resources: langResources
    });

export default i18n;
