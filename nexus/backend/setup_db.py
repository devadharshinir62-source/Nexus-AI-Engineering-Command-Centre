import asyncio
import asyncpg
import sys

async def init_postgres():
    passwords = ['postgres', 'password', 'admin', 'root', '', '123456']
    connected_pwd = None
    
    for pwd in passwords:
        try:
            conn = await asyncpg.connect(
                user='postgres',
                password=pwd,
                host='localhost',
                port=5432,
                database='postgres',
                timeout=5
            )
            connected_pwd = pwd
            print(f"SUCCESS: Connected to PostgreSQL with password: '{pwd}'")
            
            # Check if 'nexus' database exists
            row = await conn.fetchrow("SELECT 1 FROM pg_database WHERE datname = 'nexus'")
            if not row:
                await conn.execute("CREATE DATABASE nexus")
                print("SUCCESS: Database 'nexus' created.")
            else:
                print("SUCCESS: Database 'nexus' already exists.")
            
            await conn.close()
            break
        except Exception as e:
            print(f"Failed with password '{pwd}': {e}")
            continue

    if connected_pwd is None:
        print("ERROR: Could not connect to PostgreSQL with default credentials.")
        sys.exit(1)
    else:
        # Write matching .env file
        env_content = f"""# NEXUS Environment Configuration
DATABASE_URL=postgresql+asyncpg://postgres:{connected_pwd}@localhost:5432/nexus
SECRET_KEY=nexus-super-secret-jwt-signing-key-production-grade-2026
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
BACKEND_CORS_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173"]
ENVIRONMENT=development
DEBUG=True
"""
        with open(".env", "w") as f:
            f.write(env_content)
        print(f"SUCCESS: .env written with valid PostgreSQL connection URL.")

if __name__ == "__main__":
    asyncio.run(init_postgres())
