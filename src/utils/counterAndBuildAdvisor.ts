import { Champion, Role, TeamDraft, TeamStatsSummary } from '../types';
import { CHAMPIONS } from '../data/champions';

export interface CounterPickRecommendation {
  champion: Champion;
  counterScore: number; // e.g. 8.5
  winRateAdvantage: string; // e.g. "+4.2% 승률 우위"
  tacticalReason: string; // e.g. "원거리 카이팅 및 돌진 차단으로 라인전 압살"
  spikeTip: string; // e.g. "1~3레벨 라인 슬로우 푸시 후 딜교환 유도"
}

export interface SituationalBuildAdvice {
  recommendedKeystone: string;
  secondaryRunes: {
    treeName: string;
    runes: string[];
    reason: string;
  };
  shards: string;
  recommendedSpell: string;
  situationalCoreItems: {
    name: string;
    timing: string;
    reason: string;
    priority: '필수' | '추천' | '상황별';
  }[];
  tacticalWarning: string;
}

// Known hard-counter pairings for hyper-accurate solo queue advice
const KNOWN_HARD_COUNTERS: Record<string, { counters: string[]; reason: string; tip: string }[]> = {
  // TOP
  Darius: [
    { counters: ['Quinn', 'Vayne', 'Gnar'], reason: '원거리 카이팅과 거리 조절 스킬로 출혈 5스택 각 원천 차단', tip: '유체화 킨 타이밍에만 생존기 아끼고 거리 유지' },
    { counters: ['Jayce', 'Kennen'], reason: '장거리 견제 및 진입 시 넉백/스턴으로 일방적 딜교환', tip: '도끼날(Q) 바깥쪽 안 맞게 거리 조절' }
  ],
  Malphite: [
    { counters: ['Sylas', 'Gwen', 'Mordekaiser'], reason: 'AP 마법 피해와 체력 비례 트루뎀으로 방어력 무력화', tip: '말파이트 궁극기를 강탈하거나 W/지속딜로 맞딜 승리' },
    { counters: ['ChoGath', 'Shen'], reason: '유지력과 CC기로 라인 푸시 주도권 장악', tip: '패시브 쉴드 쿨타임 돌기 전에 평타로 견제' }
  ],
  Aatrox: [
    { counters: ['Fiora', 'Irelia', 'Kled'], reason: 'Q 끝거리 안쪽으로 파고드는 근접 기동성과 치감 압박', tip: '아트록스 Q 1, 2타 안쪽으로 붙어 피하고 3타 사이드 회피' },
    { counters: ['Poppy'], reason: 'E 대시를 굳은 태세(W)로 차단하고 벽꿍 콤보', tip: '아트록스 대시 모션 보고 W 활성화' }
  ],
  Fiora: [
    { counters: ['Malphite', 'Poppy', 'Kennen'], reason: '공속 감소 및 원거리 포킹으로 급소 타격 억제', tip: '응수(W) 빠진 후 핵심 스킬 집중 투하' },
    { counters: ['Pantheon', 'Renekton'], reason: '초반 확정 스턴과 폭딜로 라인전 1:1 디나이', tip: 'W 응수 타이밍에 페이크 주고 스턴 적중' }
  ],

  // MID
  Zed: [
    { counters: ['Malzahar', 'Lissandra'], reason: '궁극기 진입 즉시 확정 타겟팅 제압/스턴 및 존야 연계', tip: '제드가 궁(R) 타고 뒤로 나타나는 순간 확정 궁 적중' },
    { counters: ['Vex', 'Galio'], reason: 'W/R 그림자 진입 카운터 공포 및 마법 쉴드 탱킹', tip: '그림자 타기 전 우울 게이지 유지' }
  ],
  Yasuo: [
    { counters: ['Renekton', 'Pantheon', 'Sett'], reason: '장막으로 막을 수 없는 타겟팅 CC 및 근접 브루저 맞딜 분쇄', tip: '바람 장막(W) 무시하고 W 확정 스턴 박고 딜교' },
    { counters: ['Vex', 'Malzahar'], reason: '돌진기 카운터 공포 및 장막 관통 제압', tip: 'E 미니언 타고 올 때 침묵/공포로 묶기' }
  ],
  LeBlanc: [
    { counters: ['Galio', 'Lissandra', 'Vex'], reason: '왜곡(W) 진입 경로에 광역 도발/스턴/공포로 진입 차단', tip: 'W 찍고 들어오는 타이밍에 맞춰 선 CC 발동' },
    { counters: ['Malzahar'], reason: '패시브 CC 쉴드 및 공허충 라인 밀어넣기로 로밍 억제', tip: '라인 박아넣고 타워에 묶어두기' }
  ],
  Ahri: [
    { counters: ['Yasuo', 'Syndra'], reason: '매혹(E) 바람 장막 차단 및 더 긴 사거리의 적군 와해 스턴', tip: '매혹 빠지면 궁극기 돌진 전까지 프리딜' },
    { counters: ['Lissandra', 'Vex'], reason: '혼령 질주 돌진 카운터 및 확정 결속', tip: '궁 진입 순간 맞궁으로 원콤 방지' }
  ],

  // JUG
  LeeSin: [
    { counters: ['Poppy', 'Gragas'], reason: 'Q 음파 돌진을 W 장막이나 E 배치기로 공중 차단', tip: '음파 2타 날아올 때 W 켜서 튕겨내기' },
    { counters: ['Udyr', 'Trundle'], reason: '정글 1:1 맞딜 우위 및 카정 압살', tip: '바위게 싸움에서 빼지 말고 정면 맞딜' }
  ],
  Viego: [
    { counters: ['Rammus', 'Jax', 'Amumu'], reason: '평타 기반 폭딜 카운터 및 한타 연속 처치 패시브 차단', tip: '안개 속에서 나올 때 하드 CC 집중 포커싱' }
  ],

  // BOT
  Samira: [
    { counters: ['Alistar', 'Rell', 'Nautilus'], reason: '궁극기(지옥불 난사)를 즉발 에어본/기절로 0.1초 만에 캔슬', tip: '궁극기 시전 모션 보자마자 CC기 투하' },
    { counters: ['Jinx', 'Caitlyn'], reason: '긴 사거리로 S랭크 스택 접근 자체를 차단', tip: '장막(W) 빠졌을 때 덫과 스킬 연계' }
  ],
  Ezreal: [
    { counters: ['Sivir', 'Ashe', 'Draven'], reason: '미니언 뒤 사거리 압박 및 초반 강력한 맞딜로 비전 이동 강제', tip: '신비한 화살(Q) 미니언 뒤에서 피하며 라인 푸시' }
  ],

  // SUP
  Blitzcrank: [
    { counters: ['Morgana', 'Alistar', 'Leona', 'Taric'], reason: '블랙실드로 그랩 무효화 또는 끌려가서 역이니시 대박', tip: '원딜 대신 앞라인이 그랩 맞아주고 역으로 적 원딜 물기' }
  ],
  Nautilus: [
    { counters: ['Morgana', 'Braum', 'Alistar'], reason: '닻줄 견인 및 궁극기를 블랙실드/불굴 방패로 흡수', tip: '닻 던질 때 미니언 뒤 포지셔닝 유지' }
  ],
  Soraka: [
    { counters: ['Blitzcrank', 'Nautilus', 'Pyke'], reason: '물몸 힐러를 순식간에 끌어와 점화로 폭사', tip: '소라카 먼저 물어서 힐 지원 자체를 차단' }
  ]
};

