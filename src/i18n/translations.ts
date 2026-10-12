export type Language = 'ko' | 'en';

export const TRANSLATIONS = {
  ko: {
    // Header
    brandTitle: 'Draft',
    brandSuffix: '.gg',
    brandBadge: 'AI',
    brandSubtitle: '5:5 솔로랭크 밴픽 & 인게임 1분 코치',
    manualMode: '수동 픽 모드',
    liveMode: '라이브 인게임',
    presetSample: '추천 조합 프리셋',
    swapTeams: '진영 스왑',
    resetDraft: '초기화',
    settings: '설정',
    help: '도움말',
    summonerPlaceholder: '소환사명#태그 (예: Hide on bush#KR1)',
    searchLiveGame: '인게임 조회',
    searching: '조회 중...',
    reanalyzeAI: 'AI 재분석',
    analyzingAI: '분석 중...',
    sampleInGame: '샘플 인게임 로드',

    // Live Search Card
    liveSearchTitle: '라이브 인게임 솔로랭크 자동 조회',
    liveSearchSubtitle: '소환사명과 태그(Riot ID)를 입력하여 현재 진행 중인 게임 10명의 챔피언과 룬 세팅을 실시간으로 자동 로드합니다.',
    liveSearchBtn: '인게임 조회',
    quickProSamples: '1클릭 프로 선수 샘플:',
    liveGameActive: '라이브 인게임 연동 활성',
    liveGameDuration: '진행 시간:',
    liveGameMode: '게임 모드:',
    noApiKeyNotice: 'Riot 개발자 API 키가 필요하신가요? 우측 상단 [설정]에서 무료 발급 키를 입력하시거나, 아래 프로 선수 샘플을 클릭하여 즉시 체험할 수 있습니다.',
    
    // View Modes
    quickMode: '1분 초간단 브리핑 (로딩창 추천)',
    detailedMode: '상세 분석 모드',
    manualModeNotice: '수동 빠른 픽 모드 활성화됨 (클릭 시 자동 다음 슬롯 이동)',
    liveModeNotice: '라이브 인게임 조회 모드',

    // Draft Slots
    blueTeam: 'BLUE TEAM',
    redTeam: 'RED TEAM',
    ourTeam: '우리 팀',
    enemyTeam: '상대 팀',
    slotInstruction: '슬롯 클릭 시 픽 대상 지정',
    selectChampion: '챔피언 선택',

    // Fast Inline Picker
    targetSlot: '선택 대상:',
    blueBtn: '블루팀',
    redBtn: '레드팀',
    searchChampPlaceholder: '챔피언/초성 검색 (예: ㅇㅅㅇ, ㅋㅇㅅ, Yasuo)',
    counterRecPrefix: '상대',
    counterRecSuffix: '카운터 추천:',
    allRolePrefix: '',
    allRoleSuffix: '전체',
    noSearchResults: '검색 결과가 없습니다.',

    // Quick Briefing Card
    blueFavored: '블루팀 {rate}% 조합 우세',
    redFavored: '레드팀 {rate}% 조합 우세',
    evenFavored: '50:50 백중세 (피지컬 싸움)',
    copyChat: '팀 채팅용 1줄 오더 복사',
    copied: '복사 완료! (Ctrl+V)',
    step1Title: '1. 초반 동선 (0~14분)',
    step1Tag: '오브젝트 우선순위',
    step2Title: '2. 한타/중반 오더 (15~25분)',
    step2Tag: '교전 설계',
    step3Title: '3. 패배 위험 구간 (주의점)',
    step3Tag: '역전 방지',
    myRoleFocus: '내 포지션 맞춤 미션:',
    recommendedSpell: '추천 스펠:',
    runesAndBuildTitle: '적 조합 카운터 룬 & 빌드 추천',
    runesAndBuildTag: '적 특성 맞춤 대응',
    secondaryTree: '보조 룬 트리:',
    reason: '이유:',
    statShards: '추천 파편:',
    situationalCoreItems: '상황별 핵심 코어 템:',
    countersTop3Title: '상대 ({champ}) 카운터픽 TOP 3',
    countersTop3Tag: '라인 상성 우위',
    countersPlaceholder: '상대 {role} 챔피언이 선택되면 실시간 최적 카운터가 표시됩니다.',
    laneAdvantage: '전 라인 유불리:',
    keyThreatSkills: '적 핵심 주의 스킬:',
    laneLeadBlue: '주도권 우세',
    laneLeadRed: '상대 주도권',
    laneLeadEven: '호각',
    blueWinTeamfight: '5:5 강제 교전 유도 (블루 한타 대승)',
    redAvoidTeamfight: '사이드 분산 및 각개격파',

    // Lane Counter Advisor
    counterAdvisorTitle: '라인별 상대 맞춤 카운터픽 분석기 (Lane Counter Engine)',
    counterAdvisorSubtitle: '적 픽 파훼 승률 TOP 3 추천 및 상성 분석',
    selectBtn: '선택',
    timing: '타이밍:',
    opponentUnselected: '상대 챔피언이 지정되면 최적 카운터픽이 자동 산출됩니다.',

    // Roles
    roles: {
      TOP: '탑',
      JUG: '정글',
      MID: '미드',
      BOT: '원딜',
      SUP: '서폿'
    },

    // Footer
    footerText: 'Draft.gg - 5:5 솔로랭크 밴픽 & 인게임 초고속 1분 코치 도구'
  },

  en: {
    // Header
    brandTitle: 'Draft',
    brandSuffix: '.gg',
    brandBadge: 'AI',
    brandSubtitle: '5:5 SoloQ Draft & In-Game 1-Minute Coach',
    manualMode: 'Manual Pick',
    liveMode: 'Live In-Game',
    presetSample: 'Preset Comps',
    swapTeams: 'Swap Sides',
    resetDraft: 'Reset',
    settings: 'Settings',
    help: 'Help',
    summonerPlaceholder: 'Summoner#Tag (e.g. Faker#KR1)',
    searchLiveGame: 'Search Game',
    searching: 'Searching...',
    reanalyzeAI: 'Analyze AI',
    analyzingAI: 'Analyzing...',
    sampleInGame: 'Load Sample Game',

    // Live Search Card
    liveSearchTitle: 'Live SoloQ Game Spectator Search',
    liveSearchSubtitle: 'Enter Summoner Name and Tag (Riot ID) to automatically load all 10 champions and runes from active match.',
    liveSearchBtn: 'Search Live Game',
    quickProSamples: '1-Click Pro Samples:',
    liveGameActive: 'Live Game Connected',
    liveGameDuration: 'Game Time:',
    liveGameMode: 'Mode:',
    noApiKeyNotice: 'Need a Riot API key? Add your free key in Settings, or click the pro player presets below to test live analysis immediately.',

    // View Modes
    quickMode: '1-Min Quick Briefing (Loading Screen)',
    detailedMode: 'Detailed Analysis Mode',
    manualModeNotice: 'Fast manual pick active (click advances to next slot)',
    liveModeNotice: 'Live game spectator mode',

    // Draft Slots
    blueTeam: 'BLUE TEAM',
    redTeam: 'RED TEAM',
    ourTeam: 'Our Team',
    enemyTeam: 'Enemy Team',
    slotInstruction: 'Click slot to set pick target',
    selectChampion: 'Select Champion',

    // Fast Inline Picker
    targetSlot: 'Target Slot:',
    blueBtn: 'Blue Team',
    redBtn: 'Red Team',
    searchChampPlaceholder: 'Search champion (e.g. Yasuo, Ahri, Lee Sin)',
    counterRecPrefix: 'Counters vs',
    counterRecSuffix: ':',
    allRolePrefix: 'All',
    allRoleSuffix: '',
    noSearchResults: 'No champions found.',

    // Quick Briefing Card
    blueFavored: 'Blue Team {rate}% Comp Advantage',
    redFavored: 'Red Team {rate}% Comp Advantage',
    evenFavored: '50:50 Even Matchup (Execution Diff)',
    copyChat: 'Copy 1-Line Team Chat Order',
    copied: 'Copied! (Ctrl+V)',
    step1Title: '1. Early Game (0~14m)',
    step1Tag: 'Objective Priority',
    step2Title: '2. Mid Game / Teamfight (15~25m)',
    step2Tag: 'Teamfight Setup',
    step3Title: '3. Danger Zone (Macro Threat)',
    step3Tag: 'Prevent Throw',
    myRoleFocus: 'My Role Focus:',
    recommendedSpell: 'Recommended Spells:',
    runesAndBuildTitle: 'Situational Runes & Item Build',
    runesAndBuildTag: 'Comp Counter Build',
    secondaryTree: 'Secondary Tree:',
    reason: 'Reason:',
    statShards: 'Stat Shards:',
    situationalCoreItems: 'Situational Core Items:',
    countersTop3Title: 'Top 3 Counters vs {champ}',
    countersTop3Tag: 'Lane Advantage',
    countersPlaceholder: 'Counters will appear when enemy {role} is selected.',
    laneAdvantage: 'All Lanes Advantage:',
    keyThreatSkills: 'Key Enemy Threat Skills:',
    laneLeadBlue: 'Lane Lead',
    laneLeadRed: 'Opponent Lead',
    laneLeadEven: 'Even',
    blueWinTeamfight: 'Force 5v5 teamfights around objectives (Blue comp dominates)',
    redAvoidTeamfight: 'Avoid 5v5; split-push side lanes and look for picks',

    // Lane Counter Advisor
    counterAdvisorTitle: 'Lane Counter-Pick Advisory Engine',
    counterAdvisorSubtitle: 'Top 3 counter picks with win rate advantage and matchup advice',
    selectBtn: 'Pick',
    timing: 'Timing:',
    opponentUnselected: 'Top counters will be calculated once enemy champion is locked in.',

    // Roles
    roles: {
      TOP: 'Top',
      JUG: 'Jungle',
      MID: 'Mid',
      BOT: 'Bot',
      SUP: 'Support'
    },

    // Footer
    footerText: 'Draft.gg - 5:5 SoloQ Draft & In-Game 1-Minute Coach Tool'
  }
};
