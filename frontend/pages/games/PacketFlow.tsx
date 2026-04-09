import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from "../../components/ui/Container";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/cn";
import { 
  RotateCcw, Info, Trophy, ArrowRight, Lock, 
  Cpu, HardDrive, Wifi, Zap, Maximize2, RefreshCw,
  CheckCircle2
} from "lucide-react";
import confetti from 'canvas-confetti';

// --- Game Logic & Types ---

type NodeType = 'empty' | 'straight' | 'corner' | 't-shape' | 'cross' | 'source' | 'target' | 'block';
type Direction = 'up' | 'right' | 'down' | 'left';

interface GridNodeData {
  id: string;
  type: NodeType;
  rotation: number; // 0, 90, 180, 270
  active: boolean; // Is it receiving power?
  locked?: boolean; // Can player rotate it?
}

const GRID_SIZE = 5;

// --- Levels Configuration ---
const LEVELS = [
  {
    id: 1,
    name: "Initialize Uplink",
    hint: "Establish a direct connection to the mainframe.",
    par: 3,
    layout: [
      ['source', 'straight', 'straight', 'corner', 'empty'],
      ['empty', 'empty', 'empty', 'straight', 'empty'],
      ['empty', 'empty', 'empty', 'target', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
    ],
    // Target at 3-2 needs to face Up (receives from Top), so we rotate 90 deg.
    // (Rot 0 = Port Left. Rot 90 = Port Up. Rot 180 = Port Right. Rot 270 = Port Down)
    fixedRotations: { '3-2': 90 }
  },
  {
    id: 2,
    name: "Firewall Bypass",
    hint: "Navigate around the security blocks.",
    par: 5,
    layout: [
      ['source', 'corner', 'empty', 'empty', 'empty'],
      ['empty', 'straight', 'block', 'block', 'empty'],
      ['empty', 'corner', 'straight', 'corner', 'empty'],
      ['empty', 'empty', 'empty', 'straight', 'empty'],
      ['empty', 'empty', 'empty', 'target', 'empty'],
    ],
    // Target at 3-4 needs to face Up.
    fixedRotations: { '3-4': 90 }
  },
  {
    id: 3,
    name: "Load Balancing",
    hint: "Split the stream to stabilize the core.",
    par: 8,
    layout: [
      ['source', 't-shape', 'corner', 'empty', 'empty'],
      ['empty', 'straight', 'block', 'empty', 'empty'],
      ['empty', 'corner', 'straight', 't-shape', 'target'],
      ['empty', 'empty', 'empty', 'straight', 'empty'],
      ['empty', 'empty', 'empty', 'block', 'empty'],
    ],
    // Target at 4-2 needs to face Left (receives from Right? No, previous is 3-2 T-shape).
    // Path: ... -> (3,2) -> (4,2). 
    // Flow enters (4,2) from Left.
    // Target Rot 0 = Port Left. So it accepts input from Left. Correct.
    fixedRotations: { '4-2': 0 }
  },
  {
    id: 4,
    name: "The Mesh",
    hint: "Complex routing required.",
    par: 12,
    layout: [
      ['source', 't-shape', 'straight', 't-shape', 'empty'],
      ['empty', 'cross', 'block', 'straight', 'empty'],
      ['empty', 'corner', 'cross', 'corner', 'empty'],
      ['empty', 'block', 'straight', 'block', 'empty'],
      ['empty', 'empty', 'target', 'empty', 'empty'],
    ],
    // Target at 2-4 needs to face Up.
    fixedRotations: { '2-4': 90 }
  }
];

// --- Helpers ---

const hasPort = (type: NodeType, rotation: number, dir: Direction): boolean => {
  const r = rotation % 360;
  const dirMap = { up: 0, right: 1, down: 2, left: 3 };
  const targetDirIndex = dirMap[dir];
  // Calculate which side of the unrotated piece we are trying to enter
  const localDirIndex = (targetDirIndex - (r / 90) + 4) % 4;
  const localDir = ['up', 'right', 'down', 'left'][localDirIndex];

  switch (type) {
    case 'straight': return localDir === 'left' || localDir === 'right';
    case 'corner': return localDir === 'left' || localDir === 'down';
    case 't-shape': return localDir === 'left' || localDir === 'down' || localDir === 'right';
    case 'cross': return true;
    case 'source': return localDir === 'right'; 
    case 'target': return localDir === 'left';
    default: return false;
  }
};

const getNeighbor = (x: number, y: number, dir: Direction) => {
  if (dir === 'up') return { x, y: y - 1 };
  if (dir === 'right') return { x: x + 1, y };
  if (dir === 'down') return { x, y: y + 1 };
  if (dir === 'left') return { x: x - 1, y };
  return { x, y };
};

const getOpposite = (dir: Direction): Direction => {
  if (dir === 'up') return 'down';
  if (dir === 'right') return 'left';
  if (dir === 'down') return 'up';
  return 'right';
};

// --- High Fidelity Visual Components ---

const CircuitPattern = () => (
  <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
    <path d="M0 10h20M10 0v20" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.1" />
    <rect x="9" y="9" width="2" height="2" fill="currentColor" fillOpacity="0.2" />
  </pattern>
);

const NodeVisual = ({ type, active, rotation, locked }: { type: NodeType, active: boolean, rotation: number, locked?: boolean }) => {
  // Theme-aware colors
  // Light Mode: Technical Blue/Grey. Dark Mode: Neon Cyan/Green.
  const activeColor = active 
    ? "text-brand-600 dark:text-brand-400 drop-shadow-[0_0_8px_rgba(14,219,160,0.6)]" 
    : "text-slate-400/40 dark:text-slate-700";
  
  const coreColor = active ? "fill-brand-500" : "fill-slate-400/20 dark:fill-slate-800";
  
  return (
    <motion.div 
      className="w-full h-full flex items-center justify-center relative p-1"
      animate={{ rotate: rotation }}
      transition={{ type: "spring", stiffness: 180, damping: 15 }}
    >
      <svg viewBox="0 0 100 100" className={cn("w-full h-full transition-colors duration-500", activeColor)}>
        <defs>
          <linearGradient id="pipe-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* --- PIPES --- */}
        {type === 'straight' && (
          <g>
            {/* Base Track */}
            <path d="M0 50 L100 50" stroke="currentColor" strokeWidth="16" strokeLinecap="butt" opacity="0.2" />
            {/* Inner Detail */}
            <path d="M0 45 L100 45 M0 55 L100 55" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            {/* Active Core */}
            <motion.path 
              d="M0 50 L100 50" 
              stroke="currentColor" 
              strokeWidth="6" 
              initial={false}
              animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
              transition={{ duration: 0.4, ease: "circOut" }}
            />
          </g>
        )}

        {type === 'corner' && (
          <g>
             <path d="M0 50 Q50 50 50 100" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="butt" opacity="0.2" />
             <path d="M0 44 Q56 44 56 100 M0 56 Q44 56 44 100" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
             <motion.path 
                d="M0 50 Q50 50 50 100" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="6"
                initial={false}
                animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
                transition={{ duration: 0.4, ease: "circOut" }}
             />
             {/* Corner Reinforcement */}
             <circle cx="50" cy="50" r="12" className={coreColor} opacity="0.5" />
          </g>
        )}

        {type === 't-shape' && (
           <g>
             <path d="M0 50 L100 50 M50 50 L50 100" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="butt" opacity="0.2" />
             <circle cx="50" cy="50" r="14" className={coreColor} opacity="0.3" />
             <motion.path 
                d="M0 50 L100 50 M50 50 L50 100" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="6"
                initial={false}
                animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
                transition={{ duration: 0.4, ease: "circOut" }}
             />
           </g>
        )}

        {type === 'cross' && (
           <g>
             <path d="M0 50 L100 50 M50 0 L50 100" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="butt" opacity="0.2" />
             <rect x="35" y="35" width="30" height="30" rx="4" className={coreColor} opacity="0.3" />
             <motion.path 
                d="M0 50 L100 50 M50 0 L50 100" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="6"
                initial={false}
                animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
                transition={{ duration: 0.4, ease: "circOut" }}
             />
           </g>
        )}

        {/* --- TERMINALS --- */}
        {type === 'source' && (
           <g filter={active ? "url(#glow)" : ""}>
             {/* Base Plate */}
             <rect x="10" y="10" width="80" height="80" rx="12" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
             {/* Tech Details */}
             <rect x="20" y="20" width="10" height="10" fill="currentColor" fillOpacity="0.4" />
             <rect x="20" y="70" width="10" height="10" fill="currentColor" fillOpacity="0.4" />
             <path d="M40 20 L80 20 L80 80 L40 80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
             {/* Output Port */}
             <path d="M80 50 L100 50" stroke="currentColor" strokeWidth="12" />
             {/* Core Icon */}
             <foreignObject x="30" y="30" width="40" height="40">
                <div className="w-full h-full flex items-center justify-center text-current">
                   <Cpu size={32} />
                </div>
             </foreignObject>
             {/* Pulse Ring */}
             {active && (
               <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5">
                 <animate attributeName="r" values="30;40;30" dur="2s" repeatCount="indefinite" />
                 <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
               </circle>
             )}
           </g>
        )}

        {type === 'target' && (
           <g filter={active ? "url(#glow)" : ""}>
             <rect x="10" y="10" width="80" height="80" rx="12" fill="currentColor" fillOpacity={active ? 0.2 : 0.05} stroke="currentColor" strokeWidth="2" strokeDasharray={active ? "none" : "4 4"} />
             <path d="M0 50 L20 50" stroke="currentColor" strokeWidth="12" />
             
             {/* Server Rack Lines */}
             <rect x="30" y="25" width="40" height="6" rx="2" fill="currentColor" fillOpacity="0.5" />
             <rect x="30" y="38" width="40" height="6" rx="2" fill="currentColor" fillOpacity="0.5" />
             <rect x="30" y="51" width="40" height="6" rx="2" fill="currentColor" fillOpacity="0.5" />
             <rect x="30" y="64" width="40" height="6" rx="2" fill="currentColor" fillOpacity="0.5" />

             {/* Indicator Light */}
             <circle cx="75" cy="20" r="4" fill={active ? "#10B981" : "#EF4444"} />
           </g>
        )}

        {type === 'block' && (
           <g>
             <rect x="15" y="15" width="70" height="70" rx="8" fill="url(#circuit)" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" fillOpacity="0.1" />
             <path d="M25 25 L75 75 M75 25 L25 75" stroke="currentColor" strokeWidth="2" opacity="0.2" />
             <rect x="35" y="35" width="30" height="30" rx="4" fill="currentColor" fillOpacity="0.1" />
           </g>
        )}
      </svg>
      
      {/* Lock Indicator */}
      {locked && type !== 'empty' && (
         <div className="absolute top-1 right-1 text-[8px] sm:text-[10px] text-muted/50 dark:text-slate-600">
           <Lock size="1em" />
         </div>
      )}
    </motion.div>
  );
};

// --- Main Game Component ---

export default function PacketFlow() {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [grid, setGrid] = useState<GridNodeData[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'complete'>('playing');
  const [lastActiveCount, setLastActiveCount] = useState(0);

  // Initialize Level
  useEffect(() => {
    loadLevel(currentLevelIdx);
  }, [currentLevelIdx]);

  const loadLevel = (idx: number) => {
    const level = LEVELS[idx];
    if (!level) {
      setGameState('complete');
      return;
    }

    const newGrid: GridNodeData[] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const type = level.layout[y][x] as NodeType;
        const isLocked = type === 'source' || type === 'target' || type === 'block' || type === 'empty';
        
        // --- ROTATION LOGIC ---
        let rotation = 0;
        
        // Check for specific fixed rotation for this coordinate (used for Source/Target solvability)
        const fixedRot = (level as any).fixedRotations?.[`${x}-${y}`];
        
        if (fixedRot !== undefined) {
           rotation = fixedRot;
        } else if (!isLocked) {
           // Randomize playable pieces
           rotation = Math.floor(Math.random() * 4) * 90;
        } else {
           // Default 0 for blocks/empty
           rotation = 0;
        }

        newGrid.push({
          id: `${x}-${y}`,
          type,
          rotation,
          active: type === 'source', // Source starts active
          locked: isLocked
        });
      }
    }
    
    setGrid(newGrid);
    setMoves(0);
    setGameState('playing');
    
    // Initial Trace
    setTimeout(() => updateFlow(newGrid), 100); 
  };

  const handleRotate = (index: number) => {
    if (gameState !== 'playing') return;
    const node = grid[index];
    
    if (node.locked) {
      return;
    }

    const newGrid = [...grid];
    newGrid[index] = { ...node, rotation: (node.rotation + 90) % 360 };
    setGrid(newGrid);
    setMoves(m => m + 1);
    updateFlow(newGrid);
  };

  // The "Engine" - Trace the path
  const updateFlow = (currentGrid: GridNodeData[]) => {
    // Reset active states
    const resetGrid = currentGrid.map(n => ({
      ...n,
      active: n.type === 'source'
    }));

    const sourceIdx = resetGrid.findIndex(n => n.type === 'source');
    if (sourceIdx === -1) return;

    const queue = [sourceIdx];
    const visited = new Set([sourceIdx]);
    let targetReached = false;
    let activeCount = 1;

    while (queue.length > 0) {
      const currIdx = queue.shift()!;
      const currNode = resetGrid[currIdx];
      const cx = currIdx % GRID_SIZE;
      const cy = Math.floor(currIdx / GRID_SIZE);

      const directions: Direction[] = ['up', 'right', 'down', 'left'];

      for (const dir of directions) {
        if (hasPort(currNode.type, currNode.rotation, dir)) {
          const { x: nx, y: ny } = getNeighbor(cx, cy, dir);
          
          if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
            const neighborIdx = ny * GRID_SIZE + nx;
            const neighborNode = resetGrid[neighborIdx];

            if (!visited.has(neighborIdx) && neighborNode.type !== 'empty' && neighborNode.type !== 'block') {
               const incomingDir = getOpposite(dir);
               if (hasPort(neighborNode.type, neighborNode.rotation, incomingDir)) {
                 resetGrid[neighborIdx].active = true;
                 visited.add(neighborIdx);
                 queue.push(neighborIdx);
                 activeCount++;

                 if (neighborNode.type === 'target') {
                   targetReached = true;
                 }
               }
            }
          }
        }
      }
    }

    setGrid(resetGrid);
    setLastActiveCount(activeCount);

    if (targetReached && gameState !== 'won') {
      setGameState('won');
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#0EDBA0', '#25F5B5', '#ffffff'],
        disableForReducedMotion: true
      });
    }
  };

  return (
    <main className="min-h-screen bg-bg pt-24 pb-20 text-text font-sans selection:bg-brand-500/30 overflow-hidden relative transition-colors duration-500">
      
      {/* Background Tech Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.08] pointer-events-none"
           style={{
             backgroundImage: `
               linear-gradient(currentColor 1px, transparent 1px), 
               linear-gradient(90deg, currentColor 1px, transparent 1px)
             `,
             backgroundSize: '60px 60px',
             maskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)'
           }}
      />
      
      {/* Accent Blurs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2" />

      <Container className="relative z-10 max-w-5xl">
        
        {/* Header HUD */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-2">
              <Zap size={16} fill="currentColor" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Network Operations</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text font-mono">
              PACKET<span className="text-brand-600 dark:text-brand-500">FLOW</span>
            </h1>
            <p className="mt-2 text-muted font-mono text-sm max-w-md">
               Restoring uplink connectivity via neural mesh re-routing.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-card border border-border p-4 rounded-xl min-w-[120px] shadow-sm">
               <div className="text-xs text-muted uppercase tracking-widest mb-1 flex items-center gap-1"><HardDrive size={10}/> Level</div>
               <div className="text-2xl font-bold text-text font-mono">0{currentLevelIdx + 1}</div>
            </div>
            <div className="bg-card border border-border p-4 rounded-xl min-w-[120px] shadow-sm">
               <div className="text-xs text-muted uppercase tracking-widest mb-1 flex items-center gap-1"><RefreshCw size={10}/> Moves</div>
               <div className="text-2xl font-bold text-brand-600 dark:text-brand-400 font-mono">{moves}</div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Puzzle Board */}
          <div className="lg:col-span-8">
             <div className="aspect-square bg-card/50 dark:bg-[#0A0F1E] border border-border rounded-3xl relative p-6 shadow-2xl backdrop-blur-sm overflow-hidden group">
                
                {/* Board Decoration */}
                <div className="absolute top-4 left-4 text-[10px] font-mono text-muted/30">SYS.GRID.V4</div>
                <div className="absolute bottom-4 right-4 text-[10px] font-mono text-muted/30">STATUS: {gameState === 'playing' ? 'OFFLINE' : 'ONLINE'}</div>
                <div className="absolute top-4 right-4"><Wifi size={16} className={cn("transition-colors", gameState === 'won' ? "text-brand-500" : "text-muted/20")} /></div>

                {/* Completion Overlay */}
                <AnimatePresence>
                  {gameState === 'won' && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-50 bg-bg/90 dark:bg-black/80 flex flex-col items-center justify-center rounded-3xl backdrop-blur-md"
                    >
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="p-4 rounded-full bg-brand-500/10 text-brand-500 mb-6 ring-1 ring-brand-500/50 shadow-[0_0_30px_rgba(14,219,160,0.3)]"
                      >
                         <Trophy size={48} />
                      </motion.div>
                      
                      <h2 className="text-4xl font-bold text-text mb-2 tracking-tight">System Restored</h2>
                      <p className="text-muted mb-10 font-mono text-sm">Throughput: 100% | Latency: 1ms</p>
                      
                      <Button 
                        onClick={() => {
                           if (currentLevelIdx < LEVELS.length - 1) {
                             setCurrentLevelIdx(c => c + 1);
                           } else {
                             setGameState('complete');
                           }
                        }}
                        className="px-10 py-6 text-lg h-auto rounded-xl shadow-xl shadow-brand-500/20"
                      >
                         {currentLevelIdx < LEVELS.length - 1 ? "Initialize Next Node" : "Finish Sequence"} <ArrowRight size={20} className="ml-2" />
                      </Button>
                    </motion.div>
                  )}

                  {gameState === 'complete' && (
                     <motion.div 
                       initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                       className="absolute inset-0 z-50 bg-bg/95 flex flex-col items-center justify-center rounded-3xl"
                     >
                        <CheckCircle2 size={80} className="text-brand-500 mb-6" />
                        <h2 className="text-4xl font-bold text-text mb-6">All Systems Operational</h2>
                        <Button href="/dashboard" variant="secondary" className="px-8">Return to Dashboard</Button>
                     </motion.div>
                  )}
                </AnimatePresence>

                {/* The Grid */}
                <div 
                  className="w-full h-full grid gap-2 sm:gap-3"
                  style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
                >
                  {grid.map((node, i) => (
                    <div 
                      key={node.id} 
                      onClick={() => handleRotate(i)}
                      className={cn(
                        "relative rounded-xl transition-all duration-300 flex items-center justify-center overflow-hidden border",
                        node.type === 'empty' 
                          ? "border-transparent" 
                          : "bg-card border-border shadow-sm",
                        // Interactive States
                        !node.locked && node.type !== 'empty' && "cursor-pointer hover:border-brand-500/50 hover:shadow-md hover:bg-card/80 active:scale-95",
                        // Active State Styling
                        node.active && node.type !== 'source' && node.type !== 'target' && "border-brand-500/30 bg-brand-500/5"
                      )}
                    >
                       {node.type !== 'empty' && (
                         <NodeVisual 
                           type={node.type} 
                           active={node.active} 
                           rotation={node.rotation} 
                           locked={node.locked} 
                         />
                       )}
                    </div>
                  ))}
                </div>

             </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
             
             {/* Mission Card */}
             <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-4">
                   <Info size={18} />
                   <span className="font-bold uppercase text-xs tracking-widest">Mission Brief</span>
                </div>
                <h3 className="text-xl font-bold text-text mb-2">{LEVELS[currentLevelIdx]?.name}</h3>
                <p className="text-muted text-sm leading-relaxed mb-6">
                   {LEVELS[currentLevelIdx]?.hint}
                </p>

                <div className="h-px bg-border w-full mb-6" />

                <div className="space-y-3 text-sm">
                   <div className="flex justify-between items-center text-muted">
                      <span>Connection Status</span>
                      <span className={cn("font-bold px-2 py-0.5 rounded text-xs uppercase", gameState === 'playing' ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500" : "bg-green-500/10 text-green-600 dark:text-green-500")}>
                        {gameState === 'playing' ? "Disconnected" : "Secure"}
                      </span>
                   </div>
                   <div className="flex justify-between items-center text-muted">
                      <span>Signal Integrity</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted/20 rounded-full overflow-hidden">
                          <motion.div 
                             className="h-full bg-brand-500" 
                             initial={{ width: 0 }}
                             animate={{ width: `${(lastActiveCount / (grid.length || 1) * 100)}%` }}
                          />
                        </div>
                        <span className="font-mono text-text">{(lastActiveCount / (grid.length || 1) * 100).toFixed(0)}%</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Legend */}
             <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                 <div className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Component Legend</div>
                 <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted">
                       <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center"><Cpu size={14}/></div>
                       <span><strong>Source:</strong> Data Origin (Fixed)</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted">
                       <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center"><HardDrive size={14}/></div>
                       <span><strong>Target:</strong> Mainframe (Fixed)</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted">
                       <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center"><Lock size={14}/></div>
                       <span><strong>Locked:</strong> Cannot be rotated</span>
                    </div>
                 </div>
             </div>
             
             <Button 
               variant="secondary" 
               onClick={() => loadLevel(currentLevelIdx)}
               className="w-full justify-center h-12"
             >
                <RotateCcw size={16} className="mr-2" /> Reset Simulation
             </Button>
          </div>

        </div>

      </Container>
    </main>
  );
}