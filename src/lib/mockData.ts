import { 
  ExaminerPersona, 
  MaterialAnalysis, 
  Question, 
  AnswerEvaluation, 
  FinalReportData, 
  TopicMastery, 
  AnswerRecord, 
  ExaminerPersonaId,
  PressureIntensity
} from './types';

export const EXAMINER_PERSONAS: Record<ExaminerPersonaId, ExaminerPersona> = {
  professor: {
    id: 'professor',
    name: 'Prof. Alistair Vance',
    title: 'Department Chair & Senior Fellow',
    avatarSeed: 'vance',
    description: 'Pedantic, academically rigorous, and obsessed with first principles. Dislikes buzzwords and hand-waving.',
    vibe: 'Analytical, formal, uncompromising precision',
    tagline: 'Define your axioms or concede the argument.'
  },
  interviewer: {
    id: 'interviewer',
    name: 'Devon Shaw',
    title: 'Principal Staff Engineer',
    avatarSeed: 'shaw',
    description: 'Silicon Valley systems architect. Cuts through theory to demand real-world trade-offs, failure modes, and scale limits.',
    vibe: 'Sharp, pragmatic, high-tempo technical drill',
    tagline: 'Theory is cute. What breaks when 100k nodes drop?'
  },
  ruthless: {
    id: 'ruthless',
    name: 'The Inquisitor',
    title: 'Autonomous Defense Examiner',
    avatarSeed: 'inquisitor',
    description: 'Cold, hyper-rational, and completely unsympathetic. Weaponizes your own notes to expose every implicit assumption.',
    vibe: 'Merciless, relentless, psychological pressure',
    tagline: 'Your notes are riddled with blind spots. Let us illuminate them.'
  }
};

