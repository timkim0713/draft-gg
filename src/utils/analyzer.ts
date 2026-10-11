import { Champion, TeamDraft, TeamStatsSummary, AnalysisResult, LaneMatchup, Role } from '../types';
import { ROLE_LABELS } from '../data/champions';

export function calculateTeamStats(draft: TeamDraft): TeamStatsSummary {
  const champions = Object.values(draft).filter((c): c is Champion => c !== null);
  
  if (champions.length === 0) {
    return {
      adRatio: 50,
      apRatio: 50,
      avgEngage: 5,
      avgCC: 5,
      avgTankiness: 5,
      avgPeel: 5,
      avgPoke: 5,
      avgMobility: 5,
      avgSplitPush: 5,
      avgEarlyGame: 5,
      avgScaling: 5,
      warnings: [],
      synergies: []
    };
  }

  const count = champions.length;
  let totalAD = 0;
  let totalAP = 0;
  let totalEngage = 0;
  let totalCC = 0;
  let totalTankiness = 0;
  let totalPeel = 0;
  let totalPoke = 0;
  let totalMobility = 0;
  let totalSplitPush = 0;
  let totalEarly = 0;
  let totalScaling = 0;

  for (const c of champions) {
    totalAD += c.stats.damageAD;
    totalAP += c.stats.damageAP;
    totalEngage += c.stats.engage;
    totalCC += c.stats.cc;
    totalTankiness += c.stats.tankiness;
    totalPeel += c.stats.peel;
    totalPoke += c.stats.poke;
    totalMobility += c.stats.mobility;
    totalSplitPush += c.stats.splitPush;
    totalEarly += c.stats.earlyGame;
    totalScaling += c.stats.scaling;
  }

  const dmgSum = totalAD + totalAP || 1;
  const adRatio = Math.round((totalAD / dmgSum) * 100);
  const apRatio = 100 - adRatio;

  const avgEngage = Number((totalEngage / count).toFixed(1));
  const avgCC = Number((totalCC / count).toFixed(1));
  const avgTankiness = Number((totalTankiness / count).toFixed(1));
  const avgPeel = Number((totalPeel / count).toFixed(1));
  const avgPoke = Number((totalPoke / count).toFixed(1));
  const avgMobility = Number((totalMobility / count).toFixed(1));
  const avgSplitPush = Number((totalSplitPush / count).toFixed(1));
  const avgEarlyGame = Number((totalEarly / count).toFixed(1));
  const avgScaling = Number((totalScaling / count).toFixed(1));

  // Generate Warnings & Synergies
  const warnings: string[] = [];
  const synergies: string[] = [];

  // Damage warning
  if (adRatio >= 75 && count >= 3) {
    warnings.push('⚠️ 올AD 주의 (상대 닌자의 신발/가시갑옷 방템 밸류 극대화)');
  } else if (apRatio >= 75 && count >= 3) {
    warnings.push('⚠️ 올AP 주의 (상대 헤르메스/케이닉 루 Fern 등 마저템에 무력화)');
  } else if (adRatio >= 40 && adRatio <= 60 && count >= 3) {
    synergies.push('✨ 황금 밸런스 딜구조 (상대 방어 아이템 선택 강제 곤란)');
  }

  // Frontline warning
  if (avgTankiness < 4.5 && count >= 3) {
    warnings.push('⚠️ 앞라인(탱커) 부재 (적 진입 시 딜러진 즉각 노출 위험)');
  } else if (avgTankiness >= 7.5 && count >= 3) {
    synergies.push('✨ 든든한 앞라인 (장기전 및 오브젝트 버스트 든든함)');
  }

  // Engage warning
  if (avgEngage < 4.2 && count >= 3) {
    warnings.push('⚠️ 강제 이니시 부재 (상대가 거리 벌리면 싸움 열기 힘듦)');
  } else if (avgEngage >= 7.5 && count >= 3) {
    synergies.push('✨ 강력한 한타 이니시 (원하는 타이밍에 강제 교전 가능)');
  }

  // CC Warning
  if (avgCC < 4.5 && count >= 3) {
    warnings.push('⚠️ 하드 CC 부족 (적 암살자/칼바람 진입 제어 취약)');
  } else if (avgCC >= 7.5 && count >= 3) {
    synergies.push('✨ 풍부한 CC기 연계 (적 딜러진 행동 불가 확정)');
  }

  // Poke synergy
  if (avgPoke >= 6.8 && count >= 3) {
    synergies.push('✨ 강력한 원거리 포킹 (오브젝트 대치 구도에서 피 깎기 최적)');
  }

  // SplitPush synergy
  if (avgSplitPush >= 7.2 && count >= 3) {
    synergies.push('✨ 날카로운 1:1 사이드 철거 (스플릿 푸시로 적 분산 유도)');
  }

  // Scaling / Early Game
  if (avgScaling >= 7.8 && count >= 3) {
    synergies.push('✨ 후반 왕귀 밸류 (3코어 이후 게임 주도권 확보)');
  } else if (avgEarlyGame >= 7.5 && avgScaling < 5.5 && count >= 3) {
    warnings.push('⚠️ 유통기한 주의 (초반 20분 내 스노우볼 굴려야 승리)');
  }

  return {
    adRatio,
    apRatio,
    avgEngage,
    avgCC,
    avgTankiness,
    avgPeel,
    avgPoke,
    avgMobility,
    avgSplitPush,
    avgEarlyGame,
    avgScaling,
    warnings,
    synergies
  };
}

