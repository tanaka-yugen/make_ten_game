from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# 0〜9 の異なる4つの数字をランダムに生成
def generate_numbers():
    return random.sample(range(1,10), 4)

@app.route("/")
def index():
    numbers = generate_numbers()
    return render_template("index.html", numbers=numbers)

@app.route("/calculate", methods=["POST"])
def calculate():
    try:
        data = request.json
        formula = data.get("formula", "")

        # 危険な文字を除外（安全のため）
        allowed_chars = "0123456789+-*/() "
        if any(c not in allowed_chars for c in formula):
            return jsonify({"error": "無効な文字が含まれています"}), 400

        result = eval(formula)  # 数式の評価
        return jsonify({"result": result})
    except Exception:
        return jsonify({"error": "計算エラー"}), 400

if __name__ == "__main__":
    app.run(debug=True)
