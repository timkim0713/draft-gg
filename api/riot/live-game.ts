// Vercel Serverless Function: /api/riot/live-game
const REGION_MAP: Record<string, { cluster: string; platform: string; defaultTag: string }> = {
  kr: { cluster: 'asia', platform: 'kr', defaultTag: 'KR1' },
  na: { cluster: 'americas', platform: 'na1', defaultTag: 'NA1' },
  euw: { cluster: 'europe', platform: 'euw1', defaultTag: 'EUW' }
};

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Riot-Token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { gameName, tagLine: rawTag, region: rawRegion = 'kr', apiKey: queryKey } = req.query;
  const regionKey = String(rawRegion).toLowerCase();
  const regionConfig = REGION_MAP[regionKey] || REGION_MAP.kr;

  // Thorough sanitization of gameName and tagLine
  const cleanName = String(gameName || '').trim();
  let cleanTag = String(rawTag || '').trim();
  if (cleanTag.startsWith('#')) {
    cleanTag = cleanTag.substring(1).trim();
  }
  if (!cleanTag) {
    cleanTag = regionConfig.defaultTag;
  }

  const apiKey = (queryKey as string) || process.env.RIOT_API_KEY || '';

  if (!cleanName) {
    return res.status(400).json({
      success: false,
      message: '소환사명을 입력해주세요.'
    });
  }

  if (!apiKey) {
    return res.status(400).json({
      success: false,
      inGame: false,
      message: 'Riot API Key가 설정되지 않았습니다. 우측 상단 [설정]에서 API Key를 입력하시거나, [샘플 인게임 로드] 버튼으로 즉시 체험해보실 수 있습니다.'
    });
  }

  try {
    // 1. Account-v1 (Get PUUID by Riot ID using regional clusters: americas, asia, europe)
    const encodedName = encodeURIComponent(cleanName);
    const encodedTag = encodeURIComponent(cleanTag);

    const primaryCluster = regionConfig.cluster;
    const fallbackClusters = ['americas', 'asia', 'europe'].filter(c => c !== primaryCluster);
    const clustersToTry = [primaryCluster, ...fallbackClusters];

    let puuid: string | null = null;

    for (const cluster of clustersToTry) {
      const accountUrl = `https://${cluster}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodedName}/${encodedTag}`;
      const accRes = await fetch(accountUrl, {
        headers: { 'X-Riot-Token': apiKey }
      });

      if (accRes.status === 401 || accRes.status === 403) {
        return res.status(accRes.status).json({
          success: false,
          inGame: false,
          message: 'Riot API Key가 유효하지 않거나 24시간 만료되었습니다. Riot 개발자 포털(developer.riotgames.com)에서 새로 발급받아 우측 상단 [설정]에 등록해주세요.'
        });
      }

      if (accRes.status === 429) {
        return res.status(429).json({
          success: false,
          inGame: false,
          message: 'Riot API 호출 한도 초과 (Rate Limit). 잠시 후 다시 시도해주세요.'
        });
      }

      if (accRes.ok) {
        const accData: any = await accRes.json();
        puuid = accData.puuid;
        break;
      }
    }

    if (!puuid) {
      return res.status(404).json({
        success: false,
        inGame: false,
        message: `소환사를 찾을 수 없습니다 (${cleanName}#${cleanTag} [${regionKey.toUpperCase()}]). 소환사명과 태그를 확인해주세요.`
      });
    }

    // 2. Spectator-v5 (Get Active Game using platform e.g. kr, na1, euw1)
    const specUrl = `https://${regionConfig.platform}.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${puuid}`;
    const specRes = await fetch(specUrl, {
      headers: { 'X-Riot-Token': apiKey }
    });

    if (specRes.status === 401 || specRes.status === 403) {
      return res.status(specRes.status).json({
        success: false,
        inGame: false,
        message: 'Riot API Key가 유효하지 않거나 24시간 만료되었습니다. Riot 개발자 포털에서 키를 재발급받아주세요.'
      });
    }

    if (specRes.status === 404) {
      return res.status(200).json({
        success: true,
        inGame: false,
        message: `${cleanName}#${cleanTag} 님은 현재 진행 중인 게임이 없습니다.`
      });
    }

    if (!specRes.ok) {
      const errText = await specRes.text();
      return res.status(specRes.status).json({
        success: false,
        inGame: false,
        message: `Riot Spectator API 오류 (${specRes.status}): ${errText}`
      });
    }

    const gameData: any = await specRes.json();
    return res.status(200).json({
      success: true,
      inGame: true,
      data: {
        gameId: gameData.gameId,
        gameMode: gameData.gameMode,
        gameLength: gameData.gameLength,
        summonerQuery: `${cleanName}#${cleanTag}`,
        participants: gameData.participants.map((p: any) => ({
          summonerName: p.summonerName || p.riotId || 'Player',
          riotId: p.riotId || p.summonerName || 'Player',
          teamId: p.teamId,
          championId: p.championId,
          spell1Id: p.spell1Id,
          spell2Id: p.spell2Id
        }))
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      inGame: false,
      message: `서버 통신 실패: ${error.message}`
    });
  }
}