export function evaluateLaneMatchup(role: Role, blue: Champion | null, red: Champion | null): LaneMatchup {
  const roleName = ROLE_LABELS[role] || role;

  if (!blue || !red) {
    return {
      role,
      roleName,
      blueChamp: blue,
      redChamp: red,
      favored: 'even',
      leadScore: 0,
      tip: `${roleName} 라인 챔피언을 선택하면 1:1 맞대결 상성을 분석합니다.`
    };
  }

  // Calculate matchup score based on early game, mobility, poke, cc
  const blueScore = (blue.stats.earlyGame * 0.45) + (blue.stats.poke * 0.25) + (blue.stats.mobility * 0.15) + (blue.stats.cc * 0.15);
  const redScore = (red.stats.earlyGame * 0.45) + (red.stats.poke * 0.25) + (red.stats.mobility * 0.15) + (red.stats.cc * 0.15);
  
  const diff = Number((blueScore - redScore).toFixed(1));
  let favored: 'blue' | 'red' | 'even' = 'even';
  if (diff >= 0.8) favored = 'blue';
  else if (diff <= -0.8) favored = 'red';

  // Construct tactical tip
  let tip = '';
  if (favored === 'blue') {
    tip = `[블루 우세] ${blue.nameKo}이(가) 초반 라인 주도권 우위. 정글러와 함께 첫 오브젝트나 카정을 노리기 좋습니다.`;
  } else if (favored === 'red') {
    tip = `[레드 우세] ${red.nameKo}의 압박이 거셉니다. ${blue.nameKo}은(는) 무리한 딜교를 피하고 라인을 당겨 갱 호응을 노리세요.`;
  } else {
    tip = `[호각/손싸움] ${blue.nameKo} vs ${red.nameKo} 팽팽한 구도. 핵심 스킬 적중 여부와 정글러의 첫 동선이 승패를 가릅니다.`;
  }

  if (red.keySkillsTip && favored === 'red') {
    tip += ` (주의: ${red.keySkillsTip})`;
  } else if (blue.keySkillsTip && favored === 'blue') {
    tip += ` (핵심: ${blue.keySkillsTip})`;
  }

  return {
    role,
    roleName,
    blueChamp: blue,
    redChamp: red,
    favored,
    leadScore: Math.abs(diff),
    tip
  };
}

