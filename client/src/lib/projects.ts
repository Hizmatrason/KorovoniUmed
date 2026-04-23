export type ProjectLocale = "ru" | "tj" | "en";
export type LocalizedString = Record<ProjectLocale, string>;

export type ProjectBullet = {
  icon?: string;
  title?: LocalizedString;
  text: LocalizedString;
};

export type ProjectSection = {
  id: string;
  title: LocalizedString;
  paragraphs?: LocalizedString[];
  bullets?: ProjectBullet[];
};

export type Project = {
  slug: string;
  title: LocalizedString;
  shortTitle: LocalizedString;
  summary: LocalizedString;
  coverImage?: string;
  donor: LocalizedString;
  period: LocalizedString;
  location: LocalizedString;
  status: LocalizedString;
  intro: LocalizedString;
  sections: ProjectSection[];
  closing?: LocalizedString;
};

export const projects: Project[] = [
  {
    slug: "rudaki-rule-of-law",
    title: {
      ru: "Защита и расширение возможностей женщин в группе риска в районе Рудаки",
      tj: "Ҳифзи ҳуқуқҳо ва тавонмандсозии заноне, ки дар хатаранд, дар ноҳияи Рӯдакӣ",
      en: "Protecting and Empowering Women at Risk in Rudaki District",
    },
    shortTitle: {
      ru: "Рудаки: верховенство права и защита женщин",
      tj: "Рӯдакӣ: волоияти қонун ва ҳифзи занон",
      en: "Rudaki: Rule of Law & Women's Protection",
    },
    summary: {
      ru: "Двухлетняя программа в рамках инициативы Rule of Law: кризисный центр, 385 участниц, 361 женщина прошла профессиональное обучение, 104 получили дипломы государственного образца.",
      tj: "Барномаи дусолаи доираи ташаббуси Волоияти Қонун: маркази бӯҳронӣ, 385 иштирокчӣ, 361 зан омӯзиши касбӣ гирифтанд, 104 нафар дипломи давлатӣ гирифтанд.",
      en: "A two-year Rule of Law program: crisis center, 385 women enrolled, 361 trained in vocational skills, and 104 receiving state-recognized diplomas.",
    },
    coverImage: "/images/hero-4.jpg",
    donor: {
      ru: "Посольство США в Таджикистане, Бюро по международной борьбе с наркотиками и правоприменению (INL)",
      tj: "Сафорати ИМА дар Тоҷикистон, Бюрои байналмилалии мубориза бо маводи мухаддир ва татбиқи қонун (INL)",
      en: "U.S. Embassy Tajikistan, International Narcotics and Law Enforcement Affairs (INL)",
    },
    period: {
      ru: "2 года",
      tj: "2 сол",
      en: "2 years",
    },
    location: {
      ru: "Район Рудаки, Таджикистан",
      tj: "Ноҳияи Рӯдакӣ, Тоҷикистон",
      en: "Rudaki District, Tajikistan",
    },
    status: {
      ru: "Действующий",
      tj: "Ҷорӣ",
      en: "Ongoing",
    },
    intro: {
      ru: "С большой радостью объявляем об успешной реализации нашего двухлетнего проекта «Защита и расширение возможностей женщин в группе риска в районе Рудаки» в рамках программы «Верховенство права». «Караван надежды» (Корвони Умед) при поддержке Посольства США в Таджикистане и его секции по международной борьбе с наркотиками и правоприменению (INL) успешно реализовал этот проект.",
      tj: "Бо хушнудии зиёд дар бораи амалишавии муваффақонаи лоиҳаи дусолаи «Ҳифзи ҳуқуқҳо ва тавонмандсозии заноне, ки дар хатаранд, дар ноҳияи Рӯдакӣ» дар доираи барномаи «Волоияти Қонун» хабар медиҳем. «Корвони Умед» бо дастгирии Сафорати ИМА дар Тоҷикистон ва бахши он оид ба мубориза бо маводи мухаддир ва татбиқи қонун (INL) ин лоиҳаро муваффақона амалӣ намуд.",
      en: "We are thrilled to announce the successful implementation of our two-year project, \"Protecting and Empowering Women at Risk in Rudaki District,\" under the Rule of Law program. Caravan of Hope (Korvoni Umed), with the support of the U.S. Embassy Tajikistan and its International Narcotics and Law Enforcement Affairs section, has implemented this project with great success.",
    },
    sections: [
      {
        id: "key-achievements",
        title: {
          ru: "Ключевые достижения",
          tj: "Дастовардҳои асосӣ",
          en: "Key Achievements",
        },
        bullets: [
          {
            icon: "🏠",
            title: {
              ru: "Создание кризисного центра",
              tj: "Таъсиси маркази бӯҳронӣ",
              en: "Crisis Center Establishment",
            },
            text: {
              ru: "В районе Рудаки был открыт кризисный центр для поддержки пострадавших от домашнего насилия с предоставлением юридических, медицинских и психологических услуг.",
              tj: "Дар ноҳияи Рӯдакӣ маркази бӯҳронӣ барои дастгирии ҷабрдидагони зӯроварии хонаводагӣ таъсис дода шуд, ки хидматҳои ҳуқуқӣ, тиббӣ ва равониро пешниҳод мекунад.",
              en: "A crisis center was set up in Rudaki District to support domestic violence survivors with legal, medical, and psychological services.",
            },
          },
          {
            icon: "💪",
            title: {
              ru: "Расширение возможностей и реабилитация",
              tj: "Тавонмандсозӣ ва бозсозӣ",
              en: "Empowerment and Rehabilitation",
            },
            text: {
              ru: "Более 385 женщин приняли участие в программе: они прошли профессиональное обучение, получили правовое просвещение и занятия по финансовому управлению.",
              tj: "Беш аз 385 зан ба барнома ҷалб шуданд — онҳо омӯзиши касбӣ, маърифати ҳуқуқӣ ва дарсҳои идоракунии молиявиро гузаштанд.",
              en: "Over 385 women were enrolled and received vocational training, legal literacy education, and financial management classes.",
            },
          },
          {
            icon: "📚",
            title: {
              ru: "Профессиональное обучение",
              tj: "Омӯзиши касбӣ",
              en: "Vocational Training",
            },
            text: {
              ru: "361 женщина прошла обучение швейному делу, кулинарии и выпечке; 60% из них теперь имеют достаточный доход. 104 женщины получили дипломы государственного образца.",
              tj: "361 зан аз омӯзиши дӯзандагӣ, ошпазӣ ва нонпазӣ гузаштанд; 60% аз онҳо ҳоло дорои даромади кофӣ ҳастанд. 104 нафар дипломҳои давлатӣ гирифтанд.",
              en: "361 women were trained in sewing, cooking, and baking; 60% now earn sufficient income. 104 women received state-recognized diplomas.",
            },
          },
          {
            icon: "🚨",
            title: {
              ru: "Экстренное реагирование",
              tj: "Дахолати зудамал",
              en: "Crisis Intervention",
            },
            text: {
              ru: "В сотрудничестве с полицией и местными органами власти мы спасали и защищали жертв домашнего насилия.",
              tj: "Дар ҳамкорӣ бо милиса ва мақомоти маҳаллӣ мо ҷабрдидагони зӯроварии хонаводагиро наҷот дода, ҳимоя кардем.",
              en: "We collaborated with police and local authorities to rescue and protect victims of domestic violence.",
            },
          },
          {
            icon: "🎓",
            title: {
              ru: "Наращивание потенциала",
              tj: "Рушди иқтидор",
              en: "Capacity Building",
            },
            text: {
              ru: "80 государственных служащих прошли обучение, чтобы эффективнее поддерживать женщин в группе риска; также были проведены семинары по повышению осведомлённости в сообществе.",
              tj: "80 корманди давлатӣ омӯзиш гирифтанд, то ки тавонанд занони осебпазирро беҳтар дастгирӣ намоянд; ҳамзамон семинарҳои огоҳкунии ҷамъият баргузор шуданд.",
              en: "80 civil servants were trained to better support women at risk, alongside community awareness seminars.",
            },
          },
        ],
      },
      {
        id: "collaboration-impact",
        title: {
          ru: "Партнёрство и результаты",
          tj: "Ҳамкорӣ ва натиҷаҳо",
          en: "Collaboration and Impact",
        },
        paragraphs: [
          {
            ru: "Наше партнёрство с программой «Верховенство права» Посольства США сыграло ключевую роль в содействии Правительству Таджикистана в создании интегрированной, справедливой, подотчётной и прозрачной системы поддержки пострадавших. Это сотрудничество обеспечило равные права на участие для всех ключевых сторон, включая женщин и девочек.",
            tj: "Ҳамкории мо бо барномаи «Волоияти Қонун»-и Сафорати ИМА дар кумаки Ҳукумати Тоҷикистон барои бунёди низоми ҳамгироёнда, одилона, ҷавобгӯ ва шаффофи дастгирии ҷабрдидагон нақши калидӣ дошт. Ин ҳамкорӣ ҳуқуқи баробари иштирокро ба ҳамаи ҷонибҳои асосӣ, аз ҷумла занон ва духтарон, таъмин намуд.",
            en: "Our partnership with the U.S. Embassy Rule of Law Program has been instrumental in assisting the Tajik Government to establish an integrated, fair, accountable, and transparent support system for survivors. This collaboration has ensured that all key players, including women and girls, have equal participation rights.",
          },
        ],
      },
    ],
    closing: {
      ru: "Мы продолжаем нашу миссию — расширять возможности и защищать уязвимых женщин, опираясь на эти успехи, чтобы строить более безопасное и справедливое общество. Благодарим всех, кто поддержал эту жизненно важную инициативу.",
      tj: "Мо ба рисолати худ — тавонмандсозӣ ва ҳифзи занони осебпазир содиқ мемонем ва бар такя ба ин дастовардҳо ҷомеаи бехатартар ва одилонаро месозем. Ба ҳамаи онҳое, ки ин ташаббуси муҳимро дастгирӣ карданд, миннатдорем.",
      en: "We are committed to continuing our mission to empower and protect vulnerable women, building on these successes to create a safer and more equitable society. Thank you to everyone who supported this vital initiative.",
    },
  },
  {
    slug: "vahdat-protection",
    title: {
      ru: "Защита и расширение возможностей женщин в группе риска в городе Вахдат",
      tj: "Ҳифзи ҳуқуқҳо ва тавонмандсозии заноне, ки дар хатаранд, дар шаҳри Ваҳдат",
      en: "Protecting and Empowering Women at Risk in Vahdat City",
    },
    shortTitle: {
      ru: "Вахдат: защита женщин в группе риска",
      tj: "Ваҳдат: ҳифзи занони осебпазир",
      en: "Vahdat: Women at Risk Protection",
    },
    summary: {
      ru: "Четырёхлетняя инициатива (2021–2025) по борьбе с гендерным насилием и торговлей женщинами через кризисный центр, экономическое расширение возможностей и работу с сообществом.",
      tj: "Ташаббуси чорсола (2021–2025) барои мубориза бо зӯроварии гендерӣ ва савдои занон тавассути маркази бӯҳронӣ, тавонмандсозии иқтисодӣ ва кор бо ҷамъият.",
      en: "A four-year initiative (2021–2025) addressing gender-based violence and women trafficking through a crisis center, economic empowerment, and community outreach.",
    },
    coverImage: "/images/hero-5.jpg",
    donor: {
      ru: "Посольство Нидерландов в Центральной Азии (с резиденцией в Казахстане)",
      tj: "Сафорати Ҳоланд дар Осиёи Марказӣ (бо резиденсияи Қазоқистон)",
      en: "Embassy of the Netherlands in Central Asia to Kazakhstan",
    },
    period: {
      ru: "2021–2025",
      tj: "2021–2025",
      en: "2021–2025",
    },
    location: {
      ru: "г. Вахдат, Таджикистан",
      tj: "шаҳри Ваҳдат, Тоҷикистон",
      en: "Vahdat City, Tajikistan",
    },
    status: {
      ru: "Действующий",
      tj: "Ҷорӣ",
      en: "Ongoing",
    },
    intro: {
      ru: "Проект «Защита и расширение возможностей женщин в группе риска в городе Вахдат» реализуется общественной организацией «Караван надежды» при щедрой поддержке Посольства Нидерландов в Центральной Азии. Эта четырёхлетняя инициатива (2021–2025) посвящена решению острых проблем гендерного насилия и торговли женщинами через три взаимосвязанных, преобразующих жизни компонента.",
      tj: "Лоиҳаи «Ҳифзи ҳуқуқҳо ва тавонмандсозии заноне, ки дар хатаранд, дар шаҳри Ваҳдат» аз ҷониби Ташкилоти ҷамъиятии «Корвони Умед» бо дастгирии Сафорати Ҳоланд дар Осиёи Марказӣ амалӣ мегардад. Ин ташаббуси чорсола (2021–2025) ба ҳалли масъалаҳои муҳими зӯроварии гендерӣ ва савдои занон тавассути се ҷузъи ба ҳам пайванди ҳаётдигаркунанда бахшида шудааст.",
      en: "The \"Protecting and Empowering Women at Risk in Vahdat City\" project is led by the Public Organization \"Caravan of Hope\" with the generous support of the Embassy of the Netherlands in Central Asia. This four-year initiative (2021–2025) is dedicated to addressing the pressing issues of gender-based violence and women trafficking through three comprehensive and life-changing components.",
    },
    sections: [
      {
        id: "crisis-center",
        title: {
          ru: "1. Женский кризисный центр в городе Вахдат",
          tj: "1. Маркази бӯҳронии занон дар шаҳри Ваҳдат",
          en: "1. Operating a Women's Crisis Center in Vahdat City",
        },
        bullets: [
          {
            icon: "🏠",
            title: {
              ru: "Безопасное убежище",
              tj: "Паноҳгоҳи бехатар",
              en: "A Safe Haven",
            },
            text: {
              ru: "Наш женский кризисный центр — больше, чем просто приют. Это святилище, где женщины находят безопасность, поддержку и надежду. Мы предоставляем профессиональную помощь, реабилитационные услуги, консультирование, медицинский уход и юридическую помощь, чтобы каждая женщина получила всесторонний уход.",
              tj: "Маркази бӯҳронии мо аз як паноҳгоҳи оддӣ беш аст — он ҷойгоҳест, ки занон бехатарӣ, дастгирӣ ва умедро меёбанд. Мо кумаки касбӣ, хидматҳои бозсозӣ, машваратҳо, хидматҳои тиббӣ ва кумаки ҳуқуқиро пешкаш мекунем, то ҳар як зан эҳтиёҷоти пурраи худро қонеъ кунад.",
              en: "Our women's crisis center in Vahdat City is more than just a shelter; it's a sanctuary where women find safety, support, and hope. We provide professional aid, rehabilitation services, counseling, medical care, and legal assistance, ensuring that every woman receives the comprehensive care she needs.",
            },
          },
          {
            icon: "🤝",
            title: {
              ru: "Индивидуальный подход",
              tj: "Кумаки инфиродӣ",
              en: "Personalized Care",
            },
            text: {
              ru: "Наши социальные работники проводят тщательную оценку, чтобы понять уникальные потребности каждой женщины и ребёнка. Мы предлагаем качественное консультирование в безопасной среде и разрабатываем индивидуальные трёхмесячные планы, ведущие от кризиса к стабильности. Юридические консультации и постоянная поддержка — неотъемлемая часть нашего подхода.",
              tj: "Корманди иҷтимоии мо арзёбии пурраро гузаронида, ниёзҳои ҳар як зан ва кӯдакро муайян мекунад. Мо машварати босифатро дар муҳити бехатар пешниҳод мекунем ва нақшаҳои инфиродии сесоҳаро таҳия менамоем, ки роҳро аз бӯҳрон ба устуворӣ раҳнамоӣ кунанд. Машварати ҳуқуқӣ ва дастгирии доимӣ ҷузъи муҳими раҳёфти мо мебошанд.",
              en: "Our dedicated social workers conduct thorough assessments to understand the unique needs of each woman and child. We offer high-quality counseling in a secure environment and develop individualized three-month plans to guide their journey from crisis to stability. Legal advice and continuous support are integral to our approach.",
            },
          },
        ],
      },
      {
        id: "livelihood",
        title: {
          ru: "2. Улучшение социально-экономических условий женщин в группе риска",
          tj: "2. Беҳтар кардани шароити иҷтимоию иқтисодии занони осебпазир",
          en: "2. Improving Socio-Economic Livelihood Conditions for Women at Risk",
        },
        bullets: [
          {
            icon: "📚",
            title: {
              ru: "Навыки для лучшего будущего",
              tj: "Малакаҳо барои ояндаи беҳтар",
              en: "Skills for a Better Future",
            },
            text: {
              ru: "Экономическое расширение возможностей — краеугольный камень нашего проекта. Мы предлагаем базовую профессиональную подготовку, адаптированную к биографии и текущей ситуации каждой женщины. Участницы могут выбрать трёхмесячный курс швейного или кулинарного дела, получая практические навыки для устойчивого дохода.",
              tj: "Тавонмандсозии иқтисодӣ яке аз сутунҳои асосии лоиҳаи мост. Мо омӯзиши касбии ибтидоиро мутобиқ ба таърихча ва ҳолати ҳозираи ҳар як зан пешниҳод мекунем. Иштирокчиён метавонанд курси сесолаи дӯзандагӣ ё ошпазиро интихоб кунанд ва малакаҳои амалии даромадовариро ба даст оранд.",
              en: "Economic empowerment is a cornerstone of our project. We offer basic job skill training tailored to each woman's background and current situation. Eligible women can choose between a three-month course in sewing or cooking, equipping them with practical skills to secure a sustainable livelihood.",
            },
          },
          {
            icon: "💡",
            title: {
              ru: "Комплексное обучение",
              tj: "Омӯзиши ҳамаҷониба",
              en: "Comprehensive Training",
            },
            text: {
              ru: "Помимо технических навыков, наши программы охватывают налогообложение, бухгалтерию, планирование бюджета и управление финансами. Курсы дают женщинам знания для управления своими финансами, понимания рыночного спроса и построения успешного бизнеса.",
              tj: "Ба ғайр аз малакаҳои техникӣ, барномаҳои мо мавзӯъҳои муҳим — андозсупорӣ, ҳисобдорӣ, буҷетбандӣ ва идоракунии молиявиро дар бар мегиранд. Ин курсҳо заноно дониши идоракунии молия, дарки талаботи бозор ва сохтани тиҷорати муваффақро фароҳам меоваранд.",
              en: "Beyond technical skills, our training programs cover essential topics such as taxes, accounting, budgeting, and financial management. These courses are designed to empower women with the knowledge to manage their finances, understand market demands, and build successful businesses.",
            },
          },
        ],
      },
      {
        id: "capacity-building",
        title: {
          ru: "3. Наращивание потенциала и повышение осведомлённости",
          tj: "3. Рушди иқтидор ва баланд бардоштани огоҳӣ",
          en: "3. Capacity Building and Awareness Raising",
        },
        bullets: [
          {
            icon: "🚀",
            title: {
              ru: "Построение более сильного сообщества",
              tj: "Бунёди ҷомеаи қавитар",
              en: "Building a Stronger Community",
            },
            text: {
              ru: "Проект делает акцент на наращивании потенциала и повышении осведомлённости для создания устойчивых изменений. Мы оказываем экстренную эмоциональную помощь жертвам психологической и физической травмы и тесно работаем с местными органами власти и полицией для защиты женщин в группе риска.",
              tj: "Лоиҳа ба рушди иқтидор ва баланд бардоштани огоҳӣ барои эҷоди тағйироти пойдор таваҷҷӯҳ дорад. Мо ба ҷабрдидагони осеби равонӣ ва ҷисмонӣ кумаки зудамали эҳсосӣ мерасонем ва бо мақомоти маҳаллӣ ва милиса наздик ҳамкорӣ карда, занони осебпазирро ҳимоя мекунем.",
              en: "Our project emphasizes capacity building and awareness-raising to create lasting change. We provide urgent emotional assistance to victims of psychological and physical trauma, working closely with local authorities and the police to protect and advocate for women at risk.",
            },
          },
          {
            icon: "📢",
            title: {
              ru: "Знание — это сила",
              tj: "Дониш — қудрат аст",
              en: "Knowledge is Power",
            },
            text: {
              ru: "На наших тренингах мы рассказываем участницам об их правах, стратегиях предотвращения насилия и доступных организациях помощи. Эти знания дают женщинам возможность отстаивать себя и обращаться за помощью, когда это необходимо, формируя сообщество информированных и стойких людей.",
              tj: "Дар ҷаласаҳои омӯзишии мо иштирокчиён дар бораи ҳуқуқҳои худ, стратегияҳои пешгирии зӯроварӣ ва ташкилотҳои дастрасии кумак маълумот мегиранд. Ин дониш занонро ваколат медиҳад, ки аз ҳуқуқҳои худ ҳимоят кунанд ва дар вақти зарурӣ кумак ҷӯянд, ва ҷомеае аз шахсони огоҳ ва устуворро бунёд мекунад.",
              en: "Through our training sessions, we inform participants about their rights, violence prevention strategies, and available support organizations. This knowledge empowers women to stand up for themselves and seek help when needed, fostering a community of informed and resilient individuals.",
            },
          },
        ],
      },
    ],
    closing: {
      ru: "Этот проект — свидетельство нашей непоколебимой приверженности созданию более безопасного и справедливого общества для женщин. Вместе с нашими партнёрами и сторонниками мы стремимся к миру, где каждая женщина сможет жить без насилия и эксплуатации, с возможностью строить лучшее будущее для себя и своего сообщества. Присоединяйтесь к этому пути преобразований — станьте частью перемен!",
      tj: "Ин лоиҳа гувоҳи садоқати пойдори мо ба эҷоди ҷомеаи бехатар ва одилона барои занон аст. Дар якҷоягӣ бо шарикон ва дастгиркунандагони худ, мо барои ҷаҳоне талош мекунем, ки дар он ҳар як зан бидуни зӯроварӣ ва истисмор зиндагӣ кунад ва барои худу ҷомеаи худ ояндаи дурахшонтареро бунёд намояд. Ба ин сафари дигаргунӣ ҳамроҳ шавед — як қисми ин тағйирот шавед!",
      en: "This project is a testament to our unwavering commitment to creating a safer, more equitable society for women. Together with our partners and supporters, we strive for a world where every woman can live free from violence and exploitation, empowered to build a brighter future for herself and her community. Join us in this transformative journey and be a part of the change!",
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
