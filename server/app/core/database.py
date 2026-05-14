import socket
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.core.config import settings


def _get_client_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect((settings.DB_HOST, settings.DB_PORT))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "unknown"


def _build_engine():
    url = settings.DATABASE_URL
    connect_args = {}
    engine_kwargs = {}

    if url.startswith("sqlite"):
        connect_args["check_same_thread"] = False
    else:
        connect_args["connect_timeout"] = 5
        connect_args["sslmode"] = "prefer"
        engine_kwargs = {
            "pool_size": 10,
            "max_overflow": 20,
            "pool_pre_ping": True,
        }

    try:
        eng = create_engine(url, connect_args=connect_args, **engine_kwargs)
        with eng.connect() as conn:
            conn.execute(text("SELECT 1"))
        print(f"[DB] PostgreSQL connected: {settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}")
        return eng
    except Exception as e:
        err_msg = str(e)
        if "pg_hba.conf" in err_msg:
            client_ip = _get_client_ip()
            print(f"[DB] PostgreSQL rejected: pg_hba.conf does not allow client IP {client_ip}")
            print(f"[DB] Fix: add the following line to pg_hba.conf on the PostgreSQL server:")
            print(f'[DB]   host  {settings.DB_NAME}  {settings.DB_USER}  {client_ip}/32  md5')
            print(f"[DB] Then run: pg_ctl reload  OR  SELECT pg_reload_conf();")
        elif "Connection refused" in err_msg or "timeout" in err_msg.lower():
            print(f"[DB] PostgreSQL connection timeout/refused: {settings.DB_HOST}:{settings.DB_PORT}")
        else:
            print(f"[DB] PostgreSQL connection failed: {e.__class__.__name__}: {err_msg[:200]}")

        if not url.startswith("sqlite") and settings.DATABASE_URL_FALLBACK:
            fallback_url = settings.DATABASE_URL_FALLBACK
            fallback_args = {"check_same_thread": False} if fallback_url.startswith("sqlite") else {}
            print(f"[DB] Fallback to SQLite: {fallback_url}")
            return create_engine(fallback_url, connect_args=fallback_args)
        raise


engine = _build_engine()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
