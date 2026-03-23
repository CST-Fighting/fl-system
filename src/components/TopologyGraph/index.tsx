
import React, { useEffect, useRef } from 'react';
import { Card } from 'antd';

interface TopologyGraphProps {
  title?: string;
  height?: number;
  nodes?: { id: string; label: string; type?: string }[];
  edges?: { source: string; target: string }[];
}

/**
 * Network topology visualization component using AntV G6
 * Renders a force-directed graph for computing network topology
 */
const TopologyGraph: React.FC<TopologyGraphProps> = ({
  title = '网络拓扑结构',
  height = 400,
  nodes = [
    { id: 'cloud', label: '云中心', type: 'cloud' },
    { id: 'edge1', label: '边缘节点1', type: 'edge' },
    { id: 'edge2', label: '边缘节点2', type: 'edge' },
    { id: 'edge3', label: '边缘节点3', type: 'edge' },
    { id: 'client1', label: '客户端1', type: 'client' },
    { id: 'client2', label: '客户端2', type: 'client' },
    { id: 'client3', label: '客户端3', type: 'client' },
    { id: 'client4', label: '客户端4', type: 'client' },
    { id: 'client5', label: '客户端5', type: 'client' },
    { id: 'client6', label: '客户端6', type: 'client' },
  ],
  edges = [
    { source: 'cloud', target: 'edge1' },
    { source: 'cloud', target: 'edge2' },
    { source: 'cloud', target: 'edge3' },
    { source: 'edge1', target: 'client1' },
    { source: 'edge1', target: 'client2' },
    { source: 'edge2', target: 'client3' },
    { source: 'edge2', target: 'client4' },
    { source: 'edge3', target: 'client5' },
    { source: 'edge3', target: 'client6' },
  ],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamic import for G6 to avoid SSR issues
    import('@antv/g6').then((G6) => {
      if (graphRef.current) {
        graphRef.current.destroy();
      }

      const colorMap: Record<string, string> = {
        cloud: '#1677ff',
        edge: '#52c41a',
        client: '#faad14',
      };

      const sizeMap: Record<string, number> = {
        cloud: 50,
        edge: 35,
        client: 25,
      };

      const graph = new G6.Graph({
        container: containerRef.current!,
        width: containerRef.current!.clientWidth,
        height: height - 60,
        layout: {
          type: 'force',
          preventOverlap: true,
          nodeStrength: -200,
          edgeStrength: 0.5,
        },
        defaultNode: {
          type: 'circle',
          labelCfg: { position: 'bottom', style: { fontSize: 11, fill: '#666' } },
        },
        defaultEdge: {
          style: { stroke: '#d9d9d9', lineWidth: 2, endArrow: true },
        },
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
        },
      });

      const graphData = {
        nodes: nodes.map((n) => ({
          ...n,
          size: sizeMap[n.type || 'client'] || 25,
          style: { fill: colorMap[n.type || 'client'] || '#faad14', stroke: '#fff', lineWidth: 2 },
        })),
        edges: edges.map((e) => ({ ...e })),
      };

      graph.data(graphData);
      graph.render();
      graphRef.current = graph;
    });

    return () => {
      if (graphRef.current) {
        graphRef.current.destroy();
        graphRef.current = null;
      }
    };
  }, [nodes, edges, height]);

  return (
    <Card title={title}>
      <div ref={containerRef} style={{ width: '100%', height: height - 60 }} />
    </Card>
  );
};

export default TopologyGraph;
