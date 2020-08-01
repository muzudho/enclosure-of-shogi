# 盤(square)
for rank in range(1, 10):
    for file in reversed(range(1, 10)):
        print(f"""<img id="sq{file}{rank}">""", end="")
    print(f"""<br>""")

# ヨコ(width)
for rank in range(1, 10):
    for file in reversed(range(2, 10)):
        print(f"""<img id="w{file}{rank}">""", end="")
    print(f"""<br>""")

# タテ(height)
for rank in range(2, 10):
    for file in reversed(range(1, 10)):
        print(f"""<img id="h{file}{rank}">""", end="")
    print(f"""<br>""")

# ナナメ(diagonal)
for rank in range(2, 10):
    for file in reversed(range(2, 10)):
        print(f"""<img id="d{file}{rank}">""", end="")
    print(f"""<br>""")

# ナカ(center)
for rank in range(1, 10):
    for file in reversed(range(1, 10)):
        print(f"""<img id="c{file}{rank}">""", end="")
    print(f"""<br>""")
