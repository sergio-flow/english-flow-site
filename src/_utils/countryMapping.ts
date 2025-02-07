export type CountryMapping = {
    countryCode: string;
    countryName: string;
    continentName: string;
}

const countryMapping: CountryMapping[] = [
    { countryCode: "EG", countryName: "Egypt", continentName: "Africa" },
    { countryCode: "SA", countryName: "Saudi Arabia", continentName: "Asia" },
    { countryCode: "AE", countryName: "United Arab Emirates", continentName: "Asia" },
    { countryCode: "LB", countryName: "Lebanon", continentName: "Asia" },
    { countryCode: "JO", countryName: "Jordan", continentName: "Asia" },
    { countryCode: "SY", countryName: "Syria", continentName: "Asia" },
    { countryCode: "IQ", countryName: "Iraq", continentName: "Asia" },
    { countryCode: "MA", countryName: "Morocco", continentName: "Africa" },
    { countryCode: "TN", countryName: "Tunisia", continentName: "Africa" },
    { countryCode: "DZ", countryName: "Algeria", continentName: "Africa" },
    { countryCode: "YE", countryName: "Yemen", continentName: "Asia" },
    { countryCode: "SD", countryName: "Sudan", continentName: "Africa" },
    { countryCode: "LY", countryName: "Libya", continentName: "Africa" },
    { countryCode: "KW", countryName: "Kuwait", continentName: "Asia" },
    { countryCode: "QA", countryName: "Qatar", continentName: "Asia" },
    { countryCode: "BH", countryName: "Bahrain", continentName: "Asia" },
    { countryCode: "OM", countryName: "Oman", continentName: "Asia" },

    { countryCode: "BG", countryName: "Bulgaria", continentName: "Europe" },
    { countryCode: "CZ", countryName: "Czech Republic", continentName: "Europe" },
    { countryCode: "DK", countryName: "Denmark", continentName: "Europe" },
    { countryCode: "DE", countryName: "Germany", continentName: "Europe" },
    { countryCode: "AT", countryName: "Austria", continentName: "Europe" },
    { countryCode: "CH", countryName: "Switzerland", continentName: "Europe" },
    { countryCode: "LI", countryName: "Liechtenstein", continentName: "Europe" },
    { countryCode: "GR", countryName: "Greece", continentName: "Europe" },
    { countryCode: "CY", countryName: "Cyprus", continentName: "Europe" },
    { countryCode: "ES", countryName: "Spain", continentName: "Europe" },

    { countryCode: "MX", countryName: "Mexico", continentName: "North America" },
    { countryCode: "CO", countryName: "Colombia", continentName: "South America" },
    { countryCode: "AR", countryName: "Argentina", continentName: "South America" },
    { countryCode: "PE", countryName: "Peru", continentName: "South America" },
    { countryCode: "VE", countryName: "Venezuela", continentName: "South America" },
    { countryCode: "CL", countryName: "Chile", continentName: "South America" },
    { countryCode: "EC", countryName: "Ecuador", continentName: "South America" },

    { countryCode: "GT", countryName: "Guatemala", continentName: "North America" },
    { countryCode: "HN", countryName: "Honduras", continentName: "North America" },
    { countryCode: "SV", countryName: "El Salvador", continentName: "North America" },
    { countryCode: "CR", countryName: "Costa Rica", continentName: "North America" },
    { countryCode: "PA", countryName: "Panama", continentName: "North America" },
    { countryCode: "DO", countryName: "Dominican Republic", continentName: "North America" },
    { countryCode: "BO", countryName: "Bolivia", continentName: "South America" },
    { countryCode: "PY", countryName: "Paraguay", continentName: "South America" },
    { countryCode: "UY", countryName: "Uruguay", continentName: "South America" },
    { countryCode: "NI", countryName: "Nicaragua", continentName: "North America" },
    { countryCode: "CU", countryName: "Cuba", continentName: "North America" },

    { countryCode: "EE", countryName: "Estonia", continentName: "Europe" },
    { countryCode: "FI", countryName: "Finland", continentName: "Europe" },
    { countryCode: "FR", countryName: "France", continentName: "Europe" },
    { countryCode: "CA", countryName: "Canada", continentName: "North America" },
    { countryCode: "BE", countryName: "Belgium", continentName: "Europe" },
    { countryCode: "LU", countryName: "Luxembourg", continentName: "Europe" },
    { countryCode: "MC", countryName: "Monaco", continentName: "Europe" },

    { countryCode: "HU", countryName: "Hungary", continentName: "Europe" },
    { countryCode: "ID", countryName: "Indonesia", continentName: "Asia" },
    { countryCode: "IT", countryName: "Italy", continentName: "Europe" },
    { countryCode: "SM", countryName: "San Marino", continentName: "Europe" },
    { countryCode: "VA", countryName: "Vatican City", continentName: "Europe" },
    { countryCode: "SI", countryName: "Slovenia", continentName: "Europe" },

    { countryCode: "JP", countryName: "Japan", continentName: "Asia" },
    { countryCode: "KR", countryName: "South Korea", continentName: "Asia" },
    { countryCode: "KP", countryName: "North Korea", continentName: "Asia" },

    { countryCode: "LT", countryName: "Lithuania", continentName: "Europe" },
    { countryCode: "LV", countryName: "Latvia", continentName: "Europe" },
    { countryCode: "NO", countryName: "Norway", continentName: "Europe" },
    { countryCode: "NL", countryName: "Netherlands", continentName: "Europe" },
    { countryCode: "BE", countryName: "Belgium", continentName: "Europe" },
    { countryCode: "SR", countryName: "Suriname", continentName: "South America" },
    { countryCode: "PL", countryName: "Poland", continentName: "Europe" },
    { countryCode: "BR", countryName: "Brazil", continentName: "South America" },

    { countryCode: "PT", countryName: "Portugal", continentName: "Europe" },
    { countryCode: "AO", countryName: "Angola", continentName: "Africa" },
    { countryCode: "MZ", countryName: "Mozambique", continentName: "Africa" },
    { countryCode: "GW", countryName: "Guinea-Bissau", continentName: "Africa" },
    { countryCode: "TL", countryName: "Timor-Leste", continentName: "Asia" },
    { countryCode: "MO", countryName: "Macau", continentName: "Asia" },

    { countryCode: "RO", countryName: "Romania", continentName: "Europe" },
    { countryCode: "MD", countryName: "Moldova", continentName: "Europe" },
    { countryCode: "RU", countryName: "Russia", continentName: "Europe" },
    { countryCode: "KZ", countryName: "Kazakhstan", continentName: "Asia" },
    { countryCode: "BY", countryName: "Belarus", continentName: "Europe" },
    { countryCode: "KG", countryName: "Kyrgyzstan", continentName: "Asia" },
    { countryCode: "TJ", countryName: "Tajikistan", continentName: "Asia" },
    { countryCode: "UA", countryName: "Ukraine", continentName: "Europe" },

    { countryCode: "SK", countryName: "Slovakia", continentName: "Europe" },
    { countryCode: "SI", countryName: "Slovenia", continentName: "Europe" },
    { countryCode: "SE", countryName: "Sweden", continentName: "Europe" },
    { countryCode: "FI", countryName: "Finland", continentName: "Europe" },
    { countryCode: "AX", countryName: "Åland Islands", continentName: "Europe" },
    { countryCode: "TR", countryName: "Turkey", continentName: "Asia" },

    { countryCode: "CN", countryName: "China", continentName: "Asia" },
    { countryCode: "SG", countryName: "Singapore", continentName: "Asia" },
    { countryCode: "MY", countryName: "Malaysia", continentName: "Asia" },
    { countryCode: "TW", countryName: "Taiwan", continentName: "Asia" },
    { countryCode: "HK", countryName: "Hong Kong", continentName: "Asia" },
    { countryCode: "MO", countryName: "Macau", continentName: "Asia" }
]

export default countryMapping;