import sqlite3
conn = sqlite3.connect('Batangas_Risk_Monitoring.sqlite')
cur = conn.cursor()
cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cur.fetchall()
print('Tables:', tables)
for t in tables:
    cur.execute('PRAGMA table_info(' + t[0] + ')')
    cols = cur.fetchall()
    print('\nTable:', t[0])
    print('Columns:', cols)
    cur.execute('SELECT * FROM ' + t[0] + ' LIMIT 20')
    rows = cur.fetchall()
    print('Rows (up to 20):', len(rows))
    for r in rows:
        print(r)
conn.close()
