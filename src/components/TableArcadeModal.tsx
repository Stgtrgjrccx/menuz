import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Trophy,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Play,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Flame,
  Users,
  Gamepad2,
  Clock,
  Award,
  Zap,
  Volume2,
  VolumeX,
  Dice5,
  Dices,
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react';

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
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

interface SolitaireState {
  stock: Card[]; // Draw pile (face down)
  waste: Card[]; // Discard pile (face up)
  foundations: Card[][]; // 4 suit piles (Ace -> King)
  tableau: Card[][]; // 7 columns
  moves: number;
  score: number;
  won: boolean;
}

function initSolitaire(): SolitaireState {
  const deck = createShuffledDeck();
  const tableau: Card[][] = [[], [], [], [], [], [], []];

  // Deal 1 to 7 cards into tableau
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
// 2. CROSSWORD PUZZLES & DATA
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
  size: number; // e.g. 7 for 7x7
  clues: CrosswordClue[];
}

const CROSSWORD_PUZZLES: CrosswordPuzzle[] = [
  {
    id: 'pune-spices',
    title: 'Pune Foodie & Spices',
    theme: 'Legendary Local Tastes & Masalas',
    size: 7,
    clues: [
      { num: 1, dir: 'across', clue: 'Golden turmeric spice widely used in curries', answer: 'HALDI', row: 0, col: 0 },
      { num: 3, dir: 'across', clue: 'Pune’s fiery sprout curry served with pav', answer: 'MISAL', row: 2, col: 0 },
      { num: 5, dir: 'across', clue: 'Traditional clay oven for naan & kebabs', answer: 'TANDOOR', row: 4, col: 0 },
      { num: 6, dir: 'across', clue: 'Refreshing yogurt drink, sweet or salted', answer: 'LASSI', row: 6, col: 2 },
      { num: 1, dir: 'down', clue: 'Maharashtrian sweet flatbread filled with jaggery & lentils', answer: 'PURAN', row: 0, col: 0 },
      { num: 2, dir: 'down', clue: 'Spiced aromatic layered rice delight', answer: 'DUM', row: 0, col: 3 },
      { num: 4, dir: 'down', clue: 'Crispy fried snack, famous with Pune chai', answer: 'SAMOSA', row: 1, col: 2 }
    ]
  },
  {
    id: 'italian-delight',
    title: 'Italian & Bistro Classics',
    theme: 'Artisanal Pizzas, Pasta & Dolce',
    size: 7,
    clues: [
      { num: 1, dir: 'across', clue: 'Creamy slow-cooked Arborio rice', answer: 'RISOTTO', row: 0, col: 0 },
      { num: 3, dir: 'across', clue: 'Silky frozen Italian treat', answer: 'GELATO', row: 2, col: 1 },
      { num: 5, dir: 'across', clue: 'Italian coffee dessert layered with mascarpone', answer: 'TIRAMISU', row: 4, col: 0 },
      { num: 1, dir: 'down', clue: 'Folded pizza pocket stuffed with cheese', answer: 'ROAST', row: 0, col: 0 },
      { num: 2, dir: 'down', clue: 'Vibrant green sauce of basil & pine nuts', answer: 'PESTO', row: 0, col: 4 },
      { num: 4, dir: 'down', clue: 'Morning brew with steamed milk foam', answer: 'LATTE', row: 2, col: 3 }
    ]
  }
];

// ─────────────────────────────────────────────────────────────
// 3. MULTIPLAYER TABLE TRIVIA QUESTIONS
// ─────────────────────────────────────────────────────────────
interface TriviaQuestion {
  question: string;
  options: string[];
  correct: number;
  fact: string;
}

