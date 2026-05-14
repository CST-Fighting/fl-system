
import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface GaugeChartProps {
  title: string;
  value: number;
  max?: number;
  color?: string;
  suffix?: string;
  height?: number;
}

/**
 * Reusable gauge chart component for resource monitoring (CPU, Memory, Disk, etc.)
 */
const GaugeChart: React.FC<GaugeChartProps> = ({
  title,
  value,
  max = 100,
  color = '#1677ff',
  suffix = '%',
  height = 200,
}) => {
  const option: EChartsOption = useMemo(() => ({
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max,
        progress: { show: true, width: 14 },
        pointer: { show: false },
        axisLine: { lineStyle: { width: 14, color: [[1, '#e6e6e6']] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        title: { show: true, offsetCenter: [0, '70%'], fontSize: 14, color: '#666' },
        detail: {
          fontSize: 24,
          fontWeight: 'bold',
          offsetCenter: [0, '30%'],
          formatter: `{value}${suffix}`,
          color,
        },
        data: [{ value, name: title }],
        itemStyle: { color },
      },
    ],
  }), [title, value, max, color, suffix]);

  return <ReactECharts option={option} style={{ height }} />;
};

export default GaugeChart;
