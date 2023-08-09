import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    'calendar-man-hours': {
      'title': 'calendar-man-hours',
      'description': 'calendar-man-hours',
    },
  },
  ja: {
    'calendar-man-hours': {
      'title': '工数カレンダー',
      'description': '工数をカレンダーに入れて管理します',
    },
  },
}

const isSSR = typeof window === 'undefined'

let lang = isSSR || sessionStorage.getItem('lang')
if (!['ja', 'en'].includes(lang as string)) {
  lang = 'en'
}

i18n.use(initReactI18next).init({
  resources,
  lng: lang,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
