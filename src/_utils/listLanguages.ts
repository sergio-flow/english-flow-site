type Language = {
    code: string;
    english_name: string;
    local_name: string;
    countries: string[];
}

const listLanguages: Language[] = [
    {
        code: 'AR',
        english_name: 'Arabic',
        local_name: 'العربية',
        countries: ['EG', 'SA', 'AE', 'LB', 'JO', 'SY', 'IQ', 'MA', 'TN', 'DZ', 'YE', 'SD', 'LY', 'KW', 'QA', 'BH', 'OM']
    },
    {
        code: 'BG',
        english_name: 'Bulgarian',
        local_name: 'Български',
        countries: ['BG']
    },
    {
        code: 'CS',
        english_name: 'Czech',
        local_name: 'Čeština',
        countries: ['CZ']
    },
    {
        code: 'DA',
        english_name: 'Danish',
        local_name: 'Dansk',
        countries: ['DK']
    },
    {
        code: 'DE',
        english_name: 'German',
        local_name: 'Deutsch',
        countries: ['DE', 'AT', 'CH', 'LI']
    },
    {
        code: 'EL',
        english_name: 'Greek',
        local_name: 'Ελληνικά',
        countries: ['GR', 'CY']
    },
    {
        code: 'ES',
        english_name: 'Spanish',
        local_name: 'Español',
        countries: ['ES', 'MX', 'CO', 'AR', 'PE', 'VE', 'CL', 'EC', 'GT', 'HN', 'SV', 'CR', 'PA', 'DO', 'BO', 'PY', 'UY', 'NI', 'CU']
    },
    {
        code: 'ET',
        english_name: 'Estonian',
        local_name: 'Eesti',
        countries: ['EE']
    },
    {
        code: 'FI',
        english_name: 'Finnish',
        local_name: 'Suomi',
        countries: ['FI']
    },
    {
        code: 'FR',
        english_name: 'French',
        local_name: 'Français',
        countries: ['FR', 'CA', 'BE', 'CH', 'LU', 'MC']
    },
    {
        code: 'HU',
        english_name: 'Hungarian',
        local_name: 'Magyar',
        countries: ['HU']
    },
    {
        code: 'ID',
        english_name: 'Indonesian',
        local_name: 'Bahasa Indonesia',
        countries: ['ID']
    },
    {
        code: 'IT',
        english_name: 'Italian',
        local_name: 'Italiano',
        countries: ['IT', 'CH', 'SM', 'VA', 'SI']
    },
    {
        code: 'JA',
        english_name: 'Japanese',
        local_name: '日本語',
        countries: ['JP']
    },
    {
        code: 'KO',
        english_name: 'Korean',
        local_name: '한국어',
        countries: ['KR', 'KP']
    },
    {
        code: 'LT',
        english_name: 'Lithuanian',
        local_name: 'Lietuvių',
        countries: ['LT']
    },
    {
        code: 'LV',
        english_name: 'Latvian',
        local_name: 'Latviešu',
        countries: ['LV']
    },
    {
        code: 'NB',
        english_name: 'Norwegian Bokmål',
        local_name: 'Norsk Bokmål',
        countries: ['NO']
    },
    {
        code: 'NL',
        english_name: 'Dutch',
        local_name: 'Nederlands',
        countries: ['NL', 'BE', 'SR']
    },
    {
        code: 'PL',
        english_name: 'Polish',
        local_name: 'Polski',
        countries: ['PL']
    },
    {
        code: 'PT-BR',
        english_name: 'Portuguese (Brazilian)',
        local_name: 'Português Brasileiro',
        countries: ['BR']
    },
    {
        code: 'PT-PT',
        english_name: 'Portuguese',
        local_name: 'Português',
        countries: ['PT', 'AO', 'MZ', 'GW', 'TL', 'MO']
    },
    {
        code: 'RO',
        english_name: 'Romanian',
        local_name: 'Română',
        countries: ['RO', 'MD']
    },
    {
        code: 'RU',
        english_name: 'Russian',
        local_name: 'Русский',
        countries: ['RU', 'KZ', 'BY', 'KG', 'TJ', 'UA', 'MD']
    },
    {
        code: 'SK',
        english_name: 'Slovak',
        local_name: 'Slovenčina',
        countries: ['SK']
    },
    {
        code: 'SL',
        english_name: 'Slovenian',
        local_name: 'Slovenščina',
        countries: ['SI']
    },
    {
        code: 'SV',
        english_name: 'Swedish',
        local_name: 'Svenska',
        countries: ['SE', 'FI', 'AX']
    },
    {
        code: 'TR',
        english_name: 'Turkish',
        local_name: 'Türkçe',
        countries: ['TR', 'CY']
    },
    {
        code: 'UK',
        english_name: 'Ukrainian',
        local_name: 'Українська',
        countries: ['UA']
    },
    {
        code: 'ZH-HANS',
        english_name: 'Chinese (simplified)',
        local_name: '简体中文',
        countries: ['CN', 'SG', 'MY']
    },
    {
        code: 'ZH-HANT',
        english_name: 'Chinese (traditional)',
        local_name: '繁體中文',
        countries: ['TW', 'HK', 'MO']
    }
];

export default listLanguages;