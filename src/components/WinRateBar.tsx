import React from 'react';
import { AnalysisResult } from '../types';
import { BarChart2, AlertCircle, CheckCircle } from 'lucide-react';

interface WinRateBarProps {
  analysis: AnalysisResult;
}

export const WinRateBar: React.FC<WinRateBarProps> = ({ analysis }) => {
  const { blueWinRate, redWinRate, favoredTeam, headline, blueStats, redStats } = analysis;

  return (
    <div className="bg-[#121620] border border-[#202738] rounded-xl p-4 sm:p-5 shadow-lg space-y-3.5">
      {/* Top Header & Verdict Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#4a72ff]/10 text-[#4a72ff] border border-[#4a72ff]/20">
            <BarChart2 size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">
                조합 밸런스 및 승률 예측
              </h2>
              <span
                className={`text-[11px] px-2 py-0.5 rounded font-bold border ${
                  favoredTeam === 'blue'
                    ? 'bg-[#4a72ff]/15 text-[#719df0] border-[#4a72ff]/30'
                    : favoredTeam === 'red'
                    ? 'bg-[#e0455f]/15 text-[#f56678] border-[#e0455f]/30'
                    : 'bg-gray-800 text-gray-300 border-gray-700'
                }`}
              >
                {favoredTeam === 'blue'
                  ? '블루팀 우세'
                  : favoredTeam === 'red'
                  ? '레드팀 우세'
                  : '호각 (50:50)'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{headline}</p>
          </div>
        </div>

        {/* Win Rate Percentage Display */}
        <div className="flex items-center gap-3 text-sm font-black self-end sm:self-center">
          <span className="text-[#4a72ff]">BLUE {blueWinRate}%</span>
          <span className="text-gray-600 text-xs font-normal">/</span>
          <span className="text-[#e0455f]">{redWinRate}% RED</span>
        </div>
      </div>

      {/* Visual Split Bar */}
      <div className="w-full h-3 bg-[#0d1017] rounded overflow-hidden flex p-0.5 border border-[#1f2638]">
        <div
          className="h-full bg-[#4a72ff] transition-all duration-500 rounded-l"
          style={{ width: `${blueWinRate}%` }}
        />
        <div
          className="h-full bg-[#e0455f] transition-all duration-500 rounded-r"
          style={{ width: `${redWinRate}%` }}
        />
      </div>

      {/* Warnings & Synergies Badges Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-0.5">
        {/* Blue Team Badges */}
        <div className="space-y-1.5 bg-[#0e121a] p-2.5 rounded-lg border border-[#1b2230]">
          <span className="text-[11px] font-bold text-[#4a72ff] block">
            블루팀 조합 특이사항
          </span>
          <div className="flex flex-wrap gap-1.5">
            {blueStats.warnings.map((w, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1"
              >
                <AlertCircle size={10} /> {w}
              </span>
            ))}
            {blueStats.synergies.map((s, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded bg-[#4a72ff]/10 text-blue-300 border border-[#4a72ff]/20 flex items-center gap-1"
              >
                <CheckCircle size={10} /> {s}
              </span>
            ))}
            {blueStats.warnings.length === 0 && blueStats.synergies.length === 0 && (
              <span className="text-[10px] text-gray-500">특이사항 없음 (표준 밸런스)</span>
            )}
          </div>
        </div>

        {/* Red Team Badges */}
        <div className="space-y-1.5 bg-[#170f14] p-2.5 rounded-lg border border-[#2b1b22]">
          <span className="text-[11px] font-bold text-[#e0455f] block">
            레드팀 조합 특이사항
          </span>
          <div className="flex flex-wrap gap-1.5">
            {redStats.warnings.map((w, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1"
              >
                <AlertCircle size={10} /> {w}
              </span>
            ))}
            {redStats.synergies.map((s, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded bg-[#e0455f]/10 text-rose-300 border border-[#e0455f]/20 flex items-center gap-1"
              >
                <CheckCircle size={10} /> {s}
              </span>
            ))}
            {redStats.warnings.length === 0 && redStats.synergies.length === 0 && (
              <span className="text-[10px] text-gray-500">특이사항 없음 (표준 밸런스)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
