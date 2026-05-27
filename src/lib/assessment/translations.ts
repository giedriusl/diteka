import type { Language } from './types'

// Template variables use {varName} syntax. Replace at render time.

const en = {
  step0: {
    headline: 'Choose your language / Pasirinkite kalbą',
    en: 'English',
    lt: 'Lietuvių',
  },

  step1: {
    headline: "Let's start with some context about your company",
    companySize: {
      label: 'How many employees does your company have?',
      xs: '1–10',
      s: '11–50',
      m: '51–200',
      l: '200+',
    },
    sector: {
      label: 'What sector best describes your business?',
      manufacturing: 'Manufacturing',
      logistics: 'Logistics / Transport',
      wholesale: 'Wholesale / Distribution',
      services: 'Professional Services',
      retail: 'Retail',
      other: 'Other',
    },
    painPoint: {
      label: 'What is your biggest operational challenge right now?',
      staff: 'Staff shortage / hard to hire',
      errors: 'Too many manual errors',
      overload: 'Owner/manager overloaded with operational work',
      compliance: 'Compliance / reporting burden',
      volume: "Can't keep up with order volume",
      other: 'Other',
    },
  },

  step2: {
    headline: "Let's assess your first process",
    headlineN: "Let's assess process {n}",
    processName: {
      label: 'What is the name of this process?',
      placeholder: "e.g. 'Invoice processing', 'Order confirmation', 'Payroll'",
    },
    D1: {
      label: 'How are decisions made in this process?',
      1: 'Completely judgment-based — every case is unique, depends on experience',
      2: 'Mostly judgment, with some informal rules',
      3: 'Mix of clear rules and occasional judgment calls',
      4: 'Mostly rule-based, with rare exceptions',
      5: 'Completely rule-based — same input always produces the same output',
    },
    D2: {
      label: 'How many times is this process completed per month?',
      1: 'Fewer than 10',
      2: '10–50',
      3: '50–200',
      4: '200–1,000',
      5: 'More than 1,000',
    },
    D3: {
      label: 'Where does the data that triggers this process come from?',
      1: 'Paper documents, handwritten notes, or phone calls only',
      2: 'Mostly paper with some digital (scanned PDFs, email attachments)',
      3: 'Mix of paper and digital inputs',
      4: 'Mostly digital (emails, forms, spreadsheets) with occasional paper',
      5: 'Fully digital — systems, APIs, or online forms only',
    },
    D4: {
      label: 'How is the data in this process formatted?',
      1: 'Free-form text, varied formats — emails written differently each time',
      2: 'Mostly unstructured with some consistent fields',
      3: 'Mix of structured and unstructured',
      4: 'Mostly structured (tables, forms, consistent fields) with some free text',
      5: 'Fully structured and machine-readable — consistent fields, no free text',
    },
    D5: {
      label: 'How consistent is this process from one execution to the next?',
      1: 'Every case is handled differently — no standard procedure',
      2: 'Some common steps, but many exceptions and variations',
      3: 'A documented procedure exists and is followed most of the time',
      4: 'Highly consistent with only rare exceptions',
      5: 'Identical every time — same steps, same sequence, no exceptions',
    },
    D6: {
      label: 'How many different software tools or systems are used in this process?',
      1: '1 system (or done on paper)',
      2: '2 systems',
      3: '3–4 systems',
      4: '5–6 systems',
      5: '7 or more systems',
    },
    D7: {
      label: 'How often do errors, rework, or corrections occur in this process?',
      1: 'Rarely or never — process runs smoothly',
      2: 'Occasional errors (once a month or less)',
      3: 'Regular errors (roughly once a week)',
      4: 'Frequent errors (multiple times per week)',
      5: 'Constant errors — rework is a standard part of the process',
    },
    D8: {
      label: 'Is this process expected to significantly change in the next 12 months?',
      1: 'Yes — we are redesigning or replacing this process completely',
      2: 'Significant changes are planned',
      3: 'Some changes possible, but nothing major',
      4: 'Minor changes only',
      5: 'No changes planned — this process is stable',
    },
    hoursPerWeek: {
      label: 'Roughly how many person-hours per week does your team spend on this process?',
      placeholder: 'e.g. 10',
    },
  },

  step3: {
    teaserHeadline: 'Process {n} preliminary score: {score}%',
    teaserSubtext:
      'Complete the full assessment to receive your detailed report, benchmark comparison, and time-savings estimate.',
    cta: 'Continue →',
    knockout: {
      no_compliance:
        "Process redesign in progress — automation not recommended now. We'll revisit in 6–12 months.",
      no_data_and_rules:
        "This process relies heavily on unstructured data and judgment — standard automation isn't the right fit. AI-augmented solutions may apply.",
    },
  },

  step4: {
    headline: 'Add more processes for a fuller picture',
    incentive:
      'Assess 3 or more processes and receive a free Automation Roadmap — a prioritised list of where to start.',
    addProcess2: 'Add Process 2',
    addProcess3: 'Add Process 3',
    skip: 'Skip to next step',
    overallScore: 'Your overall automation potential so far: {score}%',
  },

  step5: {
    headline: 'Is your data stored in spreadsheets, legacy systems, or scattered across tools?',
    subtext:
      'Take our 3-minute Database Readiness check and find out if a modern database could unlock faster growth.',
    toggleLabel: 'Yes, assess my database readiness',
    M1: {
      label: 'Where is your business-critical data currently stored?',
      1: 'Modern cloud ERP or CRM (e.g. SAP, Dynamics 365, Salesforce)',
      2: 'Older ERP with some cloud features',
      3: 'Mix of ERP and spreadsheets / local files',
      4: 'Primarily spreadsheets and shared drives',
      5: 'Paper records or no structured storage',
    },
    M2: {
      label: 'How much data do you estimate needs to be migrated or organised?',
      1: 'Very large — millions of records, 10+ years of history',
      2: 'Large — hundreds of thousands of records',
      3: 'Medium — tens of thousands of records',
      4: 'Small — thousands of records',
      5: 'Very small — hundreds of records',
    },
    M3: {
      label: 'How clean and consistent is your current data?',
      1: 'Very poor — many duplicates, missing fields, inconsistent formats',
      2: 'Poor — significant cleanup would be required',
      3: 'Moderate — some issues but mostly usable',
      4: 'Good — minor cleanup needed',
      5: 'Excellent — clean, consistent, and well-organised',
    },
    M4: {
      label: 'How many other systems need to connect to your new database?',
      1: 'None — standalone database is fine',
      2: '1–2 systems',
      3: '3–4 systems',
      4: '5–6 systems',
      5: '7 or more systems',
    },
    M5: {
      label: 'Which of the following apply to your business? Select all that apply.',
      gdpr: 'A GDPR or compliance audit is coming up',
      vendor_eol: 'Our current software vendor is ending support',
      growth: 'Growth is bottlenecked by our current data systems',
      security: 'We have had a data security incident or concern',
      investors: 'Investors or board have flagged data management as an issue',
    },
  },

  step6: {
    teaserHeadline: 'Your automation potential: {score}%',
    subtext:
      'Enter your email to receive your full report — score breakdown, benchmark comparison, and recommended next steps. Sent within 60 seconds.',
    emailLabel: 'Email address',
    emailPlaceholder: 'you@company.com',
    privacy: 'We will not share your data. One report email, then only if you opt in.',
    submit: 'Get My Report →',
  },

  step7: {
    headline: '{score}% Automation Potential',
    bands: {
      strong: 'Strong Candidate',
      good: 'Good Candidate',
      moderate: 'Moderate Potential',
      low: 'Low Suitability',
      not_suitable: 'Not Suitable',
    },
    benchmark: 'Companies in your sector average {benchmark}% automation potential. You scored {score}%.',
    hoursSaved: 'Your top process could save approximately {hours} hours/year (≈ {days} person-days).',
    emailSent: 'Your full report has been sent to {email}. Check your inbox — it should arrive within 60 seconds.',
    contactCta: "We'll be in touch within 2 working days.",
    contactSubtext: 'Our team will review your results and reach out by email or phone to discuss next steps.',
    contactFallback: "Can't wait? Email us at",
    migration: {
      headline: 'Database Migration Readiness',
      score: 'Migration score: {score}%',
      bands: {
        critical: 'Critical',
        ready: 'Ready to Migrate',
        prepare_first: 'Prepare First',
        low_urgency: 'Low Urgency',
        no_action: 'No Action Needed',
      },
    },
  },

  nav: {
    back: '← Back',
    next: 'Next →',
    submit: 'Get My Report →',
  },

  progress: {
    step: 'Step {current} of {total}',
  },

  errors: {
    required: 'This field is required.',
    invalidEmail: 'Please enter a valid email address.',
    submitFailed: 'Something went wrong. Please try again.',
    hoursRange: 'Please enter a number between 1 and 500.',
  },

  reset: {
    link: 'Start over',
    confirm: 'This will clear all your answers. Are you sure?',
    yes: 'Yes, start over',
    cancel: 'Cancel',
  },
} as const

