import { LiveGameInfo, LiveGameParticipant, Role, TeamDraft } from '../types';
import { CHAMPIONS, getChampionByKey } from '../data/champions';

export interface RiotLiveGameResponse {
  success: boolean;
  inGame: boolean;
  message?: string;
  data?: LiveGameInfo;
}

// Sample live games for demo & instant testing
export const SAMPLE_LIVE_GAMES: Record<string, LiveGameInfo> = {
  faker: {
    gameId: 6981290341,
    gameMode: 'CLASSIC (솔로랭크)',
    gameLength: 320,
    summonerQuery: 'Hide on bush#KR1',
    participants: [
      // Blue Team (100)
      { summonerName: 'Zeus', riotId: 'T1 Zeus#KR1', teamId: 100, championId: 54 },     // Malphite
      { summonerName: 'Oner', riotId: 'T1 Oner#KR1', teamId: 100, championId: 113 },    // Sejuani
      { summonerName: 'Faker', riotId: 'Hide on bush#KR1', teamId: 100, championId: 61 },// Orianna
      { summonerName: 'Gumayusi', riotId: 'T1 Gumayusi#KR1', teamId: 100, championId: 222 }, // Jinx
      { summonerName: 'Keria', riotId: 'T1 Keria#KR1', teamId: 100, championId: 111 },  // Nautilus
      // Red Team (200)
      { summonerName: 'Kiin', riotId: 'GenG Kiin#KR1', teamId: 200, championId: 126 },   // Jayce
      { summonerName: 'Canyon', riotId: 'GenG Canyon#KR1', teamId: 200, championId: 64 },// LeeSin
      { summonerName: 'Chovy', riotId: 'GenG Chovy#KR1', teamId: 200, championId: 134 }, // Syndra
      { summonerName: 'Peyz', riotId: 'GenG Peyz#KR1', teamId: 200, championId: 81 },   // Ezreal
      { summonerName: 'Lehends', riotId: 'GenG Lehends#KR1', teamId: 200, championId: 43 } // Karma
    ]
  },
  chovy: {
    gameId: 6981290342,
    gameMode: 'CLASSIC (솔로랭크)',
    gameLength: 180,
    summonerQuery: 'Chovy#KR1',
    participants: [
      // Blue Team (100)
      { summonerName: 'Player1', riotId: 'TopKing#KR1', teamId: 100, championId: 114 },  // Fiora
      { summonerName: 'Player2', riotId: 'JungleDiff#KR1', teamId: 100, championId: 234 },// Viego
      { summonerName: 'Chovy', riotId: 'Chovy#KR1', teamId: 100, championId: 103 },      // Ahri
      { summonerName: 'Player4', riotId: 'AdcCarry#KR1', teamId: 100, championId: 145 },  // KaiSa
      { summonerName: 'Player5', riotId: 'SupportGod#KR1', teamId: 100, championId: 497 },// Rakan
      // Red Team (200)
      { summonerName: 'Player6', riotId: 'IronWall#KR1', teamId: 200, championId: 516 },  // Ornn
      { summonerName: 'Player7', riotId: 'DunkMaster#KR1', teamId: 200, championId: 59 }, // JarvanIV
      { summonerName: 'Player8', riotId: 'LaserMachine#KR1', teamId: 200, championId: 112 }, // Viktor
      { summonerName: 'Player9', riotId: 'FrostArrow#KR1', teamId: 200, championId: 22 }, // Ashe
      { summonerName: 'Player10', riotId: 'SunPraise#KR1', teamId: 200, championId: 89 }  // Leona
    ]
  }
};

/**
 * Converts live game participants into 5v5 draft slots based on common role mapping or sequence
 */
export function mapLiveGameToDraft(participants: LiveGameParticipant[]): {
  blueDraft: TeamDraft;
  redDraft: TeamDraft;
} {
  const roles: Role[] = ['TOP', 'JUG', 'MID', 'BOT', 'SUP'];

  const blueParts = participants.filter(p => p.teamId === 100);
  const redParts = participants.filter(p => p.teamId === 200);

  const blueDraft: TeamDraft = {
    TOP: null,
    JUG: null,
    MID: null,
    BOT: null,
    SUP: null
  };

  const redDraft: TeamDraft = {
    TOP: null,
    JUG: null,
    MID: null,
    BOT: null,
    SUP: null
  };

  // Map blue team
  blueParts.forEach((part, index) => {
    const champ = getChampionByKey(part.championId);
    if (champ) {
      // If index corresponds to role, or assign sequentially
      const role = roles[index] || 'MID';
      blueDraft[role] = champ;
    }
  });

  // Map red team
  redParts.forEach((part, index) => {
    const champ = getChampionByKey(part.championId);
    if (champ) {
      const role = roles[index] || 'MID';
      redDraft[role] = champ;
    }
  });

  return { blueDraft, redDraft };
}

/**
 * Fetch live spectator game by Riot ID (gameName#tagLine)
 */
export async function fetchLiveGame(
  riotIdQuery: string,
  region: string = 'kr',
  apiKey?: string
): Promise<RiotLiveGameResponse> {
  const trimmed = riotIdQuery.trim();
  if (!trimmed) {
    return { success: false, inGame: false, message: '소환사명을 입력해주세요. (예: Hide on bush#KR1)' };
  }

  // Check if it's a sample query
  const lower = trimmed.toLowerCase();
  if (lower.includes('faker') || lower.includes('hide on bush')) {
    return {
      success: true,
      inGame: true,
      data: SAMPLE_LIVE_GAMES.faker
    };
  }
  if (lower.includes('chovy')) {
    return {
      success: true,
      inGame: true,
      data: SAMPLE_LIVE_GAMES.chovy
    };
  }

  // Attempt to call local proxy API
  try {
    let gameName = '';
    let tagLine = '';

    if (trimmed.includes('#')) {
      const hashIndex = trimmed.indexOf('#');
      gameName = trimmed.substring(0, hashIndex).trim();
      tagLine = trimmed.substring(hashIndex + 1).trim();
    } else {
      gameName = trimmed.trim();
      const defaultTagMap: Record<string, string> = {
        kr: 'KR1',
        na: 'NA1',
        euw: 'EUW'
      };
      tagLine = defaultTagMap[region.toLowerCase()] || 'NA1';
    }

    const params = new URLSearchParams({
      gameName,
      tagLine,
      region
    });
    if (apiKey) params.append('apiKey', apiKey);

    const res = await fetch(`/api/riot/live-game?${params.toString()}`);
    if (res.ok) {
      const json = await res.json();
      return json;
    } else {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        inGame: false,
        message: err.message || '인게임 정보를 불러오지 못했습니다. 소환사명 또는 Riot API Key를 확인해주세요.'
      };
    }
  } catch {
    // If backend endpoint is unavailable, return helpful error
    return {
      success: false,
      inGame: false,
      message: 'Riot API 연결 실패: API 키 설정이 필요합니다. "샘플 인게임 로드" 버튼으로 즉시 체험해보실 수 있습니다.'
    };
  }
}
