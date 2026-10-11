import { TeamDraft, AIAnalysisResult, Role } from '../types';
import { ROLE_LABELS } from '../data/champions';
import { calculateTeamStats, analyzeMatch } from '../utils/analyzer';

export interface AIAnalysisRequest {
  blueDraft: TeamDraft;
  redDraft: TeamDraft;
  apiKey?: string;
  provider?: 'gemini' | 'openai';
  customNotes?: string;
}

export async function requestAICompAnalysis(req: AIAnalysisRequest): Promise<AIAnalysisResult> {
  const { blueDraft, redDraft, apiKey, provider = 'gemini', customNotes } = req;

  // Format team rosters
  const roles: Role[] = ['TOP', 'JUG', 'MID', 'BOT', 'SUP'];
  const blueRoster = roles.map(r => `${ROLE_LABELS[r]}: ${blueDraft[r]?.nameKo || '미선택'}`).join(', ');
  const redRoster = roles.map(r => `${ROLE_LABELS[r]}: ${redDraft[r]?.nameKo || '미선택'}`).join(', ');

  // Try calling backend endpoint if available or direct API if apiKey is present
  try {
    const res = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blueRoster,
        redRoster,
        blueDraft,
        redDraft,
        apiKey,
        provider,
        customNotes
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.summary) {
        return data;
      }
    }
  } catch {
    // Backend endpoint not reached or in standalone mode, fall through to client-side logic
  }

  // If client-provided Gemini key exists, call Gemini directly via client
  if (apiKey && (provider === 'gemini' || !provider)) {
    try {
      const geminiResult = await callGeminiDirectly(blueRoster, redRoster, apiKey, customNotes);
      if (geminiResult) return geminiResult;
    } catch (err) {
      console.warn('Direct Gemini call failed, falling back to analytic model:', err);
    }
  }

  // High-fidelity Analytic LLM Coach Fallback
  return generateAnalyticFallback(blueDraft, redDraft);
}

async function callGeminiDirectly(
  blueRoster: string,
  redRoster: string,
  apiKey: string,
  customNotes?: string
): Promise<AIAnalysisResult | null> {
  const prompt = `당신은 리그 오브 레전드 LCK/월즈 프로팀의 수석 전력분석관이자 밴픽 코치입니다.
다음 5:5 솔로랭크 조합 매치업을 심층 분석해주세요.

우리 팀 (블루 진영): ${blueRoster}
상대 팀 (레드 진영): ${redRoster}
${customNotes ? `추가 질문/상황: ${customNotes}` : ''}

반드시 다음 JSON 형식으로만 응답하세요. 이모지(아이콘, 특수문자 이모티콘 등)는 절대 사용하지 마세요.
{
  "modelName": "Gemini 2.5 Flash",
  "summary": "핵심 요약 2문장",
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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
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

  if (!response.ok) return null;
  const json = await response.json();
  const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) return null;

  const parsed = JSON.parse(rawText) as AIAnalysisResult;
  return parsed;
}

function generateAnalyticFallback(blueDraft: TeamDraft, redDraft: TeamDraft): AIAnalysisResult {
  const base = analyzeMatch(blueDraft, redDraft);
  const blueStats = calculateTeamStats(blueDraft);
  const redStats = calculateTeamStats(redDraft);

  const blueEngage = blueStats.avgEngage >= 7;
  const redEngage = redStats.avgEngage >= 7;

  let teamfightDetail = '';
  if (base.teamfight.winner === 'blue') {
    teamfightDetail = '블루팀이 확고한 앞라인과 강력한 CC 연계 능력을 보유하여 5:5 정면 힘싸움에서 확연한 우위를 점합니다. 이니시에이터가 적 주요 딜러의 퇴로를 차단하고 진형을 붕괴시키면 무난한 승리가 예상됩니다.';
  } else if (base.teamfight.winner === 'red') {
    teamfightDetail = '레드팀의 기동성과 광역 진형 붕괴 능력이 블루팀을 상회합니다. 블루팀은 5:5 정면 힘싸움을 지양하고 시야 우위를 바탕으로 각개격파하는 교전을 유도해야 합니다.';
  } else {
    teamfightDetail = '양 팀의 한타 잠재력이 팽팽합니다. 어느 팀이 먼저 핵심 딜러에게 CC를 연계하느냐와 포지셔닝 실수가 발생하지 않는 쪽이 한타를 지배합니다.';
  }

  return {
    modelName: 'DeepLoL AI Analytic Coach',
    summary: base.headline,
    favoredTeam: base.favoredTeam,
    blueWinRate: base.blueWinRate,
    redWinRate: base.redWinRate,
    teamfightVerdict: {
      winner: base.teamfight.winner,
      breakdown: teamfightDetail,
      blueFocusTarget: blueEngage
        ? '적 메인 딜러진(원딜/미드)의 플래시 여부를 체크하고 이니시 연계로 한 번에 삭제'
        : '진입하는 적 브루저/암살자에게 하드 CC를 집중하여 아군 원딜 지키기 우선',
      redThreatsToAvoid: redEngage
        ? '상대 이니시에이터의 기습 플래시 궁극기 범위에 2명 이상 모여있지 않도록 산개'
        : '상대의 원거리 포킹에 체력이 깎인 상태에서 억지 교전을 열지 않도록 주의'
    },
    macroRoadmap: {
      earlyGame: base.winCondition.earlyGame.guide,
      midGame: base.winCondition.midGame.guide,
      lateGame: base.winCondition.lateGame.guide,
      recommendedStyle: base.winCondition.midGame.macroStyle
    },
    criticalTips: [
      blueStats.adRatio >= 75 ? '올AD 비중이 높아 상대 탱커의 방어구 밸류가 높습니다. 방어구 관통력 아이템을 2코어 이내에 필수 구비하세요.' : '데미지 밸런스가 균형을 이루고 있어 상대가 아이템을 선택하기 까다롭습니다.',
      blueStats.avgTankiness < 4.5 ? '앞라인이 부족하므로 시야가 없는 부쉬에 단독 진입하지 마세요.' : '든든한 앞라인을 앞세워 바론 및 드래곤 둥지 주변 시야를 선점하세요.',
      '오브젝트 생성 1분 전 귀환 타이밍을 잡고 핑크 와드로 시야 주도권을 확보하세요.'
    ]
  };
}
