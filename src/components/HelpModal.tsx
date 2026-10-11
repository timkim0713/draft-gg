import React from 'react';
import { X, Sparkles, CheckCircle2, Monitor, Keyboard } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-[#161a23] border border-[#2c3240] rounded-xl shadow-2xl p-6 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#232936] pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Sparkles size={18} className="text-[#5383e8]" />
            LoL Comp Coach 활용 가이드
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#2c3240] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3.5 text-xs text-gray-300 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <Keyboard size={16} className="text-[#5383e8] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white mb-0.5">초고속 초성 검색 지원</p>
              <p className="text-gray-400">
                픽창 시간이 촉박할 때는 챔피언 검색창에 초성만 입력하세요.
                (예: <span className="text-[#5383e8]">ㅇㅅㅇ</span> -&gt; 야스오, <span className="text-[#5383e8]">ㅁㅍㅇㅌ</span> -&gt; 말파이트, <span className="text-[#5383e8]">ㄹㅅ</span> -&gt; 리 신)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Monitor size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white mb-0.5">보조 모니터나 스마트폰/태블릿 활용</p>
              <p className="text-gray-400">
                게임을 플레이하면서 보조 모니터나 스마트폰 웹 브라우저로 띄워두면, 로딩창과 인게임에서 우리 팀이 취해야 할 운영법을 상시 확인할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white mb-0.5">실시간 조합 시뮬레이션</p>
              <p className="text-gray-400">
                픽/밴이 진행되는 도중에도 챔피언을 하나씩 클릭하여 상대방의 조합 픽에 따른 실시간 유불리 변화를 즉각 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#232936] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#5383e8] hover:bg-[#4171d6] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
