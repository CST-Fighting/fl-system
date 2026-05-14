import pytest
from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)


class TestHealthCheck:
    def test_health(self):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"


class TestResourcesAPI:
    def test_get_nodes(self):
        response = client.get("/api/resources/nodes")
        assert response.status_code == 200
        data = response.json()
        assert "nodes" in data
        assert data["total"] > 0

    def test_get_node_history(self):
        response = client.get("/api/resources/nodes/1/history")
        assert response.status_code == 200
        data = response.json()
        assert "data" in data

    def test_get_topology(self):
        response = client.get("/api/resources/topology")
        assert response.status_code == 200
        data = response.json()
        assert "nodes" in data
        assert "edges" in data


class TestTasksAPI:
    def test_get_tasks(self):
        response = client.get("/api/tasks")
        assert response.status_code == 200
        data = response.json()
        assert "tasks" in data

    def test_create_task(self):
        response = client.post("/api/tasks", json={
            "name": "Test Task",
            "type": "training",
        })
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Test Task"


class TestFraudAPI:
    def test_get_overview(self):
        response = client.get("/api/fraud/overview")
        assert response.status_code == 200

    def test_get_users(self):
        response = client.get("/api/fraud/users")
        assert response.status_code == 200
        data = response.json()
        assert "users" in data


class TestChatAPI:
    def test_chat(self):
        response = client.post("/api/chat", json={"message": "hello"})
        assert response.status_code == 200
        data = response.json()
        assert "reply" in data
