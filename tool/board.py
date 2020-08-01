# 盤
for rank in range(1, 10):
    for file in reversed(range(1, 10)):
        print(f"""<img id="sq{file}{rank}">""", end="")
    print(f"""<br>""")

# ヨコ
for rank in range(1, 10):
    for file in reversed(range(2, 10)):
        print(f"""<img id="w{file}{rank}">""", end="")
    print(f"""<br>""")

# タテ
for rank in range(2, 10):
    for file in reversed(range(1, 10)):
        print(f"""<img id="h{file}{rank}">""", end="")
    print(f"""<br>""")

# ナナメ
for rank in range(2, 10):
    for file in reversed(range(2, 10)):
        print(f"""<img id="d{file}{rank}">""", end="")
    print(f"""<br>""")