/**
 * Find Top 3 Counter Champions against an enemy pick in a specific role
 */
export function getCounterPicks(enemyChamp: Champion | null, role: Role): CounterPickRecommendation[] {
  if (!enemyChamp) return [];

  const candidates: { champ: Champion; score: number; reason: string; tip: string }[] = [];
  const pool = CHAMPIONS.filter(c => c.roles.includes(role) && c.id !== enemyChamp.id);

  // 1. Check direct hard-counter table
  const known = KNOWN_HARD_COUNTERS[enemyChamp.id];
  const knownCountersSet = new Set<string>();

  if (known) {
    for (const group of known) {
      for (const counterId of group.counters) {
        const found = pool.find(c => c.id === counterId);
        if (found) {
          candidates.push({
            champ: found,
            score: 9.2,
            reason: group.reason,
            tip: group.tip
          });
          knownCountersSet.add(found.id);
        }
      }
    }
  }

  // 2. Algorithmic Counter Calculation based on Kit Dynamics
  for (const c of pool) {
    if (knownCountersSet.has(c.id)) continue;

    let score = 5.0;
    let reason = '';
    let tip = '';

    // A. Range advantage in Solo Lane (TOP / MID)
    if ((role === 'TOP' || role === 'MID') && enemyChamp.rangeType === 'Melee' && c.rangeType === 'Ranged') {
      score += 2.0;
      reason = '원거리 사거리 우위를 활용한 일방적 평타 견제 및 CS 디나이';
      tip = '상대 돌진기 쿨타임일 때 집중 카이팅';
    }

    // B. Anti-Tank / High DPS vs High Tankiness
    if (enemyChamp.stats.tankiness >= 8 && (c.stats.splitPush >= 8 || c.damageType === 'True' || c.stats.scaling >= 8)) {
      score += 1.8;
      reason = `${c.nameKo}의 체력 비례/방관 피해로 ${enemyChamp.nameKo}의 방어력을 관통`;
      tip = '초반 라인 푸시 후 2코어 타이밍부터 사이드 스플릿 압살';
    }

    // C. Anti-Assassin / Lockdown CC vs High Mobility squishy
    if (enemyChamp.stats.mobility >= 8 && enemyChamp.stats.tankiness <= 4 && (c.stats.cc >= 8 || c.stats.peel >= 8)) {
      score += 2.2;
      reason = `상대 돌진 시 즉발 CC로 묶어 무력화시키는 카운터 스킬셋 보유`;
      tip = '상대 진입 스킬을 본 후 반격 CC를 넣어야 필승';
    }

    // D. Heavy Engage vs Immobile Poke Mage / ADC
    if (enemyChamp.stats.mobility <= 3 && c.stats.engage >= 8) {
      score += 1.9;
      reason = `뚜벅이인 ${enemyChamp.nameKo} 상대로 강제 돌진 이니시로 점멸 강제`;
      tip = '주요 생존기 빠진 타이밍에 정글러 콜하여 다이브';
    }

    // E. Early game lane bully vs weak early scaler
    if (enemyChamp.stats.earlyGame <= 4 && c.stats.earlyGame >= 8) {
      score += 1.7;
      reason = `초반 1~3레벨 주도권 차이를 이용한 디나이 및 정글 개입 주도`;
      tip = '슬로우 푸시 후 빅웨이브 다이브 설계';
    }

    // F. Damage type mismatch
    if (c.stats.earlyGame >= 7 && c.stats.damageAD >= 8 && enemyChamp.stats.tankiness <= 4) {
      score += 1.0;
      if (!reason) {
        reason = '강력한 초반 AD 교전력으로 맞딜 우위 점령';
        tip = '라인전 1:1 교전 유도';
      }
    }

    if (reason) {
      candidates.push({ champ: c, score, reason, tip });
    }
  }

  // Sort by score descending and take Top 3
  candidates.sort((a, b) => b.score - a.score);

  return candidates.slice(0, 3).map((item, idx) => {
    const diff = (item.score - 4.5).toFixed(1);
    const winAdv = idx === 0 ? `+${diff}% 승률 우위` : idx === 1 ? `+${(parseFloat(diff) - 0.6).toFixed(1)}% 승률 우위` : `+${(parseFloat(diff) - 1.2).toFixed(1)}% 승률 우위`;
    return {
      champion: item.champ,
      counterScore: parseFloat(item.score.toFixed(1)),
      winRateAdvantage: winAdv,
      tacticalReason: item.reason,
      spikeTip: item.tip || '핵심 스킬 교환 후 라인 주도권 장악'
    };
  });
}

