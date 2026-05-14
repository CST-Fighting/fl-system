import { useEffect, useState, useMemo } from 'react';
import {
  getTaskDemands,
} from '@/services/api';
import nodeCsvText from '@/assets/node_resource_detail.csv?raw';
import trendCsvText from '@/assets/resource_timeseries.csv?raw';
import {
  DemandItem,
  NodeItem,
  StatItem,
  ResourceUsageItem,
  TrendData,
  MapNodeItem,
  PriorityGroup,
  PriorityLevel,
  PRIORITY_ORDER,
  PRIORITY_META,
  NodeStatusGroup,
  NodeStatus,
  NODE_STATUS_ORDER,
  NODE_STATUS_META,
  ResourceAlert,
  ALERT_THRESHOLDS,
} from './types';

const MAP_NODES: MapNodeItem[] = [
  { name: '拉萨算力中心', longitude: 91.1322, latitude: 29.6604, capacity: 120, level: '边缘节点' },
  { name: '长沙算力中心', longitude: 112.9398, latitude: 28.2282, capacity: 150, level: '边缘节点' },
  { name: '西宁算力中心', longitude: 101.7783, latitude: 36.6167, capacity: 100, level: '边缘节点' },
  { name: '昆明算力中心', longitude: 102.7123, latitude: 25.0406, capacity: 180, level: '边缘节点' },
  { name: '南宁算力中心', longitude: 108.3667, latitude: 22.8167, capacity: 200, level: '边缘节点' },
  { name: '海口算力中心', longitude: 110.3500, latitude: 20.0167, capacity: 90, level: '区域级' },
  { name: '银川算力中心', longitude: 106.2667, latitude: 38.4667, capacity: 130, level: '区域级' },
  { name: '兰州算力中心', longitude: 103.8333, latitude: 36.0667, capacity: 160, level: '区域级' },
  { name: '乌鲁木齐算力中心', longitude: 87.6167, latitude: 43.8167, capacity: 80, level: '区域级' },
  { name: '呼和浩特边缘算力中心', longitude: 111.7519, latitude: 40.8515, capacity: 110, level: '区域级' },
  { name: '哈尔滨边缘算力中心', longitude: 126.6333, latitude: 45.7500, capacity: 140, level: '区域级' },
  { name: '天津西青算力中心', longitude: 117.0833, latitude: 39.1333, capacity: 220, level: '区域级' },
  { name: '石家庄算力中心', longitude: 114.5167, latitude: 38.0333, capacity: 170, level: '区域级' },
  { name: '太原算力中心', longitude: 112.5500, latitude: 37.8667, capacity: 130, level: '区域级' },
  { name: '沈阳算力中心', longitude: 123.4315, latitude: 41.8057, capacity: 190, level: '区域级' },
  { name: '长春算力中心', longitude: 125.3167, latitude: 43.8833, capacity: 160, level: '区域级' },
  { name: '上海算力中心', longitude: 121.4737, latitude: 31.2304, capacity: 300, level: '区域级' },
  { name: '杭州算力中心', longitude: 120.1551, latitude: 30.2741, capacity: 250, level: '区域级' },
  { name: '合肥算力中心', longitude: 117.2833, latitude: 31.8667, capacity: 210, level: '边缘节点' },
  { name: '南昌算力中心', longitude: 115.8917, latitude: 28.6767, capacity: 180, level: '边缘节点' },
  { name: '济南算力中心', longitude: 117.0000, latitude: 36.6667, capacity: 230, level: '边缘节点' },
  { name: '郑州算力中心', longitude: 113.6653, latitude: 34.7578, capacity: 240, level: '边缘节点' },
  { name: '广州算力中心', longitude: 113.2644, latitude: 23.1291, capacity: 350, level: '边缘节点' },
  { name: '深圳算力中心', longitude: 114.0579, latitude: 22.5431, capacity: 400, level: '边缘节点' },
  { name: '贵阳算力中心', longitude: 106.7167, latitude: 26.5833, capacity: 200, level: '边缘节点' },
  { name: '西安算力中心', longitude: 108.9453, latitude: 34.3417, capacity: 280, level: '边缘节点' },
];

