import React from 'react';
import { AnalysisResult } from '../types';
import { Trophy, AlertTriangle, Sparkles } from 'lucide-react';

interface WinRateBarProps {
  analysis: AnalysisResult;
}

export const WinRateBar: React.FC<WinRateBarProps> = ({ analysis }) => {
  const { blueWinRate, redWinRate, favoredTeam, headline, blueStats, redStats } = analysis;

  return (
    <div className="bg-[#161a23] border border-[#232936] rounded-xl p-5 shadow-lg space-y-4">
      {/* Top Header & Verdict Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#5383e8]/10 text-[#5383e8] border border-[#5383e8]/20">
            <Trophy size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              종합 조합 진단
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  favoredTeam === 'blue'
                    ? 'bg-[#5383e8]/20 text-[#719df0] border-[#5383e8]/40'
                    : favoredTeam === 'red'
                    ? 'bg-[#e84057]/20 text-[#f56678] border-[#e84057]/40'
                    : 'bg-gray-700/30 text-gray-300 border-gray-600'
                }`}
              >
                {favoredTeam === 'blue'
                  ? '🔵 블루팀 조합 우세'
                  : favoredTeam === 'red'
                  ? '🔴 레드팀 조합 우세'
                  : '⚪ 팽팽한 호각 (50:50)'}
              </span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{headline}</p>
          </div>
        </div>

        {/* Win Rate Percentage Display */}
        <div className="flex items-center gap-4 text-sm font-extrabold self-end sm:self-center">
          <span className="text-[#5383e8]">{blueWinRate}%</span>
          <span className="text-gray-500 text-xs font-normal">VS</span>
          <span className="text-[#e84057]">{redWinRate}%</span>
        </div>
      </div>

      {/* Visual Split Bar */}
      <div className="w-full h-3.5 bg-[#1a1f2c] rounded-full overflow-hidden flex p-0.5 border border-[#2a3140]">
        <div
          className="h-full bg-gradient-to-r from-[#3b6ecc] to-[#5383e8] rounded-l-full transition-all duration-500 relative"
          style={{ width: `${blueWinRate}%` }}
        />
        <div
          className="h-full bg-gradient-to-r from-[#e84057] to-[#c7283e] rounded-r-full transition-all duration-500 relative"
          style={{ width: `${redWinRate}%` }}
        />
      </div>

      {/* Warnings & Synergies Badges Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* Blue Team Badges */}
        <div className="space-y-1.5 bg-[#121620] p-2.5 rounded-lg border border-[#1e2533]">
          <span className="text-[11px] font-bold text-[#5383e8] flex items-center gap-1">
            🔵 블루팀 핵심 체크포인트
          </span>
          <div className="flex flex-wrap gap-1.5">
            {blueStats.warnings.map((w, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1"
              >
                <AlertTriangle size={11} /> {w}
              </span>
            ))}
            {blueStats.synergies.map((s, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center gap-1"
              >
                <Sparkles size={11} /> {s}
              </span>
            ))}
            {blueStats.warnings.length === 0 && blueStats.synergies.length === 0 && (
              <span className="text-[11px] text-gray-500">무난한 밸런스 조합</span>
            )}
          </div>
        </div>

        {/* Red Team Badges */}
        <div className="space-y-1.5 bg-[#1b1419] p-2.5 rounded-lg border border-[#331e28]">
          <span className="text-[11px] font-bold text-[#e84057] flex items-center gap-1">
            🔴 레드팀 핵심 체크포인트
          </span>
          <div className="flex flex-wrap gap-1.5">
            {redStats.warnings.map((w, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1"
              >
                <AlertTriangle size={11} /> {w}
              </span>
            ))}
            {redStats.synergies.map((s, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center gap-1"
              >
                <Sparkles size={11} /> {s}
              </span>
            ))}
            {redStats.warnings.length === 0 && redStats.synergies.length === 0 && (
              <span className="text-[11px] text-gray-500">무난한 밸런스 조합</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
