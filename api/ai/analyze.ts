// Vercel Serverless Function: /api/ai/analyze
export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { blueRoster, redRoster, apiKey, customNotes } = req.body || {};
  const geminiKey = apiKey || process.env.GEMINI_API_KEY;

  if (!geminiKey) {
    return res.status(400).json({
      error: 'NO_API_KEY',
      message: 'Gemini API Key가 설정되지 않았습니다. 우측 상단 [설정]에서 API Key를 입력하세요.'
    });
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

  try {
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
      return res.status(aiRes.status).json({ error: errText });
    }

    const aiJson: any = await aiRes.json();
    const textOutput = aiJson?.candidates?.[0]?.content?.parts?.[0]?.text;
    const resultObj = JSON.parse(textOutput);

    return res.status(200).json(resultObj);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
