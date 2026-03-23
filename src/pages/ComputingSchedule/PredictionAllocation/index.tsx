
import React from 'react';
import { Row, Col, Card, Table, Tag } from 'antd';
import { LineChart, BarChart, GaugeChart } from '@/components/Charts';
import { generateTimeLabels, generateSeriesData, mockNodes } from '@/mock/data';

/**
 * Computing Network Collaborative Prediction & Allocation - Module 2, Page 3
 * Features:
 * - Resource demand prediction at different cycles
 * - Reinforced federated intelligent scheduling allocation
 * - Node resource monitoring (CPU, GPU, Memory, Disk)
 */
const PredictionAllocation: React.FC = () => {
  const dailyLabels = generateTimeLabels(24, 'hour');
  const monthLabels = generateTimeLabels(12, 'month');

  // Allocation results
  const allocations = [
    { id: 'a1', task: '联邦训练A', node: '节点-01', cpu: 8, memory: 32, gpu: 2, score: 92 },
    { id: 'a2', task: '推理任务B', node: '节点-03', cpu: 4, memory: 16, gpu: 1, score: 88 },
    { id: 'a3', task: '数据处理C', node: '节点-02', cpu: 16, memory: 64, gpu: 0, score: 85 },
    { id: 'a4', task: '安全检测D', node: '节点-06', cpu: 4, memory: 8, gpu: 1, score: 79 },
  ];

  const allocColumns = [
    { title: '任务', dataIndex: 'task', key: 'task' },
    { title: '分配节点', dataIndex: 'node', key: 'node' },
    { title: 'CPU(核)', dataIndex: 'cpu', key: 'cpu' },
    { title: '内存(GB)', dataIndex: 'memory', key: 'memory' },
    { title: 'GPU', dataIndex: 'gpu', key: 'gpu' },
    { title: '调度评分', dataIndex: 'score', key: 'score', render: (v: number) => <Tag color={v >= 90 ? 'green' : v >= 80 ? 'blue' : 'orange'}>{v}</Tag> },
  ];

  return (
    <div>
      {/* Resource demand prediction */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="算力资源服务需求预测（日）">
            <LineChart
              xData={dailyLabels}
              series={[
                { name: 'CPU需求预测', data: generateSeriesData(24, 40, 95), color: '#1677ff', areaStyle: true },
                { name: '实际CPU使用', data: generateSeriesData(24, 35, 85), color: '#ff7875' },
              ]}
              height={280}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="算力资源服务需求预测（月）">
            <LineChart
              xData={monthLabels}
              series={[
                { name: 'GPU需求预测', data: generateSeriesData(12, 20, 80), color: '#faad14', areaStyle: true },
                { name: '存储需求预测', data: generateSeriesData(12, 30, 70), color: '#52c41a', areaStyle: true },
              ]}
              height={280}
            />
          </Card>
        </Col>
      </Row>

      {/* RL allocation results */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={14}>
          <Card title="强化联邦智能调度 — 算力资源分配结果">
            <Table dataSource={allocations} columns={allocColumns} rowKey="id" pagination={false} size="small" />
          </Card>
        </Col>
        <Col span={10}>
          <Card title="调度策略效果对比">
            <BarChart
              xData={['轮询', '随机', '贪心', '强化学习']}
              series={[
                { name: '平均完成时间(s)', data: [120, 115, 98, 72], color: '#1677ff' },
                { name: '资源利用率(%)', data: [65, 68, 78, 92], color: '#52c41a' },
              ]}
              height={280}
            />
          </Card>
        </Col>
      </Row>

      {/* Node resource monitoring gauges */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="单节点资源监控面板">
            <Row gutter={16}>
              {mockNodes.slice(0, 4).map((node) => (
                <Col span={6} key={node.id}>
                  <Card size="small" title={node.name} bordered={false}>
                    <Row gutter={8}>
                      <Col span={12}><GaugeChart title="CPU" value={node.cpu} color="#1677ff" height={120} /></Col>
                      <Col span={12}><GaugeChart title="GPU" value={node.gpu} color="#faad14" height={120} /></Col>
                      <Col span={12}><GaugeChart title="内存" value={node.memory} color="#52c41a" height={120} /></Col>
                      <Col span={12}><GaugeChart title="磁盘" value={node.disk} color="#eb2f96" height={120} /></Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PredictionAllocation;