const lt = {
  step0: {
    headline: 'Choose your language / Pasirinkite kalbą',
    en: 'English',
    lt: 'Lietuvių',
  },

  step1: {
    headline: 'Pradėkime nuo konteksto apie jūsų įmonę',
    companySize: {
      label: 'Kiek darbuotojų turi jūsų įmonė?',
      xs: '1–10',
      s: '11–50',
      m: '51–200',
      l: '200+',
    },
    sector: {
      label: 'Kuris sektorius geriausiai apibūdina jūsų verslą?',
      manufacturing: 'Gamyba',
      logistics: 'Logistika / Transportas',
      wholesale: 'Didmeninė prekyba / Distribucija',
      services: 'Profesionalios paslaugos',
      retail: 'Mažmeninė prekyba',
      other: 'Kita',
    },
    painPoint: {
      label: 'Koks didžiausias jūsų veiklos iššūkis šiuo metu?',
      staff: 'Darbuotojų trūkumas / sunku įdarbinti',
      errors: 'Per daug rankinių klaidų',
      overload: 'Savininkas/vadovas perkrautas operatyviniais darbais',
      compliance: 'Atitikties / ataskaitų našta',
      volume: 'Nespėjame apdoroti užsakymų',
      other: 'Kita',
    },
  },

  step2: {
    headline: 'Įvertinkime pirmą procesą',
    headlineN: 'Įvertinkime {n} procesą',
    processName: {
      label: 'Kaip vadinate šį procesą?',
      placeholder: 'pvz. „Sąskaitų apdorojimas", „Užsakymų patvirtinimas", „Atlyginimų skaičiavimas"',
    },
    D1: {
      label: 'Kaip priimami sprendimai šiame procese?',
      1: 'Visiškai paremta sprendimu — kiekvienas atvejis unikalus, priklauso nuo patirties',
      2: 'Daugiausia sprendimas, šiek tiek neformalių taisyklių',
      3: 'Aiškių taisyklių ir retų sprendimų derinys',
      4: 'Daugiausia taisyklėmis paremta, retai — išimtys',
      5: 'Visiškai taisyklėmis paremta — vienodi duomenys visada duoda vienodą rezultatą',
    },
    D2: {
      label: 'Kiek kartų šis procesas atliekamas per mėnesį?',
      1: 'Mažiau nei 10',
      2: '10–50',
      3: '50–200',
      4: '200–1 000',
      5: 'Daugiau nei 1 000',
    },
    D3: {
      label: 'Iš kur gaunami duomenys, pradedantys šį procesą?',
      1: 'Tik popieriniai dokumentai, ranka rašytos pastabos ar telefono skambučiai',
      2: 'Daugiausia popierius su šiek tiek skaitmeninio (nuskaityti PDF, el. pašto priedai)',
      3: 'Popierinio ir skaitmeninio derinys',
      4: 'Daugiausia skaitmeninis (el. laiškai, formos, skaičiuoklės) su retomis išimtimis',
      5: 'Visiškai skaitmeninis — sistemos, API ar internetinės formos',
    },
    D4: {
      label: 'Kokiu formatu pateikiami duomenys šiame procese?',
      1: 'Laisvos formos tekstas, skirtingi formatai — el. laiškai rašomi skirtingai kiekvieną kartą',
      2: 'Daugiausia nestruktūrizuota su kai kuriais nuosekliais laukais',
      3: 'Struktūrizuoto ir nestruktūrizuoto derinys',
      4: 'Daugiausia struktūrizuota (lentelės, formos, nuoseklūs laukai) su šiek tiek laisvo teksto',
      5: 'Visiškai struktūrizuota ir mašinai skaitoma — nuoseklūs laukai, nėra laisvo teksto',
    },
    D5: {
      label: 'Kiek nuoseklus šis procesas kiekvieną kartą jį atliekant?',
      1: 'Kiekvienas atvejis traktuojamas skirtingai — nėra standartinės procedūros',
      2: 'Kai kurie bendri žingsniai, tačiau daug išimčių ir variantų',
      3: 'Yra dokumentuota procedūra, dažniausiai laikomasi',
      4: 'Labai nuoseklus su retomis išimtimis',
      5: 'Identiškas kiekvieną kartą — tie patys žingsniai, ta pati seka, jokių išimčių',
    },
    D6: {
      label: 'Kiek skirtingų programų ar sistemų naudojama šiame procese?',
      1: '1 sistema (arba atliekama popieriuje)',
      2: '2 sistemos',
      3: '3–4 sistemos',
      4: '5–6 sistemos',
      5: '7 ar daugiau sistemų',
    },
    D7: {
      label: 'Kaip dažnai pasitaiko klaidų, perdarymo ar pataisymų šiame procese?',
      1: 'Retai arba niekada — procesas vyksta sklandžiai',
      2: 'Retkarčiais (kartą per mėnesį ar rečiau)',
      3: 'Reguliariai (maždaug kartą per savaitę)',
      4: 'Dažnai (kelis kartus per savaitę)',
      5: 'Nuolat — pataisymai yra įprasta proceso dalis',
    },
    D8: {
      label: 'Ar šis procesas labai pasikeis per ateinančius 12 mėnesių?',
      1: 'Taip — visiškai pertvarkome arba keičiame šį procesą',
      2: 'Planuojami reikšmingi pokyčiai',
      3: 'Galimi kai kurie pokyčiai, bet nieko esminio',
      4: 'Tik nedideli pakeitimai',
      5: 'Pokyčiai neplanuojami — procesas stabilus',
    },
    hoursPerWeek: {
      label: 'Maždaug kiek žmogaus valandų per savaitę jūsų komanda skiria šiam procesui?',
      placeholder: 'pvz. 10',
    },
  },

  step3: {
    teaserHeadline: '{n} proceso preliminarus balas: {score}%',
    teaserSubtext:
      'Užbaikite visą vertinimą ir gaukite išsamią ataskaitą, lyginamąją analizę ir laiko taupymo įvertinimą.',
    cta: 'Tęsti →',
    knockout: {
      no_compliance:
        'Procesas pertvarkomas — automatizacija nerekomenduojama šiuo metu. Peržiūrėsime po 6–12 mėn.',
      no_data_and_rules:
        'Šis procesas labai priklauso nuo nestruktūrizuotų duomenų ir sprendimų — standartinė automatizacija netinkama. Galbūt tiks dirbtinio intelekto sprendimai.',
    },
  },

  step4: {
    headline: 'Pridėkite daugiau procesų išsamesniam vaizdui',
    incentive:
      'Įvertinkite 3 ar daugiau procesų ir gaukite nemokamą Automatizavimo kelrodį — prioritetinį sąrašą, kur pradėti.',
    addProcess2: 'Pridėti 2 procesą',
    addProcess3: 'Pridėti 3 procesą',
    skip: 'Praleisti šį žingsnį',
    overallScore: 'Bendras jūsų automatizavimo potencialas iki šiol: {score}%',
  },

  step5: {
    headline: 'Ar jūsų duomenys saugomi skaičiuoklėse, senose sistemose ar išsklaidyti po skirtingas priemones?',
    subtext:
      'Atlikite 3 minučių duomenų bazės pasirengimo patikrinimą ir sužinokite, ar šiuolaikinė duomenų bazė galėtų padėti augti greičiau.',
    toggleLabel: 'Taip, įvertinkite mano duomenų bazės pasirengimą',
    M1: {
      label: 'Kur šiuo metu saugomi jūsų verslo duomenys?',
      1: 'Šiuolaikinė debesinė ERP ar CRM sistema (pvz. SAP, Dynamics 365, Salesforce)',
      2: 'Senesnė ERP su kai kuriomis debesijos funkcijomis',
      3: 'ERP ir skaičiuoklių / vietinių failų derinys',
      4: 'Daugiausia skaičiuoklės ir bendrinami diskai',
      5: 'Popieriniai įrašai arba nėra struktūrizuotos saugyklos',
    },
    M2: {
      label: 'Kiek duomenų, jūsų manymu, reikia perkelti ar sutvarkyti?',
      1: 'Labai daug — milijonai įrašų, 10+ metų istorija',
      2: 'Daug — šimtai tūkstančių įrašų',
      3: 'Vidutiniškai — dešimtys tūkstančių įrašų',
      4: 'Nedaug — tūkstančiai įrašų',
      5: 'Labai nedaug — šimtai įrašų',
    },
    M3: {
      label: 'Kokie švarūs ir nuoseklūs yra jūsų dabartiniai duomenys?',
      1: 'Labai prasti — daug dublikatų, trūkstamų laukų, nenuoseklių formatų',
      2: 'Prasti — reikėtų didelės valymo darbo',
      3: 'Vidutiniai — yra problemų, bet daugiausia naudojami',
      4: 'Geri — reikalingas nedidelis valymas',
      5: 'Puikūs — švarūs, nuoseklūs ir gerai sutvarkyti',
    },
    M4: {
      label: 'Kiek kitų sistemų turi prisijungti prie jūsų naujos duomenų bazės?',
      1: 'Nė vienos — atskira duomenų bazė tinka',
      2: '1–2 sistemos',
      3: '3–4 sistemos',
      4: '5–6 sistemos',
      5: '7 ar daugiau sistemų',
    },
    M5: {
      label: 'Kuris iš šių teiginių taikomas jūsų verslui? Pasirinkite visus tinkančius.',
      gdpr: 'Artėja BDAR ar atitikties auditas',
      vendor_eol: 'Mūsų dabartinis programinės įrangos tiekėjas baigia palaikymą',
      growth: 'Augimas ribojamas dabartinių duomenų sistemų',
      security: 'Turėjome duomenų saugumo incidentą ar susirūpinimą',
      investors: 'Investuotojai ar valdyba atkreipė dėmesį į duomenų valdymą',
    },
  },

  step6: {
    teaserHeadline: 'Jūsų automatizavimo potencialas: {score}%',
    subtext:
      'Įveskite el. paštą ir gaukite išsamią ataskaitą — balų analizę, lyginamąją analizę ir rekomenduojamus tolesnius žingsnius. Atsiųsime per 60 sekundžių.',
    emailLabel: 'El. pašto adresas',
    emailPlaceholder: 'jusu@imone.lt',
    privacy: 'Nesidalinsime jūsų duomenimis. Vienas ataskaitos el. laiškas, toliau — tik jei sutinkate.',
    submit: 'Gauti ataskaitą →',
  },

  step7: {
    headline: '{score}% Automatizavimo potencialas',
    bands: {
      strong: 'Stiprus kandidatas',
      good: 'Geras kandidatas',
      moderate: 'Vidutinis potencialas',
      low: 'Žemas tinkamumas',
      not_suitable: 'Netinkamas',
    },
    benchmark:
      'Jūsų sektoriaus įmonės vidutiniškai pasiekia {benchmark}% automatizavimo potencialo. Jūs surinkai {score}%.',
    hoursSaved:
      'Jūsų geriausias procesas galėtų sutaupyti maždaug {hours} valandų per metus (≈ {days} darbo dienų).',
    emailSent:
      'Jūsų išsami ataskaita išsiųsta į {email}. Patikrinkite el. paštą — turėtų ateiti per 60 sekundžių.',
    contactCta: 'Susisieksime per 24 valandas.',
    contactSubtext: 'Mūsų komanda peržiūrės jūsų rezultatus ir susisieks el. paštu arba telefonu aptarti tolesnių žingsnių.',
    contactFallback: 'Negalite laukti? Rašykite mums:',
    migration: {
      headline: 'Duomenų bazės migracijos pasirengimas',
      score: 'Migracijos balas: {score}%',
      bands: {
        critical: 'Kritinė',
        ready: 'Pasiruošę migracijai',
        prepare_first: 'Pirmiausia pasiruoškite',
        low_urgency: 'Žemas skubumas',
        no_action: 'Veiksmų nereikia',
      },
    },
  },

  nav: {
    back: '← Atgal',
    next: 'Toliau →',
    submit: 'Gauti ataskaitą →',
  },

  progress: {
    step: '{current} žingsnis iš {total}',
  },

  errors: {
    required: 'Šis laukas yra privalomas.',
    invalidEmail: 'Įveskite galiojantį el. pašto adresą.',
    submitFailed: 'Kažkas nutiko. Pabandykite dar kartą.',
    hoursRange: 'Įveskite skaičių nuo 1 iki 500.',
  },

  reset: {
    link: 'Pradėti iš naujo',
    confirm: 'Tai ištrins visus jūsų atsakymus. Ar tikrai?',
    yes: 'Taip, pradėti iš naujo',
    cancel: 'Atšaukti',
  },
} as const

export const translations = { en, lt } as const

export type Translations = typeof translations.en
export type TranslationKey = keyof Translations

export function getT(language: Language) {
  return translations[language]
}

export function tmpl(str: string, vars: Record<string, string | number>): string {
  return str.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''))
}
