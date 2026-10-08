import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Trophy,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Users,
  Gamepad2,
  Clock,
  Zap,
  Dices,
  Plus
} from 'lucide-react';

export type ArcadeDifficulty = 'easy' | 'medium' | 'hard';

export interface TableArcadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableLabel?: string;
  restaurantName?: string;
}

// ─────────────────────────────────────────────────────────────
// 1. SOLITAIRE (CLASSIC KLONDIKE) TYPES & ENGINE
// ─────────────────────────────────────────────────────────────
type Suit = '♠' | '♥' | '♦' | '♣';
type Color = 'red' | 'black';

interface Card {
  id: string;
  suit: Suit;
  rank: number; // 1 (Ace) to 13 (King)
  color: Color;
  faceUp: boolean;
}

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];

function getRankLabel(rank: number): string {
  if (rank === 1) return 'A';
  if (rank === 11) return 'J';
  if (rank === 12) return 'Q';
  if (rank === 13) return 'K';
  return String(rank);
}

function createShuffledDeck(): Card[] {
  const deck: Card[] = [];
  let id = 1;
  for (const suit of SUITS) {
    const color: Color = suit === '♥' || suit === '♦' ? 'red' : 'black';
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({
        id: `card-${id++}`,
        suit,
        rank,
        color,
        faceUp: false,
      });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

interface SolitaireState {
  stock: Card[];
  waste: Card[];
  foundations: Card[][];
  tableau: Card[][];
  moves: number;
  score: number;
  won: boolean;
}

function initSolitaire(): SolitaireState {
  const deck = createShuffledDeck();
  const tableau: Card[][] = [[], [], [], [], [], [], []];

  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = deck.pop()!;
      if (row === col) {
        card.faceUp = true;
      }
      tableau[col].push(card);
    }
  }

  return {
    stock: deck,
    waste: [],
    foundations: [[], [], [], []],
    tableau,
    moves: 0,
    score: 0,
    won: false,
  };
}

// ─────────────────────────────────────────────────────────────
// 2. GENERIC CROSSWORD PUZZLES (KIDS TO ADULTS)
// ─────────────────────────────────────────────────────────────
interface CrosswordClue {
  num: number;
  dir: 'across' | 'down';
  clue: string;
  answer: string;
  row: number;
  col: number;
}

interface CrosswordPuzzle {
  id: string;
  title: string;
  theme: string;
  difficulty: ArcadeDifficulty;
  ageLabel: string;
  size: number;
  clues: CrosswordClue[];
}