export interface DemoPreset {
  id: string;
  title: string;
  subject: string;
  subtitle: string;
  badge: string;
  content: string;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'distributed-systems',
    title: 'Distributed Systems & Raft Consensus',
    subject: 'Distributed Computing',
    subtitle: 'Leader election, log replication, split-brain quorum & Byzantine faults',
    badge: 'High Yield',
    content: `# Distributed Systems & Raft Consensus Protocol

## 1. Overview & Problem Definition
A distributed consensus algorithm allows a cluster of state machines to agree on a sequence of state transitions (a replicated log) despite network delays, packet loss, and node crashes. Raft achieves this by decomposing consensus into three orthogonal subproblems:
- Leader Election: Ensuring exactly one active leader per term.
- Log Replication: The leader accepts client entries and forces follower logs to match.
- Safety: Guaranteeing that if any server applied a log entry at a given index, no other server will ever apply a different entry for that index.

## 2. Server Roles & Term Progression
Nodes exist in one of three states: Follower, Candidate, or Leader.
- Followers are passive; they only respond to RPCs from candidates and leaders. If an election timeout elapses without receiving a heartbeat (AppendEntries RPC), the follower assumes the leader has failed, increments its currentTerm, transitions to Candidate, and broadcasts RequestVote RPCs.
- Randomized election timeouts (typically 150ms–300ms) prevent split votes by ensuring one candidate almost always initiates an election before others.
- Quorum requirement: A candidate becomes leader if and only if it receives votes from a strict majority (floor(N/2) + 1) of cluster nodes.

## 3. Log Replication & Commit Index
- The leader appends incoming client commands as new entries in its log with its current term and an index.
- It broadcasts AppendEntries RPCs to all peers.
- When an entry is replicated on a majority of nodes, the leader updates its commitIndex and applies the entry to its state machine.
- Log Matching Property: If two logs contain an entry with the same index and term, they are identical in all entries up through the given index.

## 4. Raft Safety Invariant: Election Restriction
- To preserve safety without needing to replay or roll forward uncommitted entries from previous leaders, Raft guarantees that a leader's log always contains all committed entries.
- The RequestVote RPC includes candidate's lastLogIndex and lastLogTerm.
- A voter denies its vote if the candidate's log is less up-to-date than the voter's own log:
  1. If terms differ, the candidate with the higher lastLogTerm is more up-to-date.
  2. If terms are equal, the candidate with the longer log (higher lastLogIndex) is more up-to-date.

## 5. Network Partitions & Split-Brain Mitigation
- In a 5-node cluster (A, B, C, D, E), if a network partition isolates (A, B) from (C, D, E):
  - A and B cannot form a quorum (2 < 3). A leader in {A, B} cannot commit new entries.
  - C, D, and E have 3 nodes, elect a new leader with a higher term, and commit client writes safely.
  - When the partition heals, nodes A and B receive AppendEntries with the higher term, step down, and overwrite uncommitted diverging log entries with the majority leader's log.`
  },
  {
    id: 'transformers-llm',
    title: 'Transformers & Self-Attention Mechanics',
    subject: 'Deep Learning & NLP',
    subtitle: 'Scaled dot-product, multi-head projections, positional encoding, and KV caching',
    badge: 'AI Core',
    content: `# Transformers & Self-Attention Mechanics

## 1. Architectural Motivation
Prior sequence models (RNNs, LSTMs) processed tokens sequentially, creating an O(N) sequential computational dependency that prevented parallelization during training and suffered from gradient degradation over long context windows. The Transformer architecture replaces recurrent connections entirely with attention mechanisms.

## 2. Scaled Dot-Product Attention
Given input sequence representations X in R^(N x d_model), projections produce Queries (Q), Keys (K), and Values (V):
  Q = X * W_Q,  K = X * W_K,  V = X * W_V
Attention weights are calculated as:
  Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V

- The scaling factor 1 / sqrt(d_k) is critical: for large projection dimensions d_k, the dot products grow large in magnitude, pushing the softmax function into regions with extremely small gradients (vanishing gradients).
- Self-attention computational complexity is O(N^2 * d_model), quadratic with sequence length N.

## 3. Multi-Head Attention (MHA)
Rather than performing a single attention function with d_model-dimensional queries, keys, and values, MHA linearly projects Q, K, and V h times with distinct learned parameter matrices:
  MultiHead(Q, K, V) = Concat(head_1, ..., head_h) * W_O
where head_i = Attention(Q * W_Q_i, K * W_K_i, V * W_V_i).
This allows the model to jointly attend to information from different representation subspaces at different positions.

## 4. Positional Encodings
Because attention is permutation-equivariant (it has no inherent notion of sequence order), positional information must be injected:
- Sinusoidal encodings: deterministic frequencies based on sine and cosine functions.
- Rotary Position Embeddings (RoPE): encodes relative position by rotating the query and key representations in the complex plane, allowing dot-product attention to naturally capture relative distance.

## 5. KV Caching in Autoregressive Inference
During autoregressive decoding (generating token by token):
- In naive generation, all previous tokens are re-processed at every step, causing redundant O(N^3) total compute.
- KV Caching stores the computed Key and Value tensors for all previous tokens in memory. Only the current single token is projected into a Query, which attends across the cached Keys and Values in O(N) per step.`
  },
  {
    id: 'os-memory-concurrency',
    title: 'Operating Systems: Virtual Memory & Concurrency',
    subject: 'Computer Systems',
    subtitle: 'Page tables, TLB shootdown, Peterson algorithm, cache coherency & atomics',
    badge: 'Systems',
    content: `# Operating Systems: Virtual Memory & Concurrency

## 1. Virtual Memory Architecture
Virtual memory provides each process with the illusion of a contiguous, private address space, isolating processes from one another and abstracting physical RAM limitations.
- Paging divides virtual memory into fixed-size units (pages, typically 4KB) and physical memory into page frames.
- Multi-level Page Tables (e.g., 4-level paging on x86-64: PML4, PDP, PD, PT) prevent allocating memory for unused regions of sparse address spaces.
- Translation Lookaside Buffer (TLB): A hardware cache of recent virtual-to-physical address translations.
- TLB Shootdown: When a page table entry is modified on a multi-core system (e.g., unmapping memory), an inter-processor interrupt (IPI) must be sent to flush stale TLB entries across other CPU cores.

## 2. Page Fault Handling Lifecycle
1. The CPU attempts an instruction referencing virtual address V.
2. MMU checks TLB (miss) and walks page tables.
3. If the Present bit in the Page Table Entry (PTE) is 0, the CPU triggers hardware interrupt #14 (Page Fault Exception), saving CR2 register with the faulting address.
4. OS kernel inspects the address in the process Virtual Memory Area (VMA) tree.
5. If valid, the OS allocates a physical frame, reads the missing page from backing disk/swap, updates the PTE (Present=1, frame number), flushes the local TLB, and resumes the faulting instruction.

## 3. Concurrency, Race Conditions & Synchronization
A race condition occurs when multiple threads concurrently access shared state with at least one write, and the outcome depends on thread scheduling.
- Critical Section: Code accessing shared mutable state requiring mutual exclusion.
- Atomicity: An operation appears to occur instantaneously with respect to other threads. Modern CPUs provide atomic instructions (e.g., LOCK CMPXCHG).

## 4. Deadlock Necessary Conditions (Coffman Conditions)
A deadlock can occur if and only if all four conditions hold simultaneously:
1. Mutual Exclusion: At least one resource is held in a non-shareable mode.
2. Hold and Wait: A thread holds a resource while waiting to acquire another.
3. No Preemption: Resources cannot be forcibly taken from a thread.
4. Circular Wait: A closed chain of threads exists where each holds a resource requested by the next.

Eliminating Circular Wait is most commonly achieved by imposing a strict global ordering on resource acquisition.`
  }
];

