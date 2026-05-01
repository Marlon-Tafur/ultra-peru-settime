export interface Artist {
  id: number
  name: string
  image: string
  genre: string
  startTime: string
  endTime: string
  stage: string
  spotifyUrl?: string
  soundcloudUrl?: string
}

export interface Stage {
  id: number
  name: string
  logo: string
  color: string
}

export const STAGES: Stage[] = [
  { id: 1, name: 'MAIN STAGE',   logo: '/stages/main-stage.png',  color: '#00D4FF' },
  { id: 2, name: 'RESISTANCE',   logo: '/stages/resistance.png',  color: '#FF8C00' },
  { id: 3, name: 'RESISTANCE 2', logo: '/stages/resistance2.png', color: '#FF3366' },
  { id: 4, name: 'UMF RADIO',    logo: '/stages/umf-radio.png',   color: '#9B59B6' },
]

// Event date: 2026-05-02 (Lima UTC-5)
// Sets after midnight belong to 2026-05-03
export const ARTISTS: Artist[] = [
  // ── MAIN STAGE ──────────────────────────────────────────────────────────────
  {
    id: 12,
    name: 'AMMO AVENUE',
    image: '/artists/ammo-avenue.jpg',
    genre: 'Tech House',
    startTime: '2026-05-02T15:00:00-05:00',
    endTime:   '2026-05-02T16:20:00-05:00',
    stage: 'MAIN STAGE',
  },
  {
    id: 11,
    name: 'MUTER',
    image: '/artists/muter.jpg',
    genre: 'Tech House',
    startTime: '2026-05-02T16:20:00-05:00',
    endTime:   '2026-05-02T17:25:00-05:00',
    stage: 'MAIN STAGE',
  },
  {
    id: 10,
    name: 'ANUNNAKIS',
    image: '/artists/anunnakis.jpg',
    genre: 'Melodic Techno',
    startTime: '2026-05-02T17:25:00-05:00',
    endTime:   '2026-05-02T18:30:00-05:00',
    stage: 'MAIN STAGE',
  },
  {
    id: 9,
    name: 'MYKRIS',
    image: '/artists/mykris.jpg',
    genre: 'Big Room',
    startTime: '2026-05-02T18:30:00-05:00',
    endTime:   '2026-05-02T19:35:00-05:00',
    stage: 'MAIN STAGE',
  },
  {
    id: 8,
    name: 'JEFFREY SUTORIUS',
    image: '/artists/jeffrey-sutorius.jpg',
    genre: 'Trance',
    startTime: '2026-05-02T19:35:00-05:00',
    endTime:   '2026-05-02T20:40:00-05:00',
    stage: 'MAIN STAGE',
  },
  {
    id: 7,
    name: 'LEVEL UP',
    image: '/artists/level-up.jpg',
    genre: 'Dubstep',
    startTime: '2026-05-02T20:40:00-05:00',
    endTime:   '2026-05-02T21:45:00-05:00',
    stage: 'MAIN STAGE',
  },
  {
    id: 6,
    name: 'SUB ZERO PROJECT',
    image: '/artists/sub-zero-project.jpg',
    genre: 'Hardstyle',
    startTime: '2026-05-02T21:45:00-05:00',
    endTime:   '2026-05-02T22:50:00-05:00',
    stage: 'MAIN STAGE',
  },
  {
    id: 5,
    name: 'SUBTRONICS',
    image: '/artists/subtronics.jpg',
    genre: 'Dubstep',
    startTime: '2026-05-02T22:50:00-05:00',
    endTime:   '2026-05-03T00:10:00-05:00',
    stage: 'MAIN STAGE',
  },
  {
    id: 4,
    name: 'GRYFFIN',
    image: '/artists/gryffin.jpg',
    genre: 'EDM',
    startTime: '2026-05-03T00:10:00-05:00',
    endTime:   '2026-05-03T01:30:00-05:00',
    stage: 'MAIN STAGE',
  },
  {
    id: 3,
    name: 'STEVE ANGELLO',
    image: '/artists/steve-angello.jpg',
    genre: 'Progressive House',
    startTime: '2026-05-03T01:30:00-05:00',
    endTime:   '2026-05-03T03:00:00-05:00',
    stage: 'MAIN STAGE',
  },

  // ── RESISTANCE ──────────────────────────────────────────────────────────────
  {
    id: 20,
    name: 'M.E.R.',
    image: '/artists/mer.jpg',
    genre: 'Progressive',
    startTime: '2026-05-02T15:00:00-05:00',
    endTime:   '2026-05-02T16:00:00-05:00',
    stage: 'RESISTANCE',
  },
  {
    id: 19,
    name: 'ARTATTACK',
    image: '/artists/artattack.jpg',
    genre: 'Melodic',
    startTime: '2026-05-02T16:00:00-05:00',
    endTime:   '2026-05-02T17:30:00-05:00',
    stage: 'RESISTANCE',
  },
  {
    id: 18,
    name: 'CARLOS CHAPARRO',
    image: '/artists/carlos-chaparro.jpg',
    genre: 'Tech House',
    startTime: '2026-05-02T17:30:00-05:00',
    endTime:   '2026-05-02T19:00:00-05:00',
    stage: 'RESISTANCE',
  },
  {
    id: 17,
    name: 'EMILIANO DEMARCO',
    image: '/artists/emiliano-demarco.jpg',
    genre: 'Melodic Techno',
    startTime: '2026-05-02T19:00:00-05:00',
    endTime:   '2026-05-02T20:30:00-05:00',
    stage: 'RESISTANCE',
  },
  {
    id: 16,
    name: 'ERIC PRYDZ',
    image: '/artists/eric-prydz.jpg',
    genre: 'Techno',
    startTime: '2026-05-02T20:30:00-05:00',
    endTime:   '2026-05-02T22:00:00-05:00',
    stage: 'RESISTANCE',
  },
  {
    id: 15,
    name: 'RIVO',
    image: '/artists/rivo.jpg',
    genre: 'Afro House',
    startTime: '2026-05-02T22:00:00-05:00',
    endTime:   '2026-05-02T23:30:00-05:00',
    stage: 'RESISTANCE',
  },
  {
    id: 14,
    name: 'COLYN',
    image: '/artists/colyn.jpg',
    genre: 'Melodic Techno',
    startTime: '2026-05-02T23:30:00-05:00',
    endTime:   '2026-05-03T01:00:00-05:00',
    stage: 'RESISTANCE',
  },
  {
    id: 13,
    name: 'ADRIATIQUE',
    image: '/artists/adriatique.jpg',
    genre: 'Melodic Techno',
    startTime: '2026-05-03T01:00:00-05:00',
    endTime:   '2026-05-03T03:00:00-05:00',
    stage: 'RESISTANCE',
  },

  // ── RESISTANCE 2 ────────────────────────────────────────────────────────────
  {
    id: 28,
    name: 'KLËYP25',
    image: '/artists/kleyp25.jpg',
    genre: 'Techno',
    startTime: '2026-05-02T15:00:00-05:00',
    endTime:   '2026-05-02T16:00:00-05:00',
    stage: 'RESISTANCE 2',
  },
  {
    id: 27,
    name: 'CURSE DC B2B THE PHOBIAN PROJECT',
    image: '/artists/curse-dc-b2b-phobian.jpg',
    genre: 'Techno',
    startTime: '2026-05-02T16:00:00-05:00',
    endTime:   '2026-05-02T17:00:00-05:00',
    stage: 'RESISTANCE 2',
  },
  {
    id: 26,
    name: 'ROMINA MAZZINI',
    image: '/artists/romina-mazzini.png',
    genre: 'Techno',
    startTime: '2026-05-02T17:00:00-05:00',
    endTime:   '2026-05-02T18:30:00-05:00',
    stage: 'RESISTANCE 2',
  },
  {
    id: 25,
    name: 'ANHEDONIA',
    image: '/artists/anhedonia.jpg',
    genre: 'Hard Techno',
    startTime: '2026-05-02T18:30:00-05:00',
    endTime:   '2026-05-02T20:00:00-05:00',
    stage: 'RESISTANCE 2',
  },
  {
    id: 24,
    name: 'ØTTA',
    image: '/artists/otta.jpg',
    genre: 'Hard Techno',
    startTime: '2026-05-02T20:00:00-05:00',
    endTime:   '2026-05-02T21:30:00-05:00',
    stage: 'RESISTANCE 2',
  },
  {
    id: 23,
    name: 'NOVAH',
    image: '/artists/novah.jpg',
    genre: 'Hard Techno',
    startTime: '2026-05-02T21:30:00-05:00',
    endTime:   '2026-05-02T23:30:00-05:00',
    stage: 'RESISTANCE 2',
  },
  {
    id: 22,
    name: 'NICO MORENO',
    image: '/artists/nico-moreno.jpg',
    genre: 'Hard Techno',
    startTime: '2026-05-02T23:30:00-05:00',
    endTime:   '2026-05-03T01:30:00-05:00',
    stage: 'RESISTANCE 2',
  },
  {
    id: 21,
    name: 'REINIER ZONNEVELD',
    image: '/artists/reinier-zonneveld.jpg',
    genre: 'Hard Techno',
    startTime: '2026-05-03T01:30:00-05:00',
    endTime:   '2026-05-03T03:00:00-05:00',
    stage: 'RESISTANCE 2',
  },

  // ── UMF RADIO ───────────────────────────────────────────────────────────────
  {
    id: 35,
    name: 'MIKELA',
    image: '/artists/mikela.png',
    genre: '—',
    startTime: '2026-05-02T15:00:00-05:00',
    endTime:   '2026-05-02T16:00:00-05:00',
    stage: 'UMF RADIO',
  },
  {
    id: 34,
    name: 'DAMARAY',
    image: '/artists/damaray.jpg',
    genre: 'House',
    startTime: '2026-05-02T16:00:00-05:00',
    endTime:   '2026-05-02T17:00:00-05:00',
    stage: 'UMF RADIO',
  },
  {
    id: 33,
    name: 'INSOMNIA B2B DIEGO BARRERA',
    image: '/artists/insomnia-b2b-diego-barrera.jpg',
    genre: '—',
    startTime: '2026-05-02T17:00:00-05:00',
    endTime:   '2026-05-02T18:30:00-05:00',
    stage: 'UMF RADIO',
  },
  {
    id: 32,
    name: 'JUNGLE JACK',
    image: '/artists/jungle-jack.jpg',
    genre: 'Tech House',
    startTime: '2026-05-02T18:30:00-05:00',
    endTime:   '2026-05-02T20:00:00-05:00',
    stage: 'UMF RADIO',
  },
  {
    id: 31,
    name: 'GAMEROLOCO',
    image: '/artists/gameroloco.jpg',
    genre: 'Tech House',
    startTime: '2026-05-02T20:00:00-05:00',
    endTime:   '2026-05-02T21:30:00-05:00',
    stage: 'UMF RADIO',
  },
  {
    id: 30,
    name: 'ARBAIZA',
    image: '/artists/arbaiza.png',
    genre: 'Afro House',
    startTime: '2026-05-02T21:30:00-05:00',
    endTime:   '2026-05-02T23:30:00-05:00',
    stage: 'UMF RADIO',
  },
  {
    id: 29,
    name: 'BI-SIGNAL',
    image: '/artists/bi-signal.jpg',
    genre: 'Tech House',
    startTime: '2026-05-02T23:30:00-05:00',
    endTime:   '2026-05-03T01:00:00-05:00',
    stage: 'UMF RADIO',
  },
]

export const EVENT_START = new Date('2026-05-02T15:00:00-05:00')
export const EVENT_END   = new Date('2026-05-03T03:00:00-05:00')
export const TOTAL_MINUTES = 720 // 12 horas

export function getArtistsByStage(stageName: string): Artist[] {
  return ARTISTS.filter((a) => a.stage === stageName).sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  )
}

export function getStageColor(stageName: string): string {
  return STAGES.find((s) => s.name === stageName)?.color ?? '#00D4FF'
}
