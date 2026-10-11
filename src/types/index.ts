export type Role = 'TOP' | 'JUG' | 'MID' | 'BOT' | 'SUP';
export type DamageType = 'AD' | 'AP' | 'Hybrid' | 'True';
export type RangeType = 'Melee' | 'Ranged';

export interface ChampionStats {
  damageAD: number;      // 0 - 10
  damageAP: number;      // 0 - 10
  cc: number;            // 0 - 10 (Crowd control / Hard CC)
  engage: number;        // 0 - 10 (Initiation / Hard engage)
  peel: number;          // 0 - 10 (Protecting allies / Counter-engage)
  tankiness: number;     // 0 - 10 (Frontline / Durability)
  poke: number;          // 0 - 10 (Range poke / Siege)
  mobility: number;      // 0 - 10 (Dashes / Assassin capability)
  splitPush: number;     // 0 - 10 (1v1 dueling / Tower taking)
  scaling: number;       // 0 - 10 (Late game power)
  earlyGame: number;     // 0 - 10 (Laning dominance)
}

export interface Champion {
  id: string;            // DDragon ID e.g. "Aatrox"
  key?: number;          // Riot Numeric Key e.g. 266
  name: string;          // English name
  nameKo: string;        // Korean name
  initials: string;      // 초성 e.g. "ㅇㅌㄹㅅ"
  roles: Role[];
  damageType: DamageType;
  rangeType: RangeType;
  stats: ChampionStats;
  tags: string[];        // Key tags e.g. ["하드 이니시", "단단한 앞라인"]
  keySkillsTip?: string; // 스킬 팁 e.g. "궁극기 이니시 주의"
}

export interface LiveGameParticipant {
  summonerName: string;
  riotId?: string;
  teamId: number; // 100 for blue, 200 for red
  championId: number;
  spell1Id?: number;
  spell2Id?: number;
}

export interface LiveGameInfo {
  gameId: number;
  gameMode: string;
  gameLength: number;
  summonerQuery: string;
  participants: LiveGameParticipant[];
}

export interface AIAnalysisResult {
  modelName: string;
  summary: string;
  favoredTeam: 'blue' | 'red' | 'even';
  blueWinRate: number;
  redWinRate: number;
  teamfightVerdict: {
    winner: 'blue' | 'red' | 'even';
    breakdown: string;
    blueFocusTarget: string;
    redThreatsToAvoid: string;
  };
  macroRoadmap: {
    earlyGame: string;
    midGame: string;
    lateGame: string;
    recommendedStyle: string;
  };
  criticalTips: string[];
}

export interface TeamDraft {
  TOP: Champion | null;
  JUG: Champion | null;
  MID: Champion | null;
  BOT: Champion | null;
  SUP: Champion | null;
}

export interface TeamStatsSummary {
  adRatio: number;       // percentage 0 - 100
  apRatio: number;       // percentage 0 - 100
  avgEngage: number;     // 0 - 10
  avgCC: number;         // 0 - 10
  avgTankiness: number;  // 0 - 10
  avgPeel: number;       // 0 - 10
  avgPoke: number;       // 0 - 10
  avgMobility: number;   // 0 - 10
  avgSplitPush: number;  // 0 - 10
  avgEarlyGame: number;  // 0 - 10
  avgScaling: number;    // 0 - 10
  warnings: string[];    // e.g. "올AD 조합 (적 방어구 효율 극대화)", "앞라인 부재"
  synergies: string[];   // e.g. "강력한 5인 한타 연계", "돌진 암살 최적화"
}

export interface LaneMatchup {
  role: Role;
  roleName: string;
  blueChamp: Champion | null;
  redChamp: Champion | null;
  favored: 'blue' | 'red' | 'even';
  leadScore: number;     // Difference
  tip: string;           // Matchup advice
}

export interface AnalysisResult {
  blueStats: TeamStatsSummary;
  redStats: TeamStatsSummary;
  blueWinRate: number;   // 0 - 100
  redWinRate: number;    // 0 - 100
  favoredTeam: 'blue' | 'red' | 'even';
  headline: string;
  
  // 한타 구도
  teamfight: {
    winner: 'blue' | 'red' | 'even';
    ratingDiff: number;
    summary: string;
    bluePlan: string;
    redThreats: string;
  };

  // 운영 및 승리 플랜 (Macro Roadmap)
  winCondition: {
    earlyGame: {
      leadTeam: 'blue' | 'red' | 'even';
      guide: string;
      objectiveFocus: string; // '첫 유충 우선' | '첫 용 우선' | '반반 파밍'
    };
    midGame: {
      guide: string;
      macroStyle: string;     // '강제 5:5 한타 유도' | '1-3-1 날개 스플릿' | '시야 낚시 잘라먹기'
    };
    lateGame: {
      guide: string;
      endingTip: string;
    };
  };

  // 라인별 상성
  laneMatchups: LaneMatchup[];
}