export function getMockAnalysis(notesContent: string, subjectTitle?: string): MaterialAnalysis {
  let detectedSubject = subjectTitle || 'Advanced Computer Systems';
  let concepts = [
    { topic: 'Consensus Protocols', summary: 'Quorum formation, election timeouts, and state machine replication', importance: 'high' as const },
    { topic: 'Log Matching & Commit Safety', summary: 'Rules governing log consistency and safe commitment without rollback', importance: 'high' as const },
    { topic: 'Partition Tolerances', summary: 'Split-brain mitigation and asymmetric network partitions', importance: 'medium' as const },
    { topic: 'Election Restrictions', summary: 'Up-to-date invariants that prevent uncommitted leaders from wiping state', importance: 'high' as const },
  ];

  if (notesContent.toLowerCase().includes('transformer') || notesContent.toLowerCase().includes('attention')) {
    detectedSubject = subjectTitle || 'Deep Learning & Attention';
    concepts = [
      { topic: 'Self-Attention Mechanics', summary: 'Query, Key, Value projections and scaled dot-product attention', importance: 'high' as const },
      { topic: 'Multi-Head Attention', summary: 'Representation subspace projections and parallel attention heads', importance: 'high' as const },
      { topic: 'Positional Encodings', summary: 'RoPE and sinusoidal frequency embeddings for order preservation', importance: 'medium' as const },
      { topic: 'KV Caching & Generation', summary: 'Autoregressive inference optimization and memory bandwidth bottlenecks', importance: 'high' as const },
    ];
  } else if (notesContent.toLowerCase().includes('memory') || notesContent.toLowerCase().includes('concurrency')) {
    detectedSubject = subjectTitle || 'Operating Systems Architecture';
    concepts = [
      { topic: 'Paging & Address Translation', summary: 'Multi-level page tables, TLB shootdowns, and hardware page walks', importance: 'high' as const },
      { topic: 'Page Fault Lifecycle', summary: 'PTE present bits, CR2 traps, swap in, and execution resumption', importance: 'high' as const },
      { topic: 'Concurrency & Atomics', summary: 'Race conditions, compare-and-swap, and cache coherency', importance: 'high' as const },
      { topic: 'Deadlock & Coffman Rules', summary: 'Circular wait prevention and resource acquisition ordering', importance: 'medium' as const },
    ];
  }

  return {
    subject: detectedSubject,
    coreConcepts: concepts,
    examinableGaps: [
      'Subtle edge-case divergence between theoretical invariance and real-world failure modes',
      'Implicit assumptions regarding network delivery latency and memory ordering',
      'Distinction between necessary vs sufficient conditions in core theorems'
    ],
    estimatedDifficulty: 'applied',
    examinerIntro: `I have thoroughly dissected your submission on "${detectedSubject}". You have recorded the standard definitions, but true comprehension requires defending them against surgical counter-examples. Let us see if your knowledge withstands rigorous cross-examination.`
  };
}