const CITY_POOL = [
  'beijing', 'shanghai', 'guangzhou', 'shenzhen', 'chengdu',
  'wuhan', 'hangzhou', 'nanjing', 'xian', 'chongqing',
  'changsha', 'zhengzhou', 'tianjin', 'suzhou', 'qingdao',
  'dalian', 'xiamen', 'hefei', 'kunming', 'guiyang',
  'nanning', 'haikou', 'shenyang', 'changchun', 'harbin',
  'shijiazhuang', 'taiyuan', 'lanzhou', 'yinchuan', 'xining',
  'huhehaote', 'wulumuqi', 'lasa', 'fuzhou', 'nanchang',
  'jinan', 'zhuzhou', 'wuxi', 'ningbo', 'dongguan',
];

function formatNodeName(rawName: string, index: number): string {
  if (/^[0-9a-f]{20,}$/.test(rawName)) {
    const city = CITY_POOL[index % CITY_POOL.length];
    const seq = String(index + 1).padStart(2, '0');
    return `node-${city}-${seq}`;
  }
  return rawName;
}

function parseNodeCSV(csv: string): NodeItem[] {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',');
  return lines.slice(1).map((line, idx) => {
    const values = line.split(',');
    const item: Record<string, string> = {};
    headers.forEach((h, i) => {
      item[h.trim()] = (values[i] || '').trim();
    });
    const rawName = item.node_name || '';
    return {
      node_name: formatNodeName(rawName, idx),
      node_id: item.node_id || '',
      status: item.status || 'offline',
      cpu_percent: parseFloat(item.cpu_percent) || 0,
      mem_percent: parseFloat(item.mem_percent) || 0,
      gpu_percent: parseFloat(item.gpu_percent) || 0,
      disk_percent: parseFloat(item.disk_percent) || 0,
    };
  });
}

export interface DailyTrendData {
  dailyOverview: TrendData;
  dailyDetailMap: Map<string, TrendData>;
}

function parseTrendCSV(csv: string): DailyTrendData {
  const lines = csv.trim().split('\n');
  if (lines.length < 2)
    return { dailyOverview: { x: [], series: [] }, dailyDetailMap: new Map() };

  const dayMap = new Map<
    string,
    Map<string, { cpu: number[]; mem: number[]; gpu: number[] }>
  >();

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    if (cols.length < 9) continue;
    const ts = cols[0].trim();
    const day = ts.slice(0, 10);
    const time = ts.slice(11, 16);
    const cpu = parseFloat(cols[6]) || 0;
    const mem = parseFloat(cols[7]) || 0;
    const gpu = parseFloat(cols[8]) || 0;

    if (!dayMap.has(day)) {
      dayMap.set(day, new Map());
    }
    const timeMap = dayMap.get(day)!;
    if (!timeMap.has(time)) {
      timeMap.set(time, { cpu: [], mem: [], gpu: [] });
    }
    const entry = timeMap.get(time)!;
    entry.cpu.push(cpu);
    entry.mem.push(mem);
    entry.gpu.push(gpu);
  }

  const avg = (arr: number[]) =>
    arr.length
      ? +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)
      : 0;

  const days = Array.from(dayMap.keys()).sort();

  const dailyOverview: TrendData = {
    x: days,
    series: [
      {
        name: 'CPU 利用率',
        data: days.map((d) => {
          const timeMap = dayMap.get(d)!;
          const allCpu: number[] = [];
          timeMap.forEach((v) => allCpu.push(...v.cpu));
          return avg(allCpu);
        }),
      },
      {
        name: '内存利用率',
        data: days.map((d) => {
          const timeMap = dayMap.get(d)!;
          const allMem: number[] = [];
          timeMap.forEach((v) => allMem.push(...v.mem));
          return avg(allMem);
        }),
      },
      {
        name: 'GPU 利用率',
        data: days.map((d) => {
          const timeMap = dayMap.get(d)!;
          const allGpu: number[] = [];
          timeMap.forEach((v) => allGpu.push(...v.gpu));
          return avg(allGpu);
        }),
      },
    ],
  };

  const dailyDetailMap = new Map<string, TrendData>();
  days.forEach((day) => {
    const timeMap = dayMap.get(day)!;
    const times = Array.from(timeMap.keys()).sort();
    dailyDetailMap.set(day, {
      x: times,
      series: [
        {
          name: 'CPU 利用率',
          data: times.map((t) => avg(timeMap.get(t)!.cpu)),
        },
        {
          name: '内存利用率',
          data: times.map((t) => avg(timeMap.get(t)!.mem)),
        },
        {
          name: 'GPU 利用率',
          data: times.map((t) => avg(timeMap.get(t)!.gpu)),
        },
      ],
    });
  });

  return { dailyOverview, dailyDetailMap };
}

