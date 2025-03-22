document.addEventListener("DOMContentLoaded", function () {
    const formulaPanel = document.getElementById("formula-panel");
    const resultDisplay = document.getElementById("result");
    const submitButton = document.getElementById("submit");
    const resetButton = document.getElementById("reset");
    const modal = document.getElementById("clear-modal");
    const closeModal = document.getElementById("close-modal");

    const numberButtons = document.querySelectorAll(".number");
    const operatorButtons = document.querySelectorAll(".operator");
    const retryButton = document.getElementById("retry"); // ここで取得

    let lastInput = ""; // 直前の入力を記録
    let usedNumbers = new Set();

    // 計算欄に値を追加する関数
    function addToFormula(value) {
        // 入力ルールのチェック
        if (!validateInput(value)) {
            return;
        }

        const span = document.createElement("span");
        span.textContent = value;
        span.classList.add("formula-item");
        span.dataset.value = value;
        formulaPanel.appendChild(span);
        lastInput = value;

        if (/\d/.test(value)) {
            usedNumbers.add(value);
            disableUsedNumbers();
        }
    }
    // すでに使われた数字のボタンを無効化する関数
    function disableUsedNumbers() {
        numberButtons.forEach(button => {
            if (usedNumbers.has(button.dataset.value)) {
                button.classList.add("disabled");
            }
        });
    }
    // 入力ルールを検証する関数
    function validateInput(value) {
        if (!lastInput) {
            // 初回入力時
            if (["+", "-", "×", "÷", ")"].includes(value)) return false;
        } else {
            // 数字が連続するのを防ぐ
            if (/\d/.test(lastInput) && /\d/.test(value)) return false;

            // 演算子が連続するのを防ぐ
            if (/[\+\-×÷]/.test(lastInput) && /[\+\-×÷]/.test(value)) return false;

            // "(" の後に演算子が来るのはOK、数字もOK、それ以外はダメ
            if (lastInput === "(" && !/[\d+\-]/.test(value)) return false;

            // ")" の後に数字が来るのは禁止（例：")3" はダメ）
            if (lastInput === ")" && /\d/.test(value)) return false;

            // ")" の後に "(" が来るのも禁止（例："())(" はダメ）
            if (lastInput === ")" && value === "(") return false;
        }

        return true;
    }

    // 数字ボタンのクリックイベント
    numberButtons.forEach(button => {
        button.addEventListener("click", function () {
            addToFormula(this.dataset.value);
        });
    });

    // 演算子ボタンのクリックイベント
    operatorButtons.forEach(button => {
        button.addEventListener("click", function () {
            addToFormula(this.dataset.value);
        });
    });

    // 数式の検証関数
    function validateExpression(expression) {
        if (!expression) return "数式が空です";
        if (/[^0-9+\-*/() ]/.test(expression)) return "無効な文字が含まれています";
        if (/\d\s+\d/.test(expression)) return "数字の間にスペースがあります";
        try {
            eval(expression); // 構文エラーをチェック
        } catch (error) {
            return "無効な数式";
        }
        return null;
    }

    // 計算ボタンの処理
    submitButton.addEventListener("click", function () {
        let expression = "";
        const elements = formulaPanel.querySelectorAll(".formula-item");

        elements.forEach(el => {
            expression += el.dataset.value;
        });

        // 記号変換（× → *、÷ → /）
        expression = expression.replace(/×/g, "*").replace(/÷/g, "/");

        console.log("📌 最終計算式:", expression); // デバッグ用

        const errorMessage = validateExpression(expression);
        if (errorMessage) {
            resultDisplay.textContent = "エラー: " + errorMessage;
            return;
        }

        try {
            let result = eval(expression);
            console.log("📌 計算結果:", result); // デバッグ用
            // 使用した数字の数を確認（4つすべて使っているか）
            if (usedNumbers.size != 4) {
                resultDisplay.textContent = "エラー: すべての数字を使ってください";
                return;
            } else {
                if(result == 10){
                    modal.style.display = "block"; // クリアモーダル表示
                    return;
                }else{
                    resultDisplay.textContent = "結果: " + result;
                    return;
                }
            }
        } catch (error) {
            console.error("❌ 計算エラー:", error);
            resultDisplay.textContent = "エラー: 無効な数式";
        }
    });

    // リセットボタンの処理
    resetButton.addEventListener("click", function () {
        formulaPanel.innerHTML = "";
        resultDisplay.textContent = "";
        lastInput = ""; // リセット
        usedNumbers.clear(); // 使用済みリストをクリア

        numberButtons.forEach(button => {
            button.classList.remove("disabled"); // 無効化を解除
        });
    });

    if (retryButton) {
        retryButton.addEventListener("click", function () {
            console.log('retry clicked');
            location.reload();
        });
    }
});
