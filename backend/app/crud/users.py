from app.database import get_connection


def create_user(email: str, password_hash: str) -> int:
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO users (email, password_hash) VALUES (%s, %s)",
                (email, password_hash),
            )
            user_id = cursor.lastrowid
        connection.commit()
    finally:
        connection.close()

    return user_id

def get_user_by_email(email: str):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT id, email, password_hash FROM users WHERE email = %s",
                (email,),
            )
            row = cursor.fetchone()
    finally:
        connection.close()

    if row is None:
        return None

    return {"id": row[0], "email": row[1], "password_hash": row[2]}