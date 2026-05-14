
import React from 'react';
import { Row, Col, Card, Table, Tag, Descriptions, Statistic } from 'antd';
import { BarChart } from '@/components/Charts';
import ChatAssistant from '@/components/Chat/ChatAssistant';
import ReactECharts from 'echarts-for-react';

/**
 * Reinforced Federated Learning Quantitative Security Assessment - Module 2, Page 5
 * Features:
 * - Multi-dimensional risk indicators (data, algorithm, network, system)
 * - Real-time security posture assessment
 * - Subjective/objective weight analysis
 * - LLM-based analysis report generation
 */
const SecurityAssessment: React.FC = () => {
  // Risk indicators
  const riskIndicators = [
    { id: 'r1', category: '数据安全', indicator: '数据泄露风险', score: 85, weight: 0.25, level: '低风险' },
    { id: 'r2', category: '数据安全', indicator: '数据完整性', score: 92, weight: 0.20, level: '低风险' },
    { id: 'r3', category: '算法安全', indicator: '模型鲁棒性', score: 78, weight: 0.15, level: '中风险' },
    { id: 'r4', category: '算法安全', indicator: '对抗攻击防御', score: 65, weight: 0.15, level: '中风险' },
    { id: 'r5', category: '网络安全', indicator: '通信加密强度', score: 90, weight: 0.10, level: '低风险' },
    { id: 'r6', category: '系统安全', indicator: '节点可信度', score: 72, weight: 0.10, level: '中风险' },
    { id: 'r7', category: '系统安全', indicator: '权限控制', score: 88, weight: 0.05, level: '低风险' },
  ];

  const riskColumns = [
    { title: '维度', dataIndex: 'category', key: 'category' },
    { title: '风险指标', dataIndex: 'indicator', key: 'indicator' },
    { title: '评分', dataIndex: 'score', key: 'score', sorter: (a: any, b: any) => a.score - b.score,
      render: (v: number) => <Tag color={v >= 80 ? 'green' : v >= 60 ? 'orange' : 'red'}>{v}</Tag> },
    { title: '权重', dataIndex: 'weight', key: 'weight' },
    { title: '风险等级', dataIndex: 'level', key: 'level',
      render: (l: string) => <Tag color={l === '低风险' ? 'green' : l === '中风险' ? 'orange' : 'red'}>{l}</Tag> },
  ];

  // Radar chart for security posture
  const radarOption = {
    title: { text: '安全态势评估', textStyle: { fontSize: 14, fontWeight: 500 } },
    tooltip: {},
    radar: {
      indicator: [
        { name: '数据安全', max: 100 },
        { name: '算法安全', max: 100 },
        { name: '网络安全', max: 100 },
        { name: '系统安全', max: 100 },
      ],
      shape: 'circle',
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: [88, 72, 90, 80],
          name: '当前安全态势',
          areaStyle: { opacity: 0.3, color: '#1677ff' },
          lineStyle: { color: '#1677ff' },
        },
      ],
    }],
  };

  // Gauge for overall score
  const gaugeOption = {
    series: [{
      type: 'gauge',
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      progress: { show: true, width: 18 },
      pointer: { show: true, length: '60%' },
      axisLine: { lineStyle: { width: 18, color: [[0.6, '#ff4d4f'], [0.8, '#faad14'], [1, '#52c41a']] } },
      axisTick: { show: false },
      splitLine: { distance: -18, length: 18, lineStyle: { color: '#fff', width: 2 } },
      axisLabel: { distance: 25, fontSize: 12 },
      title: { show: true, offsetCenter: [0, '75%'], fontSize: 16 },
      detail: { fontSize: 32, fontWeight: 'bold', offsetCenter: [0, '40%'], formatter: '{value}分' },
      data: [{ value: 82, name: '安全综合得分' }],
    }],
  };

  return (
    <div>
      {/* Security score and posture */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <ReactECharts option={gaugeOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <ReactECharts option={radarOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="风险指标得分">
            <BarChart
              xData={['数据泄露', '数据完整', '模型鲁棒', '对抗防御', '通信加密', '节点可信', '权限控制']}
              series={[{ name: '评分', data: [85, 92, 78, 65, 90, 72, 88], color: '#1677ff' }]}
              height={260}
            />
          </Card>
        </Col>
      </Row>

      {/* Risk indicators table and weight analysis */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={14}>
          <Card title="风险指标设置与评估结果">
            <Table dataSource={riskIndicators} columns={riskColumns} rowKey="id" pagination={false} size="small" />
          </Card>
        </Col>
        <Col span={10}>
          <Card title="风险指标重要度分析">
            <BarChart
              xData={['数据泄露', '数据完整', '模型鲁棒', '对抗防御', '通信加密', '节点可信', '权限控制']}
              series={[{ name: '权重', data: [0.25, 0.20, 0.15, 0.15, 0.10, 0.10, 0.05] }]}
              horizontal
              height={280}
            />
          </Card>
        </Col>
      </Row>

      {/* LLM-based analysis */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <ChatAssistant
            title="大模型安全分析问答助手"
            placeholder="请输入安全分析相关问题，如：当前系统最大的安全风险是什么？"
            height={400}
          />
        </Col>
      </Row>
    </div>
  );
};

export default SecurityAssessment;
