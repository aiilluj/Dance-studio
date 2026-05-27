/**
 * directions.js — статические данные о направлениях танцев студии.
 * Подключается до классов, так как AppController использует эти данные при инициализации.
 */
const DIRECTIONS_DATA_RAW = [
    {
        id:          1,
        name:        "Contemporary",
        category:    "adults",
        label:       "Для взрослых",
        description: "Свобода движения и выразительность тела. Современная хореография без ограничений стиля.",
        price:       "1 500 ₽",
        image:       "images/directions/contemporary.jpg",
    },
    {
        id:          2,
        name:        "Hip-Hop",
        category:    "adults",
        label:       "Для взрослых",
        description: "Энергичный уличный стиль с мощной ритмикой, грувом и фристайл-импровизацией.",
        price:       "1 300 ₽",
        image:       "images/directions/hiphop.jpg",
    },
    {
        id:          3,
        name:        "Jazz-Funk",
        category:    "adults",
        label:       "Для взрослых",
        description: "Коктейль из джаза и фанка — яркость, харизма и неотразимый сценический магнетизм.",
        price:       "1 400 ₽",
        image:       "images/directions/jazzfunk.jpg",
    },
    {
        id:          4,
        name:        "Zumba",
        category:    "adults",
        label:       "Для взрослых",
        description: "Латиноамериканские ритмы в формате фитнес-вечеринки. Танцуй — худей — радуйся.",
        price:       "1 200 ₽",
        image:       "images/directions/zumba.jpg",
    },
    {
        id:          5,
        name:        "Dancehall",
        category:    "adults",
        label:       "Для взрослых",
        description: "Жаркая энергетика карибских улиц. Раскованность, ритм и своя неповторимая история.",
        price:       "1 400 ₽",
        image:       "images/directions/dancehall.jpg",
    },
    {
        id:          6,
        name:        "Латина",
        category:    "children",
        label:       "Для детей",
        description: "Сальса, бачата, ча-ча-ча — огонь латинских ритмов для детей 7–14 лет.",
        price:       "1 100 ₽",
        image:       "images/directions/latina.jpg",
    },
];