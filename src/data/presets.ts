import { TeamDraft } from '../types';
import { CHAMPIONS } from './champions';

function getChamp(id: string) {
  return CHAMPIONS.find(c => c.id === id) || null;
}

export interface PresetComp {
  id: string;
  title: string;
  description: string;
  blueDraft: TeamDraft;
  redDraft: TeamDraft;
}

export const PRESET_COMPS: PresetComp[] = [
  {
    id: 'preset-1',
    title: '정석 5인 한타 연계 vs 원거리 포킹 카이팅',
    description: '말파/세주/오리아나의 파괴적인 한타 콤보 vs 제이스/이즈리얼/카르마의 거리 조절 포킹 구도',
    blueDraft: {
      TOP: getChamp('Malphite'),
      JUG: getChamp('Sejuani'),
      MID: getChamp('Orianna'),
      BOT: getChamp('Jinx'),
      SUP: getChamp('Nautilus')
    },
    redDraft: {
      TOP: getChamp('Jayce'),
      JUG: getChamp('LeeSin'),
      MID: getChamp('Syndra'),
      BOT: getChamp('Ezreal'),
      SUP: getChamp('Karma')
    }
  },
  {
    id: 'preset-2',
    title: '1-3-1 날개 스플릿 vs 묵직한 국밥 이니시',
    description: '피오라/아리의 기동성과 사이드 철거 vs 오른/자르반/애쉬의 묵직한 앞라인과 글로벌 이니시',
    blueDraft: {
      TOP: getChamp('Fiora'),
      JUG: getChamp('Viego'),
      MID: getChamp('Ahri'),
      BOT: getChamp('KaiSa'),
      SUP: getChamp('Rakan')
    },
    redDraft: {
      TOP: getChamp('Ornn'),
      JUG: getChamp('JarvanIV'),
      MID: getChamp('Viktor'),
      BOT: getChamp('Ashe'),
      SUP: getChamp('Leona')
    }
  },
  {
    id: 'preset-3',
    title: '올AD 암살 조합(위험) vs 안티AD 탱커 밸류',
    description: '올AD 극딜 암살 조합이 상대 단단한 방템 앞라인(말파/자크/알리)을 만났을 때의 상성 분석',
    blueDraft: {
      TOP: getChamp('Yasuo'),
      JUG: getChamp('LeeSin'),
      MID: getChamp('Zed'),
      BOT: getChamp('Lucian'),
      SUP: getChamp('Pyke')
    },
    redDraft: {
      TOP: getChamp('Malphite'),
      JUG: getChamp('Zac'),
      MID: getChamp('Azir'),
      BOT: getChamp('Jhin'),
      SUP: getChamp('Alistar')
    }
  },
  {
    id: 'preset-4',
    title: '후반 왕귀 하이퍼캐리 vs 초반 15분 스노우볼',
    description: '카사딘/스몰더의 후반 절대 권력 vs 레넥톤/엘리스/르블랑의 초반 타워 다이브 압살 조합',
    blueDraft: {
      TOP: getChamp('Gwen'),
      JUG: getChamp('Karthus'),
      MID: getChamp('Kassadin'),
      BOT: getChamp('Smolder'),
      SUP: getChamp('Lulu')
    },
    redDraft: {
      TOP: getChamp('Renekton'),
      JUG: getChamp('Elise'),
      MID: getChamp('LeBlanc'),
      BOT: getChamp('Caitlyn'),
      SUP: getChamp('Nautilus')
    }
  }
];