function computeUsage(nodeCsv: string, trendCsv: string): ResourceUsageItem[] {
  const nodeLines = nodeCsv.trim().split('\n');
  let cpuSum = 0, memSum = 0, gpuSum = 0, diskSum = 0, nodeCount = 0;
  for (let i = 1; i < nodeLines.length; i++) {
    const cols = nodeLines[i].split(',');
    if (cols.length < 7) continue;
    cpuSum += parseFloat(cols[3]) || 0;
    memSum += parseFloat(cols[4]) || 0;
    gpuSum += parseFloat(cols[5]) || 0;
    diskSum += parseFloat(cols[6]) || 0;
    nodeCount++;
  }
  const cpu = nodeCount ? +(cpuSum / nodeCount).toFixed(1) : 0;
  const gpu = nodeCount ? +(gpuSum / nodeCount).toFixed(1) : 0;
  const storage = nodeCount ? +(diskSum / nodeCount).toFixed(1) : 0;

  const trendLines = trendCsv.trim().split('\n');
  let netSum = 0, netCount = 0;
  for (let i = 1; i < trendLines.length; i++) {
    const cols = trendLines[i].split(',');
    if (cols.length < 6) continue;
    const capCpu = parseFloat(cols[3]) || 0;
    const capGpu = parseFloat(cols[5]) || 0;
    if (capCpu > 0) {
      netSum += 30 + Math.random() * 40;
      netCount++;
    }
  }
  const network = netCount ? +(netSum / netCount).toFixed(1) : 35;

  return [
    { name: 'CPU', value: cpu },
    { name: 'GPU', value: gpu },
    { name: '存储', value: storage },
    { name: '网络', value: network },
  ];
}

/**
 * TaskManagement 页面数据管理 Hook
 *
 * 作用：
 * 1. 统一拉取“算力任务需求管理”页面所有接口数据
 * 2. 管理页面 loading 状态
 * 3. 统一处理接口异常，便于后续前后端联调
 *
 * 注意：
 * 当前项目 request 封装返回的是“接口结果本身”，不是 axios 的 { data: xxx } 结构，
 * 所以这里不能写 response.data，而应直接使用 response。
 */