const TABLE_TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    question: 'Which legendary Pune bakery made Shrewsbury Biscuits world-famous?',
    options: ['Kayani Bakery', 'Hindustan Bakery', 'German Bakery', 'Marz-O-Rin'],
    correct: 0,
    fact: 'Kayani Bakery on East Street, Camp has been baking iconic butter Shrewsbury biscuits since 1955!'
  },
  {
    question: 'What is the key ingredient that gives Saffron rice its brilliant golden-yellow hue and royal aroma?',
    options: ['Turmeric', 'Saffron (Kesar)', 'Cardamom', 'Cumin'],
    correct: 1,
    fact: 'True saffron stigma threads are the most prized spice in the world, harvested by hand from crocus flowers!'
  },
  {
    question: 'Misal Pav is traditionally topped with which crispy savory topping?',
    options: ['Farsan / Sev', 'Boiled Peanuts', 'Fried Cashews', 'Chana Dal'],
    correct: 0,
    fact: 'Crisp farsan, spicy tarri (kat), fresh chopped onions and lemon make Puneri misal an unmatched delicacy.'
  },
  {
    question: 'In traditional Italian dining, what does "Al Dente" literally translate to?',
    options: ['To the tooth', 'Cooked well', 'With cheese', 'Boiled tender'],
    correct: 0,
    fact: '"Al dente" means "to the tooth" — describing pasta cooked firm to the bite, not mushy!'
  },
  {
    question: 'Which city is credited as the birthplace of modern pizza (Pizza Margherita)?',
    options: ['Rome', 'Naples', 'Milan', 'Florence'],
    correct: 1,
    fact: 'Naples, Italy created the Neapolitan Pizza Margherita in 1889 to represent the colors of the Italian flag!'
  },
  {
    question: 'Which refreshing herb is the soul of authentic Biryani Dum and Moroccan mint tea?',
    options: ['Cilantro', 'Pudina (Mint)', 'Rosemary', 'Thyme'],
    correct: 1,
    fact: 'Fresh mint leaves release essential aromatic oils during dum cooking, creating biryani’s signature fragrance.'
  },
  {
    question: 'What sweet seasonal dessert made with Alphonso mango pulp is a summertime pride of Pune?',
    options: ['Aamras / Amrakhand', 'Gulab Jamun', 'Rasgulla', 'Kaju Katli'],
    correct: 0,
    fact: 'Devgad and Ratnagiri Alphonso mangoes make Maharashtra’s Aamras and Amrakhand legendary.'
  },
  {
    question: 'Which country drinks the most tea per capita in the entire world?',
    options: ['India', 'Turkey', 'United Kingdom', 'China'],
    correct: 1,
    fact: 'Turkey consumes the most tea per capita, with locals drinking an average of 3 to 5 glasses of çay daily!'
  }
];

// ─────────────────────────────────────────────────────────────
// 4. "WHO PAYS THE BILL?" ROULETTE OUTCOMES
// ─────────────────────────────────────────────────────────────
const BILL_CONSEQUENCES = [
  { text: '💳 Pays the Entire Food Bill!', color: '#EF4444', icon: '💳', tag: 'Hero of the Table' },
  { text: '🍰 Treats the Table to Desserts!', color: '#F59E0B', icon: '🍰', tag: 'Sweet Tooth Sponsor' },
  { text: '☕ Buys the Post-Dinner Drinks / Coffee!', color: '#3B82F6', icon: '☕', tag: 'Beverage Host' },
  { text: '🛡️ 100% Free Pass (Immune & Pampered)!', color: '#10B981', icon: '🛡️', tag: 'Lucky Diner' },
  { text: '🌶️ Must take a bite of the spiciest dip!', color: '#EC4899', icon: '🌶️', tag: 'Spice Champion' },
  { text: '📸 Must snap & post the group table selfie!', color: '#8B5CF6', icon: '📸', tag: 'Official Photographer' },
];