/**
 * Generate Situational Rune & Item Build recommendations based on enemy team composition
 */
export function getSituationalBuildAdvice(
  myChamp: Champion | null,
  role: Role,
  enemyDraft: TeamDraft,
  enemyStats: TeamStatsSummary
): SituationalBuildAdvice {
  const enemyList = Object.values(enemyDraft).filter((c): c is Champion => c !== null);

  // Analyze enemy composition traits
  const hasHeavyCC = enemyStats.avgCC >= 7.0 || enemyList.some(c => c.stats.cc >= 9);
  const isHighAP = enemyStats.apRatio >= 60;
  const isAllAD = enemyStats.apRatio <= 15;
  const hasHeavyTanks = enemyList.filter(c => c.stats.tankiness >= 8).length >= 2;
  const hasHighHealSustain = enemyList.some(c => ['Aatrox', 'Soraka', 'Vladimir', 'Warwick', 'Briar', 'DrMundo', 'Sylas', 'Swain', 'Volibear'].includes(c.id));
  const hasSuppression = enemyList.some(c => ['Malzahar', 'Skarner', 'Lissandra', 'Warwick'].includes(c.id));
  const hasStealthAssassins = enemyList.some(c => ['Evelynn', 'Shaco', 'Rengar', 'KhaZix', 'Akali', 'Talon'].includes(c.id));
  const hasHeavyShields = enemyList.some(c => ['Shen', 'Lulu', 'Karma', 'TahmKench', 'Sett'].includes(c.id));

  // 1. Keystone & Secondary Runes
  let primaryKeystone = '정복자 (또는 감전/기민한 발놀림)';
  let secondaryTree = '결의 (Resolve)';
  let runes: string[] = ['뼈 방패 (Bone Plating)', '과잉성장 (Overgrowth)'];
  let treeReason = '안정적인 라인전 맞딜 및 폭딜 경감';

  if (myChamp) {
    if (myChamp.damageType === 'AP' && myChamp.rangeType === 'Ranged') {
      primaryKeystone = '신비로운 유성 / 감전 / 난입';
    } else if (myChamp.roles.includes('BOT') && myChamp.rangeType === 'Ranged') {
      primaryKeystone = '치명적 속도 / 집중 공격 / 기민한 발놀림';
    } else if (myChamp.stats.tankiness >= 8) {
      primaryKeystone = '여진 / 착취의 손아귀';
    } else if (myChamp.roles.includes('SUP')) {
      primaryKeystone = myChamp.rangeType === 'Ranged' ? '콩콩이 소환 / 수호자' : '여진 / 빙결 강화';
    }
  }

  // Adjust secondary runes based on enemy threats
  if (hasHeavyCC) {
    secondaryTree = '결의 (Resolve)';
    runes = ['불굴의 의지 (강인함 + 둔화 저항)', '재생의 바람 / 뼈 방패'];
    treeReason = '상대 하드 CC 연계 시간 단축 및 생존율 극대화';
  } else if (isHighAP) {
    secondaryTree = '마법 (Sorcery) / 결의';
    runes = ['무효화 구체 (AP 실드)', '주문 작열'];
    treeReason = '상대 다수 AP 챔피언의 순간 마법 누킹 방어';
  } else if (enemyStats.avgPoke >= 7.5) {
    secondaryTree = '결의 (Resolve)';
    runes = ['재생의 바람 (Second Wind)', '소생 (Revitalize)'];
    treeReason = '상대 장거리 포킹 견제 체력 회복 유지력 보강';
  } else {
    secondaryTree = '영감 (Inspiration)';
    runes = ['마법의 신발 (골드 절약)', '우주적 통찰력 (스펠/아이템 쿨감)'];
    treeReason = '템포 빠른 골드 스노우볼 및 플래시 쿨타임 가속';
  }

  // Shards
  const shardDef = isHighAP ? '적응형 능력치 + 이동속도/공속 + 마법 저항력' : isAllAD ? '적응형 능력치 + 공속/적응형 + 방어력 + 방어력' : '적응형 능력치 + 이동속도 + 성장 체력';

  // Recommended Spell
  let recommendedSpell = '점멸 + 점화 (또는 순간이동)';
  if (role === 'JUG') recommendedSpell = '강타 + 점멸';
  else if (role === 'SUP') recommendedSpell = enemyStats.avgMobility >= 7 ? '탈진 + 점멸' : '점화 + 점멸';
  else if (role === 'BOT') recommendedSpell = hasHeavyCC ? '정화 (Cleanse) + 점멸' : '회복(또는 방어막) + 점멸';
  else if (role === 'MID' && hasHeavyCC) recommendedSpell = '정화 (Cleanse) + 점멸 [강력 추천: 상대 CC 과다]';
  else if (role === 'TOP') recommendedSpell = '순간이동 + 점멸';

  // 2. Situational Core Items
  const situationalItems: SituationalBuildAdvice['situationalCoreItems'] = [];

  if (hasHighHealSustain) {
    situationalItems.push({
      name: myChamp?.damageType === 'AP' ? '망각의 구 (800G) -> 모렐로노미콘' : role === 'SUP' ? '화공 펑크 사슬검 / 가시대패' : '처형인의 대검 (800G) -> 필멸자의 운명 / 화공 펑크',
      timing: '1코어 완성 전후 800원 하위템 필수 구매',
      reason: '상대 자가 회복/힐러 유지력 40% 즉시 감소',
      priority: '필수'
    });
  }

  if (hasHeavyTanks) {
    situationalItems.push({
      name: myChamp?.damageType === 'AP' ? '공허의 지팡이 / 무덤꽃' : '도미닉 경의 인사 / 세릴다의 원한',
      timing: '3코어 타이밍',
      reason: '상대 마저/방어력 30% 이상 관통하여 앞라인 철거',
      priority: '필수'
    });
  }

  if (hasSuppression) {
    situationalItems.push({
      name: myChamp?.damageType === 'AP' ? '존야의 모래시계 / 밴시의 장막' : '수은 장식띠(QSS) -> 은빛 여명 / 헤르메스의 시미터',
      timing: '2~3코어',
      reason: '상대 타겟팅 제압/확정 CC 즉시 해제 및 무력화',
      priority: '필수'
    });
  }

  if (isAllAD) {
    situationalItems.push({
      name: '판금 장화(닌자의 신발) + 죽음의 무도 / 존야 / 란두인의 예언',
      timing: '1~2코어',
      reason: '상대 올AD 조합으로 방어력 아이템 가치 극대화',
      priority: '필수'
    });
  }

  if (hasHeavyShields && (myChamp?.damageType === 'AD' || role === 'TOP' || role === 'MID')) {
    situationalItems.push({
      name: '독사의 송곳니 (Serpent\'s Fang)',
      timing: '2~3코어',
      reason: '상대 다수 쉴드량 50% 삭감',
      priority: '추천'
    });
  }

  if (hasStealthAssassins) {
    situationalItems.push({
      name: myChamp?.damageType === 'AP' ? '존야의 모래시계' : '스테락의 도전 / 수호 천사',
      timing: '2~3코어',
      reason: '시야 밖 기습 암살 방지용 생존기 확보',
      priority: '추천'
    });
  }

  // If items empty, add standard power spike items
  if (situationalItems.length === 0) {
    situationalItems.push({
      name: '헤르메스의 발걸음 / 명석함의 아이오니아 장화',
      timing: '1코어 완성 후',
      reason: '상대 CC 및 쿨타임 가속 최적화',
      priority: '상황별'
    });
  }

  // Tactical Warning
  let tacticalWarning = '무난한 구도: 코어 아이템 완성 속도에 집중하세요.';
  if (hasHeavyCC && hasHighHealSustain) {
    tacticalWarning = '경고: 치감(800G)과 강인함(신발/룬)을 챙기지 않으면 중반 한타가 불가능합니다.';
  } else if (hasHighHealSustain) {
    tacticalWarning = '경고: 상대 피흡 챔피언이 킬을 먹기 전에 800원 치감 템을 선구매하세요.';
  } else if (isAllAD) {
    tacticalWarning = '핵심 팁: 아군 전원 판금 장화(방어력 신발) 구매 시 승률이 대폭 상승합니다.';
  } else if (hasSuppression) {
    tacticalWarning = '경고: 딜러 포지션은 수은 장식띠(QSS) 또는 정화 스펠 없이 전진하지 마세요.';
  }

  return {
    recommendedKeystone: primaryKeystone,
    secondaryRunes: {
      treeName: secondaryTree,
      runes,
      reason: treeReason
    },
    shards: shardDef,
    recommendedSpell,
    situationalCoreItems: situationalItems,
    tacticalWarning
  };
}
