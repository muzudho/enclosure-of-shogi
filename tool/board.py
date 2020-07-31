for file in reversed(range(1, 10)):
    for rank in range(1, 10):
        print(f"""<img id="sq{file}{rank}">""", end="")
    print(f"""<br>""")
