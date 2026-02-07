
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FunnelMetrics } from '../types';

interface FunnelChartProps {
  data: FunnelMetrics[];
  onSelectStep: (data: FunnelMetrics) => void;
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data, onSelectStep }) => {
  const chartData = data.map(d => ({
    name: d.step,
    conversion: d.currentConv,
    baseline: d.baselineConv,
    originalData: d
  }));

  return (
    <div className="h-96 w-full bg-[#0d1326]/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border-2 border-slate-800/40 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <h3 className="text-slate-500 text-[11px] font-black mb-6 uppercase tracking-[0.3em]">Conversion Vector Analysis (%)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          onClick={(state) => {
            if (state && state.activePayload) {
              onSelectStep(state.activePayload[0].payload.originalData);
            }
          }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id="warningGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
              <stop offset="100%" stopColor="#d97706" stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id="criticalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
              <stop offset="100%" stopColor="#b91c1c" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
          <XAxis 
            dataKey="name" 
            stroke="#475569" 
            fontSize={10} 
            fontWeight={800}
            tickLine={false}
            axisLine={false}
            dy={15}
          />
          <YAxis 
            stroke="#475569" 
            fontSize={10} 
            fontWeight={800}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            dx={-10}
          />
          <Tooltip
            cursor={{ fill: 'rgba(99,102,241,0.05)' }}
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              border: '1px solid #334155', 
              borderRadius: '16px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              padding: '12px'
            }}
            itemStyle={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '12px' }}
            labelStyle={{ color: '#64748b', fontSize: '10px', fontWeight: 'black', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
          />
          <Bar dataKey="conversion" radius={[8, 8, 0, 0]} cursor="pointer">
            {chartData.map((entry, index) => {
              const drop = entry.baseline - entry.conversion;
              const fill = drop > 10 ? "url(#criticalGradient)" : drop > 5 ? "url(#warningGradient)" : "url(#barGradient)";
              return <Cell key={`cell-${index}`} fill={fill} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FunnelChart;
