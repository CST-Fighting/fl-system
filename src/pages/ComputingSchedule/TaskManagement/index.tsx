
import React from 'react';
import { Row, Col, Card, Table, Tag, Descriptions, Tabs } from 'antd';
import { BarChart, PieChart } from '@/components/Charts';
import { mockNodes } from '@/mock/data';

/**
 * Computing Task Requirement Management - Module 2, Page 2
 * Features:
 * - Task demand management view
 * - Computing center capability view
 * - Node resource details
 * - Multi-dimensional resource management
 */
const TaskManagement: React.FC = () => {
  // Computing demand view
  const demands = [
    { id: 'd1', task: '联邦训练-图神经网络', cpu: 16, memory: 64, gpu: 4, storage: 200, priority: '高', status: '待分配' },
    { id: 'd2', task: '模型推理-欺诈检测', cpu: 8, memory: 32, gpu: 2, storage: 100, priority: '中', status: '已分配' },
    { id: 'd3', task: '数据ETL-通信数据', cpu: 4, memory: 16, gpu: 0, storage: 500, priority: '低', status: '已分配' },
    { id: 'd4', task: '安全检测-异常识别', cpu: 8, memory: 32, gpu: 2, storage: 150, priority: '高', status: '待分配' },
  ];

  const demandColumns = [
    { title: '任务名称', dataIndex: 'task', key: 'task' },
    { title: 'CPU(核)', dataIndex: 'cpu', key: 'cpu' },
    { title: '内存(GB)', dataIndex: 'memory', key: 'memory' },
    { title: 'GPU(张)', dataIndex: 'gpu', key: 'gpu' },
    { title: '存储(GB)', dataIndex: 'storage', key: 'storage' },
    { title: '优先级', dataIndex: 'priority', key: 'priority', render: (p: string) => {
      const color = p === '高' ? 'red' : p === '中' ? 'orange' : 'blue';
      return <Tag color={color}>{p}</Tag>;
    }},
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === '已分配' ? 'green' : 'gold'}>{s}</Tag> },
  ];

  // Node capability details
  const nodeDetailColumns = [
    { title: '节点名称', dataIndex: 'name', key: 'name' },
    { title: 'IP地址', dataIndex: 'ip', key: 'ip' },
    { title: 'CPU使用率(%)', dataIndex: 'cpu', key: 'cpu', sorter: (a: any, b: any) => a.cpu - b.cpu, render: (v: number) => <Tag color={v > 80 ? 'red' : v > 60 ? 'orange' : 'green'}>{v}%</Tag> },
    { title: '内存使用率(%)', dataIndex: 'memory', key: 'memory', sorter: (a: any, b: any) => a.memory - b.memory },
    { title: 'GPU使用率(%)', dataIndex: 'gpu', key: 'gpu', sorter: (a: any, b: any) => a.gpu - b.gpu },
    { title: '磁盘使用率(%)', dataIndex: 'disk', key: 'disk', sorter: (a: any, b: any) => a.disk - b.disk },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => {
      const map: Record<string, string> = { running: '运行中', idle: '空闲', warning: '告警', critical: '严重' };
      const colorMap: Record<string, string> = { running: 'green', idle: 'blue', warning: 'orange', critical: 'red' };
      return <Tag color={colorMap[s]}>{map[s]}</Tag>;
    }},
  ];

  return (
    <div>
      {/* Computing demand view */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="算力需求管理视图">
            <Table dataSource={demands} columns={demandColumns} rowKey="id" pagination={false} size="small" />
          </Card>
        </Col>
      </Row>

      {/* Node capabilities and resource overview */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card title="算力中心能力视图 — 节点资源详细信息">
            <Table dataSource={mockNodes} columns={nodeDetailColumns} rowKey="id" pagination={false} size="small" />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="算力种类分布">
            <PieChart
              data={[
                { name: 'CPU算力', value: 256 },
                { name: 'GPU算力', value: 32 },
                { name: '存储算力', value: 50 },
                { name: '网络带宽', value: 10 },
              ]}
              height={300}
            />
          </Card>
        </Col>
      </Row>

      {/* Multi-dimensional resource management */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="多维资源动态管理">
            <Tabs items={[
              {
                key: 'compute', label: '算力资源',
                children: <BarChart xData={mockNodes.map(n => n.name)} series={[
                  { name: 'CPU总量(核)', data: [32, 64, 48, 32, 48, 32], color: '#1677ff' },
                  { name: 'CPU已用(核)', data: [23, 29, 42, 7, 44, 18], color: '#ff7875' },
                ]} height={250} />,
              },
              {
                key: 'network', label: '网络资源',
                children: <BarChart xData={mockNodes.map(n => n.name)} series={[
                  { name: '带宽(Gbps)', data: [10, 10, 10, 10, 10, 10], color: '#1677ff' },
                  { name: '已用(Gbps)', data: [7.8, 5.2, 8.8, 2.3, 9.1, 5.6], color: '#ff7875' },
                ]} height={250} />,
              },
              {
                key: 'storage', label: '存储资源',
                children: <BarChart xData={mockNodes.map(n => n.name)} series={[
                  { name: '总容量(TB)', data: [10, 8, 10, 5, 10, 8], color: '#1677ff' },
                  { name: '已用(TB)', data: [4.8, 4.2, 6.7, 1.3, 7.2, 3.0], color: '#ff7875' },
                ]} height={250} />,
              },
            ]} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TaskManagement;
