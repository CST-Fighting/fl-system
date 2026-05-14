/**
 * TaskManagement 页面相关 TypeScript 类型定义
 * 作用：
 * 1. 统一前后端数据结构
 * 2. 提高代码可维护性和可读性
 * 3. 避免接口字段混乱
 */

/**
 * 算力任务需求数据
 * 对应接口：GET /api/tasks/demands
 */
export interface TaskDemand {
  /** 任务唯一标识 */
  id: string;
  /** 任务名称 */
  task: string;
  /** CPU 需求（核） */
  cpu: number;
  /** 内存需求（GB） */
  memory: number;
  /** GPU 需求（张） */
  gpu: number;
  /** 存储需求（GB） */
  storage: number;
  /** 优先级：高 / 中 / 低 */
  priority: string;
  /** 状态：待分配 / 已分配 / 运行中 / 已完成 */
  status: string;
}

/**
 * 算力任务需求数据
 */
export interface DemandItem {
  id: string;
  task: string;
  cpu: number;
  memory: number;
  gpu: number;
  storage: number;
  priority: string;
  status: string;
}

/**
 * 顶部统计卡片数据
 * 对应接口：GET /api/tasks/stats
 */
export interface StatItem {
  /** 统计项标题 */
  title: string;
  /** 统计项值 */
  value: number | string;
}

export interface NodeItem {
  node_name: string;
  node_id: string;
  status: string;
  cpu_percent: number;
  mem_percent: number;
  gpu_percent: number;
  disk_percent: number;
}

/**
 * 饼图资源占比数据
 * 对应接口：GET /api/resources/usage
 */
export interface ResourceUsageItem {
  /** 资源名称 */
  name: string;
  /** 资源值 */
  value: number;
}

/**
 * 趋势图单条序列
 */
export interface TrendSeriesItem {
  name: string;
  data: number[];
  areaStyle?: boolean;
}

/**
 * 趋势图数据
 * 对应接口：GET /api/resources/trend
 */
export interface TrendData {
  x: string[];
  series: TrendSeriesItem[];
}

/**
 * 全国算力节点地图数据
 */
export interface MapNodeItem {
  name: string;
  longitude: number;
  latitude: number;
  capacity: number;
  level: string;
}

/**
 * 地图散点数据
 * 对应接口：GET /api/resources/map
 * 数据格式：[经度, 纬度, 数值]
 */
export type MapPoint = [number, number, number];

export type PriorityLevel = '高' | '中' | '低';

export interface PriorityGroup {
  level: PriorityLevel;
  label: string;
  color: string;
  borderColor: string;
  bgColor: string;
  icon: string;
  items: DemandItem[];
  totalCpu: number;
  totalMemory: number;
  totalGpu: number;
  totalStorage: number;
}

export const PRIORITY_ORDER: PriorityLevel[] = ['高', '中', '低'];

export const PRIORITY_META: Record<PriorityLevel, Omit<PriorityGroup, 'items' | 'totalCpu' | 'totalMemory' | 'totalGpu' | 'totalStorage'>> = {
  高: {
    level: '高',
    label: '高优先级任务',
    color: '#cf1322',
    borderColor: '#ffa39e',
    bgColor: '#fff1f0',
    icon: '🔥',
  },
  中: {
    level: '中',
    label: '中优先级任务',
    color: '#d46b08',
    borderColor: '#ffd591',
    bgColor: '#fff7e6',
    icon: '⚡',
  },
  低: {
    level: '低',
    label: '低优先级任务',
    color: '#389e0d',
    borderColor: '#b7eb8f',
    bgColor: '#f6ffed',
    icon: '📋',
  },
};

export type NodeStatus = 'online' | 'warning' | 'offline';

export interface NodeStatusGroup {
  status: NodeStatus;
  label: string;
  color: string;
  borderColor: string;
  bgColor: string;
  icon: string;
  items: NodeItem[];
  avgCpu: number;
  avgMem: number;
  avgGpu: number;
  avgDisk: number;
}

export const NODE_STATUS_ORDER: NodeStatus[] = ['online', 'warning', 'offline'];

export const NODE_STATUS_META: Record<NodeStatus, Omit<NodeStatusGroup, 'items' | 'avgCpu' | 'avgMem' | 'avgGpu' | 'avgDisk'>> = {
  online: {
    status: 'online',
    label: '在线节点',
    color: '#389e0d',
    borderColor: '#b7eb8f',
    bgColor: '#f6ffed',
    icon: '🟢',
  },
  warning: {
    status: 'warning',
    label: '告警节点',
    color: '#d46b08',
    borderColor: '#ffd591',
    bgColor: '#fff7e6',
    icon: '🟡',
  },
  offline: {
    status: 'offline',
    label: '离线节点',
    color: '#cf1322',
    borderColor: '#ffa39e',
    bgColor: '#fff1f0',
    icon: '🔴',
  },
};

export type AlertLevel = 'critical' | 'warning';

export interface ResourceAlert {
  id: string;
  nodeId: string;
  nodeName: string;
  metric: string;
  value: number;
  threshold: number;
  level: AlertLevel;
  message: string;
  timestamp: number;
}

export interface AlertThreshold {
  metric: string;
  label: string;
  unit: string;
  warning: number;
  critical: number;
  field: keyof Pick<NodeItem, 'cpu_percent' | 'mem_percent' | 'gpu_percent' | 'disk_percent'>;
}

export const ALERT_THRESHOLDS: AlertThreshold[] = [
  { metric: 'cpu', label: 'CPU 利用率', unit: '%', warning: 60, critical: 80, field: 'cpu_percent' },
  { metric: 'mem', label: '内存利用率', unit: '%', warning: 60, critical: 80, field: 'mem_percent' },
  { metric: 'gpu', label: 'GPU 利用率', unit: '%', warning: 60, critical: 80, field: 'gpu_percent' },
];
