import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

export function lolApiPlugin(): Plugin {
  return {
    name: 'lol-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const url = new URL(req.url || '', 'http://localhost');

        // --- Route: /api/riot/live-game ---
        if (url.pathname === '/api/riot/live-game' && req.method === 'GET') {
          const gameName = url.searchParams.get('gameName') || '';
          const tagLine = url.searchParams.get('tagLine') || 'KR1';
          const apiKey = url.searchParams.get('apiKey') || process.env.RIOT_API_KEY || '';

          if (!apiKey) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              inGame: false,
              message: 'Riot API Key가 설정되지 않았습니다. 우측 상단 [설정]에서 API Key를 입력하시거나, [샘플 인게임 로드] 버튼으로 즉시 체험해보실 수 있습니다.'
            }));
            return;
          }

          try {
            // 1. Account-v1 (Get PUUID)
            const accountUrl = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
            const accRes = await fetch(accountUrl, {
              headers: { 'X-Riot-Token': apiKey }
            });

            if (!accRes.ok) {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: false,
                inGame: false,
                message: `소환사를 찾을 수 없습니다 (${gameName}#${tagLine}). 소환사명과 태그를 확인해주세요.`
              }));
              return;
            }

            const accData: any = await accRes.json();
            const puuid = accData.puuid;

            // 2. Spectator-v5 (Get Active Game)
            const specUrl = `https://kr.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${puuid}`;
            const specRes = await fetch(specUrl, {
              headers: { 'X-Riot-Token': apiKey }
            });

            if (specRes.status === 404) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: true,
                inGame: false,
                message: `${gameName}#${tagLine} 님은 현재 진행 중인 게임이 없습니다.`
              }));
              return;
            }

            if (!specRes.ok) {
              const errText = await specRes.text();
              res.writeHead(specRes.status, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: false,
                inGame: false,
                message: `Riot Spectator API 오류 (${specRes.status}): ${errText}`
              }));
              return;
            }

            const gameData: any = await specRes.json();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: true,
              inGame: true,
              data: {
                gameId: gameData.gameId,
                gameMode: gameData.gameMode,
                gameLength: gameData.gameLength,
                summonerQuery: `${gameName}#${tagLine}`,
                participants: gameData.participants.map((p: any) => ({
                  summonerName: p.summonerName || p.riotId || 'Player',
                  riotId: p.riotId,
                  teamId: p.teamId,
                  championId: p.championId,
                  spell1Id: p.spell1Id,
                  spell2Id: p.spell2Id
                }))
              }
            }));
            return;
          } catch (error: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              inGame: false,
              message: `서버 통신 실패: ${error.message}`
            }));
            return;
          }
        }

        // --- Route: /api/ai/analyze ---
        if (url.pathname === '/api/ai/analyze' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const { blueRoster, redRoster, apiKey, customNotes } = parsed;
              const geminiKey = apiKey || process.env.GEMINI_API_KEY;

              if (!geminiKey) {
                // Return 400 so client falls back to structured local engine
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  error: 'NO_API_KEY',
                  message: 'API Key not provided'
                }));
                return;
              }

              const prompt = `당신은 리그 오브 레전드 LCK/월즈 프로팀의 수석 전력분석관이자 밴픽 코치입니다.
다음 5:5 솔로랭크 조합 매치업을 심층 분석해주세요.

우리 팀 (블루 진영): ${blueRoster}
상대 팀 (레드 진영): ${redRoster}
${customNotes ? `추가 질문/상황: ${customNotes}` : ''}

반드시 다음 JSON 형식으로만 응답하세요. 이모지(아이콘, 특수문자 이모티콘 등)는 절대 사용하지 마세요.
{
  "modelName": "Gemini 2.5 Flash Coach",
  "summary": "조합 상성 핵심 요약 2문장",
  "favoredTeam": "blue 또는 red 또는 even",
  "blueWinRate": 55,
  "redWinRate": 45,
  "teamfightVerdict": {
    "winner": "blue 또는 red 또는 even",
    "breakdown": "5:5 정면 한타 및 교전 구도 상세 해설",
    "blueFocusTarget": "블루팀이 최우선 점사하거나 마크해야 할 상대 핵심 챔피언 및 진입 각",
    "redThreatsToAvoid": "상대팀에서 가장 위협적인 스킬 연계 및 포지셔닝 주의점"
  },
  "macroRoadmap": {
    "earlyGame": "초반 0~14분 라인전 및 첫 유충/용 주도권 운영법",
    "midGame": "중반 15~25분 사이드 관리 및 시야 대치 운영법",
    "lateGame": "후반 25분 이후 바론/장로 한타 및 엔딩 가이드",
    "recommendedStyle": "강제 5:5 한타 유도 또는 1-3-1 스플릿 등 권장 전술"
  },
  "criticalTips": [
    "핵심 팁 1",
    "핵심 팁 2",
    "핵심 팁 3"
  ]
}`;

              const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
              const aiRes = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                  generationConfig: {
                    responseMimeType: 'application/json',
                    temperature: 0.2
                  }
                })
              });

              if (!aiRes.ok) {
                const errText = await aiRes.text();
                res.writeHead(aiRes.status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: errText }));
                return;
              }

              const aiJson: any = await aiRes.json();
              const textOutput = aiJson?.candidates?.[0]?.content?.parts?.[0]?.text;
              const resultObj = JSON.parse(textOutput);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(resultObj));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}
