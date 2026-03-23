from fastapi import APIRouter
from typing import Optional
import random
import time

router = APIRouter()


def _mock_node(node_id: str):
    """Generate mock resource data for a single node."""
    return {
        "node_id": node_id,
        "hostname": f"node-{node_id}",
        "status": random.choice(["online", "online", "online", "offline", "warning"]),
        "cpu_usage": round(random.uniform(10, 95), 1),
        "memory_usage": round(random.uniform(20, 90), 1),
        "disk_usage": round(random.uniform(30, 85), 1),
        "network_in": round(random.uniform(50, 500), 2),
        "network_out": round(random.uniform(30, 300), 2),
        "gpu_usage": round(random.uniform(0, 100), 1),
        "gpu_memory": round(random.uniform(0, 100), 1),
        "updated_at": int(time.time()),
    }


@router.get("/resources/nodes")
async def get_nodes():
    """Get all computing nodes and their resource usage."""
    nodes = [_mock_node(str(i)) for i in range(1, 13)]
    return {
        "total": len(nodes),
        "online": sum(1 for n in nodes if n["status"] == "online"),
        "nodes": nodes,
    }


@router.get("/resources/nodes/{node_id}")
async def get_node_detail(node_id: str):
    """Get detailed information for a specific node."""
    return _mock_node(node_id)


@router.get("/resources/nodes/{node_id}/history")
async def get_node_history(
    node_id: str,
    metric: str = "cpu_usage",
    period: str = "1h",
):
    """Get historical metrics for a node."""
    points = 60 if period == "1h" else 120
    timestamps = [int(time.time()) - (points - i) * 60 for i in range(points)]
    values = [round(random.uniform(20, 90), 1) for _ in range(points)]
    return {
        "node_id": node_id,
        "metric": metric,
        "period": period,
        "data": [{"timestamp": t, "value": v} for t, v in zip(timestamps, values)],
    }


@router.get("/resources/topology")
async def get_topology():
    """Get network topology data for visualization."""
    nodes = [
        {"id": "cloud", "label": "Cloud Center", "type": "cloud"},
        *[{"id": f"edge-{i}", "label": f"Edge Node {i}", "type": "edge"} for i in range(1, 5)],
        *[{"id": f"client-{i}", "label": f"Client {i}", "type": "client"} for i in range(1, 9)],
    ]
    edges = [
        *[{"source": "cloud", "target": f"edge-{i}"} for i in range(1, 5)],
        *[{"source": f"edge-{(i-1)//2+1}", "target": f"client-{i}"} for i in range(1, 9)],
    ]
    return {"nodes": nodes, "edges": edges}


@router.get("/resources/load")
async def get_system_load():
    """Get system load overview for monitoring dashboard."""
    return {
        "timestamp": int(time.time()),
        "total_cpu": round(random.uniform(40, 75), 1),
        "total_memory": round(random.uniform(50, 80), 1),
        "total_gpu": round(random.uniform(30, 90), 1),
        "total_disk": round(random.uniform(40, 70), 1),
        "node_loads": [
            {"node_id": str(i), "load": round(random.uniform(20, 95), 1)}
            for i in range(1, 13)
        ],
    }