export function generateMockQuestion(
  topics: string[], 
  difficulty: 'foundation' | 'applied' | 'expert', 
  targetTopic: string, 
  questionIndex: number,
  persona: ExaminerPersonaId
): Question {
  const chosenTopic = targetTopic || topics[questionIndex % topics.length] || 'Core Mechanics';

  if (chosenTopic.includes('Attention') || chosenTopic.includes('Transformer')) {
    if (difficulty === 'foundation') {
      return {
        id: `q-${questionIndex + 1}`,
        topic: chosenTopic,
        type: 'mcq',
        difficulty: 'foundation',
        question: 'Why does scaled dot-product attention divide the product (Q * K^T) by the square root of d_k?',
        options: [
          'To ensure that the attention matrix is strictly symmetric',
          'To counteract dot-products growing excessively large, which pushes softmax into vanishing-gradient regions',
          'To eliminate the computational quadratic complexity O(N^2)',
          'To convert continuous values into discrete probabilistic integers'
        ],
        correctAnswer: 'To counteract dot-products growing excessively large, which pushes softmax into vanishing-gradient regions',
        explanation: 'For large values of d_k, dot products grow large in magnitude, pushing the softmax function into regions where gradients are infinitesimally small. Scaling by 1/sqrt(d_k) preserves unit variance.',
        misconception: 'Assuming the scaling factor is for normalization of token sequence length rather than vector projection dimensionality variance.',
        examinerLine: 'A trivial entry question. Let us ensure your baseline intuition is not corrupted.'
      };
    } else if (difficulty === 'applied') {
      return {
        id: `q-${questionIndex + 1}`,
        topic: chosenTopic,
        type: 'true_false',
        difficulty: 'applied',
        question: 'In autoregressive generation, KV caching stores the Query vectors of previous tokens to prevent redundant self-attention calculations.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'KV caching stores Key and Value vectors, NOT Query vectors. In autoregressive decoding, only the newly generated token produces a Query vector, which then attends against the cached Keys and Values.',
        misconception: 'Believing that Query representations are cached across generation steps, when only K and V are reused.',
        examinerLine: 'Read carefully. Engineers who confuse their Q, K, and V projections deploy memory leaks.'
      };
    } else {
      return {
        id: `q-${questionIndex + 1}`,
        topic: chosenTopic,
        type: 'short_answer',
        difficulty: 'expert',
        question: 'Explain why Rotary Position Embedding (RoPE) preserves relative distance properties in the self-attention dot product without altering the sequence length complexity.',
        options: [],
        correctAnswer: 'RoPE applies an orthogonal rotation matrix to Query and Key vectors in the complex plane such that their inner product depends purely on relative offset (m - n), preserving relative positions mathematically.',
        explanation: 'RoPE decomposes vectors into 2D chunks and rotates each by an angle proportional to position. Because the inner product between rotated vectors satisfies (R_m * q)^T * (R_n * k) = q^T * R_(n-m) * k, the attention score naturally reflects relative distance.',
        misconception: 'Assuming RoPE adds an additive scalar matrix to the attention logits rather than rotating vector representations.',
        examinerLine: 'A conceptual barrier. Explain the mathematical mechanism, not the marketing summary.'
      };
    }
  }

  if (chosenTopic.includes('Consensus') || chosenTopic.includes('Raft') || chosenTopic.includes('Partition')) {
    if (difficulty === 'foundation') {
      return {
        id: `q-${questionIndex + 1}`,
        topic: chosenTopic,
        type: 'mcq',
        difficulty: 'foundation',
        question: 'In a 5-node Raft cluster, what is the minimum number of affirmative votes a candidate requires to be elected leader?',
        options: ['2 votes', '3 votes', '4 votes', '5 votes'],
        correctAnswer: '3 votes',
        explanation: 'Quorum in Raft requires a strict majority of the total configured cluster: floor(N/2) + 1. For N=5, floor(5/2) + 1 = 3 nodes.',
        misconception: 'Assuming quorum is calculated based only on surviving healthy nodes rather than the full cluster configuration.',
        examinerLine: 'Let us begin with basic arithmetic. Do not disappoint me on quorum.'
      };
    } else if (difficulty === 'applied') {
      return {
        id: `q-${questionIndex + 1}`,
        topic: chosenTopic,
        type: 'true_false',
        difficulty: 'applied',
        question: 'A Raft candidate with a longer log (higher lastLogIndex) is guaranteed to win votes even if its lastLogTerm is lower than the voter\'s term.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'Raft\'s election restriction prioritizes term over index: if two logs end in different terms, the log with the higher lastLogTerm is considered more up-to-date, regardless of length.',
        misconception: 'Assuming that log length (index) supersedes the term number when comparing log completeness.',
        examinerLine: 'A classic trap. Many architects have destroyed databases on this false premise.'
      };
    } else {
      return {
        id: `q-${questionIndex + 1}`,
        topic: chosenTopic,
        type: 'short_answer',
        difficulty: 'expert',
        question: 'Suppose a 5-node cluster is partitioned into {A, B} and {C, D, E}. Node A was leader before the split. What occurs when a client writes to Node A during the partition, and what happens when the partition heals?',
        options: [],
        correctAnswer: 'Node A appends the entry but cannot commit it because it cannot reach a quorum (2/5). Meanwhile {C, D, E} elects a leader with a higher term and commits writes. Upon healing, Node A steps down and overwrites its uncommitted entry with the majority leader log.',
        explanation: 'Node A cannot reach a majority (needs 3). The write remains uncommitted. When rejoined, AppendEntries from the higher-term leader forces Node A to truncate uncommitted entries and synchronize.',
        misconception: 'Assuming the minority leader rejects the write immediately or that uncommitted entries are merged rather than overwritten.',
        examinerLine: 'Walk me through the exact transition state. I want zero vagueness.'
      };
    }
  }

  // General Systems fallback
  if (difficulty === 'foundation') {
    return {
      id: `q-${questionIndex + 1}`,
      topic: chosenTopic,
      type: 'mcq',
      difficulty: 'foundation',
      question: 'Which hardware exception register stores the faulting virtual address during an x86 Page Fault (Interrupt #14)?',
      options: ['CR0', 'CR2', 'CR3', 'EFLAGS'],
      correctAnswer: 'CR2',
      explanation: 'On x86 architectures, the processor automatically stores the 64-bit virtual memory address that triggered the page fault into control register CR2.',
      misconception: 'Confusing CR3 (which holds the physical address of the page directory base) with CR2 (the faulting address register).',
      examinerLine: 'Hardware fundamentals. Answer decisively.'
    };
  } else if (difficulty === 'applied') {
    return {
      id: `q-${questionIndex + 1}`,
      topic: chosenTopic,
      type: 'true_false',
      difficulty: 'applied',
      question: 'Eliminating the Hold and Wait condition by requiring threads to request all required resources at once is sufficient to prevent deadlock.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Deadlock requires all four Coffman conditions to hold concurrently. Breaking any single condition—such as Hold and Wait—is mathematically sufficient to guarantee deadlock freedom.',
      misconception: 'Assuming multiple Coffman conditions must be eliminated simultaneously to prevent deadlocks.',
      examinerLine: 'Look at the theorem closely. Do not overcomplicate what is mathematically proven.'
    };
  } else {
    return {
      id: `q-${questionIndex + 1}`,
      topic: chosenTopic,
      type: 'short_answer',
      difficulty: 'expert',
      question: 'Why is an inter-processor interrupt (IPI) required during a TLB shootdown on a multi-core symmetric multiprocessing (SMP) system?',
      options: [],
      correctAnswer: 'Because each CPU core maintains its own private hardware TLB cache. Modifying page tables on Core 0 does not automatically invalidate stale translations cached in other cores\' TLBs, requiring an explicit IPI.',
      explanation: 'TLBs are core-local hardware units without hardware-managed coherency like CPU caches. Modifying a PTE requires broadcasting an IPI so remote cores flush their stale TLB entries.',
      misconception: 'Assuming cache coherency protocols (like MESI) automatically invalidate TLB entries across cores.',
      examinerLine: 'Multi-core memory physics. Let us hear your defense.'
    };
  }
}