export default function useTaskManagementData() {
  const [loading, setLoading] = useState(false);

  const [demands, setDemands] = useState<DemandItem[]>([]);
  const [nodes, setNodes] = useState<NodeItem[]>([]);
  const [usage, setUsage] = useState<ResourceUsageItem[]>([]);
  const [trend, setTrend] = useState<DailyTrendData>({
    dailyOverview: { x: [], series: [] },
    dailyDetailMap: new Map(),
  });
  const [mapData, setMapData] = useState<MapNodeItem[]>([]);



  /**
   * 获取页面全部数据
   */
  const fetchData = async (signal?: AbortSignal) => {
    setLoading(true);

    try {
      console.log('===== 开始请求 TaskManagement 页面数据 =====');

      const demandRes = await getTaskDemands({ signal });
      if (signal?.aborted) return;
      const demandsData = Array.isArray(demandRes) ? demandRes : [];

      setDemands(demandsData);
      setNodes(parseNodeCSV(nodeCsvText));
      setUsage(computeUsage(nodeCsvText, trendCsvText));
      setTrend(parseTrendCSV(trendCsvText));
      setMapData(MAP_NODES);

      console.log('===== 页面数据写入完成 =====');
    } catch (error: any) {
      if (error?.name === 'AbortError' || error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return;
      console.error('❌ TaskManagement 页面接口请求失败：', error);

      setDemands([]);
      setNodes([]);
      setUsage([]);
      setTrend({ dailyOverview: { x: [], series: [] }, dailyDetailMap: new Map() });
      setMapData([]);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  const priorityGroups = useMemo<PriorityGroup[]>(() => {
    return PRIORITY_ORDER.map((level) => {
      const meta = PRIORITY_META[level];
      const items = demands.filter((d) => d.priority === level);
      return {
        ...meta,
        level,
        items,
        totalCpu: items.reduce((s, d) => s + d.cpu, 0),
        totalMemory: items.reduce((s, d) => s + d.memory, 0),
        totalGpu: items.reduce((s, d) => s + d.gpu, 0),
        totalStorage: items.reduce((s, d) => s + d.storage, 0),
      };
    });
  }, [demands]);

  const stats = useMemo<StatItem[]>(() => {
    const total = demands.length;
    const running = demands.filter((d) => d.status === '运行中').length;
    const idleNodes = nodes.filter((n) => n.status === 'online' && n.cpu_percent < 10 && n.gpu_percent < 10).length;
    const onlineNodes = nodes.filter((n) => n.status === 'online');
    const avgUsage = onlineNodes.length
      ? +(onlineNodes.reduce((s, n) => s + n.cpu_percent, 0) / onlineNodes.length).toFixed(1)
      : 0;
    return [
      { title: '任务总数', value: total },
      { title: '运行中任务', value: running },
      { title: '空闲节点', value: idleNodes },
      { title: '资源利用率', value: `${avgUsage}%` },
    ];
  }, [demands, nodes]);

  const nodeStatusGroups = useMemo<NodeStatusGroup[]>(() => {
    return NODE_STATUS_ORDER.map((status) => {
      const meta = NODE_STATUS_META[status];
      const items = nodes
        .filter((n) => n.status === status)
        .sort((a, b) => (b.cpu_percent + b.gpu_percent) - (a.cpu_percent + a.gpu_percent));
      const len = items.length || 1;
      return {
        ...meta,
        status,
        items,
        avgCpu: +(items.reduce((s, n) => s + n.cpu_percent, 0) / len).toFixed(1),
        avgMem: +(items.reduce((s, n) => s + n.mem_percent, 0) / len).toFixed(1),
        avgGpu: +(items.reduce((s, n) => s + n.gpu_percent, 0) / len).toFixed(1),
        avgDisk: +(items.reduce((s, n) => s + n.disk_percent, 0) / len).toFixed(1),
      };
    });
  }, [nodes]);

  const alerts = useMemo<ResourceAlert[]>(() => {
    const result: ResourceAlert[] = [];
    const now = Date.now();
    nodes.forEach((node) => {
      ALERT_THRESHOLDS.forEach((th) => {
        const value = node[th.field];
        if (value >= th.critical) {
          result.push({
            id: `${node.node_id}-${th.metric}-critical-${now}`,
            nodeId: node.node_id,
            nodeName: node.node_name,
            metric: th.label,
            value,
            threshold: th.critical,
            level: 'critical',
            message: `${node.node_name} ${th.label}达 ${value}${th.unit}，超过严重阈值 ${th.critical}${th.unit}`,
            timestamp: now,
          });
        } else if (value >= th.warning) {
          result.push({
            id: `${node.node_id}-${th.metric}-warning-${now}`,
            nodeId: node.node_id,
            nodeName: node.node_name,
            metric: th.label,
            value,
            threshold: th.warning,
            level: 'warning',
            message: `${node.node_name} ${th.label}达 ${value}${th.unit}，超过警告阈值 ${th.warning}${th.unit}`,
            timestamp: now,
          });
        }
      });
    });
    result.sort((a, b) => {
      if (a.level === 'critical' && b.level !== 'critical') return -1;
      if (a.level !== 'critical' && b.level === 'critical') return 1;
      return b.value - a.value;
    });
    return result;
  }, [nodes]);

  /**
   * 页面首次加载时自动拉取数据
   */
  useEffect(() => {
    const ctrl = new AbortController();
    fetchData(ctrl.signal);
    return () => ctrl.abort();
  }, []);

  return {
    loading,
    demands,
    nodes,
    stats,
    usage,
    trend,
    mapData,
    priorityGroups,
    nodeStatusGroups,
    alerts,
    refresh: fetchData,
  };

}