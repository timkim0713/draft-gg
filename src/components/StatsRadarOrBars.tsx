import React from 'react';
import { TeamStatsSummary } from '../types';
import { BarChart3, Shield, Zap, Crosshair, TrendingUp, Compass } from 'lucide-react';

interface StatsComparisonProps {
  blueStats: TeamStatsSummary;
  redStats: TeamStatsSummary;
}

interface StatRowProps {
  label: string;
  icon: React.ReactNode;
  blueVal: number;
  redVal: number;
  max?: number;
}

const StatRow: React.FC<StatRowProps> = ({ label, icon, blueVal, redVal, max = 10 }) => {
  const bluePct = Math.min(100, Math.round((blueVal / max) * 100));
  const redPct = Math.min(100, Math.round((redVal / max) * 100));

  return (
    <div className="space-y-1.5 py-1.5 border-b border-[#1b2230] last:border-0">
      <div className="flex items-center justify-between text-xs font-medium text-gray-300">
        <div className="flex items-center gap-1.5 text-gray-400">
          {icon}
          <span>{label}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-bold">
          <span className={blueVal > redVal ? 'text-[#4a72ff]' : 'text-gray-400'}>
            {blueVal.toFixed(1)}점
          </span>
          <span className="text-gray-600 font-normal">vs</span>
          <span className={redVal > blueVal ? 'text-[#e0455f]' : 'text-gray-400'}>
            {redVal.toFixed(1)}점
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 h-2">
        {/* Blue bar (fills right to left) */}
        <div className="w-full bg-[#121622] rounded overflow-hidden flex justify-end">
          <div
            className="h-full bg-[#4a72ff] rounded transition-all duration-300"
            style={{ width: `${bluePct}%` }}
          />
        </div>
        {/* Red bar (fills left to right) */}
        <div className="w-full bg-[#24131a] rounded overflow-hidden">
          <div
            className="h-full bg-[#e0455f] rounded transition-all duration-300"
            style={{ width: `${redPct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export const StatsRadarOrBars: React.FC<StatsComparisonProps> = ({ blueStats, redStats }) => {
  return (
    <div className="bg-[#121620] border border-[#202738] rounded-xl p-4 sm:p-5 shadow-lg space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <BarChart3 size={16} className="text-[#4a72ff]" />
          조합 핵심 스탯 비교
        </h3>
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="text-[#4a72ff]">BLUE</span>
          <span className="text-[#e0455f]">RED</span>
        </div>
      </div>

      {/* Damage Composition (AD vs AP) */}
      <div className="bg-[#0e121a] p-3 rounded-lg border border-[#1b2230] space-y-2">
        <span className="text-xs font-semibold text-gray-400 block">데미지 밸런스 (AD / AP 비율)</span>
        
        {/* Blue Damage */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-gray-400">
            <span>블루팀: AD {blueStats.adRatio}% / AP {blueStats.apRatio}%</span>
            <span className={blueStats.adRatio >= 75 ? 'text-amber-400 font-bold' : ''}>
              {blueStats.adRatio >= 75 ? 'AD 치중' : blueStats.apRatio >= 75 ? 'AP 치중' : '균형'}
            </span>
          </div>
          <div className="w-full h-2 bg-[#191f2c] rounded overflow-hidden flex">
            <div className="bg-amber-500 h-full" style={{ width: `${blueStats.adRatio}%` }} title="AD" />
            <div className="bg-purple-500 h-full" style={{ width: `${blueStats.apRatio}%` }} title="AP" />
          </div>
        </div>

        {/* Red Damage */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[11px] text-gray-400">
            <span>레드팀: AD {redStats.adRatio}% / AP {redStats.apRatio}%</span>
            <span className={redStats.adRatio >= 75 ? 'text-amber-400 font-bold' : ''}>
              {redStats.adRatio >= 75 ? 'AD 치중' : redStats.apRatio >= 75 ? 'AP 치중' : '균형'}
            </span>
          </div>
          <div className="w-full h-2 bg-[#191f2c] rounded overflow-hidden flex">
            <div className="bg-amber-500 h-full" style={{ width: `${redStats.adRatio}%` }} title="AD" />
            <div className="bg-purple-500 h-full" style={{ width: `${redStats.apRatio}%` }} title="AP" />
          </div>
        </div>
      </div>

      {/* 5 Key Metric Bars */}
      <div className="space-y-1 pt-0.5">
        <StatRow
          label="CC기 및 군중 제어"
          icon={<Zap size={14} className="text-yellow-400" />}
          blueVal={blueStats.avgCC}
          redVal={redStats.avgCC}
        />
        <StatRow
          label="강제 이니시에이팅"
          icon={<Compass size={14} className="text-sky-400" />}
          blueVal={blueStats.avgEngage}
          redVal={redStats.avgEngage}
        />
        <StatRow
          label="앞라인 탱킹 및 지키기"
          icon={<Shield size={14} className="text-emerald-400" />}
          blueVal={blueStats.avgTankiness}
          redVal={redStats.avgTankiness}
        />
        <StatRow
          label="원거리 포킹 및 대치"
          icon={<Crosshair size={14} className="text-rose-400" />}
          blueVal={blueStats.avgPoke}
          redVal={redStats.avgPoke}
        />
        <StatRow
          label="후반 왕귀력 (스케일링)"
          icon={<TrendingUp size={14} className="text-indigo-400" />}
          blueVal={blueStats.avgScaling}
          redVal={redStats.avgScaling}
        />
      </div>
    </div>
  );
};