export function evaluateMockAnswer(
  question: Question,
  studentAnswer: string,
  persona: ExaminerPersonaId,
  intensity: PressureIntensity
): AnswerEvaluation {
  const cleanStudent = studentAnswer.trim().toLowerCase();
  const cleanCorrect = question.correctAnswer.trim().toLowerCase();

  let verdict: 'correct' | 'partially_correct' | 'incorrect' = 'incorrect';
  let score = 0;
  let masteryDelta = -15;

  if (question.type === 'mcq' || question.type === 'true_false') {
    if (cleanStudent === cleanCorrect) {
      verdict = 'correct';
      score = 100;
      masteryDelta = 20;
    } else {
      verdict = 'incorrect';
      score = 0;
      masteryDelta = -20;
    }
  } else {
    // Semantic heuristic for short answer
    const keywords = cleanCorrect.split(/\s+/).filter(w => w.length > 4);
    let matchCount = 0;
    keywords.forEach(kw => {
      if (cleanStudent.includes(kw)) matchCount++;
    });

    const ratio = keywords.length > 0 ? matchCount / keywords.length : 0;
    if (ratio >= 0.5 || cleanStudent.length > 40) {
      if (ratio >= 0.7) {
        verdict = 'correct';
        score = 95;
        masteryDelta = 25;
      } else {
        verdict = 'partially_correct';
        score = 65;
        masteryDelta = 5;
      }
    } else {
      verdict = 'incorrect';
      score = 25;
      masteryDelta = -15;
    }
  }

  // Adjust commentary based on persona
  let reaction = '';
  let mood: 'impressed' | 'stern' | 'skeptical' | 'merciless' | 'neutral' = 'neutral';

  if (verdict === 'correct') {
    mood = 'impressed';
    if (persona === 'ruthless') {
      reaction = 'Acceptable. You avoided the obvious blunder, though your hesitation was noted.';
    } else if (persona === 'interviewer') {
      reaction = 'Spot on. That is the exact trade-off I look for in senior systems candidates.';
    } else {
      reaction = 'Precisely stated. The underlying principle has been honored.';
    }
  } else if (verdict === 'partially_correct') {
    mood = 'skeptical';
    if (persona === 'ruthless') {
      reaction = 'Half-truths are more dangerous than blatant ignorance. You glossed over the core mechanic.';
    } else if (persona === 'interviewer') {
      reaction = 'You have the general intuition, but in a production incident, this lack of precision causes outages.';
    } else {
      reaction = 'Partially sound, yet incomplete. You have captured the symptom, not the root causality.';
    }
  } else {
    mood = 'merciless';
    if (persona === 'ruthless') {
      reaction = 'Unacceptable. A fatal misconception that completely dismantles your argument.';
    } else if (persona === 'interviewer') {
      reaction = 'Incorrect. That would fail our automated verification tests immediately.';
    } else {
      reaction = 'Erroneous. Your assertion directly contradicts fundamental operational axioms.';
    }
  }

  const nextDiff = verdict === 'correct' 
    ? (question.difficulty === 'foundation' ? 'applied' : 'expert')
    : (question.difficulty === 'expert' ? 'applied' : 'foundation');

  return {
    verdict,
    score,
    feedback: verdict === 'correct' 
      ? 'Strong grasp of foundational principles with accurate causal reasoning.'
      : `${question.explanation}`,
    detectedMisconception: verdict === 'correct' ? '' : question.misconception,
    masteryDelta,
    suggestedNextDifficulty: nextDiff,
    examinerReaction: reaction,
    examinerMood: mood
  };
}

