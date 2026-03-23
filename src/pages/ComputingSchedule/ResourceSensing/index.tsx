
import React from 'react';
import { Row, Col, Card, Descriptions, Tag } from 'antd';
import { PieChart, BarChart } from '@/components/Charts';
import TopologyGraph from '@/components/TopologyGraph';
import ReactECharts from 'echarts-for-react';

/**
 * Multi-dimensional Resource Federated Collaborative Sensing - Module 2, Page 1
 * Features:
 * - Resource pool description spec
 * - Computing network real-time sensing
 * - Task status / type / node completion statistics
 */
const ResourceSensing: React.FC = () => {
  // Resource pool description
  const resourcePool = [
    { label: '总CPU核数', value: '256核', status: 'available' },
    { label: '总内存', value: '1024 GB', status: 'available' },
    { label: '总GPU', value: '32张', status: 'available' },
    { label: '总磁盘', value: '50 TB', status: 'available' },
    { label: '网络带宽', value: '10 Gbps', status: 'available' },
    { label: '节点数量', value: '12', status: 'available' },
  ];

  // Radar chart for multi-dimensional resource description
  const radarOption = {
    title: { text: '多维资源状态描述', textStyle: { fontSize: 14, fontWeight: 500 } },
    tooltip: {},
    radar: {
      indicator: [
        { name: 'CPU', max: 100 },
        { name: '内存', max: 100 },
        { name: 'GPU', max: 100 },
        { name: '磁盘', max: 100 },
        { name: '网络', max: 100 },
        { name: '安全', max: 100 },
      ],
    },
    series: [{
      type: 'radar',
      data: [
        { value: [72, 65, 55, 48, 78, 85], name: '当前使用率', areaStyle: { opacity: 0.2 } },
        { value: [90, 85, 80, 75, 90, 95], name: '总容量', areaStyle: { opacity: 0.1 } },
      ],
    }],
  };

  return (
    <div>
      {/* Resource pool overview */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="算力网络资源池">
            <Descriptions column={2} bordered size="small">
              {resourcePool.map((r) => (
                <Descriptions.Item key={r.label} label={r.label}>
                  {r.value} <Tag color="green" style={{ marginLeft: 8 }}>可用</Tag>
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <ReactECharts option={radarOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      {/* Task statistics */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Card>
            <PieChart
              title="任务状态统计"
              data={[
                { name: '运行中', value: 15 },
                { name: '已完成', value: 42 },
                { name: '排队中', value: 8 },
                { name: '失败', value: 3 },
              ]}
              height={280}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <PieChart
              title="任务类型统计"
              data={[
                { name: '训练任务', value: 28 },
                { name: '推理任务', value: 18 },
                { name: '数据处理', value: 12 },
                { name: '模型聚合', value: 10 },
              ]}
              roseType
              height={280}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <BarChart
              title="节点完成任务统计"
              xData={['节点-01', '节点-02', '节点-03', '节点-04', '节点-05', '节点-06']}
              series={[{ name: '完成任务数', data: [18, 12, 22, 8, 25, 15], color: '#1677ff' }]}
              height={280}
            />
          </Card>
        </Col>
      </Row>

      {/* Network topology */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <TopologyGraph title="算力网络拓扑结构实时感知" height={450} />
        </Col>
      </Row>
    </div>
  );
};

export default ResourceSensing;