const CROSSWORD_PUZZLES_BY_DIFFICULTY: Record<ArcadeDifficulty, CrosswordPuzzle[]> = {
  // 🟢 EASY: Kids & Junior (Ages 6-12) - 5x5 Grid
  easy: [
    {
      id: 'kids-animals-easy',
      title: 'Kids Fun & Animals',
      theme: 'Everyday Words & Friendly Animals',
      difficulty: 'easy',
      ageLabel: 'Kids (Ages 6-12)',
      size: 5,
      clues: [
        { num: 1, dir: 'across', clue: 'Furry friendly pet that purrs and catches mice', answer: 'CAT', row: 0, col: 0 },
        { num: 2, dir: 'across', clue: 'Water drops that fall from grey rainy clouds', answer: 'RAIN', row: 2, col: 0 },
        { num: 3, dir: 'across', clue: 'Glowing night object that twinkles in the dark sky', answer: 'STAR', row: 4, col: 0 },
        { num: 1, dir: 'down', clue: 'Four-wheeled vehicle driven on roads', answer: 'CAR', row: 0, col: 0 },
        { num: 4, dir: 'down', clue: 'A happy dog wags this back and forth', answer: 'TAIL', row: 0, col: 2 },
        { num: 5, dir: 'down', clue: 'Tiny hardworking insect living in an ant hill', answer: 'ANT', row: 2, col: 1 },
      ],
    },
  ],

  // 🟡 MEDIUM: Teens & Family (Ages 12-18) - 7x7 Grid
  medium: [
    {
      id: 'family-general-medium',
      title: 'General Knowledge & Nature',
      theme: 'Everyday Science, World & Living Wonders',
      difficulty: 'medium',
      ageLabel: 'Teens & Family (Ages 12-18)',
      size: 7,
      clues: [
        { num: 1, dir: 'across', clue: 'Related to the Sun or clean renewable power', answer: 'SOLAR', row: 0, col: 0 },
        { num: 1, dir: 'down', clue: 'A glowing fiery flash that can ignite a flame', answer: 'SPARK', row: 0, col: 0 },
        { num: 2, dir: 'down', clue: 'To legally possess something as your own property', answer: 'OWN', row: 0, col: 1 },
        { num: 3, dir: 'down', clue: 'A secret operative or authorized representative', answer: 'AGENT', row: 0, col: 3 },
        { num: 4, dir: 'across', clue: 'A heavenly winged protector depicted in art', answer: 'ANGEL', row: 2, col: 0 },
        { num: 5, dir: 'down', clue: 'Sour yellow citrus fruit famous in cool lemonade', answer: 'LEMON', row: 2, col: 4 },
        { num: 6, dir: 'across', clue: 'Fastening formed by looping and tying rope', answer: 'KNOT', row: 4, col: 0 },
        { num: 7, dir: 'down', clue: 'The first positive counting number', answer: 'ONE', row: 4, col: 2 },
        { num: 8, dir: 'across', clue: 'Vast body of salt water covering most of Earth', answer: 'OCEAN', row: 6, col: 0 },
      ],
    },
  ],

  // 🔴 HARD: Adults & Word Masters (Ages 18+) - 8x8 Grid
  hard: [
    {
      id: 'adults-master-hard',
      title: 'Classic World & Vocabulary',
      theme: 'Challenging Language, Literature & Science',
      difficulty: 'hard',
      ageLabel: 'Adults (Ages 18+)',
      size: 8,
      clues: [
        { num: 1, dir: 'across', clue: 'The distant line where earth seems to meet the sky', answer: 'HORIZON', row: 0, col: 0 },
        { num: 1, dir: 'down', clue: 'The celestial realm above or ultimate paradise', answer: 'HEAVEN', row: 0, col: 0 },
        { num: 2, dir: 'down', clue: 'System detecting aircraft or ships via radio pulses', answer: 'RADAR', row: 0, col: 2 },
        { num: 3, dir: 'down', clue: 'Curved astronomical path of a planet around a star', answer: 'ORBIT', row: 0, col: 5 },
        { num: 4, dir: 'across', clue: 'Official methodical examination of books or accounts', answer: 'AUDIT', row: 2, col: 0 },
        { num: 5, dir: 'down', clue: 'Procedure intended to establish quality or performance', answer: 'TEST', row: 2, col: 4 },
        { num: 6, dir: 'across', clue: 'A period of relaxation, tranquility or sleep', answer: 'REST', row: 4, col: 2 },
        { num: 7, dir: 'across', clue: 'A mysterious person, thing or riddle hard to understand', answer: 'ENIGMA', row: 6, col: 0 },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// 3. TABLE TRIVIA QUESTIONS BY DIFFICULTY (KIDS TO ADULTS)
// ─────────────────────────────────────────────────────────────
interface TriviaQuestion {
  question: string;
  options: string[];
  correct: number;
  fact: string;
}

const TABLE_TRIVIA_BY_DIFFICULTY: Record<ArcadeDifficulty, TriviaQuestion[]> = {
  // 🟢 EASY (Kids 6-12)
  easy: [
    {
      question: 'Which magnificent animal is popularly known as the "King of the Jungle"?',
      options: ['Lion', 'Elephant', 'Tiger', 'Gorilla'],
      correct: 0,
      fact: 'Lions live in family groups called prides and their loud roar can be heard 8 kilometers away!'
    },
    {
      question: 'How many bright colors are there in a standard rainbow?',
      options: ['5 Colors', '6 Colors', '7 Colors', '8 Colors'],
      correct: 2,
      fact: 'The colors in order are Red, Orange, Yellow, Green, Blue, Indigo, and Violet (ROYGBIV)!'
    },
    {
      question: 'Which helpful flying insect makes sweet golden honey?',
      options: ['Butterfly', 'Honeybee', 'Ladybug', 'Dragonfly'],
      correct: 1,
      fact: 'Honeybees visit thousands of flowers to gather nectar and communicate by doing a waggle dance!'
    },
    {
      question: 'Which famous comic superhero wears a red cape and is known as the "Man of Steel"?',
      options: ['Batman', 'Superman', 'Spider-Man', 'Iron Man'],
      correct: 1,
      fact: 'Superman was born on the planet Krypton and was named Kal-El by his parents!'
    },
    {
      question: 'What is the fastest animal on land, capable of sprinting up to 100 km/h?',
      options: ['Kangaroo', 'Cheetah', 'Horse', 'Greyhound'],
      correct: 1,
      fact: 'Cheetahs can accelerate faster than a sports car, reaching top speed in just 3 seconds!'
    },
    {
      question: 'What is the third planet from the Sun and the only home to humans?',
      options: ['Mars', 'Venus', 'Earth', 'Jupiter'],
      correct: 2,
      fact: 'Over 70% of Earth is covered in oceans, which is why it looks like a blue marble from space.'
    },
    {
      question: 'What does a little caterpillar transform into after resting inside a chrysalis?',
      options: ['Beetle', 'Moth', 'Butterfly', 'Grasshopper'],
      correct: 2,
      fact: 'This magical transformation is called metamorphosis!'
    },
    {
      question: 'Which fairy tale character has a wooden nose that grows whenever he tells a lie?',
      options: ['Pinocchio', 'Peter Pan', 'Aladdin', 'Robin Hood'],
      correct: 0,
      fact: 'Pinocchio was carved from wood by the gentle carpenter Geppetto in the classic Italian tale.'
    }
  ],

  // 🟡 MEDIUM (Teens & Family 12-18)
  medium: [
    {
      question: 'What is the capital city of Australia?',
      options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
      correct: 2,
      fact: 'Canberra was purpose-built as a compromise capital between rivals Sydney and Melbourne in 1913!'
    },
    {
      question: 'Which gas do living green plants absorb from the air to perform photosynthesis?',
      options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Helium'],
      correct: 1,
      fact: 'Plants absorb carbon dioxide and release fresh oxygen that humans and animals breathe!'
    },
    {
      question: 'How many players are on the field for one team in a standard regulation soccer match?',
      options: ['9 Players', '10 Players', '11 Players', '12 Players'],
      correct: 2,
      fact: 'Each side plays with 10 outfield players and 1 goalkeeper on the pitch.'
    },
    {
      question: 'Which British author wrote the bestselling fantasy series about Harry Potter?',
      options: ['J.R.R. Tolkien', 'J.K. Rowling', 'C.S. Lewis', 'Roald Dahl'],
      correct: 1,
      fact: 'The seven Harry Potter books have sold over 600 million copies and been translated into 85 languages!'
    },
    {
      question: 'Which planet orbits closest to the Sun in our Solar System?',
      options: ['Venus', 'Mercury', 'Mars', 'Earth'],
      correct: 1,
      fact: 'Mercury takes just 88 Earth days to orbit the Sun, though its surface can reach over 430°C!'
    },
    {
      question: 'Which European country gifted the iconic Statue of Liberty to the United States?',
      options: ['United Kingdom', 'France', 'Spain', 'Italy'],
      correct: 1,
      fact: 'Designed by sculptor Frédéric-Auguste Bartholdi, France gifted the monument in 1886.'
    },
    {
      question: 'What is the primary official language spoken in Brazil?',
      options: ['Spanish', 'Portuguese', 'French', 'English'],
      correct: 1,
      fact: 'Brazil is the only Portuguese-speaking nation in the Americas, colonized by Portugal in 1500.'
    },
    {
      question: 'Which muscular organ in the human body pumps blood through the circulatory system?',
      options: ['Lungs', 'Liver', 'Heart', 'Kidneys'],
      correct: 2,
      fact: 'An adult human heart beats around 100,000 times every day, pumping 7,500 liters of blood!'
    }
  ],

  // 🔴 HARD (Adults 18+)
  hard: [
    {
      question: 'What is the chemical symbol for the precious transition metal Gold on the Periodic Table?',
      options: ['Ag', 'Au', 'Fe', 'Pt'],
      correct: 1,
      fact: 'The symbol "Au" originates from the Latin word "Aurum", which means "shining dawn"!'
    },
    {
      question: 'In which year did the British passenger liner RMS Titanic sink in the North Atlantic?',
      options: ['1908', '1912', '1916', '1920'],
      correct: 1,
      fact: 'The Titanic struck an iceberg on the night of April 14 and sank in the early hours of April 15, 1912.'
    },
    {
      question: 'Which river is internationally recognized as the longest river in the world?',
      options: ['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River'],
      correct: 1,
      fact: 'Flowing north for approximately 6,650 km, the Nile traverses 11 African nations.'
    },
    {
      question: 'What is the hardest naturally occurring substance known to science on the Mohs scale?',
      options: ['Titanium', 'Quartz', 'Diamond', 'Tungsten'],
      correct: 2,
      fact: 'Diamond achieves the maximum score of 10 on the Mohs scale, formed under extreme mantle pressure.'
    },
    {
      question: 'Who wrote the first computer algorithm in history for Babbage’s Analytical Engine?',
      options: ['Alan Turing', 'Ada Lovelace', 'Grace Hopper', 'Charles Babbage'],
      correct: 1,
      fact: 'Ada Lovelace published the first machine algorithm in 1843, foreseeing computer music and graphics!'
    },
    {
      question: 'What is the official currency denomination of Japan?',
      options: ['Won', 'Yuan', 'Yen', 'Baht'],
      correct: 2,
      fact: 'The Japanese Yen was officially adopted during the Meiji government’s New Currency Act of 1871.'
    },
    {
      question: 'How many total bones make up the skeletal system of a healthy adult human?',
      options: ['198', '206', '214', '222'],
      correct: 1,
      fact: 'Infants are born with roughly 270 bones, which gradually fuse together into 206 by adulthood.'
    },
    {
      question: 'Which theoretical physicist formulated the revolutionary General Theory of Relativity in 1915?',
      options: ['Isaac Newton', 'Niels Bohr', 'Albert Einstein', 'Max Planck'],
      correct: 2,
      fact: 'Einstein demonstrated that gravity is the geometric warping of spacetime caused by mass and energy.'
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 4. "WHO PAYS THE BILL?" ROULETTE OUTCOMES BY DIFFICULTY
// ─────────────────────────────────────────────────────────────
interface BillConsequence {
  text: string;
  color: string;
  icon: string;
  tag: string;
}

const BILL_CONSEQUENCES_BY_DIFFICULTY: Record<ArcadeDifficulty, BillConsequence[]> = {
  // 🟢 EASY (Kids & Family Mode - Fun Table Dares)
  easy: [
    { text: '🦁 Must roar like a lion for 5 full seconds!', color: '#F59E0B', icon: '🦁', tag: 'Silly Roar' },
    { text: '🎤 Must sing the chorus of a cartoon or Disney song!', color: '#3B82F6', icon: '🎤', tag: 'Star Performer' },
    { text: '🤸 Must do 5 silly jumping jacks beside the table!', color: '#10B981', icon: '🤸', tag: 'Table Fitness' },
    { text: '💖 Must give everyone at the table a sweet compliment!', color: '#EC4899', icon: '💖', tag: 'Kind Heart' },
    { text: '🎭 Must make the funniest face for a group photo!', color: '#8B5CF6', icon: '🎭', tag: 'Face of the Day' },
    { text: '🍦 Lucky Winner! Gets an extra scoop of dessert or fries!', color: '#10B981', icon: '🍦', tag: 'Pampered Star' },
  ],

  // 🟡 MEDIUM (Teens & Family - Social Fun & Casual Treats)
  medium: [
    { text: '📸 Must snap and post the official table group selfie!', color: '#8B5CF6', icon: '📸', tag: 'Official Photographer' },
    { text: '🥤 Treats the table to the next round of soft drinks or mocktails!', color: '#3B82F6', icon: '🥤', tag: 'Beverage Sponsor' },
    { text: '🕺 Must do a 10-second funny table dance in their seat!', color: '#EC4899', icon: '🕺', tag: 'Groove Master' },
    { text: '🗣️ Must speak in a fancy accent until the food arrives!', color: '#F59E0B', icon: '🗣️', tag: 'Voice Actor' },
    { text: '🍟 Must share half of their fries or appetizer with the table!', color: '#EF4444', icon: '🍟', tag: 'Generous Friend' },
    { text: '🛡️ 100% Free Pass (Immune from all table forfeits today)!', color: '#10B981', icon: '🛡️', tag: 'Immunity Shield' },
  ],

  // 🔴 HARD (Adults - Real Dining Bill & Bar Stakes)
  hard: [
    { text: '💳 Pays the ENTIRE dining bill for the table!', color: '#EF4444', icon: '💳', tag: 'Hero of the Table' },
    { text: '🍰 Sponsors all desserts and post-dinner coffees!', color: '#F59E0B', icon: '🍰', tag: 'Sweet Tooth Sponsor' },
    { text: '🍺 Covers the craft beers, wine, and bar beverage tab!', color: '#3B82F6', icon: '🍺', tag: 'Bar Host' },
    { text: '💵 Covers the 20% server gratuity & table service charge!', color: '#10B981', icon: '💵', tag: 'Tipping Champion' },
    { text: '🍽️ Must host/treat everyone to next weekend’s dinner outing!', color: '#8B5CF6', icon: '🍽️', tag: 'Future Host' },
    { text: '🛡️ VIP Free Pass (Sits back and gets treated 100% free)!', color: '#10B981', icon: '🛡️', tag: 'Pampered VIP' },
  ]
};

export const TableArcadeModal: React.FC<TableArcadeModalProps> = ({
  isOpen,
  onClose,
  tableLabel = 'Table 1',
  restaurantName = 'Menuz Diner'
}) => {
  const [activeTab, setActiveTab] = useState<'solitaire' | 'crossword' | 'trivia' | 'billRoulette'>('solitaire');
  const [difficulty, setDifficulty] = useState<ArcadeDifficulty>('medium');

  // ── 1. Solitaire State ──
  const [solitaire, setSolitaire] = useState<SolitaireState>(initSolitaire);
  const [solitaireTimer, setSolitaireTimer] = useState(0);
  const [solitaireRunning, setSolitaireRunning] = useState(false);
  const [solitaireDeckPasses, setSolitaireDeckPasses] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isOpen && activeTab === 'solitaire' && solitaireRunning && !solitaire.won) {
      interval = setInterval(() => setSolitaireTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, activeTab, solitaireRunning, solitaire.won]);

  const resetSolitaireGame = () => {
    setSolitaire(initSolitaire());
    setSolitaireTimer(0);
    setSolitaireRunning(true);
    setSolitaireDeckPasses(0);
  };

  // Draw card from stock to waste based on difficulty
  const handleStockClick = () => {
    if (!solitaireRunning) setSolitaireRunning(true);
    if (solitaire.stock.length > 0) {
      const drawCount = difficulty === 'easy' ? 1 : 3;
      const actualDraw = Math.min(drawCount, solitaire.stock.length);
      const drawnCards = solitaire.stock.slice(-actualDraw).reverse().map((c) => ({ ...c, faceUp: true }));

      setSolitaire((prev) => ({
        ...prev,
        stock: prev.stock.slice(0, -actualDraw),
        waste: [...prev.waste, ...drawnCards],
        moves: prev.moves + 1,
      }));
    } else if (solitaire.waste.length > 0) {
      if (difficulty === 'hard' && solitaireDeckPasses >= 3) {
        return; // Hard mode: strictly maximum 3 deck passes
      }
      setSolitaireDeckPasses((p) => p + 1);
      const recycled = [...solitaire.waste].reverse().map((c) => ({ ...c, faceUp: false }));
      setSolitaire((prev) => ({
        ...prev,
        stock: recycled,
        waste: [],
        moves: prev.moves + 1,
      }));
    }
  };

  // Auto move card from waste or tableau
  const handleCardTap = (source: 'waste' | 'tableau', colIdx?: number, cardIdx?: number) => {
    if (!solitaireRunning) setSolitaireRunning(true);

    let cardToMove: Card | null = null;
    if (source === 'waste' && solitaire.waste.length > 0) {
      cardToMove = solitaire.waste[solitaire.waste.length - 1];
    } else if (source === 'tableau' && colIdx !== undefined && cardIdx !== undefined) {
      const col = solitaire.tableau[colIdx];
      if (cardIdx === col.length - 1 && col[cardIdx].faceUp) {
        cardToMove = col[cardIdx];
      }
    }

    if (!cardToMove) return;

    // 1. Try Foundation First (Ace -> King)
    for (let f = 0; f < 4; f++) {
      const pile = solitaire.foundations[f];
      const canPut =
        (pile.length === 0 && cardToMove.rank === 1) ||
        (pile.length > 0 && pile[pile.length - 1].suit === cardToMove.suit && pile[pile.length - 1].rank + 1 === cardToMove.rank);

      if (canPut) {
        const newFoundations = solitaire.foundations.map((p, idx) =>
          idx === f ? [...p, cardToMove!] : [...p]
        );

        let newWaste = [...solitaire.waste];
        let newTableau = solitaire.tableau.map((c) => [...c]);

        if (source === 'waste') {
          newWaste.pop();
        } else if (source === 'tableau' && colIdx !== undefined) {
          newTableau[colIdx].pop();
          if (newTableau[colIdx].length > 0) {
            newTableau[colIdx][newTableau[colIdx].length - 1].faceUp = true;
          }
        }

        const totalWon = newFoundations.every((p) => p.length === 13);

        setSolitaire((prev) => ({
          ...prev,
          foundations: newFoundations,
          waste: newWaste,
          tableau: newTableau,
          moves: prev.moves + 1,
          score: prev.score + 15,
          won: totalWon,
        }));
        return;
      }
    }

    // 2. Try Tableau Columns (alternating colors, descending rank)
    for (let targetCol = 0; targetCol < 7; targetCol++) {
      if (source === 'tableau' && targetCol === colIdx) continue;
      const destCol = solitaire.tableau[targetCol];

      let canPutTableau = false;
      if (destCol.length === 0) {
        canPutTableau = cardToMove.rank === 13;
      } else {
        const topDest = destCol[destCol.length - 1];
        canPutTableau = topDest.faceUp && topDest.color !== cardToMove.color && topDest.rank === cardToMove.rank + 1;
      }

      if (canPutTableau) {
        let newWaste = [...solitaire.waste];
        let newTableau = solitaire.tableau.map((c) => [...c]);

        if (source === 'waste') {
          newWaste.pop();
          newTableau[targetCol].push(cardToMove);
        } else if (source === 'tableau' && colIdx !== undefined) {
          newTableau[colIdx].pop();
          if (newTableau[colIdx].length > 0) {
            newTableau[colIdx][newTableau[colIdx].length - 1].faceUp = true;
          }
          newTableau[targetCol].push(cardToMove);
        }

        setSolitaire((prev) => ({
          ...prev,
          waste: newWaste,
          tableau: newTableau,
          moves: prev.moves + 1,
          score: prev.score + 5,
        }));
        return;
      }
    }
  };

  // ── 2. Crossword State ──
  const activePuzzleList = CROSSWORD_PUZZLES_BY_DIFFICULTY[difficulty];
  const curPuzzle = activePuzzleList[0];
  const [gridAnswers, setGridAnswers] = useState<string[][]>(() =>
    Array(curPuzzle.size).fill(null).map(() => Array(curPuzzle.size).fill(''))
  );
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>({ r: 0, c: 0 });
  const [selectedDirection, setSelectedDirection] = useState<'across' | 'down'>('across');
  const [crosswordSuccess, setCrosswordSuccess] = useState(false);

  // Sync grid when difficulty changes
  useEffect(() => {
    setGridAnswers(Array(curPuzzle.size).fill(null).map(() => Array(curPuzzle.size).fill('')));
    setSelectedCell({ r: 0, c: 0 });
    setCrosswordSuccess(false);
  }, [difficulty, curPuzzle.size]);

  // Active clue
  const activeClue = useMemo(() => {
    if (!selectedCell) return null;
    return (
      curPuzzle.clues.find(
        (clue) =>
          clue.dir === selectedDirection &&
          selectedCell.r === clue.row &&
          selectedCell.c >= clue.col &&
          selectedCell.c < clue.col + clue.answer.length
      ) ||
      curPuzzle.clues.find(
        (clue) =>
          clue.dir === selectedDirection &&
          selectedCell.c === clue.col &&
          selectedCell.r >= clue.row &&
          selectedCell.r < clue.row + clue.answer.length
      ) ||
      curPuzzle.clues[0]
    );
  }, [curPuzzle, selectedCell, selectedDirection]);

  // Determine which cells belong to clues in the puzzle
  const validCells = useMemo(() => {
    const valid = new Set<string>();
    for (const clue of curPuzzle.clues) {
      for (let i = 0; i < clue.answer.length; i++) {
        const r = clue.dir === 'across' ? clue.row : clue.row + i;
        const c = clue.dir === 'across' ? clue.col + i : clue.col;
        valid.add(`${r}-${c}`);
      }
    }
    return valid;
  }, [curPuzzle]);

  const handleCellClick = (r: number, c: number) => {
    if (!validCells.has(`${r}-${c}`)) return;
    if (selectedCell && selectedCell.r === r && selectedCell.c === c) {
      setSelectedDirection((prev) => (prev === 'across' ? 'down' : 'across'));
    } else {
      setSelectedCell({ r, c });
    }
  };

  const handleKeyInput = (char: string) => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    const upper = char.toUpperCase();

    const newGrid = gridAnswers.map((row) => [...row]);
    newGrid[r][c] = upper;
    setGridAnswers(newGrid);

    if (selectedDirection === 'across' && c + 1 < curPuzzle.size && validCells.has(`${r}-${c + 1}`)) {
      setSelectedCell({ r, c: c + 1 });
    } else if (selectedDirection === 'down' && r + 1 < curPuzzle.size && validCells.has(`${r + 1}-${c}`)) {
      setSelectedCell({ r: r + 1, c });
    }

    checkPuzzleCompletion(newGrid);
  };

  const handleBackspace = () => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    const newGrid = gridAnswers.map((row) => [...row]);
    newGrid[r][c] = '';
    setGridAnswers(newGrid);

    if (selectedDirection === 'across' && c - 1 >= 0 && validCells.has(`${r}-${c - 1}`)) {
      setSelectedCell({ r, c: c - 1 });
    } else if (selectedDirection === 'down' && r - 1 >= 0 && validCells.has(`${r - 1}-${c}`)) {
      setSelectedCell({ r: r - 1, c });
    }
  };

  const checkPuzzleCompletion = (grid: string[][]) => {
    let allCorrect = true;
    for (const clue of curPuzzle.clues) {
      for (let i = 0; i < clue.answer.length; i++) {
        const r = clue.dir === 'across' ? clue.row : clue.row + i;
        const c = clue.dir === 'across' ? clue.col + i : clue.col;
        if (grid[r][c] !== clue.answer[i]) {
          allCorrect = false;
          break;
        }
      }
      if (!allCorrect) break;
    }
    if (allCorrect) {
      setCrosswordSuccess(true);
    }
  };

  const handleHintWord = () => {
    if (!activeClue) return;
    const newGrid = gridAnswers.map((row) => [...row]);
    for (let i = 0; i < activeClue.answer.length; i++) {
      const r = activeClue.dir === 'across' ? activeClue.row : activeClue.row + i;
      const c = activeClue.dir === 'across' ? activeClue.col + i : activeClue.col;
      newGrid[r][c] = activeClue.answer[i];
    }
    setGridAnswers(newGrid);
    checkPuzzleCompletion(newGrid);
  };

  // ── 3. Table Trivia Battle State ──
  const activeTriviaList = TABLE_TRIVIA_BY_DIFFICULTY[difficulty];
  const [triviaPlayers] = useState<string[]>(['You (Guest 1)', 'Guest 2', 'Guest 3']);
  const [curTriviaIdx, setCurTriviaIdx] = useState(0);
  const [playerScores, setPlayerScores] = useState<number[]>([0, 0, 0]);
  const [activePlayerTurn, setActivePlayerTurn] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [triviaAnswered, setTriviaAnswered] = useState(false);
  const [triviaStreak, setTriviaStreak] = useState(0);

  const curQ = activeTriviaList[curTriviaIdx % activeTriviaList.length];

  const handleTriviaAnswer = (optIdx: number) => {
    if (triviaAnswered) return;
    setSelectedOption(optIdx);
    setTriviaAnswered(true);

    const isCorrect = optIdx === curQ.correct;
    if (isCorrect) {
      setTriviaStreak((s) => s + 1);
      setPlayerScores((prev) => {
        const next = [...prev];
        next[activePlayerTurn] = (next[activePlayerTurn] || 0) + 10 + (triviaStreak * 2);
        return next;
      });
    } else {
      setTriviaStreak(0);
    }
  };

  const handleNextTriviaQuestion = () => {
    setSelectedOption(null);
    setTriviaAnswered(false);
    setCurTriviaIdx((i) => (i + 1) % activeTriviaList.length);
    setActivePlayerTurn((p) => (p + 1) % triviaPlayers.length);
  };

  // ── 4. "Who Pays the Bill?" Roulette State ──
  const activeConsequences = BILL_CONSEQUENCES_BY_DIFFICULTY[difficulty];
  const [rouletteGuests, setRouletteGuests] = useState<string[]>(['Siddhant', 'Rahul', 'Priya', 'Arjun']);
  const [newGuestInput, setNewGuestInput] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [rouletteWinner, setRouletteWinner] = useState<{ guest: string; consequence: BillConsequence } | null>(null);
  const [spinHistory, setSpinHistory] = useState<Array<{ guest: string; consequence: string; time: string }>>([]);

  const spinTheWheel = () => {
    if (isSpinning || rouletteGuests.length < 2) return;
    setIsSpinning(true);
    setRouletteWinner(null);

    const extraTurns = Math.floor(Math.random() * 4) + 6;
    const randomAngle = Math.floor(Math.random() * 360);
    const newTotal = wheelRotation + extraTurns * 360 + randomAngle;
    setWheelRotation(newTotal);

    setTimeout(() => {
      setIsSpinning(false);
      const chosenGuest = rouletteGuests[Math.floor(Math.random() * rouletteGuests.length)];
      const chosenConsequence = activeConsequences[Math.floor(Math.random() * activeConsequences.length)];
      setRouletteWinner({ guest: chosenGuest, consequence: chosenConsequence });

      setSpinHistory((prev) => [
        {
          guest: chosenGuest,
          consequence: chosenConsequence.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev.slice(0, 4)
      ]);
    }, 3800);
  };

  const addGuest = () => {
    if (!newGuestInput.trim()) return;
    if (rouletteGuests.length >= 8) return;
    setRouletteGuests([...rouletteGuests, newGuestInput.trim()]);
    setNewGuestInput('');
  };

  const removeGuest = (idx: number) => {
    if (rouletteGuests.length <= 2) return;
    setRouletteGuests(rouletteGuests.filter((_, i) => i !== idx));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[94vh] bg-[#0A0F1D] border border-white/[0.12] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#0D1527] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Gamepad2 className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif font-black text-base sm:text-lg text-white">Table Arcade</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {tableLabel}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Play while waiting for your order • {restaurantName}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Close Games"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* UNIVERSAL DIFFICULTY SELECTOR                             */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#0C1222] border-b border-white/[0.08] flex items-center justify-center">
          <div className="flex items-center space-x-1.5 bg-black/40 p-1 rounded-xl border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setDifficulty('easy')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                difficulty === 'easy'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              Easy
            </button>

            <button
              type="button"
              onClick={() => setDifficulty('medium')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                difficulty === 'medium'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              Medium
            </button>

            <button
              type="button"
              onClick={() => setDifficulty('hard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                difficulty === 'hard'
                  ? 'bg-rose-500 text-white font-black shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              Hard
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-3 sm:px-6 py-2 bg-[#090D18] border-b border-white/[0.06] flex items-center space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('solitaire')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'solitaire'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <span>♠️</span>
            <span>Klondike Solitaire</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('crossword')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'crossword'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <span>✍️</span>
            <span>Classic Crossword</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('trivia')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'trivia'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Table Trivia Battle</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('billRoulette')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'billRoulette'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Who Pays The Bill?</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TAB 1: KLONDIKE SOLITAIRE                                   */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'solitaire' && (
            <div className="space-y-4">
              {/* Solitaire Control Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900/80 rounded-2xl border border-white/[0.06]">
                <div className="flex items-center space-x-4 text-xs font-mono">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{Math.floor(solitaireTimer / 60)}:{String(solitaireTimer % 60).padStart(2, '0')}</span>
                  </div>
                  <div>Moves: <span className="text-white font-bold">{solitaire.moves}</span></div>
                  <div>Score: <span className="text-amber-400 font-bold">{solitaire.score}</span></div>
                  <div className="hidden sm:inline text-slate-400">
                    Mode: <span className="text-emerald-300 font-bold">{difficulty === 'easy' ? 'Draw 1' : 'Draw 3'}</span>
                    {difficulty === 'hard' && <span className="text-rose-400 ml-1">({3 - solitaireDeckPasses} passes left)</span>}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetSolitaireGame}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-bold text-slate-200 hover:text-white flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>New Deal</span>
                </button>
              </div>

              {/* Upper Section: Stock + Waste + 4 Foundations */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {/* Stock Pile */}
                <div
                  onClick={handleStockClick}
                  className={`aspect-[2/3] rounded-xl border-2 flex items-center justify-center cursor-pointer transition-transform active:scale-95 select-none ${
                    solitaire.stock.length > 0
                      ? 'bg-gradient-to-br from-indigo-900 to-slate-950 border-indigo-500 shadow-md'
                      : 'bg-black/30 border-dashed border-slate-700 hover:border-slate-500'
                  }`}
                  title="Click to deal cards"
                >
                  {solitaire.stock.length > 0 ? (
                    <div className="text-center">
                      <span className="text-xs sm:text-sm font-bold text-indigo-300">🂠</span>
                      <span className="text-[10px] block text-indigo-300 font-mono">{solitaire.stock.length}</span>
                    </div>
                  ) : (
                    <RotateCcw className="w-4 h-4 text-slate-500" />
                  )}
                </div>

                {/* Waste Pile */}
                <div
                  onClick={() => handleCardTap('waste')}
                  className={`aspect-[2/3] rounded-xl border flex items-center justify-center transition-all select-none ${
                    solitaire.waste.length > 0
                      ? 'bg-white text-slate-950 border-slate-300 shadow-md cursor-pointer hover:ring-2 hover:ring-amber-400'
                      : 'bg-black/20 border-dashed border-slate-800'
                  }`}
                >
                  {solitaire.waste.length > 0 && (
                    <div className="text-center">
                      <div className={`text-xs sm:text-base font-black ${solitaire.waste[solitaire.waste.length - 1].color === 'red' ? 'text-rose-600' : 'text-slate-950'}`}>
                        {getRankLabel(solitaire.waste[solitaire.waste.length - 1].rank)}
                      </div>
                      <div className="text-xs sm:text-sm">{solitaire.waste[solitaire.waste.length - 1].suit}</div>
                    </div>
                  )}
                </div>

                {/* Gap */}
                <div />

                {/* 4 Foundation Piles (Ace -> King) */}
                {solitaire.foundations.map((pile, fIdx) => {
                  const targetSuit = SUITS[fIdx];
                  const top = pile.length > 0 ? pile[pile.length - 1] : null;

                  return (
                    <div
                      key={`foundation-${fIdx}`}
                      className={`aspect-[2/3] rounded-xl border flex items-center justify-center select-none ${
                        top
                          ? 'bg-white text-slate-950 border-slate-300 shadow-md'
                          : 'bg-black/30 border-dashed border-slate-700'
                      }`}
                    >
                      {top ? (
                        <div className="text-center">
                          <div className={`text-xs sm:text-base font-black ${top.color === 'red' ? 'text-rose-600' : 'text-slate-950'}`}>
                            {getRankLabel(top.rank)}
                          </div>
                          <div className="text-xs sm:text-sm">{top.suit}</div>
                        </div>
                      ) : (
                        <span className="text-sm opacity-30 font-bold">{targetSuit}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Lower Section: 7 Tableau Columns */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 min-h-[280px] pt-2">
                {solitaire.tableau.map((col, colIdx) => (
                  <div key={`col-${colIdx}`} className="relative min-h-[180px] flex flex-col items-center">
                    {col.length === 0 ? (
                      <div className="w-full aspect-[2/3] rounded-xl border border-dashed border-slate-800 bg-black/20" />
                    ) : (
                      col.map((card, cardIdx) => {
                        const isTop = cardIdx === col.length - 1;
                        return (
                          <div
                            key={card.id}
                            onClick={() => isTop && card.faceUp && handleCardTap('tableau', colIdx, cardIdx)}
                            style={{ marginTop: cardIdx === 0 ? 0 : -28 }}
                            className={`w-full aspect-[2/3] rounded-xl border transition-all select-none ${
                              card.faceUp
                                ? 'bg-white text-slate-950 border-slate-300 shadow-sm cursor-pointer hover:ring-2 hover:ring-amber-400'
                                : 'bg-gradient-to-br from-indigo-900 to-slate-950 border-indigo-700/60'
                            }`}
                          >
                            {card.faceUp ? (
                              <div className="p-1">
                                <div className={`text-[10px] sm:text-xs font-black leading-none ${card.color === 'red' ? 'text-rose-600' : 'text-slate-950'}`}>
                                  {getRankLabel(card.rank)} {card.suit}
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center opacity-40 text-[10px]">🂠</div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                ))}
              </div>

              {solitaire.won && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-amber-500/20 border border-emerald-500 text-center space-y-2 animate-bounce">
                  <Trophy className="w-10 h-10 text-amber-400 mx-auto" />
                  <h4 className="text-lg font-black text-white">SOLITAIRE VICTORY!</h4>
                  <p className="text-xs text-slate-200">You cleared the table in {solitaire.moves} moves!</p>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TAB 2: CLASSIC GENERIC CROSSWORD (KIDS TO ADULTS)           */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'crossword' && (
            <div className="space-y-4">
              {/* Puzzle Header & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900/80 rounded-2xl border border-white/[0.06]">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-white">{curPuzzle.title}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {curPuzzle.ageLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{curPuzzle.theme}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleHintWord}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reveal Word</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGridAnswers(Array(curPuzzle.size).fill(null).map(() => Array(curPuzzle.size).fill('')));
                      setCrosswordSuccess(false);
                    }}
                    className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-all cursor-pointer"
                    title="Clear Grid"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Active Clue Banner */}
              <div className="p-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span className="px-2 py-0.5 rounded-md font-mono font-black text-xs bg-amber-500 text-slate-950 uppercase shrink-0">
                    {selectedDirection} {activeClue ? activeClue.num : 1}
                  </span>
                  <p className="text-xs font-medium text-white truncate">
                    {activeClue ? activeClue.clue : 'Select any square to reveal the clue'}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-400 shrink-0">
                  ({activeClue?.answer.length || 0} letters)
                </span>
              </div>

              {/* Crossword Grid + Clues Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dynamic Sized Grid */}
                <div className="bg-[#0B1120] p-3 sm:p-4 rounded-2xl border border-white/[0.08] flex items-center justify-center">
                  <div
                    style={{ gridTemplateColumns: `repeat(${curPuzzle.size}, minmax(0, 1fr))` }}
                    className="grid gap-1 w-full max-w-[320px]"
                  >
                    {Array(curPuzzle.size).fill(null).map((_, r) =>
                      Array(curPuzzle.size).fill(null).map((__, c) => {
                        const isPlayable = validCells.has(`${r}-${c}`);
                        const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                        const cellVal = gridAnswers[r]?.[c] || '';

                        const startClue = curPuzzle.clues.find((cl) => cl.row === r && cl.col === c);

                        return (
                          <div
                            key={`cell-${r}-${c}`}
                            onClick={() => handleCellClick(r, c)}
                            className={`aspect-square rounded-lg relative flex items-center justify-center font-bold text-sm sm:text-base select-none transition-all ${
                              !isPlayable
                                ? 'bg-[#060912] border border-white/[0.02]'
                                : isSelected
                                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 font-black cursor-pointer shadow-lg scale-105 z-10'
                                : 'bg-[#131B2E] border border-white/[0.12] text-white hover:border-amber-400 cursor-pointer'
                            }`}
                          >
                            {startClue && (
                              <span className={`absolute top-0.5 left-1 text-[8px] font-mono font-bold leading-none ${isSelected ? 'text-slate-950' : 'text-amber-400'}`}>
                                {startClue.num}
                              </span>
                            )}
                            {cellVal}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Clues List */}
                <div className="bg-[#0B1120] p-4 rounded-2xl border border-white/[0.08] space-y-4 max-h-[340px] overflow-y-auto">
                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-wider text-amber-400 border-b border-white/[0.06] pb-1 mb-2 font-mono">
                      Across Clues
                    </h5>
                    <div className="space-y-1.5">
                      {curPuzzle.clues.filter((c) => c.dir === 'across').map((clue) => (
                        <div
                          key={`across-${clue.num}`}
                          onClick={() => {
                            setSelectedDirection('across');
                            setSelectedCell({ r: clue.row, c: clue.col });
                          }}
                          className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                            activeClue?.num === clue.num && activeClue?.dir === 'across'
                              ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                              : 'text-slate-300 hover:text-white hover:bg-white/[0.03]'
                          }`}
                        >
                          <span className="font-bold text-amber-400 mr-1.5">{clue.num}.</span>
                          <span>{clue.clue}</span>
                          <span className="text-[10px] text-slate-500 font-mono ml-1">({clue.answer.length})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-wider text-amber-400 border-b border-white/[0.06] pb-1 mb-2 font-mono">
                      Down Clues
                    </h5>
                    <div className="space-y-1.5">
                      {curPuzzle.clues.filter((c) => c.dir === 'down').map((clue) => (
                        <div
                          key={`down-${clue.num}`}
                          onClick={() => {
                            setSelectedDirection('down');
                            setSelectedCell({ r: clue.row, c: clue.col });
                          }}
                          className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                            activeClue?.num === clue.num && activeClue?.dir === 'down'
                              ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                              : 'text-slate-300 hover:text-white hover:bg-white/[0.03]'
                          }`}
                        >
                          <span className="font-bold text-amber-400 mr-1.5">{clue.num}.</span>
                          <span>{clue.clue}</span>
                          <span className="text-[10px] text-slate-500 font-mono ml-1">({clue.answer.length})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Virtual Touch Keyboard for Mobile Diners */}
              <div className="p-2.5 bg-[#0B1120] rounded-2xl border border-white/[0.08] space-y-1.5">
                {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, rIdx) => (
                  <div key={row} className="flex justify-center space-x-1">
                    {rIdx === 2 && (
                      <button
                        type="button"
                        onClick={handleBackspace}
                        className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        ⌫
                      </button>
                    )}
                    {row.split('').map((char) => (
                      <button
                        key={char}
                        type="button"
                        onClick={() => handleKeyInput(char)}
                        className="w-7 sm:w-8 h-8 sm:h-9 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-lg transition-all shadow-sm cursor-pointer"
                      >
                        {char}
                      </button>
                    ))}
                    {rIdx === 2 && (
                      <button
                        type="button"
                        onClick={() => setSelectedDirection((d) => (d === 'across' ? 'down' : 'across'))}
                        className="px-2 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        DIR
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {crosswordSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-center space-y-2 animate-bounce">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-black text-emerald-300">CROSSWORD PUZZLE COMPLETE!</h4>
                  <p className="text-xs text-slate-200">You solved the {curPuzzle.ageLabel} puzzle for {tableLabel}!</p>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TAB 3: TABLE TRIVIA BATTLE (KIDS TO ADULTS)                 */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'trivia' && (
            <div className="space-y-4">
              {/* Leaderboard & Turn Indicator */}
              <div className="grid grid-cols-3 gap-2">
                {triviaPlayers.map((name, pIdx) => (
                  <div
                    key={name}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      activePlayerTurn === pIdx
                        ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg ring-1 ring-amber-400'
                        : 'bg-slate-900/60 border-white/[0.06] text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                      {activePlayerTurn === pIdx ? '👉 Current Turn' : `Seat ${pIdx + 1}`}
                    </span>
                    <span className="text-xs font-bold text-white truncate block">{name}</span>
                    <span className="text-base font-black text-amber-400 font-mono mt-0.5 block">
                      {playerScores[pIdx] || 0} pts
                    </span>
                  </div>
                ))}
              </div>

              {/* Question Card */}
              <div className="p-6 bg-[#0E1527] border border-white/[0.1] rounded-3xl shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    Round {curTriviaIdx + 1} of {activeTriviaList.length} • {difficulty.toUpperCase()}
                  </span>
                  {triviaStreak > 1 && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1 animate-pulse">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{triviaStreak}x Streak (+{triviaStreak * 2} bonus)</span>
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-black text-base sm:text-xl text-white leading-snug">
                  {curQ.question}
                </h3>

                {/* Options 2x2 Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {curQ.options.map((opt, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    const isCorrect = optIdx === curQ.correct;
                    const showFeedback = triviaAnswered;

                    let btnStyle = 'bg-white/[0.04] border-white/[0.1] hover:bg-white/[0.08] hover:border-amber-400 text-white';
                    if (showFeedback) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                      } else {
                        btnStyle = 'bg-white/[0.02] border-white/[0.04] opacity-50';
                      }
                    }

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleTriviaAnswer(optIdx)}
                        disabled={triviaAnswered}
                        className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center space-x-3 cursor-pointer ${btnStyle}`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-slate-300">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Did You Know / Fact Popup */}
                {triviaAnswered && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>{selectedOption === curQ.correct ? 'Spot On! High Five!' : 'Good Try! Here is the Fun Fact:'}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{curQ.fact}</p>
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextTriviaQuestion}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                      >
                        Next Player Turn →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TAB 4: WHO PAYS THE BILL? (KIDS TO ADULTS)                  */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'billRoulette' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {tableLabel} • {difficulty.toUpperCase()} MODE
                </span>
                <h4 className="font-serif font-black text-xl text-white">Who Pays The Bill?</h4>
                <p className="text-xs text-slate-400">
                  {difficulty === 'easy' && 'Fun dares & sweet treat rewards for kids and junior diners!'}
                  {difficulty === 'medium' && 'Social fun dares & friendly mocktail/snack treats for teens!'}
                  {difficulty === 'hard' && 'High stakes! Spin to see who settles the real dining check or bar tab!'}
                </p>
              </div>

              {/* Guest Manager */}
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Diners at {tableLabel} ({rouletteGuests.length}/8)</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {rouletteGuests.map((guest, idx) => (
                    <span
                      key={`${guest}-${idx}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 border border-white/[0.08] text-xs font-bold text-white flex items-center space-x-1.5"
                    >
                      <span>{guest}</span>
                      {rouletteGuests.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeGuest(idx)}
                          className="hover:text-rose-400 ml-1 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {/* Add Guest Input */}
                {rouletteGuests.length < 8 && (
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      value={newGuestInput}
                      onChange={(e) => setNewGuestInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addGuest()}
                      placeholder="Add another friend (e.g. Rahul)"
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={addGuest}
                      className="px-3 py-2 bg-white/[0.08] hover:bg-white/[0.15] text-white font-bold text-xs rounded-xl flex items-center space-x-1 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Animated Roulette Wheel Container */}
              <div className="flex flex-col items-center justify-center py-4 space-y-5">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                  <div className="absolute -top-3 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-400 filter drop-shadow-md" />

                  <div
                    style={{
                      transform: `rotate(${wheelRotation}deg)`,
                      transition: isSpinning ? 'transform 3.8s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
                    }}
                    className="w-full h-full rounded-full border-4 border-amber-400/80 shadow-2xl relative overflow-hidden bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-900"
                  >
                    {rouletteGuests.map((guest, idx) => {
                      const angle = (360 / rouletteGuests.length) * idx;
                      return (
                        <div
                          key={`slice-${guest}`}
                          style={{
                            transform: `rotate(${angle}deg)`,
                            transformOrigin: '50% 100%',
                          }}
                          className="absolute top-0 left-1/2 -ml-8 w-16 h-1/2 flex flex-col items-center justify-start pt-3"
                        >
                          <span className="text-[10px] font-black text-white uppercase font-mono tracking-wider drop-shadow-md truncate max-w-[55px]">
                            {guest}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={spinTheWheel}
                    disabled={isSpinning || rouletteGuests.length < 2}
                    className="absolute z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-black text-xs uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center border-4 border-slate-950 cursor-pointer disabled:opacity-50"
                  >
                    <Dices className="w-5 h-5 mb-0.5" />
                    <span>{isSpinning ? 'Spinning' : 'SPIN'}</span>
                  </button>
                </div>

                {/* Result Card */}
                {rouletteWinner && (
                  <div className="w-full max-w-md p-5 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border-2 border-amber-400/80 text-center space-y-2 shadow-2xl animate-in fade-in duration-300">
                    <span className="text-3xl block">{rouletteWinner.consequence.icon}</span>
                    <h3 className="font-serif font-black text-xl text-amber-300">
                      DESTINY CHOOSES: {rouletteWinner.guest.toUpperCase()}!
                    </h3>
                    <p className="text-sm font-bold text-white">
                      {rouletteWinner.consequence.text}
                    </p>
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-white/10 text-slate-300 border border-white/20">
                      {rouletteWinner.consequence.tag}
                    </span>
                  </div>
                )}

                {/* History */}
                {spinHistory.length > 0 && (
                  <div className="w-full max-w-md space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                      Previous Spins at This Table:
                    </span>
                    {spinHistory.map((h, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs flex items-center justify-between">
                        <span className="font-bold text-white">{h.guest}</span>
                        <span className="text-slate-400 truncate max-w-[200px]">{h.consequence}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{h.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TableArcadeModal;