export function generateMockReport(
  subject: string,
  records: AnswerRecord[],
  topicMasteries: TopicMastery[]
): FinalReportData {
  const total = records.length;
  const correctCount = records.filter(r => r.evaluation.verdict === 'correct').length;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  let grade: 'S' | 'A' | 'B' | 'C' | 'D' = 'C';
  if (accuracy >= 90) grade = 'S';
  else if (accuracy >= 80) grade = 'A';
  else if (accuracy >= 65) grade = 'B';
  else if (accuracy >= 45) grade = 'C';
  else grade = 'D';

  const sortedTopics = [...topicMasteries].sort((a, b) => b.mastery - a.mastery);
  const strongest = sortedTopics.slice(0, 2).map(t => t.topic);
  const weak = sortedTopics.filter(t => t.mastery < 70).map(t => ({
    topic: t.topic,
    masteryScore: t.mastery,
    primaryReason: `Failed critical edge-case questions during multi-tiered interrogation.`
  }));

  const misconceptions = records
    .filter(r => r.evaluation.detectedMisconception)
    .map(r => ({
      topic: r.question.topic,
      whatYouThought: r.userAnswer || 'Implicit assumption without verification',
      reality: r.evaluation.detectedMisconception
    }));

  const repairPlan = (weak.length > 0 ? weak : sortedTopics.slice(-2)).map(w => ({
    topic: w.topic,
    actionItem: `Re-derive first-order axioms of ${w.topic} and test against asymmetric failure partitions.`,
    practiceQuestion: {
      question: `If an unexpected partition isolates 2 nodes out of 5 in ${w.topic}, what specific invariant guarantees safety?`,
      hint: 'Reflect on majority quorum intersection: floor(N/2) + 1.',
      solution: 'Any two majorities must overlap in at least one node, ensuring the newest state is always represented in every valid quorum.'
    }
  }));

  return {
    subject,
    overallScore: accuracy,
    grade,
    verdictTitle: grade === 'S' ? 'Exemplary Mastery' : grade === 'A' ? 'Superior Comprehension' : grade === 'B' ? 'Competent but Vulnerable' : 'Severe Conceptual Fractures',
    verdictSummary: `Across ${total} adaptive trials, ProfessorX exposed key variance in your technical foundation. You demonstrated competence in high-level mechanics but experienced systemic strain when interrogated on boundary safety.`,
    strongestTopics: strongest.length > 0 ? strongest : ['Foundational Recall'],
    weakTopics: weak.length > 0 ? weak : [{ topic: 'Advanced Synthesis', masteryScore: 68, primaryReason: 'Required additional scaffolding on expert questions.' }],
    misconceptionsSummary: misconceptions.length > 0 ? misconceptions : [
      {
        topic: sortedTopics[0]?.topic || 'Core Theory',
        whatYouThought: 'Assumed optimistic execution without latency penalty',
        reality: 'Real distributed consensus requires deterministic failure timeouts'
      }
    ],
    repairPlan,
    nextSteps: [
      'Implement the target practice drills below without referencing lecture notes.',
      'Audit your notes for vague terminology and replace with explicit mathematical invariants.',
      'Re-enter the interrogation room in Brutal Mode once remedial practice is complete.'
    ],
    topicMasteries,
    totalQuestions: total,
    accuracyRate: accuracy,
    dateGenerated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
}
