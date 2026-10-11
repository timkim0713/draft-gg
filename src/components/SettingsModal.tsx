import React, { useState } from 'react';
import { X, Key, Shield, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  riotApiKey: string;
  geminiApiKey: string;
  onSave: (riotKey: string, geminiKey: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  riotApiKey,
  geminiApiKey,
  onSave
}) => {
  const [riotKey, setRiotKey] = useState(riotApiKey);
  const [gemKey, setGemKey] = useState(geminiApiKey);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(riotKey.trim(), gemKey.trim());
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-md bg-[#131720] border border-[#212838] rounded-xl shadow-2xl p-5 space-y-4 text-gray-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#1f2637] pb-3">
          <div className="flex items-center gap-2">
            <Key size={16} className="text-[#4a72ff]" />
            <h3 className="font-bold text-sm text-white">API 연동 설정</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#1f2637]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Riot API Key */}
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-300 block">
              Riot Games API Key (인게임 라이브 조회용)
            </label>
            <input
              type="password"
              value={riotKey}
              onChange={e => setRiotKey(e.target.value)}
              placeholder="RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="w-full px-3 py-2 bg-[#0c0f16] border border-[#232c3f] rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[#4a72ff]"
            />
            <p className="text-[11px] text-gray-500 leading-tight">
              Riot Developer Portal에서 발급받은 API 키를 입력하시면 소환사의 실시간 진행 중인 5:5 솔랭 픽을 자동 로드합니다.
            </p>
          </div>

          {/* Gemini API Key */}
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-300 block">
              Gemini AI API Key (LLM 심층 분석용)
            </label>
            <input
              type="password"
              value={gemKey}
              onChange={e => setGemKey(e.target.value)}
              placeholder="AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-3 py-2 bg-[#0c0f16] border border-[#232c3f] rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[#4a72ff]"
            />
            <p className="text-[11px] text-gray-500 leading-tight">
              Google AI Studio에서 무료 발급 가능한 Gemini 키를 입력하시면 실시간 최신 LLM이 프로 코치 시각에서 한타와 운영을 브리핑합니다. (미입력 시 내장 정밀 분석 엔진 동작)
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#1f2637] flex items-center justify-between">
          <span className="text-[11px] text-gray-500 flex items-center gap-1">
            <Shield size={12} />
            키는 브라우저 로컬 스토리지에 안전하게 보관됩니다.
          </span>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-4 py-2 bg-[#4a72ff] hover:bg-[#3b62ee] text-white rounded-lg font-bold text-xs transition-colors"
          >
            {savedNotice ? <Check size={14} /> : null}
            {savedNotice ? '저장 완료' : '저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
};
