import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'
import { Local } from '@/cache/index'

const i18n = createI18n({
    legacy: false,
    locale: Local.get("lang") || 'zh-CN', // default locale
    messages: {
        'zh-CN': zhCN,
        'en-US': enUS
    }
})

export default i18n