export function analyzeMatch(blueDraft: TeamDraft, redDraft: TeamDraft): AnalysisResult {
  const blueStats = calculateTeamStats(blueDraft);
  const redStats = calculateTeamStats(redDraft);

  const roles: Role[] = ['TOP', 'JUG', 'MID', 'BOT', 'SUP'];
  const laneMatchups: LaneMatchup[] = roles.map(role => 
    evaluateLaneMatchup(role, blueDraft[role], redDraft[role])
  );

  // Teamfight Strength Calculation
  // Frontline + Engage + CC + Peel are critical for 5v5 teamfights
  const blueTF = (blueStats.avgEngage * 0.25) + (blueStats.avgCC * 0.25) + (blueStats.avgTankiness * 0.25) + (blueStats.avgPeel * 0.15) + (blueStats.avgScaling * 0.1);
  const redTF = (redStats.avgEngage * 0.25) + (redStats.avgCC * 0.25) + (redStats.avgTankiness * 0.25) + (redStats.avgPeel * 0.15) + (redStats.avgScaling * 0.1);

  const tfDiff = Number((blueTF - redTF).toFixed(1));
  let tfWinner: 'blue' | 'red' | 'even' = 'even';
  if (tfDiff >= 0.5) tfWinner = 'blue';
  else if (tfDiff <= -0.5) tfWinner = 'red';

  let tfSummary = '';
  let blueTFPlan = '';
  let redTFThreats = '';

  if (tfWinner === 'blue') {
    tfSummary = '블루팀이 확고한 앞라인과 강력한 CC/이니시 연계로 5:5 정면 한타에서 확연한 우위를 점합니다.';
    blueTFPlan = '좁은 정글 길목이나 용/바론 둥지 앞에서 강제 5:5 한타를 유도하여 일망타진하는 구도가 최선입니다.';
    redTFThreats = '상대팀의 기습적인 잘라먹기나 사이드 스플릿 분산 작전에 휘둘리지 말고 뭉쳐 다녀야 합니다.';
  } else if (tfWinner === 'red') {
    tfSummary = '레드팀의 진형 붕괴 능력과 CC 연계가 뛰어나 5:5 정면 힘싸움은 블루팀에게 불리합니다.';
    blueTFPlan = '정면 5:5 싸움을 피하고, 시야를 이용해 상대를 한 명씩 끊어먹거나 사이드 라인을 흔들어야 합니다.';
    redTFThreats = '상대팀의 강제 이니시에이팅 사거리에 딜러진이 노출되지 않도록 철저한 거리 유지가 필수입니다.';
  } else {
    tfSummary = '양 팀의 한타 잠재력이 백중세입니다. 어느 쪽이 먼저 핵심 딜러에게 CC를 꽂느냐에 승패가 갈립니다.';
    blueTFPlan = '아군 앞라인이 적 주요 진입을 마크하는 동안 딜러진이 안정적인 포지션에서 프리딜을 넣어야 합니다.';
    redTFThreats = '상대의 플래시 이니시 및 궁극기 연계 타이밍을 항상 주시하세요.';
  }

  // Overall Win Rate Estimation
  let bluePoints = 50;
  
  // Teamfight difference (+/- 12%)
  bluePoints += (blueTF - redTF) * 3;

  // Scaling vs Early Game (+/- 8%)
  const blueOverallPower = (blueStats.avgEarlyGame * 0.4) + (blueStats.avgScaling * 0.6);
  const redOverallPower = (redStats.avgEarlyGame * 0.4) + (redStats.avgScaling * 0.6);
  bluePoints += (blueOverallPower - redOverallPower) * 2;

  // AD/AP Balance Penalty
  if (blueStats.adRatio >= 80 && redStats.avgTankiness >= 6.5) bluePoints -= 4;
  if (redStats.adRatio >= 80 && blueStats.avgTankiness >= 6.5) bluePoints += 4;
  if (blueStats.apRatio >= 80) bluePoints -= 3;
  if (redStats.apRatio >= 80) bluePoints += 3;

  // Frontline deficit penalty
  if (blueStats.avgTankiness < 4.0 && redStats.avgEngage >= 6.5) bluePoints -= 5;
  if (redStats.avgTankiness < 4.0 && blueStats.avgEngage >= 6.5) bluePoints += 5;

  // Bound winrate between 20% and 80%
  const blueWinRate = Math.min(80, Math.max(20, Math.round(bluePoints)));
  const redWinRate = 100 - blueWinRate;

  let favoredTeam: 'blue' | 'red' | 'even' = 'even';
  if (blueWinRate >= 53) favoredTeam = 'blue';
  else if (blueWinRate <= 47) favoredTeam = 'red';

  // Overall Headline
  let headline = '';
  if (favoredTeam === 'blue') {
    headline = `블루팀 조합 우세 (예상 승률 ${blueWinRate}%) - 한타 연계와 밸런스가 조화롭습니다.`;
  } else if (favoredTeam === 'red') {
    headline = `레드팀 조합 우세 (예상 승률 ${redWinRate}%) - 교전 파괴력과 라인 밸류에서 앞서갑니다.`;
  } else {
    headline = `초박빙 팽팽한 조합 (예상 승률 50:50) - 인게임 피지컬과 운영 오더가 승부를 결정합니다.`;
  }

  // Win Conditions (Macro Roadmap)
  // Early Game
  const earlyDiff = blueStats.avgEarlyGame - redStats.avgEarlyGame;
  let earlyLeadTeam: 'blue' | 'red' | 'even' = 'even';
  let earlyGuide = '';
  let objFocus = '반반 파밍 및 정글 동선 맞춤';

  if (earlyDiff >= 0.8) {
    earlyLeadTeam = 'blue';
    objFocus = '공허 유충 3마리 & 첫 드래곤 적극 장악';
    earlyGuide = '블루팀의 라인 주도권이 전반적으로 강합니다. 정글러는 적극적인 갱킹과 카정으로 14분 전 포탑 방패 골드를 대량 뜯어내세요.';
  } else if (earlyDiff <= -0.8) {
    earlyLeadTeam = 'red';
    objFocus = '라인 당기고 갱 방어 / 무리한 첫 용 교전 회피';
    earlyGuide = '상대팀의 초반 압박이 매우 거셉니다. 무리한 딜교나 카정 지원으로 손해 보지 말고, 타워 밑 파밍으로 안정적으로 버텨야 합니다.';
  } else {
    earlyGuide = '초반 라인전 주도권이 비슷합니다. 바텀 듀오의 2레벨 선점과 첫 바위게 교전 승리 팀이 스노우볼을 굴리기 유리합니다.';
    objFocus = '정글러 위치에 따라 유충 또는 첫 용 선택';
  }

  // Mid Game
  let midGuide = '';
  let macroStyle = '강제 5:5 한타 유도';
  if (blueStats.avgSplitPush >= 7.0 && redTF > blueTF) {
    macroStyle = '1-3-1 날개 스플릿 운영';
    midGuide = '정면 5:5 대치 대신 사이드 라인에 칼챔/스플릿 챔피언을 배치하여 상대를 분산시키고 텔레포트(TP) 합류각을 보세요.';
  } else if (blueStats.avgPoke >= 6.8 && blueStats.avgEngage < 6.0) {
    macroStyle = '오브젝트 선점 포킹 & 시야 장악';
    midGuide = '오브젝트 1분 전 미리 시야를 잡고, 부쉬 뒤에서 포킹으로 적 체력을 깎은 뒤 안전하게 오브젝트를 수급하세요.';
  } else {
    macroStyle = '강제 5:5 한타 유도';
    midGuide = '미드 1차 타워를 먼저 밀고, 서포터와 정글러가 상대 시야를 지운 뒤 용/바론 앞 좁은 골목에서 일망타진 한타를 여세요.';
  }

  // Late Game
  let lateGuide = '';
  let endingTip = '';
  if (blueStats.avgScaling >= 7.5) {
    lateGuide = '후반으로 갈수록 블루팀의 데미지와 챔피언 밸류가 압도적입니다. 조급해하지 말고 3코어 이상 풀템을 갖추면 필승입니다.';
    endingTip = '무리한 다이브를 하지 말고 바론 버프를 두르고 3라인 천천히 억제기를 깎아내세요.';
  } else if (blueStats.avgScaling < redStats.avgScaling) {
    lateGuide = '후반으로 넘어가면 상대의 스케일링을 감당하기 힘듭니다. 25분~30분 이내에 바론 낚시나 결단력 있는 진입으로 끝내야 합니다.';
    endingTip = '상대 핵심 딜러가 혼자 파밍할 때 기습 암살 후 곧바로 바론이나 넥서스로 직행하세요.';
  } else {
    lateGuide = '후반 한타는 원딜과 미드 딜러의 생존이 100%를 좌우합니다. 존야/수호천사 쿨타임을 확인하고 교전에 임하세요.';
    endingTip = '장로 드래곤 버프를 먹는 팀이 게임을 끝냅니다. 장로 타이밍에 시야 장악에 전력을 다하세요.';
  }

  return {
    blueStats,
    redStats,
    blueWinRate,
    redWinRate,
    favoredTeam,
    headline,
    teamfight: {
      winner: tfWinner,
      ratingDiff: tfDiff,
      summary: tfSummary,
      bluePlan: blueTFPlan,
      redThreats: redTFThreats
    },
    winCondition: {
      earlyGame: {
        leadTeam: earlyLeadTeam,
        guide: earlyGuide,
        objectiveFocus: objFocus
      },
      midGame: {
        guide: midGuide,
        macroStyle
      },
      lateGame: {
        guide: lateGuide,
        endingTip
      }
    },
    laneMatchups
  };
}