export const TableArcadeModal: React.FC<TableArcadeModalProps> = ({
  isOpen,
  onClose,
  tableLabel = 'Table 1',
  restaurantName = 'Menuz Diner'
}) => {
  const [activeTab, setActiveTab] = useState<'solitaire' | 'crossword' | 'trivia' | 'billRoulette'>('solitaire');

  // ── 1. Solitaire State ──
  const [solitaire, setSolitaire] = useState<SolitaireState>(initSolitaire);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [solitaireTimer, setSolitaireTimer] = useState(0);
  const [solitaireRunning, setSolitaireRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isOpen && activeTab === 'solitaire' && solitaireRunning && !solitaire.won) {
      interval = setInterval(() => setSolitaireTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, activeTab, solitaireRunning, solitaire.won]);

  const resetSolitaireGame = () => {
    setSolitaire(initSolitaire());
    setSelectedCardId(null);
    setSolitaireTimer(0);
    setSolitaireRunning(true);
  };

  // Draw card from stock to waste
  const handleStockClick = () => {
    if (!solitaireRunning) setSolitaireRunning(true);
    if (solitaire.stock.length > 0) {
      const nextCard = { ...solitaire.stock[solitaire.stock.length - 1], faceUp: true };
      setSolitaire((prev) => ({
        ...prev,
        stock: prev.stock.slice(0, -1),
        waste: [...prev.waste, nextCard],
        moves: prev.moves + 1,
      }));
    } else if (solitaire.waste.length > 0) {
      // Recycle waste back into stock
      const recycled = [...solitaire.waste].reverse().map((c) => ({ ...c, faceUp: false }));
      setSolitaire((prev) => ({
        ...prev,
        stock: recycled,
        waste: [],
        moves: prev.moves + 1,
      }));
    }
  };

  // Check if card can move to a foundation pile
  const tryMoveToFoundation = (card: Card): boolean => {
    for (let f = 0; f < 4; f++) {
      const pile = solitaire.foundations[f];
      if (pile.length === 0) {
        if (card.rank === 1) {
          // Ace to empty foundation
          return true;
        }
      } else {
        const top = pile[pile.length - 1];
        if (top.suit === card.suit && top.rank + 1 === card.rank) {
          return true;
        }
      }
    }
    return false;
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
        canPutTableau = cardToMove.rank === 13; // Only Kings on empty columns
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
  const [selectedPuzzleIdx, setSelectedPuzzleIdx] = useState(0);
  const curPuzzle = CROSSWORD_PUZZLES[selectedPuzzleIdx];
  const [gridAnswers, setGridAnswers] = useState<string[][]>(() =>
    Array(7).fill(null).map(() => Array(7).fill(''))
  );
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>({ r: 0, c: 0 });
  const [selectedDirection, setSelectedDirection] = useState<'across' | 'down'>('across');
  const [crosswordSuccess, setCrosswordSuccess] = useState(false);
  const [crosswordScore, setCrosswordScore] = useState(0);

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

    // Auto advance to next cell
    if (selectedDirection === 'across' && c + 1 < curPuzzle.size && validCells.has(`${r}-${c + 1}`)) {
      setSelectedCell({ r, c: c + 1 });
    } else if (selectedDirection === 'down' && r + 1 < curPuzzle.size && validCells.has(`${r + 1}-${c}`)) {
      setSelectedCell({ r: r + 1, c });
    }

    // Check full puzzle
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
      setCrosswordScore((s) => s + 100);
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
  const [triviaPlayers, setTriviaPlayers] = useState<string[]>(['You (Guest 1)', 'Guest 2', 'Guest 3']);
  const [curTriviaIdx, setCurTriviaIdx] = useState(0);
  const [playerScores, setPlayerScores] = useState<number[]>([0, 0, 0]);
  const [activePlayerTurn, setActivePlayerTurn] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [triviaAnswered, setTriviaAnswered] = useState(false);
  const [triviaStreak, setTriviaStreak] = useState(0);

  const curQ = TABLE_TRIVIA_QUESTIONS[curTriviaIdx % TABLE_TRIVIA_QUESTIONS.length];

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
    setCurTriviaIdx((i) => (i + 1) % TABLE_TRIVIA_QUESTIONS.length);
    setActivePlayerTurn((p) => (p + 1) % triviaPlayers.length);
  };

  // ── 4. "Who Pays the Bill?" Roulette State ──
  const [rouletteGuests, setRouletteGuests] = useState<string[]>(['Siddhant', 'Rahul', 'Priya', 'Arjun']);
  const [newGuestInput, setNewGuestInput] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [rouletteWinner, setRouletteWinner] = useState<{ guest: string; consequence: typeof BILL_CONSEQUENCES[0] } | null>(null);
  const [spinHistory, setSpinHistory] = useState<Array<{ guest: string; consequence: string; time: string }>>([]);

  const spinTheWheel = () => {
    if (isSpinning || rouletteGuests.length < 2) return;
    setIsSpinning(true);
    setRouletteWinner(null);

    // Random turns: between 5 and 9 full rotations + random angle
    const extraTurns = Math.floor(Math.random() * 4) + 6;
    const randomAngle = Math.floor(Math.random() * 360);
    const newTotal = wheelRotation + extraTurns * 360 + randomAngle;
    setWheelRotation(newTotal);

    setTimeout(() => {
      setIsSpinning(false);
      // Pick random guest & random consequence
      const chosenGuest = rouletteGuests[Math.floor(Math.random() * rouletteGuests.length)];
      const chosenConsequence = BILL_CONSEQUENCES[Math.floor(Math.random() * BILL_CONSEQUENCES.length)];
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
              <p className="text-[11px] text-slate-400">Play while waiting for your fresh order • {restaurantName}</p>
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
            <span>Solitaire</span>
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
            <span>Food Crossword</span>
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
            <span>Table Trivia</span>
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
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#070B14]">
          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TAB 1: SOLITAIRE (KLONDIKE)                                  */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'solitaire' && (
            <div className="space-y-4">
              {/* Solitaire Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900/80 rounded-2xl border border-white/[0.06]">
                <div className="flex items-center space-x-3 text-xs">
                  <div className="flex items-center space-x-1.5 font-mono text-amber-400">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(solitaireTimer / 60)}:{String(solitaireTimer % 60).padStart(2, '0')}</span>
                  </div>
                  <div className="text-slate-400">
                    Moves: <span className="font-bold text-white font-mono">{solitaire.moves}</span>
                  </div>
                  <div className="text-slate-400">
                    Score: <span className="font-bold text-emerald-400 font-mono">{solitaire.score}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={resetSolitaireGame}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-bold text-white flex items-center space-x-1 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>New Game</span>
                  </button>
                </div>
              </div>

              {/* Felt Green Solitaire Board */}
              <div className="p-3 sm:p-5 rounded-2xl bg-gradient-to-b from-[#113824] to-[#0A2616] border border-emerald-600/30 shadow-inner min-h-[360px]">
                {/* Upper Area: Stock, Waste, and 4 Foundations */}
                <div className="flex items-start justify-between mb-5">
                  {/* Stock & Waste */}
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {/* Stock Pile */}
                    <div
                      onClick={handleStockClick}
                      className="w-11 sm:w-16 h-16 sm:h-24 rounded-lg sm:rounded-xl border-2 border-emerald-500/40 bg-gradient-to-br from-indigo-950 to-slate-900 flex items-center justify-center cursor-pointer shadow-md active:scale-95 transition-transform"
                      title="Draw Card"
                    >
                      {solitaire.stock.length > 0 ? (
                        <div className="w-full h-full rounded-lg bg-indigo-900/60 border border-indigo-400/30 flex items-center justify-center font-bold text-xs text-indigo-300">
                          🂠 {solitaire.stock.length}
                        </div>
                      ) : (
                        <RotateCcw className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>

                    {/* Waste Pile */}
                    <div
                      onClick={() => handleCardTap('waste')}
                      className={`w-11 sm:w-16 h-16 sm:h-24 rounded-lg sm:rounded-xl border-2 border-emerald-500/30 flex items-center justify-center transition-all ${
                        solitaire.waste.length > 0
                          ? 'bg-white cursor-pointer shadow-md hover:ring-2 hover:ring-amber-400'
                          : 'bg-emerald-950/40 border-dashed'
                      }`}
                      title={solitaire.waste.length > 0 ? 'Tap to move card' : 'Waste pile'}
                    >
                      {solitaire.waste.length > 0 && (() => {
                        const top = solitaire.waste[solitaire.waste.length - 1];
                        return (
                          <div className={`text-center select-none font-bold ${top.color === 'red' ? 'text-red-600' : 'text-slate-900'}`}>
                            <div className="text-xs sm:text-base font-black leading-none">{getRankLabel(top.rank)}</div>
                            <div className="text-sm sm:text-xl leading-none mt-0.5">{top.suit}</div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* 4 Foundations (Ace to King) */}
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    {SUITS.map((suit, fIdx) => {
                      const pile = solitaire.foundations[fIdx];
                      const top = pile.length > 0 ? pile[pile.length - 1] : null;

                      return (
                        <div
                          key={suit}
                          className={`w-11 sm:w-16 h-16 sm:h-24 rounded-lg sm:rounded-xl border-2 flex items-center justify-center transition-all ${
                            top
                              ? 'bg-white border-emerald-400 shadow-md'
                              : 'bg-emerald-950/40 border-dashed border-emerald-500/30 text-emerald-500/40'
                          }`}
                        >
                          {top ? (
                            <div className={`text-center select-none font-bold ${top.color === 'red' ? 'text-red-600' : 'text-slate-900'}`}>
                              <div className="text-xs sm:text-base font-black leading-none">{getRankLabel(top.rank)}</div>
                              <div className="text-sm sm:text-xl leading-none mt-0.5">{top.suit}</div>
                            </div>
                          ) : (
                            <span className="text-sm sm:text-lg">{suit}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Lower Area: 7 Tableau Columns */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-2">
                  {solitaire.tableau.map((col, colIdx) => (
                    <div
                      key={`col-${colIdx}`}
                      className="min-h-[160px] sm:min-h-[200px] flex flex-col items-center"
                    >
                      {col.length === 0 ? (
                        <div className="w-full h-16 sm:h-24 rounded-lg sm:rounded-xl border-2 border-dashed border-emerald-500/20 bg-emerald-950/20 flex items-center justify-center text-[10px] text-emerald-400/40 font-mono">
                          K
                        </div>
                      ) : (
                        col.map((card, cardIdx) => {
                          const isTop = cardIdx === col.length - 1;
                          return (
                            <div
                              key={card.id}
                              onClick={() => isTop && handleCardTap('tableau', colIdx, cardIdx)}
                              style={{ marginTop: cardIdx === 0 ? 0 : -32 }}
                              className={`w-full h-16 sm:h-24 rounded-lg sm:rounded-xl border transition-all select-none ${
                                card.faceUp
                                  ? 'bg-white shadow-md ' + (card.color === 'red' ? 'text-red-600 border-slate-200' : 'text-slate-950 border-slate-200') + (isTop ? ' cursor-pointer hover:ring-2 hover:ring-amber-400 hover:scale-[1.02]' : '')
                                  : 'bg-gradient-to-br from-indigo-900 to-slate-900 border-indigo-500/30 text-indigo-400'
                              } flex flex-col justify-between p-1 sm:p-1.5`}
                            >
                              {card.faceUp ? (
                                <>
                                  <div className="text-[10px] sm:text-xs font-black leading-none flex items-center justify-between">
                                    <span>{getRankLabel(card.rank)}</span>
                                    <span>{card.suit}</span>
                                  </div>
                                  <div className="text-xs sm:text-lg font-black text-center my-auto leading-none">
                                    {card.suit}
                                  </div>
                                  <div className="text-[10px] sm:text-xs font-black leading-none rotate-180 flex items-center justify-between">
                                    <span>{getRankLabel(card.rank)}</span>
                                    <span>{card.suit}</span>
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full rounded border border-indigo-400/20 flex items-center justify-center text-[10px] text-indigo-300">
                                  🂠
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  ))}
                </div>

                {solitaire.won && (
                  <div className="mt-4 p-4 rounded-2xl bg-amber-500/20 border border-amber-500 text-center space-y-2 animate-bounce">
                    <Trophy className="w-10 h-10 text-amber-400 mx-auto" />
                    <h4 className="text-base font-black text-amber-300">VICTORY! YOU SOLVED SOLITAIRE!</h4>
                    <p className="text-xs text-slate-200">Table {tableLabel} champions! Your order is being freshly cooked right now.</p>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-400 text-center">
                💡 <span className="font-semibold text-slate-300">Quick Play Tip:</span> Tap any uncovered card to automatically move it to a foundation or valid column!
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TAB 2: FOOD & CULINARY CROSSWORD                            */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'crossword' && (
            <div className="space-y-4">
              {/* Puzzle Selector & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900/80 rounded-2xl border border-white/[0.06]">
                <div className="flex items-center space-x-2">
                  {CROSSWORD_PUZZLES.map((pz, idx) => (
                    <button
                      key={pz.id}
                      type="button"
                      onClick={() => {
                        setSelectedPuzzleIdx(idx);
                        setGridAnswers(Array(7).fill(null).map(() => Array(7).fill('')));
                        setCrosswordSuccess(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedPuzzleIdx === idx
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-white/[0.05] text-slate-300 hover:text-white'
                      }`}
                    >
                      {pz.title}
                    </button>
                  ))}
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
                      setGridAnswers(Array(7).fill(null).map(() => Array(7).fill('')));
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
                {/* 7x7 Grid */}
                <div className="bg-[#0B1120] p-3 sm:p-4 rounded-2xl border border-white/[0.08] flex items-center justify-center">
                  <div className="grid grid-cols-7 gap-1 w-full max-w-[320px]">
                    {Array(7).fill(null).map((_, r) =>
                      Array(7).fill(null).map((__, c) => {
                        const isPlayable = validCells.has(`${r}-${c}`);
                        const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                        const cellVal = gridAnswers[r][c];

                        // Find if cell starts a clue
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
                <div className="space-y-3 bg-[#0B1120] p-3 sm:p-4 rounded-2xl border border-white/[0.08] max-h-[340px] overflow-y-auto text-xs">
                  <div>
                    <h5 className="font-bold text-amber-400 uppercase tracking-wider text-[10px] mb-2">Across Clues</h5>
                    <div className="space-y-1.5">
                      {curPuzzle.clues.filter((c) => c.dir === 'across').map((clue) => (
                        <div
                          key={`across-${clue.num}`}
                          onClick={() => {
                            setSelectedCell({ r: clue.row, c: clue.col });
                            setSelectedDirection('across');
                          }}
                          className={`p-2 rounded-xl transition-all cursor-pointer ${
                            activeClue?.num === clue.num && activeClue?.dir === 'across'
                              ? 'bg-amber-500/15 border border-amber-500/40 text-white font-bold'
                              : 'bg-white/[0.02] text-slate-300 hover:bg-white/[0.06]'
                          }`}
                        >
                          <span className="font-bold text-amber-400 mr-1.5">{clue.num}.</span>
                          <span>{clue.clue}</span>
                          <span className="text-[10px] text-slate-500 font-mono ml-1">({clue.answer.length})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06]">
                    <h5 className="font-bold text-amber-400 uppercase tracking-wider text-[10px] mb-2">Down Clues</h5>
                    <div className="space-y-1.5">
                      {curPuzzle.clues.filter((c) => c.dir === 'down').map((clue) => (
                        <div
                          key={`down-${clue.num}`}
                          onClick={() => {
                            setSelectedCell({ r: clue.row, c: clue.col });
                            setSelectedDirection('down');
                          }}
                          className={`p-2 rounded-xl transition-all cursor-pointer ${
                            activeClue?.num === clue.num && activeClue?.dir === 'down'
                              ? 'bg-amber-500/15 border border-amber-500/40 text-white font-bold'
                              : 'bg-white/[0.02] text-slate-300 hover:bg-white/[0.06]'
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
                  <h4 className="text-base font-black text-emerald-300">CULINARY CROSSWORD COMPLETE!</h4>
                  <p className="text-xs text-slate-200">You earned 100 Foodie Points for {tableLabel}!</p>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TAB 3: TABLE TRIVIA BATTLE                                  */}
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

              {/* Trivia Question Card */}
              <div className="p-5 sm:p-6 bg-[#0E1528] rounded-3xl border border-white/[0.08] shadow-xl space-y-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono font-bold border border-amber-500/20">
                    Question {curTriviaIdx + 1} of {TABLE_TRIVIA_QUESTIONS.length}
                  </span>
                  {triviaStreak > 1 && (
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold flex items-center space-x-1 animate-pulse">
                      <Flame className="w-3.5 h-3.5 text-rose-400" />
                      <span>{triviaStreak}x Streak Bonus!</span>
                    </span>
                  )}
                </div>

                <h4 className="font-serif font-black text-base sm:text-xl text-white leading-snug">
                  {curQ.question}
                </h4>

                {/* 4 Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {curQ.options.map((option, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    const isCorrect = optIdx === curQ.correct;

                    let btnStyle = 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-white/[0.08]';
                    if (triviaAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-500/30 border-emerald-400 text-emerald-200 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-500/30 border-rose-400 text-rose-200 font-bold';
                      } else {
                        btnStyle = 'bg-slate-900/40 text-slate-500 border-transparent';
                      }
                    }

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={triviaAnswered}
                        onClick={() => handleTriviaAnswer(optIdx)}
                        className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{option}</span>
                        {triviaAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {triviaAnswered && isSelected && !isCorrect && <AlertCircle className="w-4 h-4 text-rose-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Fun Fact Reveal */}
                {triviaAnswered && (
                  <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-xs space-y-1.5 animate-fadeIn">
                    <span className="font-bold text-indigo-300 block">Chef’s Tasting Fact:</span>
                    <p className="text-slate-300 leading-relaxed">{curQ.fact}</p>
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextTriviaQuestion}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
                      >
                        <span>Next Question (Pass Phone)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TAB 4: WHO PAYS THE BILL? ROULETTE                          */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'billRoulette' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {tableLabel} High-Stakes Wheel
                </span>
                <h4 className="font-serif font-black text-xl text-white">Who Pays The Bill?</h4>
                <p className="text-xs text-slate-400">Add everyone sitting at your table &amp; spin the wheel to seal your destiny!</p>
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
                  {/* Pointer Needle */}
                  <div className="absolute -top-3 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-400 filter drop-shadow-md" />

                  {/* Spinning Disc */}
                  <div
                    style={{
                      transform: `rotate(${wheelRotation}deg)`,
                      transition: isSpinning ? 'transform 3.8s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
                    }}
                    className="w-full h-full rounded-full border-4 border-amber-400/80 shadow-2xl relative overflow-hidden bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-900"
                  >
                    {/* Slices representation */}
                    {rouletteGuests.map((guest, idx) => {
                      const angle = (360 / rouletteGuests.length) * idx;
                      const sliceColors = ['#E11D48', '#D97706', '#2563EB', '#059669', '#7C3AED', '#DB2777'];
                      const col = sliceColors[idx % sliceColors.length];

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

                    {/* Wheel Center Button */}
                    <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-slate-950 flex items-center justify-center font-black text-slate-950 text-xs shadow-xl z-10">
                      MENUZ
                    </div>
                  </div>
                </div>

                {/* Spin Button */}
                <button
                  type="button"
                  disabled={isSpinning}
                  onClick={spinTheWheel}
                  className={`px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-xl flex items-center space-x-2 cursor-pointer ${
                    isSpinning
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:brightness-110 active:scale-95 text-white hover:shadow-orange-500/25'
                  }`}
                >
                  <Dices className="w-5 h-5" />
                  <span>{isSpinning ? 'SPINNING WHEEL...' : 'SPIN THE TABLE WHEEL!'}</span>
                </button>
              </div>

              {/* Winner Result Card */}
              {rouletteWinner && (
                <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-transparent border-2 border-amber-400 text-center space-y-2 animate-bounce">
                  <span className="text-3xl">{rouletteWinner.consequence.icon}</span>
                  <h4 className="font-serif font-black text-xl text-white">
                    🎯 <span className="text-amber-300 uppercase underline">{rouletteWinner.guest}</span>
                  </h4>
                  <p className="text-sm font-bold text-amber-200">
                    {rouletteWinner.consequence.text}
                  </p>
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
                    {rouletteWinner.consequence.tag}
                  </span>
                </div>
              )}

              {/* History */}
              {spinHistory.length > 0 && (
                <div className="p-3 bg-slate-900/60 rounded-2xl border border-white/[0.04] space-y-2 text-xs">
                  <span className="font-bold text-slate-400 uppercase text-[10px] block">Table Spin History</span>
                  <div className="space-y-1">
                    {spinHistory.map((h, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                        <span className="font-bold text-white">{h.guest}</span>
                        <span className="text-slate-300 text-[11px] truncate max-w-[200px]">{h.consequence}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{h.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default TableArcadeModal;
